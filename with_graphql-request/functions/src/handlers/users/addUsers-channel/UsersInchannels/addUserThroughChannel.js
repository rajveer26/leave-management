import { app, awsLamdaReceiver } from "../../../../utils/slackInit.js";
import { main1 } from "./functions/main1.js";
import {isSyncRestricted} from "../../functions/IsSyncRestricted.js";

app.command("/channels", async (args) => {
  await args.ack();
  let variables={}
  let syncRestricted = await isSyncRestricted(variables)
  if( syncRestricted)
  //  console.log(args.body.user_name);
    await main1(args.client,args.body.user_id);
});

export const handler = async (event, context, callback) => {
  const handler = await awsLamdaReceiver.start();
  return handler(event, context, callback);
};
