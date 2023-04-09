import { toGetChannel } from "../functions/toGetChannel.js";
jest.mock("graphql-request");
import  request from "graphql-request";


import { HASURA_OPERATION_get_channel} from "../../../../queries/config.js";

const headers = {
  "Content-Type": "application/json",
  "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
};
describe("toGetChannel function", () => {
  test("getting channel id", async () => {
    const variables = {};
    const data = { leave_config:  [{channel_slack_id: "CFDERT6754"}] };
    request.mockResolvedValue(data);
    await toGetChannel(variables);
    expect(request).toHaveBeenCalledWith(
      process.env.GRAPHQL_URL,
      HASURA_OPERATION_get_channel,
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
      await toGetChannel();
    } catch (error) {
      console.log(error);
    }
    expect(console.log).toHaveBeenCalledWith(error);
  });
});
