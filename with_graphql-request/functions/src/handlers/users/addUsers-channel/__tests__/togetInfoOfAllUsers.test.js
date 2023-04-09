import { getAllUserInfo } from '../functions/togetInfoOfAllUsers.js';

describe('getAllUserInfo', () => {
  test('returns user info for valid Slack ID', async () => {
    // Create a mock WebClient instance
    const mockClient = {
      users: {
        info: jest.fn().mockResolvedValue({
          user: {
            id: 'U12345678',
            name: 'testuser',
            real_name: 'Test User'
          }
        })
      }
    };

    // Call the function with a valid Slack ID
    const result = await getAllUserInfo('U12345678', mockClient, 'test-token');

    // Check that the mock API was called with the correct parameters
    expect(mockClient.users.info).toHaveBeenCalledWith({
      token: 'test-token',
      user: 'U12345678'
    });

    // Check that the function returns the expected user info
    expect(result.user.id).toBe('U12345678');
    expect(result.user.name).toBe('testuser');
    expect(result.user.real_name).toBe('Test User');
  });

  test('returns null for invalid Slack ID', async () => {
    // Create a mock WebClient instance
    const mockClient = {
      users: {
        info: jest.fn().mockResolvedValue()
      }
    };

    // Call the function with an invalid Slack ID
    const result = await getAllUserInfo('invalid-id', mockClient, 'test-token');

    // Check that the mock API was called with the correct parameters
    expect(mockClient.users.info).toHaveBeenCalledWith({
      token: 'test-token',
      user: 'invalid-id'
    });

    // Check that the function returns null when the user is not found
    expect(result).toBe(undefined);
  });
});
