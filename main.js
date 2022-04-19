const drawButton = document.getElementById("draw")

drawButton.addEventListener('click', newGame)

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
}
function drawFromDeck(deckID, numberToDraw) {
    const url = api + `${deckID}/draw/?count=${numberToDraw}`;
    return fetchThing(url);
}
function newGame() {
    newDeck(1)
    .then(deck => drawFromDeck(deck.deck_id, 2))
    .then(res => {
        let cards = res.cards;
        cards.forEach(item => {
            let img = document.createElement('img');
            img.src = item.image;
            let yourHand = document.getElementById('your-hand')
            yourHand.appendChild(img);
        })
    });
}
