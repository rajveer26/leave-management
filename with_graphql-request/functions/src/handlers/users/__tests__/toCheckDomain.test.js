import { to_validateDomain } from '../functions/toCheckDomain.js';
jest.mock('../functions/toGetDomain', () => ({
  toGetDomain: jest.fn(() => 'example'),
}));

describe('to_validateDomain', () => {
  test('returns true when the domain in the email matches the domain in the config', async () => {
    const email = 'user@example.com';
    const result = await to_validateDomain(email);
    expect(result).toBe(true);
  });

  test('returns false when the domain in the email does not match the domain in the config', async () => {
    const email = 'user@wrong-domain.com';
    const result = await to_validateDomain(email);
    expect(result).toBe(false);
  });
});
