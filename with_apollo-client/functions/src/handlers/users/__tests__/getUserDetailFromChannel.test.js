import {getAllUserFromChannel} from "../../../utils/helper.js";
jest.mock("../../../libs/graphConnector.js", () => ({
  getGraphClient: jest.fn()
}));
describe('getAllUserFromChannel', () => {
  test('returns user info for valid Slack ID', async () => {
    // Create a mock WebClient instance
    const mockClient = {
      conversations: {
        members: jest.fn().mockResolvedValue({
          members: [
            "U023BECGF",
            "U061F7AUR",
            "W012A3CDE"
          ]
        })
      }
    };

    // Call the function with a valid Slack ID
    const result = await getAllUserFromChannel('C1234567890',mockClient,'test-token');

    // Check that the mock API was called with the correct parameters
    expect(mockClient.conversations.members).toHaveBeenCalledWith({
      token: 'test-token',
      channel: 'C1234567890'
    });

    // Check that the function returns the expected user info
    expect(result.members[0]).toBe('U023BECGF');
    expect(result.members[1]).toBe('U061F7AUR');
    expect(result.members[2]).toBe('W012A3CDE');
  });

  test('returns null for invalid Slack ID', async () => {
    // Create a mock WebClient instance
    const mockClient = {
      conversations: {
        members: jest.fn().mockResolvedValue()
      }
    };

    // Call the function with an invalid Slack ID
    const result = await getAllUserFromChannel('invalid-channel', mockClient, 'test-token');

    // Check that the mock API was called with the correct parameters
    expect(mockClient.conversations.members).toHaveBeenCalledWith({
      token: 'test-token',
      channel: 'invalid-channel'
    });

    // Check that the function returns null when the user is not found
    expect(result).toBe(undefined);
  });
});
