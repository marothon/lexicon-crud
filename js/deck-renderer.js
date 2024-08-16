class DeckRenderer {

    // The entire deck
    static render(deck, includeEditOptions=true){
        let deckElem = document.createElement('article');
        deckElem.classList.add('deck');
        deckElem.id = deck.name;
        let colorCountTag = '';
        let deckIdentityTag = '';
        let colorCount = deck.getColorCount()
        for(let color in colorCount){
            colorCountTag += `
                <div class="${Card.mapManaCodeToCssClass(color)}-count">
                    <p>${colorCount[color]}</p>${DeckRenderer.renderMana(color)}
                </div>
            `
            deckIdentityTag += DeckRenderer.renderMana(color);
        };
        if(colorCount){
            colorCountTag = `<div class="color-count">${colorCountTag}</div>`;
            deckIdentityTag = `<div class="color-identity-container">
                                    <div class="color-identity">${deckIdentityTag}</div>
                                </div>`;
        }
    
        let deckCardsContainer = document.createElement('div');
        deckCardsContainer.classList.add('deck-card-list-container');
        for(let cardCount of deck.getCards()){
            deckCardsContainer.appendChild(DeckRenderer.renderDeckCard(cardCount, deck, includeEditOptions));
        }
    
        deckElem.innerHTML = `
                <div class="deck-heading">
                    <h3>${deck.name}</h3> ${deckIdentityTag}
                </div>
                ${colorCountTag}
            `;
    
        if(includeEditOptions){
            deckElem.innerHTML += `<button class="edit-deck">Add new cards</button>
                                    <button class="delete-deck">Delete</button>`;
        }
    
        deckElem.querySelector('.deck-heading').insertAdjacentElement('afterend', deckCardsContainer)
    
        if(includeEditOptions){
            deckElem.querySelector('.delete-deck').addEventListener('click', (event) => {
                let confirmation = confirm('Are you sure?');
                if(confirmation){
                    deck.remove();
                    localStorage.removeItem('currentDeck');
                    window.location.reload();
                }
            });
        
            deckElem.querySelector('.edit-deck').addEventListener('click', (event) => {
                window.location = `index.html?deck=${deck.name}`;
            });
        }

        return deckElem;
    }
    
    //A card part of the deck as a "row"
    static renderDeckCard(cardCount, deck, includeEditOptions = true){
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
            <div class="card-cost">${DeckRenderer.renderCost(card.manaCost)}</div>
        `;
    
        deckCardTag.querySelector('.card-add').addEventListener('click', (event) => {
            deck.addCard(card);
            let deckTag = document.querySelector(`.deck[id="${deck.name}"]`);
            deckTag.parentElement.replaceChild(DeckRenderer.render(deck, includeEditOptions), deckTag);
        });
        
        deckCardTag.querySelector('.card-remove').addEventListener('click', (event) => {
            deck.removeCard(card);
            let deckTag = document.querySelector(`.deck[id="${deck.name}"]`);
            deckTag.parentElement.replaceChild(DeckRenderer.render(deck, includeEditOptions), deckTag);
        });
    
        return deckCardTag;
    }
    
    //The casting-cost converted to SVG-symbols
    static renderCost(manaCost){
        return manaCost ? manaCost.replace(/{(.*?)}/g, (a, b) => {
            return DeckRenderer.renderMana(b);
        }) : '';
    }
    
    //A single mana cost symbol converted to a SVG-symbol
    static renderMana(manaCode){
        return `<div class="mana ${Card.mapManaCodeToCssClass(manaCode)}"></div>`;
    }
}