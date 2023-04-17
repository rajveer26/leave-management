import { removeMain, toDeactivate } from '../removedUserChannel/removeMain.js';
import { memberNotPresentInDB } from '../../../utils/helper.js';
import { getGraphClient } from '../../../libs/graphConnector.js';
import gql from 'graphql-tag';
import { HasuraOperationDelete } from '../../../queries/users.js';

jest.mock('../../../utils/helper.js');

jest.mock("../../../libs/graphConnector.js", () => ({
  getGraphClient: jest.fn().mockResolvedValue({
    mutate: jest.fn(() => ({ data: { update_leave_user: { returning: [{ name:"Rajveer",slack_id: 'U123456789',is_active:false }] } } }))

  })
}));
jest.mock('../removedUserChannel/removeMain.js',()=>({
  toDeactivate: jest.fn(),
  removeMain: jest.requireActual("../removedUserChannel/removeMain.js").removeMain
}))

describe('member_left_channel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls memberNotPresent_db and does not call to_deactivate if member is not present', async () => {
    const event = { user: 'U123456789' };
    memberNotPresentInDB.mockResolvedValue(true);
    await removeMain(event);

    expect(memberNotPresentInDB).toHaveBeenCalledWith({ slack_id: 'U123456789' });
    expect(toDeactivate).not.toHaveBeenCalled();
  });

  it('calls memberNotPresent_db and to_deactivate if member is present', async () => {
    const variables = {
      slack_id: { _eq: "U123456789"}
    }
    const event = { user: 'U123456789' };
      memberNotPresentInDB.mockResolvedValue(false);
    toDeactivate.mockResolvedValue('U123456789');

      await removeMain(event);
      expect(memberNotPresentInDB).toHaveBeenCalledWith({ slack_id: 'U123456789' });

    });

});
