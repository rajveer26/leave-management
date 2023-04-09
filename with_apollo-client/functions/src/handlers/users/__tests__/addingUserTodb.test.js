import { to_addData } from "../functions/addingUserTodb.js";
import { clients } from "../../../utils/connection.js";
import { gql } from "@apollo/client";
jest.mock('../../../utils/connection.js')
import {HASURA_OPERATION_add} from "../../../queries/users.js";
import { successMessage } from '../functions/successMessage.js';
import { sendDetails } from '../functions/sqs-triggers/sendDetails.js';

const mockClient = {
  chat: {
    postMessage: jest.fn(),
  },
};

jest.mock('../functions/successMessage.js');
jest.mock('../functions/sqs-triggers/sendDetails.js')
describe("to_addData function", () => {
  const variables = { slack_id: "1234",name:"Rajveer",email:"rajveer26ps@gmail.com",region:"India",external_id:"0",created_at:"2023-11-1",updated_at:"2023-11-1",created_by:"bot",updated_by:"bot" };
  const mockData = { insert_leave_user: { affected_rows: 1,returning: [{id: 47,name:"Rajveer",created_by:"bot",updated_by:"bot"}] } };


  beforeEach(() => {
    clients.mutate.mockClear();
  });

  test("User is added", async () => {
      clients.mutate.mockResolvedValue({ data: mockData });

    const slack_id = "1234";
    await to_addData(variables, slack_id,mockClient);
    expect(clients.mutate).toHaveBeenCalledTimes(1);
    expect(clients.mutate).toHaveBeenCalledWith({
      mutation: gql`${HASURA_OPERATION_add}`,
      variables,
    });
    expect(successMessage).toHaveBeenCalledTimes(1)
    expect(sendDetails).toHaveBeenCalledTimes(1)

  });

  test("logs an error if the adding fails", async () => {
    const variables = { slack_id: "1234",name:"Rajveer",email:"rajveer26ps@gmail.com",region:"India",external_id:"0",created_at:"2023-11-1",updated_at:"2023-11-1",created_by:"bot",updated_by:"bot" };

    const error = new Error("Failed to fetch data from the server.");
    clients.mutate.mockRejectedValue(error);

    console.log = jest.fn();
    try {
      await to_addData(variables);
    } catch (error) {
      console.log(error);
    }
    expect(console.log).toHaveBeenCalledWith(error);
  });
});
