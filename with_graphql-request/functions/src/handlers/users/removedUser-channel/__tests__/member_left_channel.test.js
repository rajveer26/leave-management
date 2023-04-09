import { member_left_channel } from '../function/member_left_channel.js';
import { memberNotPresent_db } from '../../functions/memberNotPresent_db.js';
import { to_deactivate } from '../function/to_deactivate.js';

jest.mock('../../functions/memberNotPresent_db.js');
jest.mock('../function/to_deactivate.js');

describe('member_left_channel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls memberNotPresent_db and does not call to_deactivate if member is not present', async () => {
    const event = { user: 'U123456789' };
    memberNotPresent_db.mockResolvedValue(true);
    await member_left_channel(event);
    expect(memberNotPresent_db).toHaveBeenCalledWith({ slack_id: 'U123456789' });
    expect(to_deactivate).not.toHaveBeenCalled();
  });

  it('calls memberNotPresent_db and to_deactivate if member is present', async () => {
    const event = { user: 'U123456789' };
    memberNotPresent_db.mockResolvedValue(false);
    to_deactivate.mockResolvedValue('U123456789');
    await member_left_channel(event);
    expect(memberNotPresent_db).toHaveBeenCalledWith({ slack_id: 'U123456789' });
    expect(to_deactivate).toHaveBeenCalledWith({ slack_id: { _eq: 'U123456789' } });
  });
});
