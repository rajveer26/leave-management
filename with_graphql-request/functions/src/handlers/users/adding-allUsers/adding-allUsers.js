import { app, awsLamdaReceiver } from "../../../utils/slackInit.js";
import { main3 } from "./functions/main3.js";
import {isSyncRestricted} from "../functions/IsSyncRestricted.js";

app.command('/add_all', async (args) => {
  await args.ack();
  const variables={}
  let syncRestricted = await isSyncRestricted(variables)

  if(!syncRestricted) {
    await main3(args.client,args.body.user_name);
  }
});

export const handler = async (event, context, callback) => {
  const handler = await awsLamdaReceiver.start();
  return handler(event, context, callback);
};
