import { app, awsLamdaReceiver } from "../../../../utils/slackInit.js";
import {isSyncRestricted} from "../../functions/IsSyncRestricted.js";
import {add_user_channel_function} from "../functions/add_user_channel_function.js";

app.event('member_joined_channel', async (args) => {

const variables={}
  let syncRestricted = await isSyncRestricted(variables)

  if( syncRestricted) {
    console.log(JSON.stringify(args.event))
    await add_user_channel_function(args.event.user,args.client,args.event.inviter);
  }

});



export const handler = async (event, context, callback) => {
  const handler = await awsLamdaReceiver.start();
  return handler(event, context, callback);
};
