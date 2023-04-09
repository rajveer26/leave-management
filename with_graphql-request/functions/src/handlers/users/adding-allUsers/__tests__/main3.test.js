import { main3 } from "../functions/main3.js";
import { getAllUsersFromSlack } from "../functions/getAllUsersFromSlack.js";
import { validMail } from "../../functions/toCheckMail.js";
import { to_validateDomain } from "../../functions/toCheckDomain.js";
import { memberNotPresent_db } from "../../functions/memberNotPresent_db.js";
import { to_addData } from "../../functions/addingUserTodb.js";
import {setRegion} from "../../functions/region.js";

jest.mock("../functions/getAllUsersFromSlack.js");
jest.mock("../../functions/toCheckMail.js");
jest.mock("../../functions/toCheckDomain.js");
jest.mock("../../functions/memberNotPresent_db.js");
jest.mock("../../functions/addingUserTodb.js");
jest.mock("../../functions/region.js")
describe("main3 function", () => {
  let mockClient;
  const admin = "Rajveer";
  beforeEach(() => {
    mockClient = {
      users: {
        info: jest.fn(),
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should add user to database if email is valid and not already present", async () => {
    const members = [{id: "1234", profile: {email: "user1@example.com",}, real_name: "User 1", tz: "Asia/Kolkata",},];
    getAllUsersFromSlack.mockResolvedValueOnce(members);
    validMail.mockReturnValueOnce(true);
    to_validateDomain.mockResolvedValueOnce(true);
    memberNotPresent_db.mockResolvedValueOnce(true);
    to_addData.mockResolvedValueOnce(true);
    setRegion.mockResolvedValue("India")

    await main3(mockClient,admin);

    expect(getAllUsersFromSlack).toHaveBeenCalledWith(mockClient);
    expect(validMail).toHaveBeenCalledWith("user1@example.com");
    expect(to_validateDomain).toHaveBeenCalledWith("user1@example.com");
    expect(memberNotPresent_db).toHaveBeenCalledWith({slack_id: "1234"});
    expect(setRegion).toHaveBeenCalledWith(members[0].tz);
    expect(to_addData).toHaveBeenCalledWith(
      {
        slack_id: members[0].id,
        name: "User 1",
        email: "user1@example.com",
        region: "India",
        external_id: "0",
        created_at: expect.any(String),
        updated_at: expect.any(String),
        created_by: admin,
        updated_by: admin,
      },
      members[0].id,
      mockClient
    );
  });

  test("should not add user to database if email is invalid", async () => {
    const members = [{id: "user1", profile: {email: "invalidemail",}, real_name: "User 1", tz: "Asia/Kolkata",},];
    getAllUsersFromSlack.mockResolvedValueOnce(members);
    validMail.mockReturnValueOnce(false);

    await main3(mockClient,admin);

    expect(getAllUsersFromSlack).toHaveBeenCalledWith(mockClient);
    expect(validMail).toHaveBeenCalledWith("invalidemail");
    expect(to_validateDomain).not.toHaveBeenCalled();
    expect(memberNotPresent_db).not.toHaveBeenCalled();
    expect(setRegion).not.toHaveBeenCalled();
    expect(to_addData).not.toHaveBeenCalled();


  });

  test("should not add user to database if email is valid but domain is invalid", async () => {
    const members = [{id: "user1", profile: {email: "user1@example.com",}, real_name: "User 1", tz: "Asia/Kolkata",},];
    getAllUsersFromSlack.mockResolvedValueOnce(members);
    validMail.mockReturnValueOnce(true);
    to_validateDomain.mockResolvedValue(false)
    await main3(mockClient,admin);

    expect(getAllUsersFromSlack).toHaveBeenCalledWith(mockClient);
    expect(validMail).toHaveBeenCalledWith(members[0].profile.email);
    expect(to_validateDomain).toHaveBeenCalledWith(members[0].profile.email);
    expect(memberNotPresent_db).not.toHaveBeenCalled();
    expect(setRegion).not.toHaveBeenCalled();
    expect(to_addData).not.toHaveBeenCalled();

  });

  test("toCheckExistingUser will be called if memberNotPresent_db is false", async () => {
    const members = [{id: "user1", profile: {email: "user1@example.com",}, real_name: "User 1", tz: "Asia/Kolkata",},];
    getAllUsersFromSlack.mockResolvedValueOnce(members);
    validMail.mockReturnValueOnce(true);
    to_validateDomain.mockResolvedValue(true)
    memberNotPresent_db.mockResolvedValue(false)
    await main3(mockClient,admin);

    expect(getAllUsersFromSlack).toHaveBeenCalledWith(mockClient);
    expect(validMail).toHaveBeenCalledWith(members[0].profile.email);
    expect(to_validateDomain).toHaveBeenCalledWith(members[0].profile.email);
    expect(memberNotPresent_db).toHaveBeenCalledWith({slack_id:members[0].id});
    expect(setRegion).not.toHaveBeenCalled();
    expect(to_addData).not.toHaveBeenCalled();

  });
})
