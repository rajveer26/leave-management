import {gql} from '@apollo/client/core/core.cjs';
//const {gql} = pkg;

import { HASURA_OPERATION_delete } from '../../../../queries/users.js';
import {clients} from "../../../../utils/connection.js";


async function to_deactivate(variables) {
  const {data} = await clients.mutate({
    mutation: gql`${HASURA_OPERATION_delete}`, variables: variables
  })

  console.log(variables);
  console.log(JSON.stringify(data))
  console.log(data['update_leave_user']['returning'][0].slack_id);
  return data['update_leave_user']['returning'][0].slack_id;
}
export {to_deactivate}
