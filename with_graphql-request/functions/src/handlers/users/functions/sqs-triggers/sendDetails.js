import AWS from "aws-sdk"
// Set the region
AWS.config.update({region: 'eu-central-1'});
import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { sqsClient } from "../../../../utils/synSQSinit.js";

// Create an SQS service object
let sqs = new AWS.SQS({apiVersion: '2012-11-05'});

let sendDetails = async function (id,created_by,updated_by) {

  let queue_body=
    {
      id: id,
      created_by: created_by,
      updated_by: updated_by,
      created_at:new Date().toLocaleString()
    }

  let params = {
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
        StringValue: new Date().toLocaleString()
      }
    },
    MessageBody: JSON.stringify(queue_body),

    QueueUrl: 'https://sqs.eu-central-1.amazonaws.com/789111362810/leave-tracker-leave-sync'
  };

  try {
    const data = await sqsClient.send(new SendMessageCommand(params));
    if (data && data.MessageId) {
      console.log("Success, message sent. MessageID:", data.MessageId);
    } else {
      console.log("Error: No message ID returned");
    }
  } catch (err) {
    console.log("Error", err);
  }


};
export {sendDetails}
