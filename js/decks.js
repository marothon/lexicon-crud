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
        let deckTag = renderDeck(deck);
        deckListContainerTag.insertAdjacentElement('beforeend', deckTag);
    }
}

function renderDeck(deck){
    let deckElem = document.createElement('article');
    deckElem.classList.add('deck');
    deckElem.id = deck.name;
    let colorCountTag = '';
    let deckIdentityTag = '';
    let colorCount = deck.getColorCount()
    for(color in colorCount){
        colorCountTag += `
            <div class="${mapManaCodeToCssClass(color)}-count">
                <p>${colorCount[color]}</p>${renderMana(color)}
            </div>
        `
        deckIdentityTag += renderMana(color);
    };
    if(colorCount){
        colorCountTag = `<div class="color-count">${colorCountTag}</div>`;
        deckIdentityTag = `<div class="color-identity-container">
                                <div class="color-identity">${deckIdentityTag}</div>
                            </div>`;
    }

    let deckCardsContainer = document.createElement('div');
    deckCardsContainer.classList.add('deck-card-list-container');
    for(cardCount of deck.getCards()){
        deckCardsContainer.appendChild(renderDeckCard(cardCount, deck));
    }

    deckElem.innerHTML = `
            <div class="deck-heading">
                <h3>${deck.name}</h3> ${deckIdentityTag}
            </div>
            ${colorCountTag}
            <button class="edit-deck">Add new cards</button>
            <button class="delete-deck">Delete</button>
        `;

    deckElem.querySelector('.deck-heading').insertAdjacentElement('afterend', deckCardsContainer)

    deckElem.querySelector('.delete-deck').addEventListener('click', (event) => {
        let confirmation = confirm('Are you sure?');
        if(confirmation){
            deck.remove();
            localStorage.removeItem('currentDeck');
            renderDecks(Deck.all());
        }
    });

    deckElem.querySelector('.edit-deck').addEventListener('click', (event) => {
        window.location = `index.html?deck=${deck.name}`;
    });

    return deckElem;
}

function renderDeckCard(cardCount, deck){
    let deckCardTag = document.createElement('div');
    let card = cardCount[1].card;;
    deckCardTag.classList.add('deck-card');
    deckCardTag.innerHTML = `
        <div class="card-actions">
            <p class="card-add">+</p>
            <p class="card-remove">-</p>
        </div>
        <p class="card-count">${cardCount[1].count}</p>
        <p class="card-name">${card.name}</p>
        <p class="card-type">${card.type}</p>
        <div class="card-cost">${renderCost(card.manaCost)}</div>
    `;

    deckCardTag.querySelector('.card-add').addEventListener('click', (event) => {
        deck.addCard(card);
        let deckTag = document.querySelector(`.deck[id="${deck.name}"]`);
        deckTag.parentElement.replaceChild(renderDeck(deck), deckTag);
    });
    deckCardTag.querySelector('.card-remove').addEventListener('click', (event) => {
        deck.removeCard(card);
        let deckTag = document.querySelector(`.deck[id="${deck.name}"]`);
        deckTag.parentElement.replaceChild(renderDeck(deck), deckTag);
    });

    return deckCardTag;
}

function renderCost(manaCost){
    return manaCost.replace(/{(.*?)}/g, (a, b) => {
        return renderMana(b);
    })
}

function renderMana(manaCode){
    return `<div class="mana ${mapManaCodeToCssClass(manaCode)}"></div>`;
}

function mapManaCodeToCssClass(manaCode){
    const mapping = {
        W: 'white',
        B: 'black',
        U: 'blue',
        R: 'red',
        G: 'green',
        S: 'snow',
        C: 'colorless',
        '0': 'cost-0',
        '1': 'cost-1',
        '2': 'cost-2',
        '3': 'cost-3',
        '4': 'cost-4',
        '5': 'cost-5',
        '6': 'cost-6',
        '7': 'cost-7',
        '8': 'cost-8',
        '9': 'cost-9',
        '10': 'cost-10',
        '11': 'cost-11',
        '12': 'cost-12',
        '13': 'cost-13',
        '14': 'cost-14',
        '15': 'cost-15',
        '16': 'cost-16',
        '17': 'cost-17',
        '18': 'cost-18',
        '19': 'cost-19',
        '20': 'cost-20',
        'X': 'cost-X',
        'Y': 'cost-Y',
        'Z': 'cost-Z',
        'W/U':"white-blue",
        'W/B':"white-black",
        'U/B':"blue-black",
        'U(R':"blue-red",
        'B/R':"black-red",
        'B/G':"black-green",
        'R/W':"red-white",
        'R/G':"red-green",
        'G/W':"green-white",
        'G/B':"green-blue",
        '2/W':"white-2",
        '2/U':"blue-2",
        '2/B':"black-2",
        '2/R':"red-2",
        '2/G':"green-2",
        'W/P':"white-life",
        'U/P':"blue-life",
        'B/P':"black-life",
        'R/P':"red-life",
        'G/P':"green-life"
    }
    return mapping[manaCode];
}