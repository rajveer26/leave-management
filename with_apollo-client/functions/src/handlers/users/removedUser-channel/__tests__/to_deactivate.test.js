import { to_deactivate } from '../function/to_deactivate.js';
import { clients } from '../../../../utils/connection.js';
import { gql } from '@apollo/client';
import { HASURA_OPERATION_delete } from '../../../../queries/users.js';

jest.mock('../../../../utils/connection.js');

describe('to_deactivate function', () => {
  const variables = { slack_id: '1234' };
  const mockData = {
    update_leave_user: {
      affected_rows: 1,
      returning: [{ name: 'rajveer', slack_id: '1234', is_active: true }]
    }
  };

  beforeEach(() => {
    clients.mutate.mockClear();
  });

  test('returns the deactivated slack_id', async () => {
    clients.mutate.mockResolvedValue({ data: mockData });
    const result = await to_deactivate(variables);
    expect(result).toBe('1234');
    expect(clients.mutate).toHaveBeenCalledTimes(1);
    expect(clients.mutate).toHaveBeenCalledWith({
      mutation: gql`${HASURA_OPERATION_delete}`,
      variables,
    });
  });

  test('throws an error if clients.mutate() returns an error', async () => {
    const errorMessage = 'Something went wrong!';
    clients.mutate.mockRejectedValue(new Error(errorMessage));
    await expect(to_deactivate(variables)).rejects.toThrow(errorMessage);
    expect(clients.mutate).toHaveBeenCalledTimes(1);
  });
});
