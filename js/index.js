setup();

function setup(){
    document.addEventListener('DOMContentLoaded', async () => {
        let urlParams = new URLSearchParams(window.location.search);
        
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

        let cards = await Card.all();
        renderCards(cards);
        
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
    if(currentDeck()){
        cardTag.classList.add('selectable');
        cardTag.addEventListener('click', (event) => {
            let deck = currentDeck();
            deck.addCard(card);
            deck.save();
            updateCurrentDeck(deck);
            renderCurrentDeck(deck);
        });
    }
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
        return Deck.load(deck.name);
    } else {
        return null;
    }
}

function updateCurrentDeck(deck){
    localStorage.setItem('currentDeck', JSON.stringify(deck));
}

function clearCurrentDeck(){
    localStorage.removeItem('currentDeck');
    document.querySelectorAll('.card').forEach((card) => {
        card.classList.remove('selectable');
    })
}

function renderCurrentDeck(deck){
    let deckContainerTag = document.querySelector('.edit-deck-container');
    deckContainerTag.innerHTML = '';
    let deckTag = DeckRenderer.render(deck, false);

    let attachCloseButton = (deckTag) => {
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

    let updateOnCardChange = (event) => {
        let deckTag = event.target;
        let newDeckTag = DeckRenderer.render(deck, false);
        attachCloseButton(newDeckTag);
        deckTag.parentElement.replaceChild(newDeckTag, deckTag);
        newDeckTag.addEventListener('card-change', updateOnCardChange)
    };

    attachCloseButton(deckTag);
    
    deckTag.addEventListener('card-change', updateOnCardChange);
}