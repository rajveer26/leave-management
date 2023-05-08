import { main1 } from '../addUsersThroughChannel/usersInChannels/main1.js';
import { getAllUserFromChannel } from '../../../utils/helper.js';
import { toGetChannel } from '../../../utils/helper.js';
import { addUserChannelFunction } from '../addUsersThroughChannel/addNewUserThroughChannel/addUserChannelFunction.js';

jest.mock('../../../utils/helper.js');
jest.mock('../addUsersThroughChannel/addNewUserThroughChannel/addUserChannelFunction.js',()=>({
  addUserChannelFunction:jest.fn()
}));
jest.mock("../../../libs/graphConnector.js", () => ({
  getGraphClient: jest.fn(),
}));
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

    toGetChannel.mockResolvedValueOnce(mockChannelId);
    getAllUserFromChannel.mockResolvedValueOnce(mockMembers);

    await main1(mockClient,mockAdmin_id);

    expect(toGetChannel).toHaveBeenCalled();
    expect(toGetChannel).toHaveBeenCalledWith({});
    expect(getAllUserFromChannel).toHaveBeenCalled();
    expect(getAllUserFromChannel).toHaveBeenCalledWith(mockChannelId, mockClient, process.env.SLACK_BOT_TOKEN);
    expect(addUserChannelFunction).toHaveBeenCalledTimes(2);
    expect(addUserChannelFunction).toHaveBeenCalledWith('user1', mockClient,mockAdmin_id);
  });

  it('should not call addUserChannelFunction if there are no members', async () => {
    const mockChannelId = 'channel123';
    const mockMembers = { members: [] };

    toGetChannel.mockResolvedValue(mockChannelId);
    getAllUserFromChannel.mockResolvedValue(0);

    await main1(mockClient,mockAdmin_id);
    expect(addUserChannelFunction).not.toHaveBeenCalled();
  });
});
