import { app, awsLamdaReceiver } from "../../../utils/slackInit.js";
import { main3 } from "./main3.js";
import { isSyncRestricted } from "../../../utils/helper.js";

const token = process.env.SLACK_BOT_TOKEN;

app.command("/add_all", async (args) => {
  await args.ack();
  const variables = {};
  const syncRestricted = await isSyncRestricted(variables);

  if (!syncRestricted) {
    await main3(args.client, args.body.user_name, token);
  }
});

export const handler = async (event, context, callback) => {
  const handlers = await awsLamdaReceiver.start();
  return handlers(event, context, callback);
};
