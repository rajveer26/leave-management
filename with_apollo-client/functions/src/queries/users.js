const HasuraOperationAdd = `  mutation MyMutation_add_user($created_at: timestamp, $created_by: String, $email: citext, $external_id: String, $slack_id: String, $updated_at: timestamp, $updated_by: String, $region: leave_region_enum, $name: String) {
  insert_leave_user(objects: {created_at: $created_at, created_by: $created_by, email: $email, external_id: $external_id, updated_at: $updated_at, updated_by: $updated_by, slack_id: $slack_id, region: $region, name: $name}) {
    returning {
      name
      id
      created_by
      updated_by
    }
  }
}
`;

const HasuraOperationDelete = `
  mutation MyMutation_del($slack_id: String_comparison_exp = {}) {
    update_leave_user(where: {slack_id: $slack_id}, _set: {is_active: false}) {
      affected_rows
      returning {
        name
        slack_id
        is_active
      }
    }
  }
`;
const HasuraOperationGetIDAndIsActiveFromUsers = `
  query MyQuery_slack_id_from_userTable($slack_id: String) {
  leave_user(where: {slack_id: {_like: $slack_id}}) {
    id
    is_active
  }
}
`;

export {
  HasuraOperationAdd,
  HasuraOperationGetIDAndIsActiveFromUsers,
  HasuraOperationDelete,
};
