import { ApolloClient, InMemoryCache} from '@apollo/client/core/core.cjs';
import { HttpLink } from '@apollo/client/link/http/http.cjs';


import fetch from 'cross-fetch';

import {headers} from "./headers.js";

export const clients = new ApolloClient({
  link: new HttpLink({
    uri: process.env.GRAPHQL_URL,
    headers,
    fetch,
  }),
  cache: new InMemoryCache(),

});

