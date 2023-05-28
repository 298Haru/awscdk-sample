import * as cdk from '@aws-cdk/core';
import { Configuration } from '../config';
import * as ssm from '@aws-cdk/aws-ssm';

export interface SsmCustomResourceProps {
  /**
   * Custom Resource Properties
   */
  cloudWatchAlarmTopicStringValue: string;
  cloudWatchAlarmReleaseTopicStringValue: string;
  wafAlarmTopicStringValue: string;
  amAlbFailOverTopicStringValue: string;
}

export class SsmCustomResource extends cdk.Construct {
  constructor(scope: cdk.Construct, config: Configuration, props: SsmCustomResourceProps) {
    super(scope, config.ssmParameterId);

    new ssm.StringParameter(this, `cloudWatchAlarmTopic-${config.env_name}`, {
      description: `cloudwatch alarm topic for ${config.env_name}`,
      parameterName: `/${config.env_name}/cloudwatch-alarm-topic`,
      stringValue: props.cloudWatchAlarmTopicStringValue,
    });

    new ssm.StringParameter(this, `cloudWatchAlarmReleaseTopic-${config.env_name}`, {
      description: `cloudwatch alarmrelease topic for ${config.env_name}`,
      parameterName: `/${config.env_name}/cloudwatch-alarm-release-topic`,
      stringValue: props.cloudWatchAlarmReleaseTopicStringValue,
    });

    new ssm.StringParameter(this, `wafAlarmTopic-${config.envName}`, {
      description: `waf alarm topic for ${config.env_name}`,
      parameterName: `/${config.env_name}/waf-alarm-topic`,
      stringValue: props.wafAlarmTopicStringValue,
    });

    new ssm.StringParameter(this, `amAlbFailOverTopic-${config.envName}`, {
      description: `alb failover topic alarm topic for ${config.env_name}`,
      parameterName: `/${config.env_name}/am-alb-failover-topic`,
      stringValue: props.amAlbFailOverTopicStringValue,
    });
  }
}
