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
    deckElem.innerHTML = `
            <div class="deck-heading">
                <h3>${deck.name}</h3> ${deckIdentityTag}
            </div>
            <p class="card-count">${deck.cards.length} cards</p>
            ${colorCountTag}
            <button class="edit-deck">Edit cards</button>
            <button class="delete-deck">Delete</button>
        `;
    deckElem.querySelector('.delete-deck').addEventListener('click', (event) => {
        let confirmation = confirm('Are you sure?');
        if(confirmation){
            deck.remove();
            renderDecks(Deck.all());
        }
    });
    deckElem.querySelector('.edit-deck').addEventListener('click', (event) => {
        window.location = `index.html?deck=${deck.name}`;
    });
    return deckElem;
}

function renderMana(manaCode){
    return `<div class="mana ${mapManaCodeToCssClass(color)}"></div>`;
}

function mapManaCodeToCssClass(manaCode){
    const mapping = {
        W: 'white',
        B: 'black',
        U: 'blue',
        R: 'red',
        G: 'green'
    }
    return mapping[manaCode];
}