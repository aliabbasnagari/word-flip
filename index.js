
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


word_pairs["words"].forEach(word => {
    createCard(word[0]);
    createCard(word[1]);
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

    // Insert card container into the DOM
    document.getElementById("cc").appendChild(card);
}


function flipCard(card) {
    card.classList.toggle("flip");
}