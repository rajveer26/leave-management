import dotenv from "dotenv";
import pkg from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import fetch from "isomorphic-fetch";

const { ApolloClient } = pkg;

dotenv.config();
export async function getGraphClient() {
  const defaultDomain = process.env.GRAPHQL_URL;
  const defaultHeader = {
    "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
  };
  return new ApolloClient({
    link: createHttpLink({
      fetch,
      uri: defaultDomain,
      headers: defaultHeader,
    }),
    cache: new InMemoryCache(),
  });
}
