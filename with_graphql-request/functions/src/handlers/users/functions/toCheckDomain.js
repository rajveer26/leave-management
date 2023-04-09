import {toGetDomain} from "./toGetDomain.js";


async function to_validateDomain(email)
{
  let domain = email.split("@")[1];
  domain = domain.split('.')[0];

  const variables={}
  let domain_config = await toGetDomain(variables)
  console.log(domain);
  console.log(domain_config)
  return domain === domain_config;
}
export {to_validateDomain}
