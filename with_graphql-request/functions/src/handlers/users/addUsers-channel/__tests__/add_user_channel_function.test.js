import { add_user_channel_function } from '../functions/add_user_channel_function';
import { getAllUserInfo } from '../functions/togetInfoOfAllUsers';
import { to_validateDomain } from '../../functions/toCheckDomain';
import { to_addData } from '../../functions/addingUserTodb';
import { memberNotPresent_db } from '../../functions/memberNotPresent_db';
import {validMail} from "../../functions/toCheckMail.js";
import {setRegion} from "../../functions/region.js";


jest.mock('../functions/togetInfoOfAllUsers');
jest.mock('../../functions/toCheckDomain');
jest.mock('../../functions/addingUserTodb');
jest.mock('../../functions/memberNotPresent_db');
jest.mock('../../functions/toCheckMail.js')
jest.mock("../../functions/region.js")
describe('add_user_channel_function', () => {
  let mockClient ;
  beforeEach(() => {
    mockClient = {
      users: {
        info: jest.fn(),
      },
    };
  });
  const slack_id = 'U123456';

  afterEach(() => {
    jest.clearAllMocks();
  });
const admin_id="U123456"
  test('should add user to the database', async () => {
    const user = {
      profile: {
        email: 'rajveer26ps@gmail.com',
      },
      real_name: 'Rajveer',
      tz: 'Asia/Kolkata',
      team_id: 'T123456',
    };

    const admin = {

      real_name: 'Rajveer',
      tz: 'Asia/Kolkata',
      team_id: 'T1234567',
    };
    const info = {
      user,admin
    };


    const memberNotPresent = true;
    const domainValidated = true;
    getAllUserInfo.mockResolvedValue(info);
    memberNotPresent_db.mockResolvedValue(memberNotPresent);
    to_validateDomain.mockResolvedValue(domainValidated);
    validMail.mockResolvedValue(true);
    setRegion.mockResolvedValue("India")


    await add_user_channel_function(slack_id, mockClient,admin_id);

    expect(getAllUserInfo).toHaveBeenCalledWith(slack_id, mockClient, process.env.SLACK_BOT_TOKEN);
    expect(memberNotPresent_db).toHaveBeenCalledWith({slack_id});
    expect(validMail).toHaveBeenCalledWith(user.profile.email);
    expect(to_validateDomain).toHaveBeenCalledWith(user.profile.email);
    expect(setRegion).toHaveBeenCalledWith(user.tz);
    expect(to_addData).toHaveBeenCalledWith({
      slack_id,
      name: user.real_name,
      email: user.profile.email,
      region: 'India',
      external_id: "0",
      created_at: expect.any(String),
      updated_at: expect.any(String),
      created_by: info.admin.real_name,
      updated_by: info.admin.real_name,
    }, slack_id, mockClient);
  });

  test('should not add user to the database if member is already present', async () => {
    const memberNotPresent = false;
    memberNotPresent_db.mockResolvedValue(memberNotPresent);

    await add_user_channel_function(slack_id, mockClient,admin_id);

    expect(memberNotPresent_db).toHaveBeenCalledWith({slack_id});
    expect(getAllUserInfo).not.toHaveBeenCalled();
    expect(validMail).not.toHaveBeenCalled();
    expect(to_validateDomain).not.toHaveBeenCalled();
    expect(setRegion).not.toHaveBeenCalled();
    expect(to_addData).not.toHaveBeenCalled();
  });

  test('should not add user to the database if email is invalid', async () => {
    const user = {
      profile: {
        email: 'invalidemail',
      },
    };
    const info = {
      user,
    };
    const memberNotPresent = true;
    getAllUserInfo.mockResolvedValue(info);
    memberNotPresent_db.mockResolvedValue(memberNotPresent);
    validMail.mockResolvedValue(false);

    await add_user_channel_function(slack_id, mockClient,admin_id);

    expect(memberNotPresent_db).toHaveBeenCalledWith({slack_id});
    expect(getAllUserInfo).toHaveBeenCalledWith(slack_id, mockClient, process.env.SLACK_BOT_TOKEN);
    expect(validMail).toHaveBeenCalledWith(user.profile.email);
    expect(to_validateDomain).not.toHaveBeenCalled();
    expect(setRegion).not.toHaveBeenCalled();
    expect(to_addData).not.toHaveBeenCalled();
  });


  test('should not add user to the database if domain is invalid', async () => {
    const user = {
      profile: {
        email: 'rajveer26ps@gmail.com',
      },
    };
    const info = {
      user,
    };
    const memberNotPresent = true;
    getAllUserInfo.mockResolvedValue(info);
    memberNotPresent_db.mockResolvedValue(memberNotPresent);
    validMail.mockResolvedValue(true);
    to_validateDomain.mockResolvedValue(false)


    await add_user_channel_function(slack_id, mockClient,admin_id);

    expect(memberNotPresent_db).toHaveBeenCalledWith({slack_id});
    expect(getAllUserInfo).toHaveBeenCalledWith(slack_id, mockClient, process.env.SLACK_BOT_TOKEN);
    expect(validMail).toHaveBeenCalledWith(user.profile.email);
    expect(to_validateDomain).toHaveBeenCalledWith(user.profile.email);
    expect(setRegion).not.toHaveBeenCalled();
    expect(to_addData).not.toHaveBeenCalled();
  });


});
