import * as cdk from '@aws-cdk/core';
import { Configuration } from '../config';
import { Duration } from '@aws-cdk/core';
import * as lambdaNodejs from '@aws-cdk/aws-lambda-nodejs';
import * as lambda from '@aws-cdk/aws-lambda';
import * as iam from '@aws-cdk/aws-iam';
import * as targets from '@aws-cdk/aws-events-targets'
import * as events from '@aws-cdk/aws-events'
import * as sns from '@aws-cdk/aws-sns';
import * as lambdaevents from '@aws-cdk/aws-lambda-event-sources';

export interface LambdaProps {
  dummyParm: string
  cloudWatchAlarmTopicArn: string
  cloudWatchAlarmReleaseTopicArn:string
}
export class NotificationLambdaStack extends cdk.Stack {

    constructor(scope: cdk.App, id: string, config: Configuration, lambdaProps:LambdaProps,props?: cdk.StackProps) {
      super(scope, id, props);
      
      const ecsAlarmEventRule = new events.Rule(this, 'ecsAlarmEventRule', {
        eventPattern: {
          source: ["aws.ecs"], detailType: ["ECS Task State Change"],
          resources:config.ecsAlarmEventRuleResources,
        },
        enabled: true
      });

      const ecsAlarmNotification = new lambdaNodejs.NodejsFunction(this, config.ecsAlarmNotificationTool, {
        entry: 'src/app/notification/ECSAlarmEventTool/ecs_alarm_notification.ts',
        environment: {
          TEAMS_HOOK_URL: config.teams_hook_url,
          ENV_NAME:config.env_name
        },
        memorySize: 128,
        timeout: Duration.seconds(600),
        handler: 'handler',
      });

      ecsAlarmNotification.addPermission('addPermission', { principal: new iam.ServicePrincipal("events.amazonaws.com") ,sourceArn:ecsAlarmEventRule.ruleArn});
      ecsAlarmEventRule.addTarget(new targets.LambdaFunction(lambda.Function.fromFunctionArn(this, config.ecsAlarmNotificationFunction, ecsAlarmNotification.functionArn)));

      const cloudWatchAlarmTopic = sns.Topic.fromTopicArn(this,config.cloudWatchAlarmTopic,lambdaProps.cloudWatchAlarmTopicArn);

      const cloudWatchAccessPolicy = new iam.PolicyStatement({
        resources: [
          '*',
        ],
        actions: [
          "logs:Describe*",
          "logs:Get*",
          "logs:List*",
          "logs:StartQuery",
          "logs:StopQuery",
          "logs:TestMetricFilter",
          "logs:FilterLogEvents"
        ],
        effect:iam.Effect.ALLOW
      })

      const ssmReadOnlyAccess =new iam.PolicyStatement({
        resources: [
          '*',
        ],
        actions: [
          "ssm:Describe*",
          "ssm:Get*",
          "ssm:List*"
        ],
        effect:iam.Effect.ALLOW
      })

      const cloudWatchAlarmTool = new lambdaNodejs.NodejsFunction(this, config.cloudWatchAlarmTool, {
        entry: 'src/app/notification/CloudWatchAlarmTool/cloudwatch_alarm_to_teams.ts',
        environment: {
          TEAMS_HOOK_URL: config.teams_hook_url
        },
        events: [new lambdaevents.SnsEventSource(cloudWatchAlarmTopic)],
        memorySize: 128,
        timeout: Duration.seconds(600),
        handler: 'handler',
        initialPolicy: [cloudWatchAccessPolicy,ssmReadOnlyAccess]
      });

      const cloudWatchAlarmReleaseTopicArn = sns.Topic.fromTopicArn(this,config.cloudWatchAlarmReleaseTopic,lambdaProps.cloudWatchAlarmReleaseTopicArn);

      const cloudWatchAlarmReleaseTool = new lambdaNodejs.NodejsFunction(this, config.cloudWatchAlarmReleaseTool, {
        entry: 'src/app/notification/CloudWatchAlarmReleaseTool/cloudwatch_alarm_release_notifier.ts',
        environment: {
          TEAMS_HOOK_URL: config.teams_hook_url
        },
        events: [new lambdaevents.SnsEventSource(cloudWatchAlarmReleaseTopicArn)],
        memorySize: 128,
        timeout: Duration.seconds(600),
        handler: 'handler',
      });


  }
}
