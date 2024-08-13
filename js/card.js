class Card {
    static #baseUrl = 'https://api.magicthegathering.io/v1';

    static async all(){
        return Card.find();
    }

    static async find(name='', page=1){
        if(CardSearch.has(name, page)){
            return CardSearch.get(name, page).cards;
        }
        try {
            let params = name == '' ? '' : `?name=${name}`;
            let cardsResponse = await fetch(`${this.#baseUrl}/cards${params}`);
            let cards = await cardsResponse.json();
            console.log(cards);
            let pages = Math.ceil(parseInt(cardsResponse.headers.get('Total-Count'))/100);
            CardSearch.add(name, cards.cards, page, pages);
            console.log(`Remaining calls: ${cardsResponse.headers.get('Ratelimit-Remaining')}`)
            return cards.cards;
        } catch(error){
            console.error(`Unable to fetch card-data: ${error.message}`);
            return [];
        }
    }
}

class CardSearch {
    static #cache;

    static #initCache(){
        CardSearch.#cache = CardSearch.#cache ?? new Map(JSON.parse(localStorage.getItem('cardSearchCache'))) ?? new Map();
    }

    static add(searchedName, cards, page=1, pages=1){
        let key = `name:${searchedName},p:${page}`;

        CardSearch.#initCache();
        if(!CardSearch.#cache.has(key)){
            CardSearch.#cache.set(key, {cards: cards});
            localStorage.setItem('cardSearchCache', JSON.stringify(Array.from(CardSearch.#cache.entries())));
            console.log('set cache');
        }
    }

    static has(searchedName, page=1){
        CardSearch.#initCache();
        return CardSearch.#cache.has(`name:${searchedName},p:${page}`);
    }

    static get(searchedName, page=1){
        CardSearch.#initCache();
        return CardSearch.#cache.get(`name:${searchedName},p:${page}`);
    }
}