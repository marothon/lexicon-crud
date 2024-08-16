class Deck {
    #loaded;
    #colorPiles;
    #cardPiles;

    constructor(name, cards = [], loaded = false){
        this.name = name;
        this.cards = cards;
        this.#colorPiles = new Map();
        this.#cardPiles = new Map();
        for(const card of this.cards){
            if(card.colorIdentity){
                for(const color of card.colorIdentity){
                    let currentPile = this.#colorPiles.get(color);
                    if(!currentPile){
                        currentPile = [];
                    }
                    currentPile.push(card);
                    this.#colorPiles.set(color, currentPile);
                }
            } else {
                let colorlessPile = this.#colorPiles.get('C') ?? [];
                colorlessPile.push(card);
                this.#colorPiles.set('C', colorlessPile);
            }
            this.#increaseCardCount(card);
        }
        this.#loaded = loaded;
    }

    #increaseCardCount(card){
        if(this.#cardPiles.has(card.id)){
            let cardPile = this.#cardPiles.get(card.id);
            cardPile.count++;
        } else {
            this.#cardPiles.set(card.id, {count: 1, card: card});
        }
    }

    #decreaseCardCount(card){
        if(this.#cardPiles.has(card.id)){
            let cardPile = this.#cardPiles.get(card.id);
            cardPile.count--;
            if(cardPile.count == 0){
                this.#cardPiles.delete(card.id);
            }
        }
    }

    getCards(){
        return this.#cardPiles.entries();
    }

    getColorCount(){
        let colorCount = {};
        for(const [color, cardPile] of this.#colorPiles){
            colorCount[color] = cardPile.length;
        }
        return colorCount;
    }

    addCard(){
        this.cards.push(...arguments);
        for(let card of arguments){
            this.#increaseCardCount(card);
        }
    }

    removeCard(card){
        let index = this.cards.map((card) => card.id).indexOf(card.id);
        this.cards.splice(index, 1);
        this.#decreaseCardCount(card);
    }

    rename(newName){
        let decks = Deck.all()
        let deck = decks.find((deck) => deck.name == this.name);
        this.name = newName;
        if(this.#loaded){
            localStorage.setItem('decks',   JSON.stringify(decks));
        }
    }

    remove(){
        let decks = Deck.all()
        decks = decks.filter((deck) => deck.name !== this.name);
        localStorage.setItem('decks',   JSON.stringify(decks));
    }

    save(override=false){
        let decks = Deck.all()
        let deck = decks.find((deck) => deck.name == this.name);

        if(deck){
            if(override || this.#loaded){
                decks[decks.indexOf(deck)] = this;
            } else {
                throw new DeckAlreadyExistsError(`A deck with the name ${this.name} already exists!`)
            }
        } else {
            decks.push(this);
        }
        localStorage.setItem('decks', JSON.stringify(decks));
        this.#loaded = true;
    }

    static load(name){
        let decks = Deck.all()
        let deck = decks.find((deck) => deck.name == name);
        if(deck){
            return deck;
        } else {
            throw new DeckCannotBeLoadedError(`No deck with name ${name} could be found!`);
        }
    }

    static all(){
        let decks = JSON.parse(localStorage.getItem('decks')) ?? [];
        decks = decks.map(deck => new Deck(deck.name, deck.cards, true));
        return decks;
    }

    toString(){
        return `"${this.name}": [${this.cards ? this.cards.map(card => card.name).join(', ') : ''}]`;
    }
}

class DeckAlreadyExistsError extends Error {
    constructor(message) {
        super(message);
        this.name = "DeckAlreadyExistsError";
    }
}

class DeckCannotBeLoadedError extends Error {
    constructor(message) {
        super(message);
        this.name = "DeckCannotBeLoadedError";
    }
}