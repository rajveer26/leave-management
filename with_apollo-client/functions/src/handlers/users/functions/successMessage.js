//sending success message
 async function successMessage(client,slack_id,name) {
   let text= `Kudos! :smiley: ${name} You are about to add in a users table with slack id ${slack_id}`
   await console.log(text);
   await client.chat.postMessage({
    channel: slack_id,
    text: text
  })
}
export {successMessage}
