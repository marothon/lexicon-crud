setup();

function setup(){
    document.addEventListener('DOMContentLoaded', async () => {
        let urlParams = new URLSearchParams(window.location.search);
        
        if(urlParams.has('deck')){
            let deck = Deck.load(urlParams.get('deck'));
            updateCurrentDeck(deck);
            renderCurrentDeck(deck);
        } else {
            let deck = currentDeck();
            if(deck){
                renderCurrentDeck(deck);
                window.history.pushState({}, null, `index.html?deck=${deck.name}`);
            }
        }

        let cards;
        if(restoreSearchParams()){
            cards = await performSearch(document.querySelector('.card-search-form'))
        } else {
            cards = await Card.random();
        };
        renderCards(cards);
        
        document.querySelector('.toggle-filter-settings').addEventListener('click', () => {
            document.querySelector('.filter-settings').classList.toggle('hidden');
        });

        document.querySelectorAll('.mana-filter > .mana').forEach( (elem) => {
            elem.addEventListener('click', (event) => {
                event.target.classList.toggle('active');
            });
        });

        let searchForm = document.querySelector('.card-search-form');
        searchForm.addEventListener('submit', performSearchHandler);
    });
}

async function performSearchHandler(event){
    event.preventDefault();
    let cards = await performSearch(event.target);
    renderCards(cards);
    storeSearchParams();
}

async function performSearch(form){
    let searchInput = form.querySelector('& > input[type="text"]');
    let colors = getManaFilter();
    let cards = await Card.find(searchInput.value, '', colors);
    let cardSearchContainer = document.querySelector('.card-search-result-container');
    cardSearchContainer.innerHTML = '';
    form.removeAttribute('inert', '');
    return cards;
}

function getManaFilter(){
    return Array.from(document.querySelectorAll('.mana-filter > .mana.active'))
                    .map((manaElem) => manaElem.getAttribute('data-color'))
                    .join(',');
}

function storeSearchParams(){
    const searchForm = document.querySelector('.card-search-form');
    const formData = new FormData(searchForm);
    let searchParams = {};
    let manaFilter = getManaFilter();
    if(manaFilter.length > 0){
        searchParams.manaFilter = manaFilter;
    }
    for(let [key, value] of formData){
        searchParams[key] = value;
    }
    localStorage.setItem('previousSearchParams', JSON.stringify(searchParams));
}

function restoreSearchParams(){
    const searchForm = document.querySelector('.card-search-form');
    if(!localStorage.getItem('previousSearchParams')){
        return false;
    }
    const searchParams = JSON.parse(localStorage.getItem('previousSearchParams'));

    let showFilterSettings = false;
    if(searchParams.manaFilter){
        showFilterSettings = true;
        for(let color of searchParams.manaFilter.split(',')){
            searchForm.querySelector(`.mana-filter .mana[data-color="${color}"]`).classList.add('active');
        }

        delete searchParams.manaFilter;
    }

    if(showFilterSettings){
        searchForm.querySelector('.filter-settings').classList.remove('hidden');
    }

    for(let key in searchParams){
        let value = searchParams[key];
        searchForm.querySelector(`*[name="${key}"]`).setAttribute('value', value);
    }
    return true;

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