import { memberNotPresentInDB } from "../../../utils/helper.js";
import { getGraphClient } from '../../../libs/graphConnector.js';
import {gql} from 'graphql-tag';

import {HasuraOperationGetIDAndIsActiveFromUsers} from "../../../queries/users.js";
import { isSyncRestricted } from '../../../utils/helper.js';
jest.mock("../../../libs/graphConnector.js", () => ({
  getGraphClient: jest.fn().mockResolvedValue({
    query: jest.fn()
  })
}));

describe("memberNotPresent_db function", () => {
  test("to check member is present", async () => {
    const variables = {
      slack_id: "1234"
    }
    const data = { leave_user: [{ id: 47, is_active: true }] };
    const gClient = await getGraphClient();

    gClient.query.mockResolvedValue({ data: data });

    await memberNotPresentInDB(variables);
    expect(gClient.query).toHaveBeenCalledWith({
      query: gql`${HasuraOperationGetIDAndIsActiveFromUsers}`,
      variables,
    });
  })

  test("logs an error if memberNotPresent fails to fetch", async () => {
    const variables = { slack_id: "1234",name:"Rajveer",email:"rajveer26ps@gmail.com",region:"India",external_id:"0",created_at:"2023-11-1",updated_at:"2023-11-1",created_by:"bot",updated_by:"bot" };

    const error = new Error("Failed to fetch data from the server.");
    const gClient = await getGraphClient();

    gClient.query.mockRejectedValue(error);

    console.log = jest.fn();
    try {
      await isSyncRestricted();
    } catch (error) {
      console.log(error);
    }
    expect(console.log).toHaveBeenCalledWith(error);
  });
})
