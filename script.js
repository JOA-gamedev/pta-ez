// function extractNetlData(text) {
//   const lines = text.split("\n");
//   const data = [];

//   for (const line of lines) {
//     if (/^E VWO \d+/.test(line)) {
//       const columns = line.split(/\s+/);
//       if (columns.length >= 13) {
//         const vak = columns[5];
//         const afnamemoment = columns[6];
//         const jaarlaag = columns[4];
//         const omschrijving = columns.slice(9).join(" ");

//         data.push({
//           Vak: vak,
//           Afnamemoment: afnamemoment,
//           jaarlaag: jaarlaag,
//           Omschrijving: omschrijving,
//         });
//       }
//     }
//   }

//   return data;
// }

async function readExternalJsonFile() {
  const filePath = "https://example.com/path/to/external/file.json"; // Replace with the actual URL
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${filePath}. Status: ${response.status}`
      );
    }

    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error(`Error reading external JSON file: ${error.message}`);
    return null;
  }
}

async function searchData() {
  const formData = new FormData(document.getElementById("searchForm"));
  const selectedYear = formData.get("year");
  const afnamemomentInput = formData.get("afnamemoment");
  const vakInput = formData.get("vak");

  // Use readLocalJsonFile to read the JSON file
  // Create a local URL for the file
  const jsonData = await readExternalJsonFile();

  if (jsonData !== null) {
    const resultsBody = document.getElementById("resultsBody");
    resultsBody.innerHTML = "";

    const uniqueRows = {};

    jsonData.forEach((row) => {
      if (shouldIncludeRow(row, selectedYear, afnamemomentInput, vakInput)) {
        appendRowToTable(resultsBody, row);
      }
    });
  } else {
    alert("Failed to read JSON file.");
  }
}

function shouldIncludeRow(row, selectedYear, afnamemomentInput, vakInput) {
  return (
    (vakInput === "All" || row.Vak === vakInput) &&
    (selectedYear === "All" || row.jaarlaag === selectedYear) &&
    (afnamemomentInput === "" || row.Afnamemoment === afnamemomentInput)
  );
}

function appendRowToTable(tableBody, row) {
  const newRow = tableBody.insertRow();

  const vakCell = newRow.insertCell(0);
  vakCell.textContent = row.Vak;

  const afnamemomentCell = newRow.insertCell(1);
  afnamemomentCell.textContent = row.Afnamemoment;

  const omschrijvingCell = newRow.insertCell(2);
  omschrijvingCell.textContent = row.Omschrijving;
}
