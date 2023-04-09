import  request  from 'graphql-request';
import {headers} from '../../../utils/headers.js'

import {HASURA_OPERATION_add} from "../../../queries/users.js";
import {sendDetails} from "./sqs-triggers/sendDetails.js";
import {successMessage} from "./successMessage.js";

 async function to_addData(variables, slack_id, client)
{
  const data = await request(process.env.GRAPHQL_URL,HASURA_OPERATION_add,variables,headers);
  let id = data['insert_leave_user']['returning'][0].id;
  let name= data['insert_leave_user']['returning'][0].name;
  let created_by = data['insert_leave_user']['returning'][0].created_by;
  let updated_by = data['insert_leave_user']['returning'][0].updated_by;
  await successMessage(client,slack_id,name)

  await sendDetails(id,created_by,updated_by);

//  if(data.insert_leave_user.affected_rows===1) return slack_id
}


export {to_addData}
