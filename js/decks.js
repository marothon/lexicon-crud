setup();

function setup(){
    document.addEventListener('DOMContentLoaded', () => {
        let decks = Deck.all();
        renderDecks(decks);

        document.querySelector('.new-deck-form').addEventListener('submit', (event) => {
            let deckName = event.target.querySelector('#card-name').value;
            let deck = new Deck(deckName);
            deck.save();
        })
    });
}

function renderDecks(decks){
    let deckListContainerTag = document.querySelector('.deck-list-container');
    deckListContainerTag.innerHTML = '';
    for(deck of decks){
        let deckTag = DeckRenderer.render(deck);
        deckListContainerTag.insertAdjacentElement('beforeend', deckTag);

        let updateOnCardChange = (event) => {
            let deckTag = event.target;
            let newDeckTag = DeckRenderer.render(deck);
            deckTag.parentElement.replaceChild(newDeckTag, deckTag);
            newDeckTag.addEventListener('card-change', updateOnCardChange)
        };
        deckTag.addEventListener('card-change', updateOnCardChange);
    }
}



