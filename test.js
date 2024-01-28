let inputString = "Blessurepreventie en behandeling 3 75 30 D Practicum VT";
let result = inputString.match(/^(.*?)\s[0-9]\s([0-9]*|H|-)(\s([0-9]*|-))?/);

if (result && result[1]) {
  console.log(result[1]);  // Output: Blessurepreventie en behandeling
} else {
  console.log("Pattern not found");
}
