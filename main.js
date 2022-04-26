const api = 'http://deckofcardsapi.com/api/deck/';
const cardMap = {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    0: 10,
    'J': 11,
    'Q': 12,
    'K': 13,
    'A': 14
}
class Game {
    constructor() {
        this.deckID = 'none';
    }
    fetchThing(url) {
        return fetch(url)
        .then(res => res.json())
        .catch(err => {
            console.log(`Error: ${err}`);
        });
    }
    preloadDeck() {
        if(localStorage.getItem('storedDeckID')) {
            this.deckID = localStorage.getItem('storedDeckID');
            console.log(`Retrieved stored deck ID: ${this.deckID}`)
        }
        else {
            newGame();
        }
    } 
    newDeck(numberDecks = 1) {
        let url = api + `new/shuffle/?deck_count=${numberDecks}`
        console.log(url);
        return this.fetchThing(url)
            .then(obj => {
                localStorage.setItem('storedDeckID', obj.deck_id);
                this.deckID = localStorage.getItem('storedDeckID');
                console.log(this.deckID);
            return obj;
            });
    }
    compareCards() {
        //TODO: Clear DOM of cards after comparison. Will require a true/false flag for when draw is pressed at the right time.
        let pCards = participants[0].laidDown;
        participants[0].laidDown = [];
        let nCards = participants[1].laidDown;
        participants[1].laidDown = [];     
        let pCardsTotal = pCards.reduce((acc, item) => cardMap[item.code.charAt(0)] + acc, 0);
        let nCardsTotal = nCards.reduce((acc, item) => cardMap[item.code.charAt(0)] + acc, 0);
        console.log(`${pCardsTotal} ${nCardsTotal}`);
        npc.showCardsDOM(nCards);
        if(pCardsTotal > nCardsTotal) {
            console.log('P wins');
            document.getElementById('result').innerText = "You win!";
            player.placeCardsInPile(pCards.concat(nCards));
        }else{
            //NPC wins ties. Git gud.
            console.log('N wins');
            document.getElementById('result').innerText = "You lose!";
            npc.placeCardsInPile(nCards.concat(pCards));
        }
    }
    newGame = () => {
        participants.forEach(item => {
            item.clearCardsDOM();
            item.laidDown = [];
        });
        let newDeckPromise = new Promise((resolve, reject) => {
            resolve(this.newDeck(1));
        })
        newDeckPromise
        .then(() => player.drawCards(26))
        .then(() => npc.drawCards(26));
    }
}
class Participant {
    constructor(name, game) {
        this.name = name;
        this.game = game;
        this.laidDown = [];
    }
    drawCards(numberToDraw) {
        const url = api + `${this.game.deckID}/draw/?count=${numberToDraw}`;
        return this.game.fetchThing(url)
        .then(res => {
            this.placeCardsInPile(res.cards, this.name);
        })
    }
    placeCardsInPile(cards, pileName = this.name) {
        let cardDesignators = '';
        cards.forEach(item => cardDesignators += `${item.code},`);
        const url = api + `${this.game.deckID}/pile/${pileName}/add/?cards=${cardDesignators}`
        return this.game.fetchThing(url);
    }
    drawFromBottomOfPile(numberToDraw, pileName = this.name) {
        const url = api + `${this.game.deckID}/pile/${pileName}/draw/bottom/?count=${numberToDraw}`;
        console.log(`${this.name} ${url}`);
        return this.game.fetchThing(url)
        .then(obj => {
            let cardsArr = obj.cards;
            cardsArr.forEach(item => {
                console.log(`${this.name} draws ${item.code}`);
                this.laidDown.push(item);
            })
            console.log(this.laidDown);
            return obj;
        })
    }
    getStatus() {
        const url = api + `${this.game.deckID}/pile/${this.name}/list/`
        return this.game.fetchThing(url)
        .then(obj => {
            let cardArr = obj.piles[this.name].cards;
            this.clearCardsDOM();
            console.log(obj);
            this.showCardsDOM(cardArr);
        })
    }
    showCardsDOM(cardArr) {
        cardArr.forEach(item => {
            let img = document.createElement('img');
            img.src = item.image;
            document.getElementById(this.name).appendChild(img);
        })        
    }
    clearCardsDOM() {
        let yourHand = document.getElementById(this.name)
        while(yourHand.firstChild) {
            yourHand.removeChild(yourHand.firstChild);
        }
    }
}
const war = new Game('War');
const player = new Participant('Player', war);
const npc = new Participant('NPC', war);
const participants = [player, npc];
war.preloadDeck();
//DOM Elements
const newGameButton = document.getElementById('new-game')
const drawButton = document.getElementById('draw')
const statusButton = document.getElementById('status')
const compareButton = document.getElementById('compare')
//Listeners
newGameButton.addEventListener('click', war.newGame)
drawButton.addEventListener('click', () => {
    player.drawFromBottomOfPile(1)
    .then(obj => player.showCardsDOM(obj.cards))
    .then(() => npc.drawFromBottomOfPile(1));
});
statusButton.addEventListener('click', () => {
    player.getStatus();
    npc.getStatus();
});
compareButton.addEventListener('click', war.compareCards);