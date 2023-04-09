//getting slack_id of all the members in a slack
async function getAllUserFromChannel(channel_id,client,token) {
  return await client.conversations.members({
    token: token,
    channel: channel_id
  });
}
export {getAllUserFromChannel}


