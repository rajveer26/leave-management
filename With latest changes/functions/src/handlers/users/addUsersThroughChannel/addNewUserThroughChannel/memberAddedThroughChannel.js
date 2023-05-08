import { app, awsLamdaReceiver } from "../../../../utils/slackInit.js";
import { isSyncRestricted } from "../../../../utils/helper.js";
import { addUserChannelFunction } from "./addUserChannelFunction.js";

app.event("member_joined_channel", async (args) => {
  const variables = {};
  const syncRestricted = await isSyncRestricted(variables);

  if (syncRestricted) {
    await addUserChannelFunction(
      args.event.user,
      args.client,
      args.event.inviter
    );
  }
});

export const handler = async (event, context, callback) => {
  const handlers = await awsLamdaReceiver.start();
  return handlers(event, context, callback);
};
