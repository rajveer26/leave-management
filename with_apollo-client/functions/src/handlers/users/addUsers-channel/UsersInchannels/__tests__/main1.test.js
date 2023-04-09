import { main1 } from '../functions/main1.js';
import { getAllUserFromChannel } from '../../functions/getUserDetailFromChannel';
import { toGetChannel } from '../../functions/toGetChannel';
import { add_user_channel_function } from '../../functions/add_user_channel_function';

jest.mock('../../functions/getUserDetailFromChannel');
jest.mock('../../functions/toGetChannel');
jest.mock('../../functions/add_user_channel_function');

describe('main1', () => {
  let mockClient;
  beforeEach(() => {
    mockClient = {
      users: {
        info: jest.fn(),
      },
    };
  });
 const mockAdmin_id = jest.fn();
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should call the necessary functions with correct arguments', async () => {
    const mockChannelId = 'channel123';
    const mockMembers = { members: ['user1', 'user2'] };

    toGetChannel.mockResolvedValue(mockChannelId);
    getAllUserFromChannel.mockResolvedValue(mockMembers);

    await main1(mockClient,mockAdmin_id);

    expect(toGetChannel).toHaveBeenCalled();
    expect(toGetChannel).toHaveBeenCalledWith({});
    expect(getAllUserFromChannel).toHaveBeenCalled();
    expect(getAllUserFromChannel).toHaveBeenCalledWith(mockChannelId, mockClient, process.env.SLACK_BOT_TOKEN);
    expect(add_user_channel_function).toHaveBeenCalledTimes(2);
    expect(add_user_channel_function).toHaveBeenCalledWith('user1', mockClient,mockAdmin_id);
  });

  it('should not call add_user_channel_function if there are no members', async () => {
    const mockChannelId = 'channel123';
    const mockMembers = { members: [] };

    toGetChannel.mockResolvedValue(mockChannelId);
    getAllUserFromChannel.mockResolvedValue(mockMembers);

    await main1(mockClient);

    expect(toGetChannel).toHaveBeenCalled();
    expect(toGetChannel).toHaveBeenCalledWith({});
    expect(getAllUserFromChannel).toHaveBeenCalled();
    expect(getAllUserFromChannel).toHaveBeenCalledWith(mockChannelId, mockClient, process.env.SLACK_BOT_TOKEN);
    expect(add_user_channel_function).not.toHaveBeenCalled();
  });
});
