import { toValidateDomain } from '../../../utils/helper.js';
jest.mock('../../../utils/helper.js', () => ({
  toGetDomain: jest.fn(() => 'example'),
  toValidateDomain: jest.requireActual('../../../utils/helper.js').toValidateDomain
}));


jest.mock("../../../libs/graphConnector.js", () => {
  return {
    getGraphClient: jest.fn().mockResolvedValue({

      query: jest.fn(() => ({
        data: {
          leave_config:[{
            domain: 'example'
          }],
        },
      })),
    }),
  };
});



describe('to_validateDomain', () => {
  test('returns true when the domain in the email matches the domain in the config', async () => {
    const email = 'user@example.com';
    const result = await toValidateDomain(email);
    expect(result).toBe(true);
  });

  test('returns false when the domain in the email does not match the domain in the config', async () => {
    const email = 'user@wrong-domain.com';
    const result = await toValidateDomain(email);
    expect(result).toBe(false);
  });
});
