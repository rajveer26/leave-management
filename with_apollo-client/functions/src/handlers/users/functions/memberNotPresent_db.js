import {gql} from '@apollo/client/core/core.cjs';

import {clients} from "../../../utils/connection.js";
import {HASURA_OPERATION_get_ID_and_isActive_from_users} from "../../../queries/users.js";


async function memberNotPresent_db(variables) {
  const {data} = await clients.query({
    query: gql`${HASURA_OPERATION_get_ID_and_isActive_from_users}`,

    variables: variables
  });

  return Object.keys(data['leave_user']).length === 0;

}

export {memberNotPresent_db}
