let currentCard = 0;
const totalCards = 7; // Including the title card and result card
const form = document.getElementById('quiz-form');
const answers = {};

document.addEventListener('DOMContentLoaded', () => {
    displayCard(currentCard);
});

function startQuiz() {
    currentCard = 1;
    displayCard(currentCard);
}

function displayCard(cardIndex) {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        if (index === cardIndex) {
            card.classList.add('active');
            const questionTitle = card.querySelector('h3');
        } else {
            card.classList.remove('active');
        }
    });

    const prevButton = document.querySelector('button[aria-label="Previous Question"]');
    const navigation = document.getElementById('navigation');

    if (currentCard === 0 || currentCard === totalCards - 1) { // Title card or Result card
        navigation.style.display = 'none';
    } else {
        navigation.style.display = 'flex';
        prevButton.style.display = currentCard > 1 ? 'inline-block' : 'none';
    }
}

function previousCard() {
    if (currentCard > 1) {
        currentCard--;
        displayCard(currentCard);
    }
}

function selectAnswer(questionNumber, answer) {
    answers[questionNumber] = answer;
    if (questionNumber < 5) {
        currentCard++;
        displayCard(currentCard);
    } else {
        calculateResult();
    }
}

function calculateResult() {
    let results = {
        "A": 0,
        "B": 0,
        "C": 0,
        "D": 0,
        "E": 0
    };

    for (let key in answers) {
        results[answers[key]]++;
    }

    let max = 0;
    let resultType = '';
    for (let key in results) {
        if (results[key] > max) {
            max = results[key];
            resultType = key;
        }
    }

    let resultText = getResultText(resultType);
    document.getElementById('result').innerHTML = `<img src='https://cdn.glitch.global/9df5ded1-1739-4f54-8568-e22251edae46/${resultText}' alt='${resultText}' />`;

    currentCard = totalCards - 1; // Move to the result card
    displayCard(currentCard);
}

function getResultText(resultType) {
    switch(resultType) {
        case 'A':
            return "PracticalLeader.png?v=1722863511706";
        case 'B':
            return "AllianceArchitect.png?v=1722863509003";
        case 'C':
            return "IdeaAlchemist.png?v=1722863509733";
        case 'D':
            return "IndependentMaven.png?v=1722863510323";
        case 'E':
            return "KnowledgeHunter.png?v=1722863511129";
        default:
            return "Sensemaker";
    }
}

function adjustTitleCardHeight() {
    const titleCard = document.getElementById('title-card');
    const width = titleCard.offsetWidth;
    titleCard.style.height = `${width}px`;
}