setup();

function setup(){
    document.addEventListener('DOMContentLoaded', async () => {
        let urlParams = new URLSearchParams(window.location.search);
        let cards = await Card.all();
        renderCards(cards);

        if(urlParams.has('deck')){
            let deck = Deck.load(urlParams.get('deck'));
            updateCurrentDeck(deck);
            renderCurrentDeck(deck);
        }else {
            let deck = currentDeck();
            if(deck){
                renderCurrentDeck(deck);
                window.history.pushState({}, null, `index.html?deck=${deck.name}`);
            }
        }
        
        document.querySelector('.toggle-filter-settings').addEventListener('click', () => {
            document.querySelector('.filter-settings').classList.toggle('hidden');
        });

        document.querySelectorAll('.mana-filter > .mana').forEach( (elem) => {
            elem.addEventListener('click', (event) => {
                event.target.classList.toggle('active');
            });
        });

        let cardSearchContainer = document.querySelector('.card-search-result-container');
        let searchForm = document.querySelector('.card-search-form');
        searchForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            let searchInput = event.target.querySelector('& > input[type="text"]');
            let colors = Array.from(document.querySelectorAll('.mana-filter > .mana.active'))
                            .map((manaElem) => manaElem.getAttribute('data-color'))
                            .join(',');
            let cards = await Card.find(searchInput.value, '', colors);
            renderCards(cards);
        });

    });
}

function renderCard(card){
    let cardTag = document.createElement('article');
    cardTag.classList.add('card');
    cardTag.innerHTML = `<img src="${card.imageUrl}">`;
    cardTag.addEventListener('click', (event) => {
        let deck = currentDeck();
        deck.addCard(card);
        deck.save();
        updateCurrentDeck(deck);
        renderCurrentDeck(deck);
    });
    return cardTag;
}

function renderCards(cards){
    let cardSearchContainer = document.querySelector('.card-search-result-container');
    cardSearchContainer.innerHTML = '';
    for(card of cards){
        let cardTag = renderCard(card);
        cardSearchContainer.insertAdjacentElement('beforeend', cardTag);
    }
}

function currentDeck(){
    let deck = JSON.parse(localStorage.getItem('currentDeck'));
    if(deck){
        return new Deck(deck.name, deck.cards, true);
    } else {
        return null;
    }
}

function updateCurrentDeck(deck){
    localStorage.setItem('currentDeck', JSON.stringify(deck));
}

function clearCurrentDeck(){
    localStorage.removeItem('currentDeck');
}

function renderCurrentDeck(deck){
    let deckContainerTag = document.querySelector('.edit-deck-container');
    deckContainerTag.innerHTML = '';
    let deckTag = DeckRenderer.render(deck, false);
    deckTag.insertAdjacentHTML('beforeend', '<aside class="close-current-deck">X</aside>');
    deckContainerTag.insertAdjacentElement('afterbegin', deckTag);
    deckContainerTag
        .querySelector('.close-current-deck')
        .addEventListener('click', (event) => {
            clearCurrentDeck();
            event.target.parentElement.remove();
            window.history.pushState({}, null, 'index.html');
});
}