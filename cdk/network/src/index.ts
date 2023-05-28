#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { Configuration } from './config';
import { VpcCustomResource } from './vpc/vpc-cr';

async function main() {
  const app = new cdk.App();
  const targetEnv = process.env.ENV_NAME ? process.env.ENV_NAME : 'demo';
  const config = new Configuration(targetEnv);
  const vpcResulst = new VpcCustomResource(app, `VpcCdk-${targetEnv}`, config, {
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION,
    },
  });

  // await ssm.putParameter({ Name: `/${targetEnv}/vpcId`, Value: vpcResulst.VpcCustom.vpcId }).promise();
}
main();
