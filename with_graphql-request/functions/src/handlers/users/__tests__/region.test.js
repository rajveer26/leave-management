import { setRegion } from '../functions/region.js';

describe('setRegion', () => {
  it('should return "India" when region is "Asia/Kolkata"', async () => {
    const region = 'Asia/Kolkata';
    const result = await setRegion(region);
    expect(result).toEqual('India');
  });

  it('should return "USA" when region is not "Asia/Kolkata"', async () => {
    const region = 'America/New_York';
    const result = await setRegion(region);
    expect(result).toEqual('USA');
  });
});
