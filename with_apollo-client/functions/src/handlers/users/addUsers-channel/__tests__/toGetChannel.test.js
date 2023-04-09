import { toGetChannel } from "../functions/toGetChannel.js";
import { HASURA_OPERATION_get_channel} from "../../../../queries/config.js";
import { clients } from "../../../../utils/connection.js";
import { gql } from "@apollo/client";
jest.mock('../../../../utils/connection.js')

describe("toGetChannel function", () => {
  test("getting channel id", async () => {
    const variables = {};
    const data = { leave_config:  [{channel_slack_id: "CFDERT6754"}] };
    clients.query.mockResolvedValue({ data: data });

    await toGetChannel(variables);
    expect(clients.query).toHaveBeenCalledWith({
      query: gql`${HASURA_OPERATION_get_channel}`,
      variables,
    })

  });

  test("logs an error if the adding fails", async () => {
    const variables = { slack_id: "1234",name:"Rajveer",email:"rajveer26ps@gmail.com",region:"India",external_id:"0",created_at:"2023-11-1",updated_at:"2023-11-1",created_by:"bot",updated_by:"bot" };

    const error = new Error("Failed to fetch data from the server.");
    clients.query.mockRejectedValue(error);

    console.log = jest.fn();
    try {
      await toGetChannel();
    } catch (error) {
      console.log(error);
    }
    expect(console.log).toHaveBeenCalledWith(error);
  });
});
