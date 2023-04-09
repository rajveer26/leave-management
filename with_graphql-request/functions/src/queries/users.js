const HASURA_OPERATION_add = `  mutation MyMutation_add_user($created_at: timestamp, $created_by: String, $email: citext, $external_id: String, $slack_id: String, $updated_at: timestamp, $updated_by: String, $region: leave_region_enum, $name: String) {
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

const HASURA_OPERATION_delete=`
  mutation MyMutation_delete_user($slack_id: String_comparison_exp = {}) {
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
const HASURA_OPERATION_get_ID_and_isActive_from_users = `
  query MyQuery_slack_id_from_userTable($slack_id: String) {
  leave_user(where: {slack_id: {_like: $slack_id}}) {
    id
    is_active
  }
}
`;

const HASURA_OPERATION_to_activate =`
 mutation MyMutation($_eq: Int) {
    update_leave_user(where: {id: {_eq: $_eq}}, _set: {is_active: true}) {
      affected_rows
      returning {
        is_active
        slack_id
      }
    }
  }
`;
export {HASURA_OPERATION_add,HASURA_OPERATION_get_ID_and_isActive_from_users,HASURA_OPERATION_delete,HASURA_OPERATION_to_activate};
