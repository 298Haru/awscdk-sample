import { checkEnv, asyncRequest } from '../../common';

exports.handler = async (event: any) => {
  await asyncRequest({
    uri: checkEnv(process.env.TEAMS_HOOK_URL),
    headers: {
      'Content-type': 'application/json',
    },
    json: {
      title: 'CloudWatchLogs Alarm',
      text: 'Alarm state is released',
    },
  });
};
