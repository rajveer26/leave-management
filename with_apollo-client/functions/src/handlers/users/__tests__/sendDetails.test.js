import { pushingInQueue } from '../../../utils/helper.js';
import { sqsClient } from '../../../utils/synSQSinit.js';
import { SendMessageCommand } from '@aws-sdk/client-sqs';

// Mock the SQS client

jest.mock('../../../utils/synSQSinit.js', () => ({
  sqsClient: {
    send: jest.fn().mockResolvedValue({ MessageId: "12345" }),
  },
}));

jest.mock("../../../libs/graphConnector.js", () => ({
  getGraphClient: jest.fn(),
}));

describe('sendDetails', () => {
  afterEach(() => {
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

  });
