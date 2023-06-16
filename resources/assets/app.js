window.addEventListener("load", init);

function randomNumberGenerator(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function selectARandomDeal(deals) {
  const dealsLength = Object.keys(deals).length;
  const randomNumber = randomNumberGenerator(0, dealsLength - 1);
  const randomDeal = deals[randomNumber];
  return randomDeal;
}

function setupRandomDeal(randomDeal, stores) {
  const dealTitle = document.getElementById('dealTitle')
  dealTitle.innerHTML = `${randomDeal.title}`
  const dealImage = document.getElementById('dealGameThumbnail')
  dealImage.src = `${randomDeal.thumb}`
  dealImage.alt = `${randomDeal.title} thumbnail`
  const dealImageLink = document.getElementById('dealGameThumbnailLink');
  dealImageLink.href = `https://www.cheapshark.com/redirect?dealID=${randomDeal.dealID}`
  const dealStore = document.getElementById('dealStore')
  const randomDealStore = stores.find(store => store.storeID === randomDeal.storeID);
  dealStore.innerHTML = `Store: ${randomDealStore.storeName}`
  const dealNormalPrice = document.getElementById('dealNormalPrice')
  dealNormalPrice.innerHTML = `Normal price: $${randomDeal.normalPrice}`
  const dealSalePrice = document.getElementById('dealSalePrice')
  dealSalePrice.innerHTML = `Price now: $${randomDeal.salePrice}`
  const dealSteamRating = document.getElementById('dealSteamRating')
  if (randomDeal.steamRatingText !== null) {
    dealSteamRating.innerHTML = `Steam rating: ${randomDeal.steamRatingPercent}% -> ${randomDeal.steamRatingText}`
    if (Number(randomDeal.steamRatingPercent) >= 70) {
      dealSteamRating.style.color = "green";
    } else if (Number(randomDeal.steamRatingPercent) >= 40 && Number(randomDeal.steamRatingPercent) < 70) {
      dealSteamRating.style.color = "orange";
    } else if (Number(randomDeal.steamRatingPercent) >= 0 && Number(randomDeal.steamRatingPercent) < 40) {
      dealSteamRating.style.color = "red";
    }
  } else {
    dealSteamRating.innerHTML = `No ratings on steam (yet?)`;
    dealSteamRating.style.color = "black";
  }
}

function emptySearchedGamesTable() {
  const searchedGamesTable = document.getElementById('searchedGamesTable');
  searchedGamesTable.innerHTML = '';
  const tableHeader = document.createElement('tr');
  const tableHeaderForTitle = document.createElement('th');
  const tableHeaderForCheapestPrice = document.createElement('th');
  const tableHeaderForSteamRating = document.createElement('th');

  tableHeader.id = 'searchedGamesTableHeader'

  tableHeaderForTitle.innerHTML = 'Title'
  tableHeaderForCheapestPrice.innerHTML = 'Cheapest price'
  tableHeaderForSteamRating.innerHTML = 'Steam rating'

  tableHeader.append(tableHeaderForTitle);
  tableHeader.append(tableHeaderForCheapestPrice);
  tableHeader.append(tableHeaderForSteamRating);

  searchedGamesTable.append(tableHeader);
}

function fillSearchedGamesTable(gamesArray, stores) {
  let gameNumber = 1;
  gamesArray.forEach(game => {
    const searchedGamesTable = document.getElementById('searchedGamesTable');
    const tableRow = document.createElement('tr');
    const tableDataCellForTitle = document.createElement('td');
    const tableDataCellForCheapestPrice = document.createElement('td');
    const tableDataCellForSteamRating = document.createElement('td');

    tableRow.id = `searchedGamesTableRow${gameNumber}`;
    gameNumber += 1;

    tableDataCellForTitle.innerHTML = `${game.title}`;
    tableDataCellForCheapestPrice.innerHTML = `${game.cheapestPriceNow}`;
    if (game.steamRatingText !== null) {
      tableDataCellForSteamRating.innerHTML = `Steam rating: ${game.steamRatingPercent}% -> ${game.steamRatingText}`
      if (Number(game.steamRatingPercent) >= 70) {
        tableDataCellForSteamRating.style.color = "green";
        tableDataCellForSteamRating.style.borderColor = "black";
      } else if (Number(game.steamRatingPercent) >= 40 && Number(game.steamRatingPercent) < 70) {
        tableDataCellForSteamRating.style.color = "orange";
        tableDataCellForSteamRating.style.borderColor = "black";
      } else if (Number(game.steamRatingPercent) >= 0 && Number(game.steamRatingPercent) < 40) {
        tableDataCellForSteamRating.style.color = "red";
        tableDataCellForSteamRating.style.borderColor = "black";
      }
    } else {
      tableDataCellForSteamRating.innerHTML = `No ratings on steam (yet?)`;
      tableDataCellForSteamRating.style.color = "black";
    }

    tableRow.addEventListener("mouseover", function() {
      tableRow.style.backgroundColor = 'lightblue';
    });
    tableRow.addEventListener("mouseout", function() {
      tableRow.style.backgroundColor = 'revert';
    });
    tableRow.addEventListener("click", function() {
      const selectedGameDivElement = document.getElementById('selectedGameDiv');
      const selectedGameTitleElement = document.getElementById('selectedGameTitle');
      const selectedGameThumbnailLinkElement = document.getElementById('selectedGameThumbnailLink');
      const selectedGameThumbnailElement = document.getElementById('selectedGameThumbnail');
      const selectedGameCheapestPriceElement = document.getElementById('selectedGameCheapestPriceEver');
      const selectedGameNormalPriceElement = document.getElementById('selectedGameNormalPrice');
      const selectedGameDealsTableElement = document.getElementById('selectedGameDealsTable');

      if (
        window.getComputedStyle(selectedGameDivElement).display === 'none' || 
        (
          window.getComputedStyle(selectedGameDivElement).display === 'block' &&
          selectedGameTitleElement.innerHTML !== game.title
        )
      ) {
        selectedGameDivElement.style.display = "block";

        const deals = game.deals;
        deals.sort((a, b) => a.price - b.price);

        selectedGameTitleElement.innerHTML = `${game.title}`;
        selectedGameThumbnailLinkElement.href = `https://www.cheapshark.com/redirect?dealID=${deals[0].dealID}`;
        selectedGameThumbnailElement.src = `${game.thumb}`;
        selectedGameThumbnailElement.alt = `${game.title} thumbnail`;
        selectedGameCheapestPriceElement.innerHTML = `Cheapest price ever<br>(before): $${game.cheapestPriceEverBefore}`;
        selectedGameNormalPriceElement.innerHTML = `Normal price: $${game.normalPrice}`;

        emptySelectedGamesTable();

        deals.forEach(deal => {
          const selectedGameDealRow = document.createElement('tr');
          const tableDataCellForStore = document.createElement('td');
          const tableDataCellForPrice = document.createElement('td');

          tableDataCellForStore.innerHTML = `${stores.find(store => store.storeID === deal.storeID).storeName}`;
          tableDataCellForPrice.innerHTML = `${deal.price}`;

          selectedGameDealRow.addEventListener("mouseover", function () {
            selectedGameDealRow.style.backgroundColor = 'lightblue';
          });
          selectedGameDealRow.addEventListener("mouseout", function () {
            selectedGameDealRow.style.backgroundColor = 'revert';
          });
          selectedGameDealRow.onclick = function () {
            window.open(`https://www.cheapshark.com/redirect?dealID=${deal.dealID}`, '_blank');
          };

          selectedGameDealRow.append(tableDataCellForStore);
          selectedGameDealRow.append(tableDataCellForPrice);

          selectedGameDealsTableElement.append(selectedGameDealRow);
        });
      } else {
        selectedGameDivElement.style.display = 'none';
      }
    });

    tableRow.append(tableDataCellForTitle);
    tableRow.append(tableDataCellForCheapestPrice);
    tableRow.append(tableDataCellForSteamRating);

    searchedGamesTable.append(tableRow);
  });
}

function emptySelectedGamesTable() {
  const selectedGamesTable = document.getElementById('selectedGameDealsTable');
  selectedGamesTable.innerHTML = '';
  const tableHeader = document.createElement('tr');
  const tableHeaderForStore = document.createElement('th');
  const tableHeaderForprice = document.createElement('th');

  tableHeaderForStore.innerHTML = 'Store'
  tableHeaderForprice.innerHTML = 'Price'

  tableHeader.append(tableHeaderForStore);
  tableHeader.append(tableHeaderForprice);

  selectedGamesTable.append(tableHeader);
}

let msSinceFirstCheckWhetherAllSearchedGamesAreInArray = 0;
function checkWhetherAllSearchedGamesAreInArray(gamesArray, searchedGames, stores) {
  if (gamesArray.length === searchedGames.length || msSinceFirstCheckWhetherAllSearchedGamesAreInArray >= 2000) {
    Promise.all(gamesArray).then((values) => {
      values.sort(function(a, b) {
        var titleA = a.title.toUpperCase();
        var titleB = b.title.toUpperCase();
        return (titleA < titleB) ? -1 : (titleA > titleB) ? 1 : 0;
      });
      fillSearchedGamesTable(values, stores);
    })
    msSinceFirstCheckWhetherAllSearchedGamesAreInArray = 0;
  } else {
    msSinceFirstCheckWhetherAllSearchedGamesAreInArray += 100;
    setTimeout(function() {
      checkWhetherAllSearchedGamesAreInArray(gamesArray, searchedGames, stores);
    }, 100)
  }
};

async function init() {
  let deals = [];
  let stores = [];
  
  getApiData('https://www.cheapshark.com/api/1.0/deals')
  .then((directDeals) => {
    deals = directDeals;
  })
  .then(() => {
    getApiData('https://www.cheapshark.com/api/1.0/stores')
    .then((directStores) => {
      stores = directStores;
    })
    .then(() => {
      let randomDeal = selectARandomDeal(deals);
      setupRandomDeal(randomDeal, stores);
      let lastNineShownDeals = [randomDeal];

      document.getElementById('randomDealButton').addEventListener("click", function() {
        if (lastNineShownDeals.length > 9) {
          lastNineShownDeals.splice(0, 1);
        }
        randomDeal = selectARandomDeal(deals);
        for (let index = 0; index < lastNineShownDeals.length; index++) {
          const deal = lastNineShownDeals[index];
          if (deal.gameID === randomDeal.gameID) {
            randomDeal = selectARandomDeal(deals);
            index = 0;
          }
        }
        lastNineShownDeals.push(randomDeal);
        setupRandomDeal(randomDeal, stores);
      });

      let searchedFreeGames = false;
    
      document.getElementById('searchFreeGames').addEventListener("click", function() {
        emptySearchedGamesTable()
        searchedFreeGames = true;
        
        let freeGames = [];
        for (let index = 0; index < Object.keys(deals).length; index++) {
          const deal = deals[index];
          if (deal.salePrice === '0.00') {
            freeGames.push(deal);
          }
        }

        let gamesArray = [];
        for (let i = 0; i < freeGames.length; i++) {
          getApiData(`https://www.cheapshark.com/api/1.0/games?id=${freeGames[i].gameID}`)
          .then((game) => {
            const promise = new Promise ((resolve, reject) => {
              resolve(
                {
                  title: freeGames[i].title,
                  gameID: freeGames[i].gameID,
                  cheapestPriceEverBefore: game.cheapestPriceEver.price,
                  cheapestPriceNow: freeGames[i].salePrice,
                  normalPrice: freeGames[i].normalPrice,
                  steamRatingText: freeGames[i].steamRatingText,
                  steamRatingPercent: freeGames[i].steamRatingPercent,
                  deals: game.deals,
                  thumb: freeGames[i].thumb,
                }
              )
            })
            gamesArray.push(promise);
          });
        };
        checkWhetherAllSearchedGamesAreInArray(gamesArray, freeGames, stores);
      });

      let previousSearchedInputValue = '';
      let hasSearchedForTheFirstTime = false;
      let lastTimeSearched = new Date();

      document.getElementById('searchGamesButton').addEventListener("click", function() {
        const currentTime = new Date();
        const neededTimeDifferenceBetweenSearches = 10;
        const timeDifference = (currentTime.getTime() - lastTimeSearched.getTime()) / 1000;
        const searchGamesErrorLabel = document.getElementById('searchGamesErrorDisplay');
        const searchGamesInputElement = document.getElementById('searchGamesInput');
        const searchGamesInputValue = searchGamesInputElement.value;
 
        searchGamesErrorLabel.innerHTML = '';

        if (
          (searchGamesInputValue !== '' && 
          searchGamesInputValue !== previousSearchedInputValue &&
          timeDifference >= neededTimeDifferenceBetweenSearches) ||
          (hasSearchedForTheFirstTime === false &&
          searchGamesInputValue !== '') ||
          (searchedFreeGames === true &&
          searchGamesInputValue !== '' &&
          timeDifference >= neededTimeDifferenceBetweenSearches)
        ) {
          emptySearchedGamesTable()
          searchedFreeGames = false;
          hasSearchedForTheFirstTime = true;
          lastTimeSearched = new Date();
          previousSearchedInputValue = searchGamesInputValue;
          
          getApiData(`https://www.cheapshark.com/api/1.0/games?title=${searchGamesInputValue}&limit=10`)
          .then((searchedGames) => {
            let gamesArray = [];
            for (let i = 0; i < searchedGames.length; i++) {
              getApiData(`https://www.cheapshark.com/api/1.0/games?id=${searchedGames[i].gameID}`)
              .then((game) => {
                getApiData(`https://www.cheapshark.com/api/1.0/deals?id=${game.deals[0].dealID}`)
                .then((deal) => {
                  const promise = new Promise ((resolve, reject) => {
                    resolve(
                      {
                        title: searchedGames[i].external,
                        gameID: searchedGames[i].gameID,
                        cheapestPriceEverBefore: game.cheapestPriceEver.price,
                        cheapestPriceNow: searchedGames[i].cheapest,
                        normalPrice: game.deals[0].retailPrice,
                        steamRatingText: deal.gameInfo.steamRatingText,
                        steamRatingPercent: deal.gameInfo.steamRatingPercent,
                        deals: game.deals,
                        thumb: searchedGames[i].thumb,
                      }
                    )
                  });
                  gamesArray.push(promise);
                });
              });
            };
            checkWhetherAllSearchedGamesAreInArray(gamesArray, searchedGames, stores);
          });
        } else {
          if (searchGamesInputValue === '') {
            searchGamesErrorLabel.innerHTML = 'Cannot search games using an empty input';
          } else if (searchGamesInputValue === previousSearchedInputValue && searchedFreeGames === false) {
            searchGamesErrorLabel.innerHTML = 'Input is the same as previous search input';
          } else if (timeDifference < neededTimeDifferenceBetweenSearches) {
            searchGamesErrorLabel.innerHTML = `Please wait ${neededTimeDifferenceBetweenSearches} second between each search. Search possible again in ${Math.round((neededTimeDifferenceBetweenSearches - timeDifference) * 10) / 10} seconds`;
          }
        }
      });
    });
  });
}

/**
 * Async function to get the data from the SWAPI api
 * @returns - returns a promise
 */
async function getApiData(url) {
  try {
    let response = await fetch(url);
    let returnedResponse = await response.json();
    return returnedResponse;
  } catch (err) {
    console.error("Error: ", err);
  }
}