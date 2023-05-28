import resources, { CdkResource, SubnetConfig } from './enviroment';

export class Configuration implements CdkResource {
  vpcCidr: string;
  env_name: string;
  node_env: string;
  natGatewaysCount: number;
  maxAzsCount: number;
  subnetConfig: SubnetConfig[];
  vpcCustomResourceId: string;
  vpcId: string;
  ssmParameterId: string;
  stringParameterId: string;

  constructor(public readonly envName: string) {
    if (resources[envName] === undefined) {
      throw new Error(envName + ' is not defined');
    }
    this.vpcCidr = resources[envName].vpcCidr;
    this.env_name = resources[envName].env_name;
    this.node_env = resources[envName].node_env;
    this.natGatewaysCount = resources[envName].natGatewaysCount;
    this.maxAzsCount = resources[envName].maxAzsCount;
    this.subnetConfig = resources[envName].subnetConfig;
    this.vpcCustomResourceId = 'cdk-vpc-' + this.envName;
    this.vpcId = 'cdk-vpc-' + this.envName;
    this.ssmParameterId = 'cdk-ssmParam' + this.envName;
    this.stringParameterId = 'cdk-stringParam' + this.envName;
  }
}
