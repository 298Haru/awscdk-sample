import { Vpc, IVpc } from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { Configuration } from '../config';
import { SsmCustomResource } from '../ssm/ssm-cr';

export class VpcCustomResource extends cdk.Stack {
  public readonly VpcCustom: IVpc;
  constructor(scope: cdk.Construct, id: string, config: Configuration, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, config.vpcCustomResourceId, {
      cidr: config.vpcCidr,
      natGateways: config.natGatewaysCount,
      maxAzs: config.maxAzsCount,
      subnetConfiguration: config.subnetConfig,
    });
    this.VpcCustom = vpc;

    //SSMパラメータストアへのvpcId書き込み
    new SsmCustomResource(this, config, {
      description: 'vpc id',
      parameterName: `/${config.env_name}/vpcId`,
      stringValue: vpc.vpcId,
    });
    // TODO:各種vpcエンドポイントの追加
  }
}
