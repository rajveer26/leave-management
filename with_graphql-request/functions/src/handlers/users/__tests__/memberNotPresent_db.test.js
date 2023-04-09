import { memberNotPresent_db } from "../functions/memberNotPresent_db.js";
jest.mock("graphql-request");
import request from "graphql-request";

import {HASURA_OPERATION_get_ID_and_isActive_from_users} from "../../../queries/users.js";

import {headers} from "../../../utils/headers.js";


describe("memberNotPresent_db function", () => {
  test("to check member is present", async () => {
    const variables={
      slack_id:"1234"
    }
    const data = {leave_user: [{id: 47,is_active:true}]  };
    request.mockResolvedValue(data);
    const slack_id = "1234";
    await memberNotPresent_db(variables);
    expect(request).toHaveBeenCalledWith(
      process.env.GRAPHQL_URL,
      HASURA_OPERATION_get_ID_and_isActive_from_users,
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
      await memberNotPresent_db(variables);
    } catch (error) {
      console.log(error);
    }
    expect(console.log).toHaveBeenCalledWith(error);
  });
});
