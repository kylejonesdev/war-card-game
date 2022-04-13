const drawButton = document.getElementById("draw")

const api = 'http://deckofcardsapi.com/api/deck/';

function newDeck(numberDecks) {
    return new Promise (resolve => {
            const url = api + `new/shuffle/?deck_count=${numberDecks}`
        fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            resolve(data.deck_id);
        })
        .catch(err => {
            console.log(`Error: ${err}`);
        });
    })
}

async function loggy() {
    console.log('Calling...');
    let deckID = await newDeck(1);
    console.log(deckID);
}
loggy();