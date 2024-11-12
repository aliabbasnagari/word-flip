function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

var word_pairs = {
    "words": [
        ["Sun", "Moon"],
        ["Love", "Hate"],
        ["Ocean", "Waves"],
        ["Book", "Knowledge"],
        ["Fire", "Ice"],
        ["Friend", "Foe"],
        ["Day", "Night"],
        ["Heart", "Beat"]
    ]
};

var words = shuffle(word_pairs.words.flat());


words.forEach(word => {
    createCard(word);
});

// JavaScript code to create and insert the card element
function createCard(word) {
    // Create card element with onclick attribute
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("onclick", "flipCard(this)");

    // Create card front face
    const cardFront = document.createElement("div");
    cardFront.className = "card-face card-front";
    cardFront.textContent = "Reveal";

    // Create card back face
    const cardBack = document.createElement("div");
    cardBack.className = "card-face card-back";
    cardBack.textContent = word;

    // Append faces to card
    card.appendChild(cardFront);
    card.appendChild(cardBack);
    card.word = word;

    // Insert card container into the DOM
    document.getElementById("cardContainer").appendChild(card);
}


function flipCard(card) {
    card.classList.toggle("flip");
    console.log(card.word);
}

document.addEventListener('DOMContentLoaded', function () {


});