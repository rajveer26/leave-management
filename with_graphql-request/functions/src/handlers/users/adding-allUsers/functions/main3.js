import {getAllUsersFromSlack} from "./getAllUsersFromSlack.js";
import {validMail} from "../../functions/toCheckMail.js";
import {to_addData} from "../../functions/addingUserTodb.js";
import {memberNotPresent_db} from "../../functions/memberNotPresent_db.js";
import {to_validateDomain} from "../../functions/toCheckDomain.js";
import {setRegion} from "../../functions/region.js";

let interval = 1000; // how much time should the delay between two iterations be (in milliseconds)?

async function main3(client,admin) {
  const members = await getAllUsersFromSlack(client);
  const promises = [];

  for (const n in members) {
    const promise = (async () => {
      const email = members[n].profile.email;
      console.log("-----------------------------------------------------")
      console.log(email)
      //to check if the user is having valid mail id or not
      const emailValidation = await validMail(email);

      if (emailValidation) {
        const domainValidated = await to_validateDomain(email);
        //checking domain
        if (domainValidated) {
          const slack_id = members[n].id;
          const variables = {
            slack_id: slack_id
          }
          //to check member is already present or not
          const memberNotPresent = await memberNotPresent_db(variables)
          console.log("member not present " + memberNotPresent)
          if (memberNotPresent) {
            const name = members[n].real_name;
            console.log(name)
            let region = members[n].tz;

            region = await setRegion(region)

            //after all the checks adding user to the db
            const variables = {
              slack_id: slack_id,
              name: name,
              email: email,
              region: region,
              external_id: "0",
              created_at: new Date().toLocaleString(),
              updated_at: new Date().toLocaleString(),
              created_by: admin,
              updated_by: admin
            };
            await to_addData(variables, slack_id, client);
          }
          else
          {
            console.log("member already exists")
          }
        }
      }
    })();
    promises.push(promise);
  }

  await Promise.all(promises.map(promise => promise.then(() => new Promise(resolve => setTimeout(resolve, interval)))));
}

export {main3};
