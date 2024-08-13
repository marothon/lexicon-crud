class Deck {
    #loaded;

    constructor(name, cards = null, loaded = false){
        this.name = name;
        this.cards = cards;
        this.#loaded = loaded;
    }

    save(override=false){
        let decks = JSON.parse(localStorage.getItem('decks')) ?? [];
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
        localStorage.setItem('decks',   JSON.stringify(decks));
        this.#loaded = true;
    }

    static load(name){
        let decks = JSON.parse(localStorage.getItem('decks')) ?? [];
        let deck = decks.find((deck) => deck.name == name);
        if(deck){
            return new Deck(deck.name, deck.cards, true);
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