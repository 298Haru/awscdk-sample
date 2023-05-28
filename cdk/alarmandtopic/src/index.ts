#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { Configuration } from './config';
import { TopicResourceStack } from './topic/topic-cr';
import * as aws from 'aws-sdk';

async function main() {
  const app = new cdk.App();
  const targetEnv = process.env.ENV_NAME ? process.env.ENV_NAME : 'demo';
  const config = new Configuration(targetEnv);
  const ssm = new aws.SSM();

  const amPublicAlbFullName = await ssm.getParameter({ Name: `/${targetEnv}/amPublicAlbFullName` }).promise();
  if (amPublicAlbFullName.Parameter === undefined || amPublicAlbFullName.Parameter.Value === undefined) {
    throw Error(`/${targetEnv}/amPublicAlbFullName is not defined`);
  }

  const amEuWebTargetFullName = await ssm.getParameter({ Name: `/${targetEnv}/amEuWebTargetFullName` }).promise();
  if (amEuWebTargetFullName.Parameter === undefined || amEuWebTargetFullName.Parameter.Value === undefined) {
    throw Error(`/${targetEnv}/amEuWebTargetFullName is not defined`);
  }

  new TopicResourceStack(
    app,
    `TopicResource-${targetEnv}`,
    config,
    {
      amPublicAlbFullName: amPublicAlbFullName.Parameter.Value,
      amEuWebTargetFullName: amEuWebTargetFullName.Parameter.Value,
    },
    {
      env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
      },
    }
  );
}

main();
