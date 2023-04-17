import {
  isSyncRestricted,
  memberNotPresentInDB,
  setRegion,
  toAddData,
  toValidateDomain, toGetChannel, toGetDomain, validMail,
} from '../../../utils/helper.js';
import { getGraphClient } from '../../../libs/graphConnector.js';
import { gql } from "graphql-tag";
import { HasuraOperationAdd, HasuraOperationGetIDAndIsActiveFromUsers } from '../../../queries/users.js';
import { successMessage } from '../../../utils/helper.js';
import { pushingInQueue } from '../../../utils/helper.js';
import { getAllUserInfo } from '../../../utils/helper.js';
import {getAllUserFromChannel} from "../../../utils/helper.js";
import { HASURA_OPERATION_GET_CHANNEL, IS_SYNC_RESTRICTED, TO_GET_DOMAIN } from '../../../queries/config.js';
import { sqsClient } from '../../../utils/synSQSinit.js';
import { SendMessageCommand } from '@aws-sdk/client-sqs';
import fetchMock from 'fetch-mock';


jest.mock("../../../libs/graphConnector.js", () => ({
  getGraphClient: jest.fn().mockResolvedValue({
    mutate: jest.fn(),
    query: jest.fn()
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
  toAddData: jest.requireActual('../../../utils/helper.js').toAddData,
  getAllUserFromChannel: jest.requireActual("../../../utils/helper.js").getAllUserFromChannel,
  isSyncRestricted: jest.requireActual("../../../utils/helper.js").isSyncRestricted,
  memberNotPresentInDB: jest.requireActual("../../../utils/helper.js").memberNotPresentInDB,
  setRegion: jest.requireActual("../../../utils/helper.js").setRegion,
  successMessage: jest.requireActual("../../../utils/helper.js").successMessage,
  toValidateDomain: jest.requireActual('../../../utils/helper.js').toValidateDomain,
  validMail:jest.requireActual("../../../utils/helper.js").validMail,
  toGetChannel: jest.requireActual("../../../utils/helper.js").toGetChannel,
   toGetDomain:jest.requireActual("../../../utils/helper.js").toGetDomain,

  getAllUserInfo:jest.requireActual("../../../utils/helper.js").getAllUserInfo,
  pushingInQueue:jest.requireActual("../../../utils/helper.js").pushingInQueue

}));

describe("toAddData function", () => {
  const variables = { slack_id: "1234", name: "Rajveer", email: "rajveer26ps@gmail.com", region: "India", external_id: "0", created_at: "2023-11-1", updated_at: "2023-11-1", created_by: "bot", updated_by: "bot" };
  const mockData = { insert_leave_user: { affected_rows: 1, returning: [{ id: 47, name: "John", created_by: "foo", updated_by: "bar" }] } };
 let successMessage = jest.fn();
let sendDetails = jest.fn();

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
    await sendDetails(id,created_by,updated_by);
    expect(sendDetails).toHaveBeenCalledTimes(1);
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



describe('getAllUserFromChannel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns user info for valid Slack ID', async () => {
    // Create a mock WebClient instance
    const mockClient = {
      conversations: {
        members: jest.fn().mockResolvedValue({
          members: [
            "U023BECGF",
            "U061F7AUR",
            "W012A3CDE"
          ]
        })
      }
    };

    // Call the function with a valid Slack ID
    const result = await getAllUserFromChannel('C1234567890',mockClient,'test-token');

    // Check that the mock API was called with the correct parameters
    expect(mockClient.conversations.members).toHaveBeenCalledWith({
      token: 'test-token',
      channel: 'C1234567890'
    });

    // Check that the function returns the expected user info
    expect(result.members[0]).toBe('U023BECGF');
    expect(result.members[1]).toBe('U061F7AUR');
    expect(result.members[2]).toBe('W012A3CDE');
  });

  test('returns null for invalid Slack ID', async () => {
    // Create a mock WebClient instance
    const mockClient = {
      conversations: {
        members: jest.fn().mockResolvedValue()
      }
    };

    // Call the function with an invalid Slack ID
    const result = await getAllUserFromChannel('invalid-channel', mockClient, 'test-token');

    // Check that the mock API was called with the correct parameters
    expect(mockClient.conversations.members).toHaveBeenCalledWith({
      token: 'test-token',
      channel: 'invalid-channel'
    });

    // Check that the function returns null when the user is not found
    expect(result).toBe(undefined);
  });
});



describe("isSyncRestricted function", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getting is_sync_restricted", async () => {
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



describe("memberNotPresent_db function", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

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

    try {
      const variables = { slack_id: "1234",name:"Rajveer",email:"rajveer26ps@gmail.com",region:"India",external_id:"0",created_at:"2023-11-1",updated_at:"2023-11-1",created_by:"bot",updated_by:"bot" };
      const gClient = await getGraphClient();

      gClient.query.mockRejectedValue(new Error("Failed to fetch data from the server."));
      console.log = jest.fn();
    } catch (error) {
      console.log(error);
      console.error(error);
    }

    try {
      await isSyncRestricted();
    } catch (error) {
      console.log(error);
      expect(console.log).toHaveBeenCalledWith(error);
      expect().toBe()
    }

  });
})

describe('setRegion', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should return "India" when region is "Asia/Kolkata"', async () => {
    const region = 'Asia/Kolkata';
    const result = await setRegion(region);
    expect(result).toEqual('India');
  });

  it('should return "USA" when region is not "Asia/Kolkata"', async () => {
    const region = 'America/New_York';
    const result = await setRegion(region);
    expect(result).toEqual('USA');
  });
});


describe("successMessage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockClient = {
    chat: {
      postMessage: jest.fn(),
    },
  };
  test("sends success message when user about to", async () => {
    const slack_id = "ABC123";
    const name = "Rajveer"
    const expectedText = `Kudos! :smiley: ${name} You are about to add in a users table with slack id ${slack_id}`;

    await successMessage(mockClient, slack_id, name);
    expect(mockClient.chat.postMessage).toHaveBeenCalledTimes(1);
    expect(mockClient.chat.postMessage).toHaveBeenCalledWith({
      channel: slack_id,
      text: expectedText,
    });
  });
  test("throws an error when there are no data", async () => {
    const slack_id = null;
    const name = "Rajveer"

    try {
      await successMessage(mockClient, slack_id,name);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});

describe('to_validateDomain', () => {
  const mockData = { leave_config:[{
      domain: 'example'
    }] };

  afterEach(() => {
    fetchMock.reset();
  });

  test('returns true when the domain in the email matches the domain in the config', async () => {

     let toGetDomain = jest.fn(() => 'example')
    const gClient = await getGraphClient();

    gClient.query.mockResolvedValue({ data: mockData });

    const email = 'user@example.com';
    const result = await toValidateDomain(email);
    expect(result).toBe(true);
  });

  test('returns false when the domain in the email does not match the domain in the config', async () => {
    const email = 'user@wrong-domain.com';
    const result = await toValidateDomain(email);
    expect(result).toBe(false);
  });
});

describe("Get true validation upon sending mail", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("getSubscribersFromString should return an array of users", async () => {
    const string = "1905890@kiit.ac.in";
    const expected = true
    const result = await validMail(string);
    expect(result).toEqual(expected);
  });

  test("get false upon sending wrong mail", async () => {
    const string = "123"
    const expected = false;
    const result = await validMail(string);
    expect(result).toEqual(expected);
  });
});

describe("toGetChannel function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

describe("toGetDomain function", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("checking domain", async () => {
    const variables = {};
    const data = { leave_config: [{ domain: "kiit.ac.in" }] };
    const gClient = await getGraphClient();

    gClient.query.mockResolvedValue({ data: data });

    await toGetDomain(variables);
    expect(gClient.query).toHaveBeenCalledWith({
      query: gql`${TO_GET_DOMAIN}`,
      variables,
    });
  })

  test("logs an error if the fetching fails", async () => {
    const variables = {};

    const error = new Error("Failed to fetch data from the server.");
    const gClient = await getGraphClient();

    gClient.query.mockRejectedValue(error);

    console.log = jest.fn();
    try {
      await toGetDomain(variables);
    } catch (error) {
      console.log(error);
    }
    expect(console.log).toHaveBeenCalledWith(error);
  });

})

describe('getAllUserInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns user info for valid Slack ID', async () => {
    // Create a mock WebClient instance
    const mockClient = {
      users: {
        info: jest.fn().mockResolvedValue({
          user: {
            id: 'U12345678',
            name: 'testuser',
            real_name: 'Test User'
          }
        })
      }
    };

    // Call the function with a valid Slack ID
    const result = await getAllUserInfo('U12345678', mockClient, 'test-token');

    // Check that the mock API was called with the correct parameters
    expect(mockClient.users.info).toHaveBeenCalledWith({
      token: 'test-token',
      user: 'U12345678'
    });

    // Check that the function returns the expected user info
    expect(result.user.id).toBe('U12345678');
    expect(result.user.name).toBe('testuser');
    expect(result.user.real_name).toBe('Test User');
  });

  test('returns null for invalid Slack ID', async () => {
    // Create a mock WebClient instance
    const mockClient = {
      users: {
        info: jest.fn().mockResolvedValue()
      }
    };

    // Call the function with an invalid Slack ID
    const result = await getAllUserInfo('invalid-id', mockClient, 'test-token');

    // Check that the mock API was called with the correct parameters
    expect(mockClient.users.info).toHaveBeenCalledWith({
      token: 'test-token',
      user: 'invalid-id'
    });

    // Check that the function returns null when the user is not found
    expect(result).toBe(undefined);
  });
});

jest.mock('../../../utils/synSQSinit.js', () => ({
  sqsClient: {
    send: jest.fn().mockResolvedValue({ MessageId: "12345" }),
  },
}));



describe('sendDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should log Success, message sent. MessageID: 12345", async () => {


    const id = 123;
    const created_by = "Rajveer";
    const updated_by = "Pratap";

    const time = new Date().toLocaleString();
    await pushingInQueue(id, created_by, updated_by);

    expect(sqsClient.send).toHaveBeenCalledWith(
      expect.objectContaining({
        input: {
          DelaySeconds: 10,
          MessageAttributes: {
            id: {
              DataType: "Number",
              StringValue: id,
            },
            created_by: {
              DataType: "String",
              StringValue: created_by,
            },
            updated_by: {
              DataType: "String",
              StringValue: updated_by,
            },
            created_at: {
              DataType: "String",
              StringValue: time, // update here
            },
          },
          MessageBody: expect.any(String),
          QueueUrl: "https://sqs.eu-central-1.amazonaws.com/789111362810/leave-tracker-leave-sync",
        },
      })
    );
  });
  it("should throw an error if there was an error sending the message", async () => {
    // Set up the mock to throw an error
    sqsClient.send.mockRejectedValue(new Error("Failed to send message"));

    // Call the function with test data
    const id = 123;
    const created_by = "testuser1";
    const updated_by = "testuser2";
    await expect(pushingInQueue(id, created_by, updated_by)).rejects.toThrow("Failed to send message");

    // Check that the sqsClient.send method was called with the correct parameters
    expect(sqsClient.send).toHaveBeenCalledWith(expect.any(SendMessageCommand));
  });
});
