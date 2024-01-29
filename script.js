let currentDataset = null; // Global variable to store the current dataset

let lastSelectedDataset = null; // Global variable to store the last selected dataset

let errout = document.getElementById("errout")
const normalColor = "#495057"
const errorColor = "red"

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

        // Update the last selected dataset
        lastSelectedDataset = selectedDataset;
      } else {
        errout.innerHTML = "Failed to read JSON file."
        errout.style.color = errorColor
      }
    } else {
      // when the dataset is same as last time just render it again with possibly new filters
      renderFilteredResults(currentDataset);
    }
  } else {
    errout.innerText = "kies aub een PTA";
    errout.style.color = errorColor
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
    errout.innerText = "inlezen succesvol"
    errout.style.color = normalColor
    return jsonData;
  } catch (error) {
    errout.innerText = `Error reading local JSON file: ${error.message}`
    errout.style.color = errorColor
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
    errout.innerHTML = "Invalid JSON data."
    errout.style.color = errorColor
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


// var wrapper = document.getElementById('cb-wrapper');
// var checkboxes = wrapper.querySelectorAll('.some-checkbox');

// wrapper.addEventListener('change', function(event) {
//   var target = event;
//   console.log(target)

//   if (target.classList.contains('some-checkbox')) {
//     if (target.checked) {
//       if (target.classList.contains('some-others')) {
//         Array.from(target.parentElement.children).forEach(function(sibling) {
//           if (sibling !== target && sibling.classList.contains('some-checkbox')) {
//             sibling.checked = false;
//           }
//         });
//       } else {
//         var someOthersSibling = target.parentElement.querySelector('.some-others');
//         if (someOthersSibling) {
//           someOthersSibling.checked = false;
//         }
//       }
//     }
//   }
// });

const checkboxes = document.querySelectorAll(".checkbox-container label input");
const allCheckbox = document.querySelector(".some-others")

for (let checkbox of checkboxes) {
  if(checkbox !== allCheckbox) {
    checkbox.addEventListener('change', ()=>{
      allCheckbox.checked = false
    });
  }
}
