import { main3 } from "../addingAllUsers/main3.js";
import { toAddData, validMail } from '../../../utils/helper.js';
import { memberNotPresentInDB } from "../../../utils/helper.js";
import { toValidateDomain } from "../../../utils/helper.js";
import { setRegion } from "../../../utils/helper.js";

jest.mock("../../../utils/helper.js", () => ({
  validMail: jest.fn(),
  memberNotPresentInDB: jest.fn(),
  toValidateDomain: jest.fn(),
  setRegion: jest.fn(),
  toAddData: jest.fn()
}));

jest.mock("../addingAllUsers/main3.js",()=>({
  getAllUsersFromSlack:jest.fn(),
  main3: jest.requireActual('../addingAllUsers/main3.js').main3
}))

describe("main3", () => {
  let client, token, admin;

  beforeEach(() => {
    // Mock the client object and set up any required environment variables
    client = {
      users: {
        list: jest.fn(),
      },
    };
    token = process.env.SLACK_BOT_TOKEN_TOKEN;
   // process.env.SLACK_BOT_TOKEN = token;

    // Set up any required admin data
    admin = "test_admin";
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("adds new user to database if member is not present and email is valid and domain is validated", async () => {
    // Set up mock data for the getAllUsersFromSlack function
    const members = {
      0: {
        profile: {
          email: "test1@test.com",
        },
        id: "test_id_1",
        real_name: "test_user_1",
        tz: "test_timezone",
      },
      1: {
        profile: {
          email: "test2@test.com",
        },
        id: "test_id_2",
        real_name: "test_user_2",
        tz: "test_timezone",
      },
    };
    client.users.list.mockResolvedValue({members});
    // Set up mock data for the helper functions
    validMail.mockResolvedValue(true);
    toValidateDomain.mockResolvedValue(true);
    memberNotPresentInDB.mockResolvedValue(true);
    setRegion.mockResolvedValue("test_region");

    await main3(client, admin,token);


    expect(client.users.list).toHaveBeenCalledTimes(1);
     expect(validMail).toHaveBeenCalledTimes(2);
    expect(toValidateDomain).toHaveBeenCalledTimes(2);
    expect(memberNotPresentInDB).toHaveBeenCalledTimes(2);
    expect(setRegion).toHaveBeenCalledTimes(2);
    expect(toAddData).toHaveBeenCalledTimes(2);
    expect(toAddData).toHaveBeenCalledWith(
      {
        slack_id: "test_id_1",
        name: "test_user_1",
        email: "test1@test.com",
        region: "test_region",
        external_id: "0",
        created_at: expect.any(String),
        updated_at: expect.any(String),
        created_by: "test_admin",
        updated_by: "test_admin",
      },
      "test_id_1",
      client
    );
   })
  test("should not add user to database if email is invalid", async () => {
    const members = [{ id: "user1", profile: { email: "invalidemail", }, real_name: "User 1", tz: "Asia/Kolkata", },];
    validMail.mockReturnValueOnce(false);
    client.users.list.mockResolvedValue({members});

    await main3(client, admin,token);

    expect(validMail).toHaveBeenCalledWith("invalidemail");
    expect(toValidateDomain).not.toHaveBeenCalled();
    expect(memberNotPresentInDB).not.toHaveBeenCalled();
    expect(setRegion).not.toHaveBeenCalled();
    expect(toAddData).not.toHaveBeenCalled();


  });

  test("should not add user to database if email is valid but domain is invalid", async () => {

    const members = {
      0: {
        profile: {
          email: "test1@test.com",
        },
        id: "test_id_1",
        real_name: "test_user_1",
        tz: "test_timezone",
      }
    }
    client.users.list.mockResolvedValue({members});

    validMail.mockResolvedValue(true);
    toValidateDomain.mockResolvedValue(false)
    await main3(client, admin);

    expect(validMail).toHaveBeenCalledTimes(1);

    expect(toValidateDomain).toHaveBeenCalledWith(members[0].profile.email);
    expect(memberNotPresentInDB).not.toHaveBeenCalled();
    expect(setRegion).not.toHaveBeenCalled();
    expect(toAddData).not.toHaveBeenCalled();

  });

  test("toCheckExistingUser will be called if memberNotPresent_db is false", async () => {

    const members = {
      0: {
        profile: {
          email: "test1@test.com",
        },
        id: "test_id_1",
        real_name: "test_user_1",
        tz: "test_timezone",
      },
      1: {
        profile: {
          email: "test2@test.com",
        },
        id: "test_id_2",
        real_name: "test_user_2",
        tz: "test_timezone",
      },
    };
    client.users.list.mockResolvedValue({members});
    const slackId = "test_id_1";
    validMail.mockReturnValue(true);
    toValidateDomain.mockResolvedValue(true);
    memberNotPresentInDB.mockResolvedValue(false)

    await main3(client, admin,token);

    expect(validMail).toHaveBeenCalledWith(members[0].profile.email);
    expect(toValidateDomain).toHaveBeenCalledWith(members[0].profile.email);
    expect(memberNotPresentInDB).toHaveBeenCalledWith({ slack_id: slackId });
    expect(setRegion).not.toHaveBeenCalled();
    expect(toAddData).not.toHaveBeenCalled();

  });
})
