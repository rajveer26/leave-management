//fetching channel id from config table and returning it

import {HASURA_OPERATION_get_channel} from "../../../../queries/config.js";
import request from "graphql-request";

import {headers} from '../../../../utils/headers.js'

async function toGetChannel(variables) {
  const data = await request(process.env.GRAPHQL_URL, HASURA_OPERATION_get_channel, variables, headers);
  return data['leave_config'][0]['channel_slack_id'];
}

export {toGetChannel}
