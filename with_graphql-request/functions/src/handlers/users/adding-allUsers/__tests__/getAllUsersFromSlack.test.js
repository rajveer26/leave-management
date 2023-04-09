import { getAllUsersFromSlack } from '../functions/getAllUsersFromSlack.js';

// Mock the WebClient object and the users.list method


describe('getAllUsersFromSlack', () => {
    const mockWebClient = {
      users: {
        list: jest.fn().mockResolvedValue({
          members: [
            { id: 'U123', name: 'user1', email: 'user1@example.com' },
            { id: 'U456', name: 'user2', email: 'user2@example.com' },
          ],
        }),
      },
    };
   // return { WebClient: jest.fn(() => mockWebClient) };

  it('should retrieve a list of all users from Slack', async () => {
    const users = await getAllUsersFromSlack(mockWebClient);
    expect(users).toHaveLength(2);
    expect(users[0].id).toBe('U123');
    expect(users[0].name).toBe('user1');
    expect(users[0].email).toBe('user1@example.com');
    expect(users[1].id).toBe('U456');
    expect(users[1].name).toBe('user2');
    expect(users[1].email).toBe('user2@example.com');
  });
});
