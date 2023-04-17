import { toAddData } from "../../../utils/helper.js";
import { getGraphClient } from '../../../libs/graphConnector.js';
import { gql } from "graphql-tag";
import { HasuraOperationAdd } from "../../../queries/users.js";
import { successMessage } from '../../../utils/helper.js';
import { pushingInQueue } from '../../../utils/helper.js';

jest.mock("../../../libs/graphConnector.js", () => ({
  getGraphClient: jest.fn().mockResolvedValue({
    mutate: jest.fn()
  })
}));
const mockClient = {
  chat: {
    postMessage: jest.fn(),
  },
};
jest.mock('../../../utils/synSQSinit.js', () => ({
  sqsClient: {
    send: jest.fn().mockResolvedValue({ MessageId: "12345" }),
  },
}));

jest.mock('../../../utils/helper.js', () => ({
  successMessage: jest.fn(),
  pushingInQueue: jest.fn(),
  toAddData: jest.requireActual('../../../utils/helper.js').toAddData
}));

describe("toAddData function", () => {
  const variables = { slack_id: "1234", name: "Rajveer", email: "rajveer26ps@gmail.com", region: "India", external_id: "0", created_at: "2023-11-1", updated_at: "2023-11-1", created_by: "bot", updated_by: "bot" };
  const mockData = { insert_leave_user: { affected_rows: 1, returning: [{ id: 47, name: "Rajveer", created_by: "bot", updated_by: "bot" }] } };


  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("User is added", async () => {
    const gClient = await getGraphClient();

    gClient.mutate.mockResolvedValue({ data: mockData });

    const slack_id = "1234";
    const name ="Rajveer";
    const id =47;
    const created_by ="bot";
    const updated_by = "bot";

    await toAddData(variables, slack_id, mockClient);
    expect(gClient.mutate).toHaveBeenCalledTimes(1);
    expect(gClient.mutate).toHaveBeenCalledWith({
      mutation: gql`${HasuraOperationAdd}`,
      variables,
    });
    await successMessage(mockClient,slack_id,name)
    expect(successMessage).toHaveBeenCalledTimes(1);
   await pushingInQueue(id,created_by,updated_by);
    expect(pushingInQueue).toHaveBeenCalledTimes(1);
  });

  test("logs an error if the adding fails", async () => {
    const variables = { slack_id: "1234", name: "Rajveer", email: "rajveer26ps@gmail.com", region: "India", external_id: "0", created_at: "2023-11-1", updated_at: "2023-11-1", created_by: "bot", updated_by: "bot" };
    const gClient = await getGraphClient();

    const error = new Error("Failed to fetch data from the server.");
    gClient.mutate.mockRejectedValue(error);

    console.log = jest.fn();
    try {
      await toAddData(variables);
    } catch (error) {
      console.log(error);
    }
    expect(console.log).toHaveBeenCalledWith(error);
  });
});
