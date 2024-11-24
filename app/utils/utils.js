// Check if a string includes any item from an array of strings
export const includesAny = (string, arr) => {

  // Is the string in the array outright?
  let included = arr.indexOf(string) >= 0;
  
  // For any array entries with a wildcard (*), does the string include them?
  arr.forEach((item) => {
    if( item.includes("*") && string.includes(item.replace('*', '')) ){
      included = true;
    }
  });

  return included;
}