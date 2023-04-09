//Slack API to get info of all users
 async function getAllUserInfo(slack_id,client,token) {
   return await client.users.info({
    token: token,
    user: slack_id
  })
}
export {getAllUserInfo}
