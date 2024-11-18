var GAME_SIZE = [4, 4];
var ACTIVE_CARDS = [];
var WORD_PAIRS = [];


function pairExists(pair, pairs_list) {
    return pairs_list.includes(`${pair[0]} ${pair[1]}`) || pairs_list.includes(`${pair[1]} ${pair[0]}`);
}


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createCard(word, parent) {
    // Create card element
    const card = document.createElement("div");
    card.className = "card";
    card.addEventListener('click', () => flipCard(card));

    // Create card front face
    const cardFront = document.createElement("div");
    cardFront.className = "card-face card-front";
    //cardFront.textContent = `(${word})`;// "Reveal";

    // Create card back face
    const cardBack = document.createElement("div");
    cardBack.className = "card-face card-back";
    cardBack.textContent = word;

    // Append faces to card
    card.appendChild(cardFront);
    card.appendChild(cardBack);
    card.cardBack = cardBack;
    card.dataset.face = 0;
    card.word = word;

    // Insert card container into the DOM
    parent.appendChild(card);
}


function flipCard(card) {
    if (card.dataset.face == 0 && ACTIVE_CARDS.length < 2) {
        card.classList.toggle("flip");
        card.dataset.face = 1;  // Mark the card as face-up
        ACTIVE_CARDS.push(card);
    } else if (card.dataset.face == 1) {
        card.classList.toggle("flip");
        card.dataset.face = 0;  // Mark the card as face-down
        ACTIVE_CARDS = ACTIVE_CARDS.filter(C => C !== card);
    }

    if (ACTIVE_CARDS.length == 2 && pairExists([ACTIVE_CARDS[0].word, ACTIVE_CARDS[1].word], WORD_PAIRS)) {
        console.log("FOUNDED");
        var clr = getRandomColor();

        // ACTIVE_CARDS[0].cardBack.style.border = "6px solid " + clr;
        // ACTIVE_CARDS[1].cardBack.style.border = "6px solid " + clr;

        // ACTIVE_CARDS[0].cardBack.style.backgroundColor = "transparent";
        // ACTIVE_CARDS[1].cardBack.style.backgroundColor = "transparent";

        ACTIVE_CARDS[0].cardBack.style.opacity = 0.3;
        ACTIVE_CARDS[1].cardBack.style.opacity = 0.3;

        ACTIVE_CARDS[0].dataset.face = 2;
        ACTIVE_CARDS[1].dataset.face = 2;
        ACTIVE_CARDS = [];
        // border 
        // backgroundColor 
    }

    console.log(ACTIVE_CARDS);
}

function getRandomColor() {
    // Define the color list only once if not already defined
    if (!getRandomColor.colorList || getRandomColor.colorList.length === 0) {
        getRandomColor.colorList = [
            "#FF6347", // Tomato Red
            "#4682B4", // Steel Blue
            "#FFD700", // Gold
            "#8A2BE2", // Blue Violet
            "#32CD32", // Lime Green
            "#FF4500", // Orange Red
            "#2F4F4F", // Dark Slate Gray
            "#800080", // Purple
            "#FFFF00", // Yellow
            "#00BFFF", // Deep Sky Blue
            "#DC143C", // Crimson
            "#00FF00", // Lime
            "#D2691E", // Chocolate
            "#0000FF", // Blue
            "#FF1493", // Deep Pink
            "#C71585", // Medium Violet Red
            "#8B0000", // Dark Red
            "#A52A2A" // Brown
        ];
    }
    const randomIndex = Math.floor(Math.random() * getRandomColor.colorList.length);
    return getRandomColor.colorList.splice(randomIndex, 1)[0];
}

document.addEventListener('DOMContentLoaded', () => {
    var btn_44 = document.getElementById("btn44");
    var btn_45 = document.getElementById("btn45");
    var btn_54 = document.getElementById("btn54");
    var btn_56 = document.getElementById("btn56");
    var btn_65 = document.getElementById("btn65");
    var btn_66 = document.getElementById("btn66");

    btn_44.addEventListener('click', () => loadGame([4, 4]));
    btn_45.addEventListener('click', () => loadGame([4, 5]));
    btn_54.addEventListener('click', () => loadGame([5, 4]));
    btn_56.addEventListener('click', () => loadGame([5, 6]));
    btn_65.addEventListener('click', () => loadGame([6, 5]));
    btn_66.addEventListener('click', () => loadGame([6, 6]));

    var card_container = document.getElementById("cardContainer");
    card_container.style.gridTemplateColumns = 'repeat(4, 1fr)';

    function loadGame(game_size) {
        GAME_SIZE = game_size;
        card_container.replaceChildren();
        card_container.style.gridTemplateColumns = `repeat(${GAME_SIZE[1]}, 1fr)`;

        fetch(`https://mytoronto.thedev.ca/wp-json/words/v1/random-words/?count=${(GAME_SIZE[0] * GAME_SIZE[1]) / 2}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error fetching words: ${response.statusText}`);
                }
                return response.json();
            })
            .then(words_json => {
                WORD_PAIRS = words_json.words;
                console.log(WORD_PAIRS);

                var words = shuffle(WORD_PAIRS.flatMap(item => item.split(" ")));
                console.log(words);

                words.forEach(word => {
                    createCard(word, card_container);
                });
            });
    }

});