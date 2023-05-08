import {
  validMail,
  toAddData,
  memberNotPresentInDB,
  toValidateDomain,
  setRegion,
} from "../../../utils/helper.js";

const interval = 1000; // how much time should the delay between two iterations be (in milliseconds)?

async function getAllUsersFromSlack(client, token) {
  const { members } = await client.users.list({
    token,
  });
  return members;
}
async function main3(client, admin, token) {
  const members = await getAllUsersFromSlack(client, token);
  const promises = [];
  for (const n in members) {
    const promise = (async () => {
      const { email } = members[n].profile;
      // to check if the user is having valid mail id or not
      const emailValidation = await validMail(email);

      if (emailValidation) {
        const domainValidated = await toValidateDomain(email);
        // checking domain
        if (domainValidated) {
          const slackId = members[n].id;
          const variables = {
            slack_id: slackId,
          };
          // to check member is already present or not
          const memberNotPresent = await memberNotPresentInDB(variables);
          if (memberNotPresent) {
            const name = members[n].real_name;
            let region = members[n].tz;

            region = await setRegion(region);

            // after all the checks adding user to the db
            const variables = {
              slack_id: slackId,
              name,
              email,
              region,
              external_id: "0",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              created_by: admin,
              updated_by: admin,
            };
            await toAddData(variables, slackId, client);
          } else {
            console.log("member already exists");
          }
        }
      }
    })();
    promises.push(promise);
  }

  await Promise.all(
    promises.map((promise) =>
      promise.then(
        () => new Promise((resolve) => setTimeout(resolve, interval))
      )
    )
  );
}

export { main3, getAllUsersFromSlack };
