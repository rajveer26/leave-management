import {gql} from '@apollo/client/core/core.cjs';

import {clients} from "../../../utils/connection.js";
import {HASURA_OPERATION_add} from "../../../queries/users.js";
import {sendDetails} from "./sqs-triggers/sendDetails.js";
import {successMessage} from "./successMessage.js";

 async function to_addData(variables, slack_id, client)
{
  const {data} = await clients.mutate({
    mutation: gql`${HASURA_OPERATION_add}`, variables: variables
  });
  let id = data['insert_leave_user']['returning'][0].id;
  let name= data['insert_leave_user']['returning'][0].name;
  let created_by = data['insert_leave_user']['returning'][0].created_by;
  let updated_by = data['insert_leave_user']['returning'][0].updated_by;
  await successMessage(client,slack_id,name)
  await sendDetails(id,created_by,updated_by);
  console.log(JSON.stringify(data))
}


export {to_addData}
