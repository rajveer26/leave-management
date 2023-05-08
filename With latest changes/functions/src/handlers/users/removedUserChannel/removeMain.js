import gql from "graphql-tag";
import { memberNotPresentInDB } from "../../../utils/helper.js";
import { getGraphClient } from "../../../libs/graphConnector.js";
import { HasuraOperationDelete } from "../../../queries/users.js";

async function toDeactivate(variables) {
  const gClient = await getGraphClient();

  const { data } = await gClient.mutate({
    mutation: gql`
      ${HasuraOperationDelete}
    `,
    variables,
  });

  return data.update_leave_user.returning[0].slack_id;
}

async function removeMain(event) {
  const slackId = event.user;
  const variables = {
    slack_id: slackId,
  };
  const memberNotPresent = await memberNotPresentInDB(variables);
  if (!memberNotPresent) {
    const variables = {
      slack_id: { _eq: slackId },
    };
    await toDeactivate(variables);
  }
}

export { removeMain, toDeactivate };
