import * as AWS from 'aws-sdk';
import { checkEnv } from '../../common';
exports.handler = async (event: any) => {
  const elb = new AWS.ELBv2();
  const healthy = await elb
    .describeTargetHealth({
      TargetGroupArn: checkEnv(process.env.ALB_HEALTH_CHECK_TARGET_ARN),
    })
    .promise();
  console.info(`describeTargetHealth: ${JSON.stringify(healthy)}`);
  if (healthy.TargetHealthDescriptions === undefined) {
    await doFailover(
      elb,
      checkEnv(process.env.ALB_TARGET_LISTENER_ARN),
      checkEnv(process.env.ALB_TARGET_LISTENER_RULE_ARN)
    );
    return;
  }
  let unhealthyCount = 0;
  for (const t of healthy.TargetHealthDescriptions) {
    if (
      t.TargetHealth === undefined ||
      t.TargetHealth.State === 'unhealthy' ||
      t.TargetHealth.State === 'draining' ||
      t.TargetHealth.State === 'unavailable'
    ) {
      unhealthyCount += 1;
    }
  }
  if (unhealthyCount === healthy.TargetHealthDescriptions.length) {
    await doFailover(
      elb,
      checkEnv(process.env.ALB_TARGET_LISTENER_ARN),
      checkEnv(process.env.ALB_TARGET_LISTENER_RULE_ARN)
    );
  }
};

async function doFailover(elb: AWS.ELBv2, targetListner: string, failoverRule: string) {
  const rules = await elb
    .describeRules({
      ListenerArn: targetListner,
    })
    .promise();
  const rulePriorities: AWS.ELBv2.RulePriorityPair[] = [];``
  console.info(`describeRules: ${JSON.stringify(rules)}`);
  if (rules.Rules === undefined) {
    return;
  }
  let priority = 2;
  for (const r of rules.Rules) {
    if (r.IsDefault) {
      continue;
    }
    if (r.RuleArn === failoverRule) {
      rulePriorities.push({ Priority: 1, RuleArn: r.RuleArn });
    } else {
      rulePriorities.push({ Priority: priority, RuleArn: r.RuleArn });
      priority = priority + 1;
    }
  }
  const ret = await elb.setRulePriorities({ RulePriorities: rulePriorities }).promise();
  if (ret.$response.error) {
    console.error(`failed to set rule priority: ${ret.$response.error}`);
  } else {
    console.info(`done. ${JSON.stringify(ret)}`);
  }
}
