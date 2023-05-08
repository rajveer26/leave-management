const HASURA_OPERATION_GET_CHANNEL = `
  query MyQuery_to_get_channel {
    leave_config {
      channel_slack_id
    }
  }
`;

const TO_GET_DOMAIN = `
  query MyQuery {
    leave_config {
      domain
    }
  }
`;

const IS_SYNC_RESTRICTED = `
  query MyQuery {
    leave_config {
      is_sync_restricted
    }
  }
`;

export { HASURA_OPERATION_GET_CHANNEL, TO_GET_DOMAIN, IS_SYNC_RESTRICTED };
