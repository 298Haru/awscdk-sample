import * as AWS from 'aws-sdk';
import { checkEnv,formatDate } from '../../common';
const cloudwatchlogs = new AWS.CloudWatchLogs({region: 'ap-northeast-1'});

const LOG_GROUP_NAME = checkEnv(process.env.LOG_GROUP_NAME);
const LOG_STREAM_NAME = `eventLog-${formatDate(new Date)}`;

exports.handler = async (event: any) => {
  await notice(async (text: string) => {
    await outLog(text);
  }, event);
};

export async function notice(callback: (t: string) => Promise<void>, event: any) {
  const detail = event.detail;
  if (!detail) {
    return;
  }

  // eventを全部記録するようにする
  try {
    await callback(JSON.stringify(event, null, 2));
    info(`event posted to cloudwatchlogs`);
  } catch (e) {
    error(`Failed to send: ${e}`);
  }
}

function info(msg: string) {
  console.info(`ECSStateChangeEvent: ${msg}`);
}

function error(msg: string) {
  console.error(`ECSStateChangeEvent: ${msg}`);
}

const initalizeLogStream = async(id:string) =>{
  const createParams = {
    logGroupName: LOG_GROUP_NAME,
    logStreamName:id
  };
  return new Promise((resolve, reject) =>{
    const createLogStreamPromise = cloudwatchlogs.createLogStream(createParams).promise();
    createLogStreamPromise.then(() => {
      console.log('%start:LogStream created: %s', LOG_STREAM_NAME);
    }).catch(function(err) {
      if (err.code == 'ResourceAlreadyExistsException') {
      console.log('%data:green LogStream already exists: %s', LOG_STREAM_NAME);
      } else {
        reject(err);
      }
    });
  });

}
const outLog = async (msg:any) => {
  const describeParams = {
    logGroupName: LOG_GROUP_NAME,
    logStreamNamePrefix: LOG_STREAM_NAME,
  };
  const data = await cloudwatchlogs.describeLogStreams(describeParams).promise();
  console.log(data);

  let sequenceToken = null;

  if (data.logStreams) {
      console.log(data.logStreams.length);
      if (data.logStreams.length ==0) {
        initalizeLogStream(LOG_STREAM_NAME).then(() => {
          cloudwatchlogs.putLogEvents({ logEvents: [{ message: msg, timestamp: Date.now() }], logGroupName: LOG_GROUP_NAME, logStreamName: LOG_STREAM_NAME }).promise()
        });
      } else {
        sequenceToken = data.logStreams[0].uploadSequenceToken;
        cloudwatchlogs.putLogEvents({logEvents:[{message:msg,timestamp:Date.now()}],logGroupName:LOG_GROUP_NAME,logStreamName:LOG_STREAM_NAME,sequenceToken:sequenceToken}).promise();}   
      } 
};

