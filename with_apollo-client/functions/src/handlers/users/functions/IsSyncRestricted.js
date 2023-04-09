import {gql} from '@apollo/client/core/core.cjs';

import {IS_SYNC_RESTRICTED} from "../../../queries/config.js";
import {clients} from "../../../utils/connection.js";

 async function isSyncRestricted(variables) {
  const {data} = await clients.query({
    query: gql`${IS_SYNC_RESTRICTED}`, variables: variables
  });
   return data['leave_config'][0]['is_sync_restricted'];
}


export {isSyncRestricted}



