import { toGetDomain } from "../functions/toGetDomain.js";
import { clients } from '../../../utils/connection.js';
import { gql } from '@apollo/client';
jest.mock('../../../utils/connection.js')

import { TO_GET_DOMAIN} from "../../../queries/config.js";


describe("toGetChannel function", () => {
  test("getting channel id", async () => {
    const variables = {};
    const data = { leave_config: [{ domain: "kiit.ac.in" }] };
    clients.query.mockResolvedValue({ data: data });

    await toGetDomain(variables);
    expect(clients.query).toHaveBeenCalledWith({
      query: gql`${TO_GET_DOMAIN}`,
      variables,
    });
  })

    test("logs an error if the adding fails", async () => {
      const variables = {};

      const error = new Error("Failed to fetch data from the server.");
      clients.query.mockRejectedValue(error);

      console.log = jest.fn();
      try {
        await toGetDomain(variables);
      } catch (error) {
        console.log(error);
      }
      expect(console.log).toHaveBeenCalledWith(error);
    });

})
