import {validMail} from "../../functions/toCheckMail.js";
import {getAllUserInfo} from "./togetInfoOfAllUsers.js";
import {memberNotPresent_db} from "../../functions/memberNotPresent_db.js";
import { to_addData} from "../../functions/addingUserTodb.js";
import {to_validateDomain} from "../../functions/toCheckDomain.js";
import {setRegion} from "../../functions/region.js";



const token = process.env.SLACK_BOT_TOKEN;
 async function add_user_channel_function(slack_id,client,admin_id)
{
  const variables={
    slack_id:slack_id
  }
  let memberNotPresent = await memberNotPresent_db(variables)
    if ( memberNotPresent) {
     let admin = await getAllUserInfo(admin_id,client,token);
      //calling function to fetch users info
      const info = await getAllUserInfo(slack_id,client,token);
      let email = info.user.profile.email;
      console.log("------------------------------------------------")
      console.log(email);
      //to check email is valid or not
      let emailValidation = await validMail(email)
      console.log(emailValidation)
      if (emailValidation) {
        //to validate domain
        let domainValidation = await to_validateDomain(email)
        if ( domainValidation) {

          let name = info.user.real_name;
          let region = info.user.tz;
          region = await setRegion(region)

          const variables = {
            slack_id,
            name,
            email,
            region,
            external_id:"0",
            created_at:new Date().toLocaleString(),
            updated_at:new Date().toLocaleString(),
            created_by:admin.user.real_name,
            updated_by:admin.user.real_name
          };
          await to_addData(variables,slack_id,client);}
      }
    }
    else
    {
      console.log("member already exists")
    }

}
export {add_user_channel_function}
