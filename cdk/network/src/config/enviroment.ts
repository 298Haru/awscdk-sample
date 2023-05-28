import { SubnetType } from '@aws-cdk/aws-ec2';

const resources: { [key: string]: CdkResource } = {
  demo: {
    env_name: 'demo',
    node_env: 'demo',
    vpcCidr: '10.79.0.0/16',
    natGatewaysCount: 0,
    maxAzsCount: 2,
    subnetConfig: [
      {
        cidrMask: 24,
        name: 'public-demo-',
        subnetType: SubnetType.PUBLIC,
      },
    ],
  },
  demo2: {
    env_name: 'demo2',
    node_env: 'demo2',
    vpcCidr: '10.88.0.0/16',
    natGatewaysCount: 0,
    maxAzsCount: 2,
    subnetConfig: [
      {
        cidrMask: 24,
        name: 'public-demo2-',
        subnetType: SubnetType.PUBLIC,
      },
    ],
  },
  st: {
    env_name: 'st',
    node_env: 'staging',
    vpcCidr: '10.99.0.0/16',
    natGatewaysCount: 1,
    maxAzsCount: 2,
    subnetConfig: [
      {
        cidrMask: 24,
        name: 'public-st-',
        subnetType: SubnetType.PUBLIC,
      },
      {
        cidrMask: 24,
        name: 'private-st-',
        subnetType: SubnetType.PRIVATE,
      },
    ],
  },
};

export interface CdkResource {
  env_name: string;
  node_env: string;
  vpcCidr: string;
  natGatewaysCount: number;
  maxAzsCount: number;
  subnetConfig: SubnetConfig[];
}

export interface SubnetConfig {
  cidrMask: number;
  name: string;
  subnetType: any;
}

export default resources;
