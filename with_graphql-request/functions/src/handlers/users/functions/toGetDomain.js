//fetching domain from config table and returning it

import request from "graphql-request";
import {TO_GET_DOMAIN} from "../../../queries/config.js";

import {headers} from '../../../utils/headers.js'



async function toGetDomain(variables) {
  const data = await request(process.env.GRAPHQL_URL, TO_GET_DOMAIN, variables, headers);
  let result = data['leave_config'][0].domain;
  return result.split('.')[0];

}

export {toGetDomain}
