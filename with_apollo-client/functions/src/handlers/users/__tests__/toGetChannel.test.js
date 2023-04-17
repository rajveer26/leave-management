import { toGetChannel } from "../../../utils/helper.js";
import { HASURA_OPERATION_GET_CHANNEL} from "../../../queries/config.js";
import { getGraphClient } from "../../../libs/graphConnector.js";
//import { gql } from "@apollo/client";
import {gql} from 'graphql-tag';

jest.mock("../../../libs/graphConnector.js", () => ({
  getGraphClient: jest.fn().mockResolvedValue({
    query: jest.fn()
  })
}));

describe("toGetChannel function", () => {
  test("getting channel id", async () => {
    const variables = {};
    const data = { leave_config:  [{channel_slack_id: "CFDERT6754"}] };
    const gClient = await getGraphClient();

    gClient.query.mockResolvedValue({ data: data });

    await toGetChannel(variables);
    expect(gClient.query).toHaveBeenCalledWith({
      query: gql`${HASURA_OPERATION_GET_CHANNEL}`,
      variables,
    })

  });

  test("logs an error if the adding fails", async () => {
    const variables = { slack_id: "1234",name:"Rajveer",email:"rajveer26ps@gmail.com",region:"India",external_id:"0",created_at:"2023-11-1",updated_at:"2023-11-1",created_by:"bot",updated_by:"bot" };

    const error = new Error("Failed to fetch data from the server.");
    const gClient = await getGraphClient();

    gClient.query.mockRejectedValue(error);

    console.log = jest.fn();
    try {
      await toGetChannel();
    } catch (error) {
      console.log(error);
    }
    expect(console.log).toHaveBeenCalledWith(error);
  });
});
