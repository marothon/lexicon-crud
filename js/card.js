class Card {
    static #baseUrl = 'https://api.magicthegathering.io/v1';

    static async all(){
        try {
            cardsResponse = await fetch(`${this.#baseUrl}/cards`);
            cards = await cardsResponse.json();
            return cards.cards;
        } catch(error){
            console.error(`Unable to fetch card-data: ${error.message}`);
            return [];
        }
    }

    static async find(name){
        try {
            cardsResponse = await fetch(`${this.#baseUrl}/cards?name=${name}`);
            cards = await cardsResponse.json();
            return cards.cards;
        } catch(error){
            console.error(`Unable to fetch card-data: ${error.message}`);
            return [];
        }
    }
}