import { toGetDomain } from "../../../utils/helper.js";
import { getGraphClient } from '../../../libs/graphConnector.js';
import { TO_GET_DOMAIN } from '../../../queries/config.js';
import { gql } from "graphql-tag";

jest.mock('../../../utils/helper.js',()=>({
  toGetDomain:jest.requireActual("../../../utils/helper.js").toGetDomain
}))

jest.mock("../../../libs/graphConnector.js", () => ({
  getGraphClient: jest.fn().mockResolvedValue({
    query: jest.fn()
  })
}));
describe("toGetDomain function", () => {
  test("getting channel id", async () => {
    const variables = {};
    const data = { leave_config: [{ domain: "kiit.ac.in" }] };
    const gClient = await getGraphClient();

    gClient.query.mockResolvedValue({ data: data });

    await toGetDomain(variables);
    expect(gClient.query).toHaveBeenCalledWith({
      query: gql`${TO_GET_DOMAIN}`,
      variables,
    });
  })

    test("logs an error if the adding fails", async () => {
      const variables = {};

      const error = new Error("Failed to fetch data from the server.");
      const gClient = await getGraphClient();

      gClient.query.mockRejectedValue(error);

      console.log = jest.fn();
      try {
        await toGetDomain(variables);
      } catch (error) {
        console.log(error);
      }
      expect(console.log).toHaveBeenCalledWith(error);
    });

})
