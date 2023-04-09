import { to_deactivate } from "../function/to_deactivate.js";
jest.mock("graphql-request");
import request from "graphql-request";

import {HASURA_OPERATION_delete} from "../../../../queries/users.js";

const headers = {
  "Content-Type": "application/json",
  "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
};
describe("to_deactivate function", () => {
  test("User status becomes active", async () => {
    const variables= {
      slack_id: {_eq: "1234"}
    }
    const data = { update_leave_user: {affected_rows:1,returning:[{name:"rajveer",slack_id: "1234",is_active: true}]  }};
    request.mockResolvedValue(data);
    await to_deactivate(variables);
    expect(request).toHaveBeenCalledWith(
      process.env.GRAPHQL_URL,
      HASURA_OPERATION_delete,
      variables,
      headers
    );
  });
  test("logs an error if the deactivation fails", async () => {
    const variables= {
      slack_id: {_eq: "1234"}
    }
    const error = new Error("Failed to fetch data from the server.");
    request.mockRejectedValue(error);
    console.log = jest.fn();
    try {
      await to_deactivate(variables);
    } catch (error) {
      console.log(error);
    }
    expect(console.log).toHaveBeenCalledWith(error);
  });
});
