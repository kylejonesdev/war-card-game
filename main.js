const drawButton = document.getElementById("draw")

const api = 'http://deckofcardsapi.com/api/deck/';
const deckID = null;
function fetchThing(url) {
    return fetch(url)
    .then(res => res.json())
    .catch(err => {
        console.log(`Error: ${err}`);
    });
}

function newDeck(numberDecks = 1) {
    let url = api + `new/shuffle/?deck_count=${numberDecks}`
    console.log(url);
    return fetchThing(url);
/*     fetch(url)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        deckID = data.deck_id;
    })
    .catch(err => {
        console.log(`Error: ${err}`);
    }); */
}

function drawFromDeck(deckID, numberToDraw) {
    const url = api + `${deckID}/draw/?count=${numberToDraw}`;
    fetch(url)
    .then(res => res.json())
    .then(data => {
        console.log(data);
    })
    .catch(err => {
        console.log(`Error: ${err}`);
    });
}

newDeck(1)
.then(deck => console.log(deck.deck_id));