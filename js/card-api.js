async function getCards(){
    const baseUrl = 'https://api.magicthegathering.io/v1';
    let cards = localStorage.getItem('cards');
    try {
        cardsResponse = await fetch(`${baseUrl}/cards`);
        cards = await cardsResponse.json();
        localStorage.setItem('cards', JSON.stringify(cards.cards));
        return cards.cards;
    } catch(error){
        console.error(`Unable to fetch card-data: ${error.message}`);
        return [];
    }
}