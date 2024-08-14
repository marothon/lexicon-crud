setup();

function setup(){
    document.addEventListener('DOMContentLoaded', async () => {
        let cards = await Card.all();
        renderCards(cards);
    });

    document.addEventListener('DOMContentLoaded', () => {
        let cardSearchContainer = document.querySelector('.card-search-result-container');
        let searchForm = document.querySelector('.card-search-form');
        searchForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            let searchInput = event.target.querySelector('& > input[type="text"]');
            let cards = await Card.find(searchInput.value);
            renderCards(cards);
        });
    })
}

function renderCard(card){
    return `
        <article class="card">
            <img src="${card.imageUrl}">
        </article>
    `;
}

function renderCards(cards){
    let cardSearchContainer = document.querySelector('.card-search-result-container');
    cardSearchContainer.innerHTML = '';
    for(card of cards){
        if(!(card.imageUrl)) continue;
        let cardTag = renderCard(card);
        cardSearchContainer.insertAdjacentHTML('beforeend', cardTag);
    }
}