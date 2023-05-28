import * as AWS from 'aws-sdk';

exports.handler = async (event: any) => {
  const dynamo = new AWS.DynamoDB();
  await createBackup(dynamo, event);
};

export async function createBackup(dynamo: AWS.DynamoDB, event: any) {
  const tables = await dynamo.listTables().promise();
  const date = new Date();
  const bkdate = `${date.getFullYear()}${date.getMonth() + 1}${date.getDay() +
    1}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
  if (tables.TableNames !== undefined) {
    for (const t of tables.TableNames) {
      const ret = await dynamo
        .createBackup({
          TableName: t,
          BackupName: `${t}-${bkdate}`,
        })
        .promise();
      if (ret.$response.error) {
        console.error(`${t}: Failed to create backup: ${ret.$response.error}`);
      } else {
        console.info(`${t}: Backup is created`);
      }
    }
  }
}
