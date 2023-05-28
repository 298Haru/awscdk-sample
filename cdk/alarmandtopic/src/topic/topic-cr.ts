import * as cdk from '@aws-cdk/core';
import { Configuration } from '../config';
import * as sns from '@aws-cdk/aws-sns';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as logs from '@aws-cdk/aws-logs';
import { Duration } from '@aws-cdk/core';
import * as cwactions from '@aws-cdk/aws-cloudwatch-actions';
import { SsmCustomResource } from '../ssm/ssm-cr';

export interface TpopicProps {
  amPublicAlbFullName: string;
  amEuWebTargetFullName: string;
}
export class TopicResourceStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, config: Configuration, topicProps: TpopicProps, props?: cdk.StackProps) {
    super(scope, id, props);

    const cloudWatchAlarmTopic = new sns.Topic(this, config.cloudWatchAlarmTopic, {
      displayName: config.cloudWatchAlarmTopicName,
      topicName: config.cloudWatchAlarmTopicName,
    });

    const cloudWatchAlarmReleaseTopic = new sns.Topic(this, config.cloudWatchAlarmReleaseTopic, {
      displayName: config.cloudWatchAlarmReleaseTopicName,
      topicName: config.cloudWatchAlarmReleaseTopicName,
    });

    const wafAlarmTopic = new sns.Topic(this, config.wafAlarmTopic, {
      displayName: config.wafAlarmTopicName,
      topicName: config.wafAlarmTopicName,
    });

    const sampleAlbFailOverTopic = new sns.Topic(this, config.sampleAlbFailOverTopic, {
      displayName: config.sampleAlbFailOverTopicName,
      topicName: config.sampleAlbFailOverTopicName,
    });

    const alarmAction = new cwactions.SnsAction(cloudWatchAlarmTopic);
    const alarmReleaseAction = new cwactions.SnsAction(cloudWatchAlarmReleaseTopic);

    // // WAFのアラームを拾うためのアラーム
    const wafAlarmNotifier = new cloudwatch.Alarm(this, config.wafAlarmNotifier, {
      metric: new cloudwatch.Metric({
        metricName: 'AWS/WAFV2',
        namespace: 'BlockedRequests',
        dimensions: { WebACL: config.webAclName, Region: 'ap-northeast-1', Rule: 'ALL' },
      }),
      alarmName: config.wafAlarmNotifierName,
      threshold: 1,
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      period: Duration.seconds(60),
      statistic: 'Sum',
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
      actionsEnabled: true,
    });

    const wafalarmAction = new cwactions.SnsAction(wafAlarmTopic);

    wafAlarmNotifier.addAlarmAction(wafalarmAction);

    const samplePublicAlbFailoverNotifier = new cloudwatch.Alarm(this, config.samplePublicAlbFailoverNotifier, {
      metric: new cloudwatch.Metric({
        metricName: 'HealthyHostCount',
        namespace: 'AWS/ApplicationELB',
        dimensions: { TargetGroup: topicProps.amEuWebTargetFullName, LoadBalancer: topicProps.amPublicAlbFullName },
      }),
      alarmName: config.samplePublicAlbFailoverNotifierName,
      threshold: 0,
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
      period: Duration.seconds(60),
      statistic: 'min',
      treatMissingData: cloudwatch.TreatMissingData.BREACHING,
      actionsEnabled: true,
    });

    const amPublicAlbFailoverAction = new cwactions.SnsAction(sampleAlbFailOverTopic);

    samplePublicAlbFailoverNotifier.addAlarmAction(amPublicAlbFailoverAction);
    //TODO: OKになったら通常のページを表示させる

    //SSMのパラメータストアへの書き込み
    new SsmCustomResource(this, config, {
      cloudWatchAlarmTopicStringValue: cloudWatchAlarmTopic.topicArn,
      cloudWatchAlarmReleaseTopicStringValue: cloudWatchAlarmReleaseTopic.topicArn,
      wafAlarmTopicStringValue: wafAlarmTopic.topicArn,
      amAlbFailOverTopicStringValue: sampleAlbFailOverTopic.topicArn,
    });
  }
}
