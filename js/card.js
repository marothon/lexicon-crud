class Card {
    static #baseUrl = 'https://api.magicthegathering.io/v1';

    static async all(){
        return Card.find();
    }

    static async find(name='', text='', colors='', page=1){
        name = name.toLocaleLowerCase();
        text = text.toLocaleLowerCase();
        if(CardSearch.has(name, text, colors, page)){
            return CardSearch.get(name, text, colors, page).cards;
        }
        try {
            let params = '?contains=imageUrl';
            params = name == '' ? params : `${params}&name=${name}`;
            params = text == '' ? params : `${params}&text=${text}`;
            params = colors == '' ? params : `${params}&colors=${colors}`;
            console.log(params);
            let cardsResponse = await fetch(`${this.#baseUrl}/cards${params}`);
            let cards = await cardsResponse.json();
            let pages = Math.ceil(parseInt(cardsResponse.headers.get('Total-Count'))/100);
            CardSearch.add(name, text, colors, cards.cards ?? [], page, pages);
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

    static #genKey(searchedName, text, colors, page){
        return `name:${searchedName},text:${text},colors:${colors},p:${page}`;
    }

    static add(searchedName, text, colors, cards, page=1, pages=1){
        let key = CardSearch.#genKey(searchedName, text, colors, page);

        CardSearch.#initCache();
        if(!CardSearch.#cache.has(key)){
            CardSearch.#cache.set(key, {cards: cards});
            localStorage.setItem('cardSearchCache', JSON.stringify(Array.from(CardSearch.#cache.entries())));
            console.log('set cache');
        }
    }

    static has(searchedName, text, colors, page=1){
        CardSearch.#initCache();
        let key = CardSearch.#genKey(searchedName, text, colors, page);
        return CardSearch.#cache.has(key);
    }

    static get(searchedName, text, colors, page=1){
        CardSearch.#initCache();
        let key = CardSearch.#genKey(searchedName, text, colors, page);
        return CardSearch.#cache.get(key);
    }
}