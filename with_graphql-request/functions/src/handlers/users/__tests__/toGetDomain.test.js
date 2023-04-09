import { toGetDomain } from "../functions/toGetDomain.js";
jest.mock("graphql-request");
import  request  from "graphql-request";

import { TO_GET_DOMAIN} from "../../../queries/config.js";

const headers = {
  "Content-Type": "application/json",
  "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
};
describe("toGetChannel function", () => {
  test("getting channel id", async () => {
    const variables = {};
    const data = { leave_config:  [{domain: "kiit.ac.in"}] };
    request.mockResolvedValue(data);
    await toGetDomain(variables);
    expect(request).toHaveBeenCalledWith(
      process.env.GRAPHQL_URL,
      TO_GET_DOMAIN,
      variables,
      headers
    );
  });
  test("logs an error if the adding fails", async () => {
    const variables = {};

    const error = new Error("Failed to fetch data from the server.");
    request.mockRejectedValue(error);
    console.log = jest.fn();
    try {
      await toGetDomain(variables);
    } catch (error) {
      console.log(error);
    }
    expect(console.log).toHaveBeenCalledWith(error);
  });
});
