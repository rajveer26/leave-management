//fetching channel id from config table and returning it
import {gql} from '@apollo/client/core/core.cjs';

import {HASURA_OPERATION_get_channel} from "../../../../queries/config.js";
import {clients} from "../../../../utils/connection.js";

async function toGetChannel(variables) {
  const {data} = await clients.query({
    query: gql`${HASURA_OPERATION_get_channel}`, variables: variables
  });
  return data['leave_config'][0]['channel_slack_id'];
}

export {toGetChannel}
