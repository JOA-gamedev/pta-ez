let currentDataset = null; // Global variable to store the current dataset

async function loadSelectedDataset() {
  const datasetSelector = document.getElementById("datasetSelector");
  const selectedDataset = datasetSelector.value;

  if (selectedDataset) {
    if (currentDataset === null) {
      // Fetch the dataset only if it hasn't been fetched before
      currentDataset = await readLocalJsonFile(selectedDataset);
      console.log("fetch");
    }

    if (currentDataset !== null) {
      renderFilteredResults(currentDataset);
    } else {
      console.error("Failed to read JSON file.");
    }
  } else {
    console.error("Please select a dataset.");
  }
}

async function readLocalJsonFile(datasetName) {
  const baseUrl = "http://127.0.0.1:5500/datasets/";
  const filePath = `${baseUrl}${datasetName}.json`;

  try {
    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${datasetName}.json. Status: ${response.status}`
      );
    }

    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error(`Error reading local JSON file: ${error.message}`);
    return null;
  }
}
function renderFilteredResults(jsonData) {
  const formData = new FormData(document.getElementById("searchForm"));
  const selectedYear = formData.get("year");
  const afnamemomentInput = formData.get("afnamemoment");
  const selectedVakCheckboxes = formData.getAll("vak");

  if (jsonData) {
    const resultsBody = document.getElementById("resultsBody");
    resultsBody.innerHTML = "";

    jsonData.forEach((row) => {
      if (
        shouldIncludeRow(
          row,
          selectedYear,
          afnamemomentInput,
          selectedVakCheckboxes
        )
      ) {
        appendRowToTable(resultsBody, row);
      }
    });
  } else {
    alert("Invalid JSON data.");
  }
}

function shouldIncludeRow(
  row,
  selectedYear,
  afnamemomentInput,
  selectedVakCheckboxes
) {
  return (
    (selectedVakCheckboxes.includes("All") ||
      selectedVakCheckboxes.includes(row.Vak)) &&
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
