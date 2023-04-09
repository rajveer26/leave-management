async function setRegion(region)
{
  if (region === 'Asia/Kolkata') {
    return  'India';
  } else {
    return  'USA';
  }
}
export {setRegion}
