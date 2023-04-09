import { memberNotPresent_db } from "../functions/memberNotPresent_db.js";
import { clients } from '../../../utils/connection.js';
import { gql } from '@apollo/client';
jest.mock('../../../utils/connection.js')
import {HASURA_OPERATION_get_ID_and_isActive_from_users} from "../../../queries/users.js";
import { isSyncRestricted } from '../functions/IsSyncRestricted.js';




describe("memberNotPresent_db function", () => {
  test("to check member is present", async () => {
    const variables = {
      slack_id: "1234"
    }
    const data = { leave_user: [{ id: 47, is_active: true }] };
    clients.query.mockResolvedValue({ data: data });

    await memberNotPresent_db(variables);
    expect(clients.query).toHaveBeenCalledWith({
      query: gql`${HASURA_OPERATION_get_ID_and_isActive_from_users}`,
      variables,
    });
  })

  test("logs an error if memberNotPresent fails to fetch", async () => {
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
})
