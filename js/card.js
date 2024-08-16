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

    static mapManaCodeToCssClass(manaCode){
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
            'W/U': "white-blue",
            'W/B': "white-black",
            'U/B': "blue-black",
            'U(R': "blue-red",
            'B/R': "black-red",
            'B/G': "black-green",
            'R/W': "red-white",
            'R/G': "red-green",
            'G/W': "green-white",
            'G/B': "green-blue",
            '2/W': "white-2",
            '2/U': "blue-2",
            '2/B': "black-2",
            '2/R': "red-2",
            '2/G': "green-2",
            'W/P': "white-life",
            'U/P': "blue-life",
            'B/P': "black-life",
            'R/P': "red-life",
            'G/P': "green-life"
        }
        return mapping[manaCode];
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