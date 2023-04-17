import { addUserChannelFunction } from '../addUsersThroughChannel/addNewUserThroughChannel/addUserChannelFunction.js';
import { getAllUserInfo } from '../../../utils/helper.js'
import { toValidateDomain } from '../../../utils/helper.js';
import { toAddData } from '../../../utils/helper.js';
import { memberNotPresentInDB } from '../../../utils/helper.js';
import {validMail} from "../../../utils/helper.js";
import {setRegion} from "../../../utils/helper.js";



jest.mock('../../../utils/helper.js');
jest.mock("../../../utils/helper.js", () => ({
  getAllUserInfo: jest.fn(),
  memberNotPresentInDB: jest.fn(),
  toValidateDomain: jest.fn(),
  toAddData: jest.fn(),
  validMail:jest.fn(),
  setRegion:jest.fn()
}));

jest.mock("../../../libs/graphConnector.js", () => ({
  getGraphClient: jest.fn(),
}));

describe('add_user_channel_function', () => {
  let mockClient ;
  beforeEach(() => {
    mockClient = {
      users: {
        info: jest.fn(),
      },
    };
  });
  const slackId = 'U123456';

  afterEach(() => {
    jest.clearAllMocks();
  });
  const adminId="U123456"
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
    memberNotPresentInDB.mockResolvedValue(memberNotPresent);
    toValidateDomain.mockResolvedValue(domainValidated);
    validMail.mockResolvedValue(true);
    setRegion.mockResolvedValue("India")


    await addUserChannelFunction(slackId, mockClient,adminId);

    expect(getAllUserInfo).toHaveBeenCalledWith(slackId, mockClient, process.env.SLACK_BOT_TOKEN);
    expect(memberNotPresentInDB).toHaveBeenCalledWith({slack_id:slackId});
    expect(validMail).toHaveBeenCalledWith(user.profile.email);
    expect(toValidateDomain).toHaveBeenCalledWith(user.profile.email);
    expect(setRegion).toHaveBeenCalledWith(user.tz);
    expect(toAddData).toHaveBeenCalledWith({
      slack_id: slackId,
      name: user.real_name,
      email: user.profile.email,
      region: 'India',
      external_id: "0",
      created_at: new Date("2023-03-04T00:12:00.000Z").toISOString(),
      updated_at: new Date("2023-03-04T00:12:00.000Z").toISOString(),
      created_by: info.admin.real_name,
      updated_by: info.admin.real_name,
    }, slackId, mockClient);
  });


jest.useFakeTimers("modern");
jest.setSystemTime(new Date("04 March 2023 00:12:00 GMT").getTime());

  test('should not add user to the database if member is already present', async () => {
    const memberNotPresent = false;
    memberNotPresentInDB.mockResolvedValue(memberNotPresent);

    await addUserChannelFunction(slackId, mockClient,adminId);

    expect(memberNotPresentInDB).toHaveBeenCalledWith({slack_id: slackId});
    expect(getAllUserInfo).not.toHaveBeenCalled();
    expect(validMail).not.toHaveBeenCalled();
    expect(toValidateDomain).not.toHaveBeenCalled();
    expect(setRegion).not.toHaveBeenCalled();
    expect(toAddData).not.toHaveBeenCalled();
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
    memberNotPresentInDB.mockResolvedValue(memberNotPresent);
    validMail.mockResolvedValue(false);

    await addUserChannelFunction(slackId, mockClient,adminId);

    expect(memberNotPresentInDB).toHaveBeenCalledWith({slack_id: slackId});
    expect(getAllUserInfo).toHaveBeenCalledWith(slackId, mockClient, process.env.SLACK_BOT_TOKEN);
    expect(validMail).toHaveBeenCalledWith(user.profile.email);
    expect(toValidateDomain).not.toHaveBeenCalled();
    expect(setRegion).not.toHaveBeenCalled();
    expect(toAddData).not.toHaveBeenCalled();
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
    memberNotPresentInDB.mockResolvedValue(memberNotPresent);
    validMail.mockResolvedValue(true);
    toValidateDomain.mockResolvedValue(false)


    await addUserChannelFunction(slackId, mockClient,adminId);

    expect(memberNotPresentInDB).toHaveBeenCalledWith({slack_id: slackId});
    expect(getAllUserInfo).toHaveBeenCalledWith(slackId, mockClient, process.env.SLACK_BOT_TOKEN);
    expect(validMail).toHaveBeenCalledWith(user.profile.email);
    expect(toValidateDomain).toHaveBeenCalledWith(user.profile.email);
    expect(setRegion).not.toHaveBeenCalled();
    expect(toAddData).not.toHaveBeenCalled();
  });


});
