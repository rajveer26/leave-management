import { isSyncRestricted } from "../../../utils/helper.js";
import { IS_SYNC_RESTRICTED} from"../../../queries/config.js";
import { getGraphClient } from '../../../libs/graphConnector.js';
import {gql} from 'graphql-tag';

jest.mock("../../../libs/graphConnector.js", () => ({
  getGraphClient: jest.fn().mockResolvedValue({
    query: jest.fn()
  })
}));
describe("isSyncRestricted function", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });


  test("getting isSyncRestricted", async () => {
    const variables = {};
    const data = { leave_config:  [{is_sync_restricted: true}] };
    const gClient = await getGraphClient();

    gClient.query.mockResolvedValue({ data: data });

    const result = await isSyncRestricted(variables);
    expect(gClient.query).toHaveBeenCalledTimes(1);
    expect(gClient.query).toHaveBeenCalledWith({
      query: gql`${IS_SYNC_RESTRICTED}`,
      variables,
    });
    expect(result).toBe(true);

  });
  test("logs an error if the is_sync_restricted fails to fetch", async () => {
    const variables = { slack_id: "1234",name:"Rajveer",email:"rajveer26ps@gmail.com",region:"India",external_id:"0",created_at:"2023-11-1",updated_at:"2023-11-1",created_by:"bot",updated_by:"bot" };
    const gClient = await getGraphClient();

    const error = new Error("Failed to fetch data from the server.");
    gClient.query.mockRejectedValue(error);

    console.log = jest.fn();
    try {
      await isSyncRestricted();
    } catch (error) {
      console.log(error);
    }
    expect(console.log).toHaveBeenCalledWith(error);
  });
});
