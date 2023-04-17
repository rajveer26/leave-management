import { app, awsLamdaReceiver } from "../../../../utils/slackInit.js";
import { main1 } from "./main1.js";
import { isSyncRestricted } from "../../../../utils/helper.js";

app.command("/channels", async (args) => {
  await args.ack();
  const variables = {};
  const syncRestricted = await isSyncRestricted(variables);
  if (syncRestricted) await main1(args.client, args.body.user_id);
});

export const handler = async (event, context, callback) => {
  const handlers = await awsLamdaReceiver.start();
  return handlers(event, context, callback);
};
