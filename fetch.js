var urlParams = new URLSearchParams(window.location.search);
var passedValue = urlParams.get("value");

document.getElementById("searchTerm").value = passedValue;

function mergeResults(data) {
  const mergedResults = new Map();
  const results = [];

  data.forEach((item) => {
    const idRoota = String(item.IDROOTA || 0);
    const items = mergedResults.get(idRoota) || [];
    items.push(item);
    mergedResults.set(idRoota, items);
  });

  Array.from(mergedResults.values())
    .sort((a, b) => parseInt(b[0].IDROOTA) - parseInt(a[0].IDROOTA))
    .forEach((group) => {
      const mergedGroup = group.reduce((merged, result) => {
        if (merged === null) {
          merged = result;
        } else {
          merged.OPIS += ` ${result.OPIS}`;
        }
        return merged;
      }, null);

      results.push(mergedGroup);
    });

  return results;
}

function search() {
  document.getElementById("searchTerm").click();
  const searchTerm = document.getElementById("searchTerm").value;
  if (searchTerm.length < 3) {
    alert("Pole wyszukiwania musi zawierać co najmniej 3 znaki.");
    return;
  } else {
    const startTime = Date.now(); // Początkowy czas

    const url = `http://${encodeURIComponent(
      searchTerm
    )}`;

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = `<div class="lds-dual-ring"></div>`;

    const czasElement = document.getElementById("czas");

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const endTime = Date.now(); // Końcowy czas
        const timeInSeconds = (endTime - startTime) / 1000; // Czas trwania w sekundach
        const roundedTime = timeInSeconds.toFixed(0)
        czasElement.innerText = `Czas wykonania: ${roundedTime} sek.`;

        resultsDiv.innerHTML = "";

        if (data.length === 0) {
          const noResultsDiv = document.createElement("div");
          noResultsDiv.innerText = "Brak wyników";
          noResultsDiv.classList.add("no-results");
          resultsDiv.appendChild(noResultsDiv);
        } else {
          const mergedData = mergeResults(data);
          const fragment = document.createDocumentFragment();

          mergedData.forEach((result) => {
            const resultDiv = createResultDiv(result, searchTerm);
            fragment.appendChild(resultDiv);
          });

          resultsDiv.appendChild(fragment);
        }
      })
      .catch((error) => {
        console.error(error);

        const errorDiv = document.createElement("div");
        errorDiv.innerText = "Błąd serwera";
        errorDiv.classList.add("server-error");
        resultsDiv.appendChild(errorDiv);
      });
  }
}

function createResultDiv(result, searchTerm) {
  const resultDiv = document.createElement("div");
  const resultText =
    result.ROOT === 0
      ? `<b>${result.CZASINS} - ${result.IDROOTA}</b> - <u><a href="https://${result.IDROOTA}" target="_blank">${result.OPIS}</a></u>`
      : `<b>${result.CZASINS} - ${result.IDROOTA}</b> - <u><a href="https://${result.IDROOTA}" target="_blank">${result.OPIS}</a></u>`;

  const colorClass = result.ROOT === 0 ? getColorClass(result.STATUS) : "black";

  resultDiv.innerHTML = highlightText(resultText, searchTerm);
  resultDiv.classList.add(colorClass);

  return resultDiv;
}

function highlightText(text, searchTerm) {
  return text.replace(
    new RegExp(searchTerm, "gi"),
    (match) => `<span class="highlight">${match}</span>`
  );
}

function getColorClass(status) {
  switch (status) {
    case 0:
      return "red";
    case 1:
      return "blue";
    case 2:
      return "green";
    case 3:
      return "black";
    default:
      return "default";
  }
}

const searchTermInput = document.getElementById("searchTerm");

searchTermInput.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    search();
    event.preventDefault();
  }
});
