import {
  getAllUserInfo,
  memberNotPresentInDB,
  setRegion,
  toAddData,
  toValidateDomain,
  validMail,
} from "../../../../utils/helper.js";

const token = process.env.SLACK_BOT_TOKEN;
async function addUserChannelFunction(slackId, client, adminId) {
  const variables = {
    slack_id: slackId,
  };
  const memberNotPresent = await memberNotPresentInDB(variables);
  if (memberNotPresent) {
    const admin = await getAllUserInfo(adminId, client, token);

    // calling function to fetch users info
    const info = await getAllUserInfo(slackId, client, token);
    const { email } = info.user.profile;

    // to check email is valid or not
    const emailValidation = await validMail(email);
    if (emailValidation) {
      // to validate domain
      const domainValidation = await toValidateDomain(email);
      if (domainValidation) {
        const name = info.user.real_name;
        let region = info.user.tz;
        region = await setRegion(region);

        const variables = {
          slack_id: slackId,
          name,
          email,
          region,
          external_id: "0",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: admin.user.real_name,
          updated_by: admin.user.real_name,
        };
        await toAddData(variables, slackId, client);
      }
    }
  }
}
export { addUserChannelFunction };
