const newGameButton = document.getElementById("new-game")
const drawButton = document.getElementById("draw")
const statusButton = document.getElementById("status")
const yourHand = document.getElementById('player')

newGameButton.addEventListener('click', newGame)
drawButton.addEventListener('click', () => {
    drawCards(deckID, 1, 'player');
    drawCards(deckID, 1, 'npc');
});
statusButton.addEventListener('click', () => {
    getStatus('player');
});

const api = 'http://deckofcardsapi.com/api/deck/';
let deckID = '';
let piles = ['player', 'npc']
let deckStatus = null;
let pileStatus = null;

function Hand(name) {
    this.cards = [];
}
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
    return fetchThing(url)
        .then(obj => {
            localStorage.setItem('storedDeckID', obj.deck_id);
            deckID = localStorage.getItem('storedDeckID');
            console.log(deckID);
        });
}
function drawCards(deckID, numberToDraw, pile) {
    const url = api + `${deckID}/draw/?count=${numberToDraw}`;
    return fetchThing(url)
    .then(res => {
        deckStatus = res;
        pileStatus = placeCardInPile(res, pile);
    })
}
function placeCardInPile(obj, pile) {
    let cards = obj.cards;
    let cardDesignators = '';
    cards.forEach(item => {
        cardDesignators += `${item.code},`;
        let img = document.createElement('img');
        img.src = item.image;
        document.getElementById(pile).appendChild(img);
    })
    const url = api + `${deckID}/pile/${pile}/add/?cards=${cardDesignators}`
    return fetchThing(url);
}
function getStatus(pileName) {
    const url = api + `${deckID}/pile/${pileName}/list/`
    return fetchThing(url)
    .then(obj => {
        let cards = obj.piles.player.cards;
        cards.forEach(item => {
            let img = document.createElement('img');
            img.src = item.image;
            document.getElementById('player').appendChild(img);
        })
        console.log(obj);
    })
}
function newGame() {
    newDeck(1)
}
function clearHand() {
    while(yourHand.firstChild) {
        yourHand.removeChild(yourHand.firstChild);
    }
}
function setupGame() {
    if(localStorage.getItem('storedDeckID')) {
        deckID = localStorage.getItem('storedDeckID');
        console.log(`Retrieved stored deck ID: ${deckID}`)
        clearHand();
        getStatus('player');
    }
    else {
        newGame();
    }
}
setupGame();