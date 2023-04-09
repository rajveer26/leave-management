import { app, awsLamdaReceiver } from "../../../utils/slackInit.js";

import {member_left_channel} from "./function/member_left_channel.js";

app.event('member_left_channel', async (args) => {

  await member_left_channel(args.event)
});

export const handler = async (event, context, callback) => {
  const handler = await awsLamdaReceiver.start();
  return handler(event, context, callback);
};
