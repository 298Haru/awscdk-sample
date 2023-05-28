#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { Configuration } from './config';
import { FailoverLambdaStack } from './lambda/failover-lambda';
import { NotificationLambdaStack } from './lambda/notification-lambda';
import { LoggingLambdaStack } from './lambda/logging-lambda';
import { BackupLambdaStack } from './lambda/backup-lambda';

import * as aws from 'aws-sdk';

async function main() {
  const app = new cdk.App();
  const targetEnv = process.env.ENV_NAME ? process.env.ENV_NAME : 'demo';
  const config = new Configuration(targetEnv);
  aws.config.update({region:'ap-northeast-1'});
  const ssm = new aws.SSM();
  
  const ayAlbFailOverTopicArn = await ssm.getParameter({ Name: `/${targetEnv}/ay-alb-failover-topic` }).promise();
  if (ayAlbFailOverTopicArn.Parameter === undefined || ayAlbFailOverTopicArn.Parameter.Value === undefined) {
    throw Error(`/${targetEnv}/ay-alb-failover-topic is not defined`);
  }

  const ayWebTargetArn = await ssm.getParameter({ Name: `/${targetEnv}/ayWebTargetArn` }).promise();
  if (ayWebTargetArn.Parameter === undefined || ayWebTargetArn.Parameter.Value === undefined) {
    throw Error(`/${targetEnv}/ayWebTargetArn is not defined`);
  }

  const ayListenerArn = await ssm.getParameter({ Name: `/${targetEnv}/ayListenerArn` }).promise();
  if (ayListenerArn.Parameter === undefined || ayListenerArn.Parameter.Value === undefined) {
    throw Error(`/${targetEnv}/ayListenerArn is not defined`);
  }

  const aySorryPageRuleArn = await ssm.getParameter({ Name: `/${targetEnv}/aySorryPageRuleArn` }).promise();
  if (aySorryPageRuleArn.Parameter === undefined || aySorryPageRuleArn.Parameter.Value === undefined) {
    throw Error(`/${targetEnv}/aySorryPageRuleArn is not defined`);
  }

  const cloudWatchAlarmTopicArn = await ssm.getParameter({ Name: `/${targetEnv}/cloudwatch-alarm-topic` }).promise();
  if (cloudWatchAlarmTopicArn.Parameter === undefined || cloudWatchAlarmTopicArn.Parameter.Value === undefined) {
    throw Error(`/${targetEnv}/cloudwatch-alarm-topic is not defined`);
  }

  const cloudWatchAlarmReleaseTopicArn = await ssm.getParameter({ Name: `/${targetEnv}/cloudwatch-alarm-release-topic` }).promise();
  if (cloudWatchAlarmReleaseTopicArn.Parameter === undefined || cloudWatchAlarmReleaseTopicArn.Parameter.Value === undefined) {
    throw Error(`/${targetEnv}/cloudwatch-alarm-release-topic is not defined`);
  }

  const gethPublicAlbFailOverTopicArn = await ssm.getParameter({ Name: `/${targetEnv}/geth-public-alb-failover-topic` }).promise();
  if (gethPublicAlbFailOverTopicArn.Parameter === undefined || gethPublicAlbFailOverTopicArn.Parameter.Value === undefined) {
    throw Error(`/${targetEnv}/geth-public-alb-failover-topic is not defined`);
  }
  
  const gethPublicListenerArn = await ssm.getParameter({ Name: `/${targetEnv}/geth-public-listener-arn` }).promise();
  if (gethPublicListenerArn.Parameter === undefined || gethPublicListenerArn.Parameter.Value === undefined) {
    throw Error(`/${targetEnv}/geth-public-listener-arn is not defined`);
  }

  const gethPublicListenerActTargetArn = await ssm.getParameter({ Name: `/${targetEnv}/geth-public-listener-act-target` }).promise();
  if (gethPublicListenerActTargetArn.Parameter === undefined || gethPublicListenerActTargetArn.Parameter.Value === undefined) {
    throw Error(`/${targetEnv}/geth-public-listener-act-target is not defined`);
  }

  const gethPublicListenerStbRuleArn = await ssm.getParameter({ Name: `/${targetEnv}/geth-public-listener-stb-rule` }).promise();
  if (gethPublicListenerStbRuleArn.Parameter === undefined || gethPublicListenerStbRuleArn.Parameter.Value === undefined) {
    throw Error(`/${targetEnv}/geth-public-listener-stb-rule is not defined`);
  }
  
  const gethPrivateAlbFailOverTopicArn = await ssm.getParameter({ Name: `/${targetEnv}/geth-private-alb-failover-topic` }).promise();
  if (gethPrivateAlbFailOverTopicArn.Parameter === undefined || gethPrivateAlbFailOverTopicArn.Parameter.Value === undefined) {
    throw Error(`/${targetEnv}/geth-private-alb-failover-topic is not defined`);
  }
  
  const gethPrivateListenerArn = await ssm.getParameter({ Name: `/${targetEnv}/geth-private-listener-arn` }).promise();
  if (gethPrivateListenerArn.Parameter === undefined || gethPrivateListenerArn.Parameter.Value === undefined) {
    throw Error(`/${targetEnv}/geth-private-listener-arn is not defined`);
  }

  const gethPrivateListenerActTargetArn = await ssm.getParameter({ Name: `/${targetEnv}/geth-private-listener-act-target` }).promise();
  if (gethPrivateListenerActTargetArn.Parameter === undefined || gethPrivateListenerActTargetArn.Parameter.Value === undefined) {
    throw Error(`/${targetEnv}/geth-private-listener-act-target is not defined`);
  }

  const gethPrivateListenerStbRuleArn = await ssm.getParameter({ Name: `/${targetEnv}/geth-private-listener-stb-rule` }).promise();
  if (gethPrivateListenerStbRuleArn.Parameter === undefined || gethPrivateListenerStbRuleArn.Parameter.Value === undefined) {
    throw Error(`/${targetEnv}/geth-private-listener-stb-rule is not defined`);
  }

  new FailoverLambdaStack(app, `FailoverLambdaStack-${targetEnv}`, config, {
    ayAlbFailOverTopicArn: ayAlbFailOverTopicArn.Parameter.Value, ayWebTargetArn: ayWebTargetArn.Parameter.Value,
    ayListenerArn: ayListenerArn.Parameter.Value, aySorryPageRuleArn: aySorryPageRuleArn.Parameter.Value,
    gethPublicAlbFailOverTopicArn: gethPublicAlbFailOverTopicArn.Parameter.Value, gethPublicListenerArn: gethPublicListenerArn.Parameter.Value,
    gethPublicListenerActTargetArn: gethPublicListenerActTargetArn.Parameter.Value, gethPublicListenerStbRuleArn: gethPublicListenerStbRuleArn.Parameter.Value,
    gethPrivateAlbFailOverTopicArn: gethPrivateAlbFailOverTopicArn.Parameter.Value, gethPrivateListenerArn: gethPrivateListenerArn.Parameter.Value,
    gethPrivateListenerActTargetArn:gethPrivateListenerActTargetArn.Parameter.Value,gethPrivateListenerStbRuleArn:gethPrivateListenerStbRuleArn.Parameter.Value
  }, {
    env:{
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION,
    }
  });

  new LoggingLambdaStack(app, `LoggingLambdaStack-${targetEnv}`, config, { dummyParm: 'test' }, {
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION,
    }
  });
  
  new NotificationLambdaStack(app, `NotificationLambdaStack-${targetEnv}`, config, {
    dummyParm: 'test',
    cloudWatchAlarmTopicArn: cloudWatchAlarmTopicArn.Parameter.Value,
    cloudWatchAlarmReleaseTopicArn: cloudWatchAlarmReleaseTopicArn.Parameter.Value
}, {
    env:{
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION,
    }
  });

  new BackupLambdaStack(app, `BackupLambdaStack-${targetEnv}`, config, { dummyParm: 'test' }, {
    env:{
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION,
    }
  });

}

main();
