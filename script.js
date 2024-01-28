let currentDataset = null; // Global variable to store the current dataset

let lastSelectedDataset = null; // Global variable to store the last selected dataset

async function loadSelectedDataset() {
  const datasetSelector = document.getElementById("datasetSelector");
  const selectedDataset = datasetSelector.value;

  if (selectedDataset) {
    document.getElementById("year").disabled = false;
    if (selectedDataset !== lastSelectedDataset) {
      currentDataset = await readLocalJsonFile(selectedDataset);
      havoOrVwo(selectedDataset);

      if (currentDataset !== null) {
        renderFilteredResults(currentDataset);
        console.log(currentDataset);

        // Update the last selected dataset
        lastSelectedDataset = selectedDataset;
      } else {
        console.error("Failed to read JSON file.");
      }
    } else {
      // when the dataset is same as last time just render it again with possibly new filters
      renderFilteredResults(currentDataset);
    }
  } else {
    console.info("Please pick a dataset");
  }
}

function havoOrVwo(selectedDataset) {
  const niveau = selectedDataset.split(" ")[0]; // determine if the dataset is an havo pta or a vwo pta
  const vwoOptions = document.getElementsByClassName("vwo-option");
  const havoOptions = document.getElementsByClassName("havo-option");

  if (niveau == "Havo") {
    for (let option of vwoOptions) {
      option.style.display = "none";
    }
    for (let option of havoOptions) {
      option.style.display = "block";
    }
  }
  if (niveau == "Vwo") {
    for (let option of havoOptions) {
      option.style.display = "none";
    }
    for (let option of vwoOptions) {
      option.style.display = "block";
    }
  }

  // Find the first visible option and set it as selected
  const yearSelect = document.getElementById("year");
  for (let i = 0; i < yearSelect.options.length; i++) {
    if (yearSelect.options[i].style.display !== "none") {
      yearSelect.selectedIndex = i;
      break;
    }
  }
}

async function readLocalJsonFile(datasetName) {
  // this is the link for the file if you host it on live server
  const baseUrl = "http://127.0.0.1:5500/datasets/";
  // const baseUrl = "datasets/"
  const filePath = `${baseUrl}${datasetName}.json`;

  try {
    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${datasetName}.json. Status: ${response.status}`
      );
    }

    const jsonData = await response.json();
    console.log("read succsesful");
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
