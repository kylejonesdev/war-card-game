const newGameButton = document.getElementById("new-game")
const drawButton = document.getElementById("draw")
const statusButton = document.getElementById("status")
const yourHand = document.getElementById('player')

newGameButton.addEventListener('click', newGame)
drawButton.addEventListener('click', () => {
    drawCards(deckID, 1, 'player');
});
statusButton.addEventListener('click', getStatus)

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
        deckID = obj.deck_id
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
        document.getElementById('player').appendChild(img);
    })
    const url = api + `${deckID}/pile/${pile}/add/?cards=${cardDesignators}`
    return fetchThing(url);
}
//TODO Change pile from hardcoded to parameter
function getStatus() {
    const url = api + `${deckID}/pile/player/list/`
    return fetchThing(url)
    //TODO display cards from status like you are loading a save
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
    while(yourHand.firstChild) {
        yourHand.removeChild(yourHand.firstChild);
    }
}

/*     
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
*/
