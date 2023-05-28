import { RemovalPolicy } from '@aws-cdk/core';

const resources: { [key: string]: CdkResource } = {
  demo: {
    env_name: 'demo',
    teams_hook_url: 'https://numlig.webhook.office.com/webhookb2/86f46b23-fa7d-409e-9337-6e3797d44b54@f4076e97-5e1c-4698-8606-03f07e6748c1/IncomingWebhook/b27260276f53409e91c063f571c18628/bfae0848-1c0d-4738-ac3a-10d0df5edaf0',
    ecsAlarmEventRuleResources:[{ prefix: "arn:aws:ecs:ap-northeast-1:675258403909:task/Aboutyou-Cluter-cdk-demo" },
    { prefix: "arn:aws:ecs:ap-northeast-1:675258403909:task/Aboutme-Cluter-cdk-demo" },
    { prefix: "arn:aws:ecs:ap-northeast-1:675258403909:task/Eth-Cluter-cdk-demo" }
    ],
    ecsEventLoggingRuleResources:[{ prefix: "" }],
    logRemovalPolicy: RemovalPolicy.DESTROY,
    algoliaBackupBucket: "algolia-backup-demo-aboutme-net",
    algoliaApplicationId: "5AA17FFJ9S",
    algoliaApiKey: "fd2a3710f11c298a227494c0bef7a043",
  },
  demo2: {
    env_name: 'demo2',
    teams_hook_url: '',
    ecsAlarmEventRuleResources:[{ prefix: "arn:aws:ecs:ap-northeast-1:675258403909:task/Aboutyou-Cluter-cdk-demo2" },
    { prefix: "arn:aws:ecs:ap-northeast-1:675258403909:task/Aboutme-Cluter-cdk-demo2" },
    { prefix: "arn:aws:ecs:ap-northeast-1:675258403909:task/Eth-Cluter-cdk-demo2" }
    ],
    ecsEventLoggingRuleResources:[{ prefix: "" }],
    logRemovalPolicy: RemovalPolicy.DESTROY,
    algoliaBackupBucket: "",
    algoliaApplicationId: "",
    algoliaApiKey: ""
  },
  st: {
    env_name: 'st',
    teams_hook_url: '',
    ecsAlarmEventRuleResources:[{ prefix: "arn:aws:ecs:ap-northeast-1:675258403909:task/Aboutyou-Cluter-cdk-st" },
    { prefix: "arn:aws:ecs:ap-northeast-1:675258403909:task/Aboutme-Cluter-cdk-st" },
    { prefix: "arn:aws:ecs:ap-northeast-1:675258403909:task/Eth-Cluter-cdk-st" }
    ],
    ecsEventLoggingRuleResources:[{ prefix: "" }],
    logRemovalPolicy: RemovalPolicy.DESTROY,
    algoliaBackupBucket: "",
    algoliaApplicationId: "",
    algoliaApiKey: ""
  },
  prod: {
    env_name: 'prod',
    teams_hook_url: '',
    ecsAlarmEventRuleResources:[{ prefix: "" },
    ],
    ecsEventLoggingRuleResources:[{ prefix: "" }],
    logRemovalPolicy: RemovalPolicy.RETAIN,
    algoliaBackupBucket: "",
    algoliaApplicationId: "",
    algoliaApiKey: ""
  },
};

export interface CdkResource {
  env_name: string;
  teams_hook_url: string;
  ecsAlarmEventRuleResources: any[],
  ecsEventLoggingRuleResources: any[]
  logRemovalPolicy: RemovalPolicy,
  algoliaBackupBucket: string,
  algoliaApplicationId: string,
  algoliaApiKey:string
}


export default resources;
