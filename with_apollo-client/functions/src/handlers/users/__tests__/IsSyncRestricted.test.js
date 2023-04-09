import { isSyncRestricted } from "../functions/IsSyncRestricted.js";
const { IS_SYNC_RESTRICTED} = require("../../../queries/config");
import { clients } from '../../../utils/connection.js';
import { gql } from '@apollo/client';
jest.mock('../../../utils/connection.js')

describe("isSyncRestricted function", () => {

  beforeEach(() => {
    clients.query.mockClear();
  });


  test("getting is_sync_restricted", async () => {
    const variables = {};
    const data = { leave_config:  [{is_sync_restricted: true}] };
    clients.query.mockResolvedValue({ data: data });

    const result = await isSyncRestricted(variables);
    expect(clients.query).toHaveBeenCalledTimes(1);
    expect(clients.query).toHaveBeenCalledWith({
      query: gql`${IS_SYNC_RESTRICTED}`,
      variables,
    });
    expect(result).toBe(true);

  });
  test("logs an error if the is_sync_restricted fails to fetch", async () => {
    const variables = { slack_id: "1234",name:"Rajveer",email:"rajveer26ps@gmail.com",region:"India",external_id:"0",created_at:"2023-11-1",updated_at:"2023-11-1",created_by:"bot",updated_by:"bot" };

    const error = new Error("Failed to fetch data from the server.");
    clients.query.mockRejectedValue(error);

    console.log = jest.fn();
    try {
      await isSyncRestricted();
    } catch (error) {
      console.log(error);
    }
    expect(console.log).toHaveBeenCalledWith(error);
  });
});
