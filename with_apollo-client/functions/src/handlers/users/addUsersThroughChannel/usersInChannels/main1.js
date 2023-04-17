import {
  getAllUserFromChannel,
  toGetChannel,
} from "../../../../utils/helper.js";
import { addUserChannelFunction } from "../addNewUserThroughChannel/addUserChannelFunction.js";

const interval = 2000; // how much time should the delay between two iterations be (in milliseconds)?
// let promise = Promise.resolve();
const token = process.env.SLACK_BOT_TOKEN;
async function main1(client, adminId) {
  const variables = {};
  const channel = await toGetChannel(variables);
  const channelMembers = await getAllUserFromChannel(channel, client, token);
  const promises = [];
  for (const n in channelMembers.members) {
    // Promise chaining
    const promise = (async () => {
      const slackId = channelMembers.members[n];

      // calling add_user_channel() function
      await addUserChannelFunction(slackId, client, adminId);
    })();
    promises.push(promise);
  }
  await Promise.all(
    promises.map((promise) =>
      promise.then(
        () => new Promise((resolve) => setTimeout(resolve, interval))
      )
    )
  );
}
export { main1 };
