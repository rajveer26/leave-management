import {getAllUserFromChannel} from "../../functions/getUserDetailFromChannel.js";
import {toGetChannel} from "../../functions/toGetChannel.js";
import {add_user_channel_function} from "../../functions/add_user_channel_function.js";
let interval = 2000; // how much time should the delay between two iterations be (in milliseconds)?
//let promise = Promise.resolve();
let token = process.env.SLACK_BOT_TOKEN;
 async function main1(client,admin_id) {
   let variables ={}
 let channel = await toGetChannel(variables);
  const channel_members = await getAllUserFromChannel(channel,client,token);
  const promises = [];
   console.log(channel_members.members.length)
  for (const n in channel_members.members) {

    //Promise chaining
   const promise = (async ()=> {
      let slack_id = channel_members.members[n]
      //calling add_user_channel() function


      await add_user_channel_function(slack_id, client,admin_id);


    })();
   promises.push(promise);
  }
   await Promise.all(promises.map(promise => promise.then(() => new Promise(resolve => setTimeout(resolve, interval)))));

 }
export {main1}
