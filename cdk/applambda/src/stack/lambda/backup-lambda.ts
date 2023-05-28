import * as cdk from '@aws-cdk/core';
import { Configuration } from '../config';
import { Duration } from '@aws-cdk/core';
import * as lambdaNodejs from '@aws-cdk/aws-lambda-nodejs';
import * as lambda from '@aws-cdk/aws-lambda';
import * as iam from '@aws-cdk/aws-iam';
import * as targets from '@aws-cdk/aws-events-targets'
import * as events from '@aws-cdk/aws-events'

export interface LambdaProps {
  dummyParm: string
}
export class BackupLambdaStack extends cdk.Stack {

    constructor(scope: cdk.App, id: string, config: Configuration, lambdaProps:LambdaProps,props?: cdk.StackProps) {
      super(scope, id, props);
      
      const dynamoBackupEventRule = new events.Rule(this, 'dynamoBackupEvent', {
        schedule: events.Schedule.cron({
          // 注意：GMTで指定
          minute: "0",
          hour: "3",
          day: "*",
          month: "*",
          year: "*"
        }),
        enabled: true,
      });

      const dynamodbBackupPolicy = new iam.PolicyStatement({
        resources: [
          '*',
        ],
        actions: [
          "dynamodb:List*",
          "dynamodb:CreateBackup"
        ],
        effect:iam.Effect.ALLOW
      })

      const dynamoDBBackup = new lambdaNodejs.NodejsFunction(this, config.dynamoDBBackupTool, {
        entry: 'src/app/backup/DynamoDBBackupTool/backup_dynamodb.ts',
        memorySize: 128,
        timeout: Duration.seconds(600),
        handler: 'handler',
        initialPolicy:[dynamodbBackupPolicy]
      });

      dynamoDBBackup.addPermission('addPermission', { principal: new iam.ServicePrincipal("events.amazonaws.com") ,sourceArn:dynamoBackupEventRule.ruleArn});
      dynamoBackupEventRule.addTarget(new targets.LambdaFunction(lambda.Function.fromFunctionArn(this, config.dynamoDBBackupFunction, dynamoDBBackup.functionArn)));

      //algoliaBackup
      const algoliaBackupEventRule = new events.Rule(this, 'algoliaBackupEvent', {
        schedule: events.Schedule.cron({
          // 注意：GMTで指定
          minute: "30",
          hour: "3",
          day: "*",
          month: "*",
          year: "*"
        }),
        enabled: true,
      });

      const algoliaBackupPolicy = new iam.PolicyStatement({
        resources: [
          '*',
        ],
        actions: [
          "dynamodb:List*",
          "dynamodb:CreateBackup"
        ],
        effect:iam.Effect.ALLOW
      })

      //TODO:KMSでAPIキーを暗号化する
      const algoliaBackup = new lambdaNodejs.NodejsFunction(this, config.algoliaBackupTool, {
        entry: 'src/app/backup/AlgoliaBackupTool/backup_algolia.ts',
        environment: {
          ALGOLIA_BACKUP_BUCKET: config.algoliaBackupBucket,
          ALGOLIA_APPLICATION_ID: config.algoliaApplicationId,
          ALGOLIA_API_KEY: config.algoliaApiKey
        },
        memorySize: 128,
        timeout: Duration.seconds(600),
        handler: 'handler',
        initialPolicy:[algoliaBackupPolicy]
      });

      algoliaBackup.addPermission('addPermission', { principal: new iam.ServicePrincipal("events.amazonaws.com") ,sourceArn:algoliaBackupEventRule.ruleArn});
      algoliaBackupEventRule.addTarget(new targets.LambdaFunction(lambda.Function.fromFunctionArn(this, config.algoliaBackupFunction, algoliaBackup.functionArn)));

  }
}
