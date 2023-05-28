import * as request from 'request';
import * as AWS from 'aws-sdk';
import { checkEnv } from '../../common';

exports.handler = async (event: any) => {
  await notice(async (text: string) => {
    await asyncRequest({
      uri: checkEnv(process.env.TEAMS_HOOK_URL),
      headers: {
        'Content-type': 'application/json',
      },
      json: {
        title: 'ECS Alarm Notification',
        text: text,
      },
    });
  }, event);
};

export async function notice(callback: (t: string) => Promise<void>, event: any) {
  const detail = event.detail;
  if (!detail) {
    return;
  }

  const message = {
    enviroment:checkEnv(process.env.ENV_NAME),
    availabilityZone: detail.availabilityZone,
    clusterArn: detail.clusterArn,
    containers: detail.containers,
    createdAt: detail.createdAt,
    desiredStatus: detail.desiredStatus,
    lastStatus: detail.lastStatus,
  };
  try {
    await callback(JSON.stringify(message, null, 2));
    info(`Message posted to teams`);
  } catch (e) {
    error(`Failed to send: ${e}`);
  }
}

function asyncRequest(options: any) {
  return new Promise((resolve, reject) => {
    request.post(options, (error: any, res: { statusCode: number }, body: any) => {
      if (!error && res.statusCode == 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

function info(msg: string) {
  console.info(`ECSStateChangeEvent: ${msg}`);
}

function error(msg: string) {
  console.error(`ECSStateChangeEvent: ${msg}`);
}
