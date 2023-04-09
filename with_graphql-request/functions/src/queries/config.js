const HASURA_OPERATION_get_details = `
  query MyQuery_leave_config_channel {
    leave_config {
      domain
      is_sync_restricted
      channel_slack_id
    }
  }
`;

const HASURA_OPERATION_get_channel=`
  query MyQuery_to_get_channel {
    leave_config {
      channel_slack_id
    }
  }
`;

const TO_GET_DOMAIN=`
  query MyQuery {
    leave_config {
      domain
    }
  }
`;

const IS_SYNC_RESTRICTED=`
  query MyQuery {
    leave_config {
      is_sync_restricted
    }
  }
`;

export {HASURA_OPERATION_get_details,HASURA_OPERATION_get_channel,TO_GET_DOMAIN,IS_SYNC_RESTRICTED};
