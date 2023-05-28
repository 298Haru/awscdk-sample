import * as AWS from 'aws-sdk';
import { checkEnv , asyncRequest} from '../../common';
const OUTPUT_LIMIT = 20;
const TIME_FROM_MIN = 8;

exports.handler = async (event: any) => {
  const cwl = new AWS.CloudWatchLogs();
  await checkLog(
    cwl,
    async (text: string) => {
      await asyncRequest({
        uri: checkEnv(process.env.TEAMS_HOOK_URL),
        headers: {
          'Content-type': 'application/json',
        },
        json: {
          title: 'CloudWatchLogs Alarm',
          text: text,
        },
      });
    },
    event
  );
};

export async function checkLog(cwl: AWS.CloudWatchLogs, callback: (t: string) => Promise<void>, event: any) {
  try {
    const message = JSON.parse(event['Records'][0]['Sns']['Message']);
    const metricsFilter = await cwl
      .describeMetricFilters({
        metricName: message.Trigger.MetricName,
        metricNamespace: message.Trigger.Namespace,
      })
      .promise();
    if (metricsFilter.$response.error) {
      error(`operation failed: describeMetricFilters: ${metricsFilter.$response.error}`);
      return;
    }
    if (metricsFilter.metricFilters === undefined) {
      error('metricFilters not found');
      return;
    }
    const timeto = Date.parse(message['StateChangeTime']);
    const timefrom = timeto - TIME_FROM_MIN * 60 * 1000;
    let nextToken: string | undefined;
    do {
      const response = await cwl
        .filterLogEvents({
          logGroupName: metricsFilter.metricFilters[0].logGroupName!,
          filterPattern: metricsFilter.metricFilters[0].filterPattern,
          startTime: timefrom,
          endTime: timeto,
          limit: OUTPUT_LIMIT,
          nextToken: nextToken,
        })
        .promise();
      if (response.$response.error) {
        error(`operation failed: filterLogEvents: ${metricsFilter.$response.error}`);
        return;
      }
      if (response.events === undefined) {
        return;
      }
      for (const event of response.events) {
        const text = `${event.logStreamName}\n${event.message}`;
        await callback(text);
      }
      nextToken = response.nextToken;
    } while (nextToken !== undefined);
  } catch (e) {
    console.info(`CloudWatchAlarmToTeams: some error occurred: ${e}`);
  }
}

function error(msg: string) {
  console.error(`CloudWatchAlarmToTeams: ${msg}`);
}