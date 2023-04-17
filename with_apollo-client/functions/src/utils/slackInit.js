import pkg from "@slack/bolt";

const { App, AwsLambdaReceiver } = pkg;

export const awsLamdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

export const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: awsLamdaReceiver,
});
