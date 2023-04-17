import gql from "graphql-tag";
import AWS from "aws-sdk";
import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { getGraphClient } from "../libs/graphConnector.js";
import {
  HasuraOperationAdd,
  HasuraOperationGetIDAndIsActiveFromUsers,
} from "../queries/users.js";
import {
  HASURA_OPERATION_GET_CHANNEL,
  IS_SYNC_RESTRICTED,
  TO_GET_DOMAIN,
} from "../queries/config.js";
import { sqsClient } from "./synSQSinit.js";
// Set the region
AWS.config.update({ region: "eu-central-1" });

// Create an SQS service object
const sqs = new AWS.SQS({ apiVersion: "2012-11-05" });

const pushingInQueue = async function (id, createdBy, updatedBy) {
  const queueBody = {
    id,
    created_by: createdBy,
    updated_by: updatedBy,
    created_at: new Date().toLocaleString(),
  };

  const params = {
    DelaySeconds: 10,

    MessageAttributes: {
      id: {
        DataType: "Number",
        StringValue: id,
      },
      created_by: {
        DataType: "String",
        StringValue: createdBy,
      },
      updated_by: {
        DataType: "String",
        StringValue: updatedBy,
      },
      created_at: {
        DataType: "String",
        StringValue: new Date().toLocaleString(),
      },
    },
    MessageBody: JSON.stringify(queueBody),

    QueueUrl:
      "https://sqs.eu-central-1.amazonaws.com/789111362810/leave-tracker-leave-sync",
  };

  try {
    const data = await sqsClient.send(new SendMessageCommand(params));
    console.log("Success, message sent. MessageID:", data.MessageId);
  } catch (err) {
    throw err;
  }
};

async function successMessage(client, slackId, name) {
  const text = `Kudos! :smiley: ${name} You are about to add in a users table with slack id ${slackId}`;
  await console.log(text);
  await client.chat.postMessage({
    channel: slackId,
    text,
  });
}
async function toAddData(variables, slackId, client) {
  const gClient = await getGraphClient();
  const { data } = await gClient.mutate({
    mutation: gql`
      ${HasuraOperationAdd}
    `,
    variables,
  });
  const { id } = data.insert_leave_user.returning[0];
  const { name } = data.insert_leave_user.returning[0];
  const { created_by } = data.insert_leave_user.returning[0];
  const { updated_by } = data.insert_leave_user.returning[0];
  await successMessage(client, slackId, name);
  await pushingInQueue(id, created_by, updated_by);
  console.log(JSON.stringify(data));
}

async function getAllUserFromChannel(channelId, client, token) {
  return await client.conversations.members({
    token,
    channel: channelId,
  });
}

async function isSyncRestricted(variables) {
  const gClient = await getGraphClient();
  const { data } = await gClient.query({
    query: gql`
      ${IS_SYNC_RESTRICTED}
    `,
    variables,
  });
  return data.leave_config[0].is_sync_restricted;
}

async function memberNotPresentInDB(variables) {
  const gClient = await getGraphClient();
  const { data } = await gClient.query({
    query: gql`
      ${HasuraOperationGetIDAndIsActiveFromUsers}
    `,

    variables,
  });

  return Object.keys(data.leave_user).length === 0;
}

async function setRegion(region) {
  if (region === "Asia/Kolkata") {
    return "India";
  }
  return "USA";
}

async function toGetDomain(variables) {
  const gClient = await getGraphClient();

  const { data } = await gClient.query({
    query: gql`
      ${TO_GET_DOMAIN}
    `,
    variables,
  });
  const result = data.leave_config[0].domain;
  return result.split(".")[0];
}

async function toValidateDomain(email) {
  let domain = email.split("@")[1];
  domain = domain.split(".")[0];

  const variables = {};
  const domainConfig = await toGetDomain(variables);
  console.log(domain);
  console.log(domainConfig);
  return domain === domainConfig;
}

async function validMail(mail) {
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
    mail
  );
}

async function toGetChannel(variables) {
  const gClient = await getGraphClient();

  const { data } = await gClient.query({
    query: gql`
      ${HASURA_OPERATION_GET_CHANNEL}
    `,
    variables,
  });
  return data.leave_config[0].channel_slack_id;
}

async function getAllUserInfo(slackId, client, token) {
  return await client.users.info({
    token,
    user: slackId,
  });
}

export {
  toAddData,
  toValidateDomain,
  toGetDomain,
  toGetChannel,
  validMail,
  successMessage,
  setRegion,
  memberNotPresentInDB,
  isSyncRestricted,
  getAllUserFromChannel,
  getAllUserInfo,
  pushingInQueue,
};
