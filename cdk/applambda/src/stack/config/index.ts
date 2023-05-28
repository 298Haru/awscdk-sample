import resources, { CdkResource } from './enviroment';
import { RemovalPolicy } from '@aws-cdk/core';
export class Configuration implements CdkResource{
  amEuWebAlbfailoverTool:string
  ayWebAlbfailoverTool:string
  env_name: string
  amAlbFailOverTopic: string
  ayAlbFailOverTopic: string
  ecsAlarmNotificationTool: string
  ecsAlarmRecordTool: string
  ecsAlarmNotificationFunction: string
  ecsAlarmRecordFunction: string
  teams_hook_url: string
  ecsEventLoggingRule:string
  ecsEventLoggingTool: string
  ecsEventLoggingFunction: string
  dynamoDBBackupTool: string
  dynamoDBBackupFunction: string
  algoliaBackupTool: string
  algoliaBackupFunction: string
  ecsAlarmEventRuleResources: any[]
  ecsEventLoggingRuleResources:any[]
  logRemovalPolicy: RemovalPolicy
  ecsEventlogGroupName: string
  ecsEventlogGroupId: string
  cloudWatchAlarmTool: string
  cloudWatchAlarmReleaseTool: string
  cloudWatchAlarmTopic: string
  cloudWatchAlarmReleaseTopic: string
  gethPublicFailOverTopic:string
  gethPublicFailOverTool:string
  gethPrivateFailOverTopic:string
  gethPrivateFailOverTool: string
  algoliaApiKey: string
  algoliaApplicationId: string
  algoliaBackupBucket:string

  constructor(public readonly envName: string) {
    this.env_name = `${this.envName}`;
    this.amEuWebAlbfailoverTool = `${this.envName}-amEuWebAlbfailoverTool`;
    this.ayWebAlbfailoverTool = `${this.envName}-ayWebAlbfailoverTool`;
    this.amAlbFailOverTopic = `${this.envName}-amAlbFailOverTopic`;
    this.ayAlbFailOverTopic = `${this.envName}-ayAlbFailOverTopic`;
    this.ecsAlarmNotificationTool = `${this.envName}-ecsAlarmNotificationTool`;
    this.ecsAlarmRecordTool = `${this.envName}-ecsAlarmRecordTool`;
    this.ecsAlarmNotificationFunction = `${this.envName}-ecsAlarmNotificationFunction`;
    this.ecsAlarmRecordFunction = `${this.envName}-ecsAlarmRecordFunction`;
    this.teams_hook_url = resources[this.envName].teams_hook_url;
    this.ecsEventLoggingRule = `${this.envName}-ecsEventLoggingRule`;
    this.ecsEventLoggingTool = `${this.envName}-ecsEventLoggingTool`;
    this.ecsEventLoggingFunction = `${this.envName}-ecsEventLoggingFunction`;
    this.dynamoDBBackupTool = `${this.envName}-dynamoDBBackupTool`;
    this.dynamoDBBackupFunction = `${this.envName}-dynamoDBBackupFunction`;
    this.algoliaBackupTool = `${this.envName}-algoliaBackupTool`;
    this.algoliaBackupFunction = `${this.envName}-algoliaBackupFunction`;
    this.ecsAlarmEventRuleResources = resources[this.envName].ecsAlarmEventRuleResources;
    this.ecsEventLoggingRuleResources = resources[this.envName].ecsEventLoggingRuleResources;
    this.logRemovalPolicy = resources[this.envName].logRemovalPolicy;
    this.ecsEventlogGroupId = `${this.envName}-ecsEventLogGroup`;
    this.ecsEventlogGroupName = `/ecs/event/logs-${this.envName}`;
    this.cloudWatchAlarmTool = `${this.envName}-cloudWatchAlarmTool`;
    this.cloudWatchAlarmReleaseTool = `${this.envName}-cloudWatchAlarmReleaseTool`;
    this.cloudWatchAlarmTopic= `${this.envName}-cloudWatchAlarmTopic`;
    this.cloudWatchAlarmReleaseTopic = `${this.envName}-cloudWatchAlarmReleaseTopic`;
    this.gethPublicFailOverTool =`${this.envName}-gethPublicFailOverTool`;
    this.gethPublicFailOverTopic =`${this.envName}-gethPublicFailOverTopic`;
    this.gethPrivateFailOverTool =`${this.envName}-gethPrivateFailOverTool`;
    this.gethPrivateFailOverTopic = `${this.envName}-gethPrivateFailOverTopic`;
    this.algoliaBackupBucket = resources[this.envName].algoliaBackupBucket;
    this.algoliaApplicationId = resources[this.envName].algoliaApplicationId;
    this.algoliaApiKey = resources[this.envName].algoliaApiKey;
  }
}
