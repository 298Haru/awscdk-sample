import * as cdk from '@aws-cdk/core';
import { Configuration } from '../config';
import * as ssm from '@aws-cdk/aws-ssm';

export interface SsmCustomResourceProps {
  /**
   * Custom Resource Properties
   */
  description: string;
  parameterName: string;
  stringValue: string;
}

export class SsmCustomResource extends cdk.Construct {
  constructor(scope: cdk.Construct, config: Configuration, props: SsmCustomResourceProps) {
    super(scope, config.ssmParameterId);

    new ssm.StringParameter(this, config.stringParameterId, {
      description: props.description,
      parameterName: props.parameterName,
      stringValue: props.stringValue,
    });
  }
}
