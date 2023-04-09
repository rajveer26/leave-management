import { successMessage } from "../functions/successMessage.js";
describe("successMessage", () => {
  const mockClient = {
    chat: {
      postMessage: jest.fn(),
    },
  };
  test("sends success message when user about to", async () => {
    const slack_id = "ABC123";
    const name = "Rajveer"
    const expectedText = `Kudos! :smiley: ${name} You are about to add in a users table with slack id ${slack_id}`;
    await successMessage(mockClient, slack_id, name);
    expect(mockClient.chat.postMessage).toHaveBeenCalledTimes(1);
    expect(mockClient.chat.postMessage).toHaveBeenCalledWith({
      channel: slack_id,
      text: expectedText,
    });
  });
  test("throws an error when there are no data", async () => {
    const slack_id = null;
    const name = "Rajveer"

    try {
      await successMessage(mockClient, slack_id,name);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
