
 async function getAllUsersFromSlack(client) {
  let {members} = await client.users.list({
    token:process.env.SLACK_BOT_TOKEN
  });
  return members;
}
export { getAllUsersFromSlack };
