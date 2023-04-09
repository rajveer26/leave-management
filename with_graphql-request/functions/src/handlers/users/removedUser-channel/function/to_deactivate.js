import {HASURA_OPERATION_delete} from "../../../../queries/users.js";

import  request  from 'graphql-request';
import {headers} from '../../../../utils/headers.js'


async function to_deactivate(variables)
{
  const data = await request(process.env.GRAPHQL_URL,HASURA_OPERATION_delete,variables,headers);

  return  data['update_leave_user']['returning'][0].slack_id;

}


export {to_deactivate}
