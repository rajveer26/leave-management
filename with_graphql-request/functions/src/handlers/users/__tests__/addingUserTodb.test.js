import { to_addData } from "../functions/addingUserTodb.js";
jest.mock("graphql-request");
import  request  from "graphql-request";

import {HASURA_OPERATION_add} from "../../../queries/users.js";

const headers = {
  "Content-Type": "application/json",
  "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
};

const mockClient = {
  chat: {
    postMessage: jest.fn(),
  },
};
describe("to_addData function", () => {
  test("User is added", async () => {
    const variables = { slack_id: "1234",name:"Rajveer",email:"rajveer26ps@gmail.com",region:"India",external_id:"0",created_at:"2023-11-1",updated_at:"2023-11-1",created_by:"bot",updated_by:"bot" };
    const data = { insert_leave_user: { affected_rows: 1,returning: [{id: 47,name:"Rajveer",created_by:"bot",updated_by:"bot"}] } };
    request.mockResolvedValue(data);
    const slack_id = "1234";
    await to_addData(variables, slack_id,mockClient);
    expect(request).toHaveBeenCalledWith(
      process.env.GRAPHQL_URL,
      HASURA_OPERATION_add,
      variables,
      headers
    );
  });
  test("logs an error if the adding fails", async () => {
    const variables = { slack_id: "1234",name:"Rajveer",email:"rajveer26ps@gmail.com",region:"India",external_id:"0",created_at:"2023-11-1",updated_at:"2023-11-1",created_by:"bot",updated_by:"bot" };

    const error = new Error("Failed to fetch data from the server.");
    request.mockRejectedValue(error);
    console.log = jest.fn();
    try {
      await to_addData(variables);
    } catch (error) {
      console.log(error);
    }
    expect(console.log).toHaveBeenCalledWith(error);
  });
});
