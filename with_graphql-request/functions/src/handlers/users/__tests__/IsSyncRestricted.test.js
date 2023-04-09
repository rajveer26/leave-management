import { isSyncRestricted } from "../functions/IsSyncRestricted.js";
jest.mock("graphql-request");
const { request } = require("graphql-request");


const { IS_SYNC_RESTRICTED} = require("../../../queries/config");

import {headers} from "../../../utils/headers.js";

describe("isSyncRestricted function", () => {
  test("getting is_sync_restricted", async () => {
    const variables = {};
    const data = { leave_config:  [{is_sync_restricted: true}] };
    request.mockResolvedValue(data);
    await isSyncRestricted(variables);
    expect(request).toHaveBeenCalledWith(
      process.env.GRAPHQL_URL,
      IS_SYNC_RESTRICTED,
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
      await isSyncRestricted();
    } catch (error) {
      console.log(error);
    }
    expect(console.log).toHaveBeenCalledWith(error);
  });
});
