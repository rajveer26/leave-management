import { app, awsLamdaReceiver } from "../../../utils/slackInit.js";

import { removeMain } from "./removeMain.js";

app.event("member_left_channel", async (args) => {
  await removeMain(args.event);
});

export const handler = async (event, context, callback) => {
  const handlers = await awsLamdaReceiver.start();
  return handlers(event, context, callback);
};
