//fetching domain from config table and returning it
import {gql} from '@apollo/client/core/core.cjs';

import {clients} from "../../../utils/connection.js";
import {TO_GET_DOMAIN} from "../../../queries/config.js";




async function toGetDomain(variables) {
  const {data} = await clients.query({
    query: gql`${TO_GET_DOMAIN}`, variables: variables
  });
  let result = data['leave_config'][0].domain;
  return result.split('.')[0];

}

export {toGetDomain}
