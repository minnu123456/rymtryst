async function getFile(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch failed:", error);
  }
}

let searchData;

async function searchSetup(data) {
  searchData = await getFile("./searches.json");
  return tabComplete(data.toLowerCase());
}

searchSetup();

let tabFirst = [],
  refs = [],
  altsData;

const changeTab = {
  tabFirst: (index, data) => {
    tabFirst[index] = data;
  },
};

function tabComplete(input) {
  if (!typeof input == "string") return;

  tabFirst = Object.keys(searchData.tabFirst);
  refs = Object.keys(searchData.ref);
  altsData = searchData.alts;
  let tab = [],
    j,
    k,
    l,
    seperated,
    altValue;

  for (j = 0; j < refs.length; j++) {
    if (isSame(input, refs[j]) == true) {
      tab = [
        ...tab,
        ...groupedIndexJson(searchData.ref[refs[j]], searchData.tabFirst),
      ];
      j = refs.length;
    }
  }
  for (j = 0; j < tabFirst.length; j++) {
    //exact match
    if (isSame(input, tabFirst[j]) == true) {
      tab.push([tabFirst[j], searchData.tabFirst[tabFirst[j]]]);
      j = tabFirst.length;
    } else {
      seperated = tokenization(tabFirst[j]);

      for (k = 0; k < seperated.length; k++) {
        //exact match in middle
        if (isSame(input, seperated[k])) {
          tab.push([tabFirst[j], searchData.tabFirst[tabFirst[j]]]);
          k = seperated.length;
        } else {
          //checking for spelling mistakes including middle
          altValue = altsData[seperated[k]];
          if (altValue) {
            for (l = 0; l < altValue.length; l++) {
              if (isSame(input, altValue[l])) {
                tab.push([tabFirst[j], searchData.tabFirst[tabFirst[j]]]);
                k = seperated.length;
                l = altValue.length;
              }
            }
          }
        }
      }
    }
  }
  return tab;
}

function isSame(data1, data2) {
  if (typeof data1 !== "string" || typeof data2 !== "string") return false;
  if (data1.length == 1) {
    if (data1[0] == data2[0]) {
      return true;
    }
  } else if (
    data1[0] == data2[0] &&
    data1[data1.length - 1] == data2[data1.length - 1]
  ) {
    if (data1.length == 2) return true;
    for (let i = 1; i < data1.length - 1; i++) {
      if (data1[i] != data2[i]) return false;
      if (i == data1.length - 2) {
        return true;
      }
    }
  }
  return false;
}

function tokenization(data) {
  if (typeof data !== "string") return false;
  let array = [];
  let presentString = "";
  for (let i = 0; i < data.length; i++) {
    if (data[i] == " ") {
      array.push(presentString);
      presentString = "";
    } else {
      presentString = presentString + data[i];
    }
  }
  array.push(presentString);
  return array;
}

function groupedIndexJson(array, object) {
  const objectKeys = Object.keys(object);
  result = [];
  for (let i = 0; i < array.length; i++) {
    result.push([objectKeys[array[i]], object[objectKeys[array[i]]]]);
    changeTab.tabFirst(i, null);
  }
  return result;
}
