import { SQSClient } from "@aws-sdk/client-sqs";

export const sqsClient = new SQSClient({
  region: "eu-central-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  endpoint:
    "https://sqs.eu-central-1.amazonaws.com/789111362810/leave-tracker-leave-sync",
});
