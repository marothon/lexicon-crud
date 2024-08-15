setup();

function setup(){
    document.addEventListener('DOMContentLoaded', async () => {
        let urlParams = new URLSearchParams(window.location.search);
        let cards = await Card.all();
        renderCards(cards);

        if(urlParams.has('deck')){
            let deck = Deck.load(urlParams.get('deck'));
            updateCurrentDeck(deck);
            renderDeck(deck);
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
        renderDeck(deck);
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
    return new Deck(deck.name, deck.cards, true);
}

function updateCurrentDeck(deck){
    localStorage.setItem('currentDeck', JSON.stringify(deck));
}

function renderDeck(deck){
    let deckContainerTag = document.querySelector('.edit-deck-container');
    deckContainerTag.innerHTML = '';
    let deckTag = `
        <article class="deck">
            <h2>${deck.name}</h2>
            <p class="card-count">${deck.cards.length} cards</p>
        </article>
        `;
    deckContainerTag.insertAdjacentHTML('afterbegin', deckTag);
}