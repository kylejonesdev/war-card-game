const api = 'http://deckofcardsapi.com/api/deck/';

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
      
    newGame = () => {
        participants.forEach(item => item.clearCardsDOM());
        let newDeckPromise = new Promise((resolve, reject) => {
            resolve(this.newDeck(1));
        })
        newDeckPromise
        .then(result => player.drawCards(26))
        .then(result => npc.drawCards(26));
    }
}
class Participant {
    constructor(name, game) {
        this.name = name;
        this.game = game;
    }
    drawCards(numberToDraw) {
        const url = api + `${this.game.deckID}/draw/?count=${numberToDraw}`;
        return this.game.fetchThing(url)
        .then(res => {
            this.placeCardInPile(res, this.name);
        })
    }
    placeCardInPile(obj, pileName) {
        let cards = obj.cards;
        let cardDesignators = '';
        cards.forEach(item => cardDesignators += `${item.code},`);
        const url = api + `${this.game.deckID}/pile/${pileName}/add/?cards=${cardDesignators}`
        return this.game.fetchThing(url);
    }
    removeCardsFromPile(numberToDraw, pileName = this.name) {
        const url = api + `${this.game.deckID}/pile/${pileName}/draw/?count=${numberToDraw}`;
        return this.game.fetchThing(url)
        .then(obj => {
            let cardArr = obj.cards;
            this.showCardsDOM(cardArr);
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
            console.log(`${this.name} showed: ${item.code}`);
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
//Listeners
newGameButton.addEventListener('click', war.newGame)
drawButton.addEventListener('click', () => {
    player.removeCardsFromPile(1);
    npc.removeCardsFromPile(1);
});
statusButton.addEventListener('click', () => {
    player.getStatus();
    npc.getStatus();
});