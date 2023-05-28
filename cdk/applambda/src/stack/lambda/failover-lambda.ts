import * as cdk from '@aws-cdk/core';
import { Configuration } from '../config';
import * as sns from '@aws-cdk/aws-sns';
import { Duration } from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda-nodejs';
import * as events from '@aws-cdk/aws-lambda-event-sources';
import * as iam from '@aws-cdk/aws-iam';

export interface LambdaProps {
  ayWebTargetArn: string
  ayListenerArn: string
  aySorryPageRuleArn: string
  ayAlbFailOverTopicArn: string
  gethPublicListenerActTargetArn: string
  gethPublicListenerArn: string
  gethPublicListenerStbRuleArn: string
  gethPublicAlbFailOverTopicArn: string
  gethPrivateListenerActTargetArn: string
  gethPrivateListenerArn: string
  gethPrivateListenerStbRuleArn: string
  gethPrivateAlbFailOverTopicArn: string
}
export class FailoverLambdaStack extends cdk.Stack {

    constructor(scope: cdk.App, id: string, config: Configuration, lambdaProps:LambdaProps,props?: cdk.StackProps) {
      super(scope, id, props);
      

      const ayAlbFailOverTopic = sns.Topic.fromTopicArn(this,config.ayAlbFailOverTopic,lambdaProps.ayAlbFailOverTopicArn);

      const ayAlbfailover = new lambda.NodejsFunction(this, config.ayWebAlbfailoverTool, {
        entry: 'src/app/failover/FailoverTool/albfailover.ts',
        environment: {
          ALB_HEALTH_CHECK_TARGET_ARN: lambdaProps.ayWebTargetArn, ALB_TARGET_LISTENER_ARN: lambdaProps.ayListenerArn,
          ALB_TARGET_LISTENER_RULE_ARN: lambdaProps.aySorryPageRuleArn
        },
        events: [new events.SnsEventSource(ayAlbFailOverTopic)],
        memorySize: 128,
        timeout: Duration.seconds(600),
        handler: 'handler',
        initialPolicy:[new iam.PolicyStatement({
          resources: [
            '*',
          ],
          actions: [
            'elasticloadbalancing:DescribeTargetHealth',
            'elasticloadbalancing:DescribeRules',
            'elasticloadbalancing:SetRulePriorities',
          ],
          effect:iam.Effect.ALLOW
        }
        )]
      });


      const gethPublicFailOverTopic = sns.Topic.fromTopicArn(this,config.gethPublicFailOverTopic,lambdaProps.gethPublicAlbFailOverTopicArn);

      const gethPublicFailOver = new lambda.NodejsFunction(this, config.gethPublicFailOverTool, {
        entry: 'src/app/failover/FailoverTool/albfailover.ts',
        environment: {
          ALB_HEALTH_CHECK_TARGET_ARN: lambdaProps.gethPublicListenerActTargetArn, ALB_TARGET_LISTENER_ARN: lambdaProps.gethPublicListenerArn,
          ALB_TARGET_LISTENER_RULE_ARN: lambdaProps.gethPublicListenerStbRuleArn
        },
        events: [new events.SnsEventSource(gethPublicFailOverTopic)],
        memorySize: 128,
        timeout: Duration.seconds(600),
        handler: 'handler',
        initialPolicy:[new iam.PolicyStatement({
          resources: [
            '*',
          ],
          actions: [
            'elasticloadbalancing:DescribeTargetHealth',
            'elasticloadbalancing:DescribeRules',
            'elasticloadbalancing:SetRulePriorities',
          ],
          effect:iam.Effect.ALLOW
        }
        )]
      });

      const gethPrivateFailOverTopic = sns.Topic.fromTopicArn(this,config.gethPrivateFailOverTopic,lambdaProps.gethPrivateAlbFailOverTopicArn);

      const gethPrivateFailOver = new lambda.NodejsFunction(this, config.gethPrivateFailOverTool, {
        entry: 'src/app/failover/FailoverTool/albfailover.ts',
        environment: {
          ALB_HEALTH_CHECK_TARGET_ARN: lambdaProps.gethPrivateListenerActTargetArn, ALB_TARGET_LISTENER_ARN: lambdaProps.gethPrivateListenerArn,
          ALB_TARGET_LISTENER_RULE_ARN: lambdaProps.gethPrivateListenerStbRuleArn
        },
        events: [new events.SnsEventSource(gethPrivateFailOverTopic)],
        memorySize: 128,
        timeout: Duration.seconds(600),
        handler: 'handler',
        initialPolicy:[new iam.PolicyStatement({
          resources: [
            '*',
          ],
          actions: [
            'elasticloadbalancing:DescribeTargetHealth',
            'elasticloadbalancing:DescribeRules',
            'elasticloadbalancing:SetRulePriorities',
          ],
          effect:iam.Effect.ALLOW
        }
        )]
      });

  }
}
