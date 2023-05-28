import * as cdk from '@aws-cdk/core';
import { Configuration } from '../config';
import { Duration } from '@aws-cdk/core';
import * as lambdaNodejs from '@aws-cdk/aws-lambda-nodejs';
import * as lambda from '@aws-cdk/aws-lambda';
import * as iam from '@aws-cdk/aws-iam';
import * as targets from '@aws-cdk/aws-events-targets'
import * as events from '@aws-cdk/aws-events'
import { LogGroup, RetentionDays } from '@aws-cdk/aws-logs';


export interface LambdaProps {
  dummyParm: string
}
export class LoggingLambdaStack extends cdk.Stack {

    constructor(scope: cdk.App, id: string, config: Configuration, lambdaProps:LambdaProps,props?: cdk.StackProps) {
      super(scope, id, props);
      
      const ecsEventLoggingRule = new events.Rule(this, config.ecsEventLoggingRule, {
        eventPattern: { source: ["aws.ecs"] ,resources:config.ecsEventLoggingRuleResources },
        enabled: true
      });

      const ecsEventlogGroup = new LogGroup(this, config.ecsEventlogGroupId, {
        retention: RetentionDays.FIVE_MONTHS,
        logGroupName: config.ecsEventlogGroupName,
        removalPolicy:config.logRemovalPolicy,
      });

      const ecsEventLogging = new lambdaNodejs.NodejsFunction(this, config.ecsEventLoggingTool, {
        entry: 'src/app/logging/ECSEventLoggingTool/ecs_event_logging.ts',
        environment: {
          LOG_GROUP_NAME:ecsEventlogGroup.logGroupName
        },
        memorySize: 128,
        timeout: Duration.seconds(600),
        handler: 'handler',
        initialPolicy:[new iam.PolicyStatement({
          resources: [
            'arn:aws:logs:*:*:*',
          ],
          actions: [
            'logs:PutLogEvents',
            'logs:CreateLogGroup',
            'logs:CreateLogStream',
            'logs:DescribeLogStreams',
          ],
          effect:iam.Effect.ALLOW
        }
        )]
      });

      ecsEventLogging.addPermission('addPermission', { principal: new iam.ServicePrincipal("events.amazonaws.com"), sourceArn: ecsEventLoggingRule.ruleArn });
      ecsEventLoggingRule.addTarget(new targets.LambdaFunction(lambda.Function.fromFunctionArn(this, config.ecsEventLoggingFunction, ecsEventLogging.functionArn)));
  }
}
