setup();

function setup(){
    document.addEventListener('DOMContentLoaded', async () => {
        let cards = await Card.all();
        renderCards(cards);

        document.querySelector('.toggle-filter-settings').addEventListener('click', () => {
            document.querySelector('.filter-settings').classList.toggle('hidden');
        });

        document.querySelectorAll('.mana-filter > .mana').forEach( (elem) => {
            elem.addEventListener('click', (event) => {
                event.target.classList.toggle('active');
            });
        });

        let cardSearchContainer = document.querySelector('.card-search-result-container');
        let searchForm = document.querySelector('.card-search-form');
        searchForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            let searchInput = event.target.querySelector('& > input[type="text"]');
            let colors = Array.from(document.querySelectorAll('.mana-filter > .mana.active'))
                            .map((manaElem) => manaElem.getAttribute('data-color'))
                            .join(',');
            let cards = await Card.find(searchInput.value, '', colors);
            renderCards(cards);
        });
    });
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
        let cardTag = renderCard(card);
        cardSearchContainer.insertAdjacentHTML('beforeend', cardTag);
    }
}