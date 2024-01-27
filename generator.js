const fs = require('fs');

function extractNetlData(text, outputFilePath) {
  const lines = text.split("\n");
  const data = [];

  for (const line of lines) {
    if (/^E VWO \d+/.test(line)) {
      const columns = line.split(/\s+/);
      if (columns.length >= 13) {
        const vak = columns[5];
        const afnamemoment = columns[6];
        const jaarlaag = columns[4];
        const omschrijving = columns.slice(9).join(" ");

        data.push({
          Vak: vak,
          Afnamemoment: afnamemoment,
          jaarlaag: jaarlaag,
          Omschrijving: omschrijving,
        });
      }
    }
  }

  // Convert the data array to JSON
  const jsonData = JSON.stringify(data, null, 2); // The third parameter (2) is for indentation

  // Write the JSON data to a file
  fs.writeFileSync(outputFilePath, jsonData, 'utf-8');

  console.log(`JSON data has been written to ${outputFilePath}`);
}

// Example usage with reading input from a file:
const inputFile = "pta2.txt";  // Replace with your input file path
const outputFilePath = "output.json";

// Read the contents of the input file
const inputText = fs.readFileSync(inputFile, 'utf-8');

extractNetlData(inputText, outputFilePath);
