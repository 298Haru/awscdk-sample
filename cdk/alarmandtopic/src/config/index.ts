export class Configuration {
  cloudWatchAlarmTopic: string;
  cloudWatchAlarmTopicName: string;
  cloudWatchAlarmReleaseTopic: string;
  cloudWatchAlarmReleaseTopicName: string;
  wafAlarmTopic: string;
  wafAlarmTopicName: string;
  wafAlarmNotifier: string;
  wafAlarmNotifierName: string;
  samplePublicAlbFailoverNotifier: string;
  samplePublicAlbFailoverNotifierName: string;
  sampleAlbFailOverTopic: string;
  sampleAlbFailOverTopicName: string;
  webAclName: string;
  ssmParameterId: string;
  env_name: string;

  constructor(public readonly envName: string) {
    this.env_name = `${this.envName}`;
    this.cloudWatchAlarmTopic = `${this.envName}-cloudWatchAlarmTopic`;
    this.cloudWatchAlarmTopicName = `${this.envName}-cloudwatch-alarm-topic`;
    this.cloudWatchAlarmReleaseTopic = `${this.envName}-cloudWatchAlarmReleaseTopic`;
    this.cloudWatchAlarmReleaseTopicName = `${this.envName}-cloudwatch-alarm-release-topic`;
    this.sampleAlbFailOverTopic = `${this.envName}-sampleAlbFailOverTopic`;
    this.sampleAlbFailOverTopicName = `${this.envName}-sampleAlbFailOverTopicName`;
    this.wafAlarmTopic = `${this.envName}-wafAlarmTopic`;
    this.wafAlarmTopicName = `${this.envName}-waf-alarm-topic`;
    this.wafAlarmNotifier = `WafAlarmNotifier-${this.envName}`;
    this.wafAlarmNotifierName = `${this.envName}-WafAlarmNotifier`;
    this.samplePublicAlbFailoverNotifier = `samplePublicAlbFailoverNotifier-${this.envName}`;
    this.samplePublicAlbFailoverNotifierName = `${this.envName}-samplePublicAlbFailoverNotifier`;
    this.webAclName = `${this.envName}WebACL`;
    this.ssmParameterId = 'cdk-ssmParam' + this.envName;
  }
}
