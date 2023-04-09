import {IS_SYNC_RESTRICTED} from "../../../queries/config.js";
import request from "graphql-request";

import {headers} from '../../../utils/headers.js'



 async function isSyncRestricted(variables) {
  const data = await request(process.env.GRAPHQL_URL, IS_SYNC_RESTRICTED, variables, headers);
   return data['leave_config'][0]['is_sync_restricted'];
}


export {isSyncRestricted}



