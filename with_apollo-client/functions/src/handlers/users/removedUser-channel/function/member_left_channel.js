
import {memberNotPresent_db} from "../../functions/memberNotPresent_db.js";
import {to_deactivate} from "./to_deactivate.js";

async function member_left_channel(event) {
  let slack_id = event.user;
  console.log(slack_id);
  const variables = {
    slack_id: slack_id
  }
  let memberNotPresent = await memberNotPresent_db(variables)
  if (!memberNotPresent) {

    console.log("deleting user")
    const variables = {
      slack_id: { _eq: slack_id}
    }
    await to_deactivate(variables);
  } else {
    console.log("user does not exists")
  }
}

export {member_left_channel}

