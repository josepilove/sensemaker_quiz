let currentCard = 0;
let cardOrder = [];
const totalCards = 7; // Including the title card and result card
const form = document.getElementById("quiz-form");

document.addEventListener("DOMContentLoaded", () => {
  cardOrder = shuffle([...Array(totalCards - 2).keys()].map((i) => i + 1)); // Exclude the title and result card from shuffling
  cardOrder.unshift(0); // Ensure the title card is first
  cardOrder.push(totalCards - 1); // Ensure the result card is last
  displayCard(currentCard);
  updateProgressBar();
  randomizeOptions();
});

function startQuiz() {
  currentCard = 1;
  displayCard(currentCard);
  updateProgressBar();
}

function displayCard(cardIndex) {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        if (index === cardOrder[cardIndex]) {
            card.classList.add('active');
            if (card.querySelector('input[type="radio"]')) {
                card.querySelector('input[type="radio"]').focus();  // Focus on the first radio button
            }
            // Update question text color
            const questionTitle = card.querySelector('h3');
            if (questionTitle) {
                questionTitle.style.color = getColorForQuestion(cardOrder[cardIndex]);
            }
        } else {
            card.classList.remove('active');
        }
    });

    const nextButton = document.querySelector('button[aria-label="Next Question"]');
    const prevButton = document.querySelector('button[aria-label="Previous Question"]');
    const submitButton = document.getElementById('submit-button');
    const navigation = document.getElementById('navigation');

    if (currentCard === 0 || currentCard === totalCards - 1) { // Title card or Result card
        navigation.style.display = 'none';
    } else if (currentCard === totalCards - 2) { // Last question card
        navigation.style.display = 'flex';
        nextButton.style.display = 'none';
        prevButton.style.display = 'inline-block';
        submitButton.style.display = 'inline-block';
    } else {
        navigation.style.display = 'flex';
        nextButton.style.display = 'inline-block';
        prevButton.style.display = 'inline-block';
        submitButton.style.display = 'none';
    }

    updateProgressBar();
}

function nextCard() {
  if (currentCard < totalCards - 1) {
    // Do not go beyond the last card
    currentCard++;
    displayCard(currentCard);
    updateProgressBar();
  }
}

function previousCard() {
  if (currentCard > 0) {
    currentCard--;
    displayCard(currentCard);
    updateProgressBar();
  }
}

function updateProgressBar() {
    const segments = document.querySelectorAll('.progress-segment');
    segments.forEach((segment, index) => {
        if (index < currentCard - 1) {
            segment.classList.add('active');
        } else if (index === currentCard - 1) {
            segment.classList.add('current');
        } else {
            segment.classList.remove('active');
            segment.classList.remove('current');
        }
    });
}

function randomizeOptions() {
  document.querySelectorAll(".card").forEach((card) => {
    const options = Array.from(card.querySelectorAll("label"));
    options.forEach((option) => option.parentNode.removeChild(option));
    shuffle(options).forEach((option) => card.appendChild(option));
  });
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function calculateResult() {
  let results = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
  };

  const formData = new FormData(form);
  const email = formData.get("email");

  for (let [key, value] of formData.entries()) {
    if (key !== "email") {
      results[value]++;
    }
  }

  let max = 0;
  let resultType = "";
  for (let key in results) {
    if (results[key] > max) {
      max = results[key];
      resultType = key;
    }
  }

  let resultText = getResultText(resultType);
  document.getElementById(
    "result"
  ).innerHTML = `<img src='https://cdn.glitch.global/9df5ded1-1739-4f54-8568-e22251edae46/${resultText}' alt='${resultText}' />`;
  saveResultToDatabase(email, resultText);
  document.getElementById("downloadButton").style.display = "inline-block";
  document.getElementById("shareButton").style.display = "inline-block";
  document.getElementById("emailButton").style.display = "inline-block";

  currentCard = totalCards - 1; // Move to the result card
  displayCard(currentCard);
  updateProgressBar();
}

function getResultText(resultType) {
  switch (resultType) {
    case "A":
      return "PracticalLeader.png?v=1722863511706";
    case "B":
      return "AllianceArchitect.png?v=1722863509003";
    case "C":
      return "IdeaAlchemist.png?v=1722863509733";
    case "D":
      return "IndependentMaven.png?v=1722863510323";
    case "E":
      return "KnowledgeHunter.png?v=1722863511129";
    default:
      return "Sensemaker";
  }
}

function saveResultToDatabase(email, resultText) {
  // Implement a backend service to save the email and result
  // Example: using a server-side script or Firebase
}

function generateResultImage(resultText) {
  const canvas = document.getElementById("resultCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 400;
  canvas.height = 200;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#333";
  ctx.font = "20px Arial";
  ctx.fillText(resultText, 10, 30);

  document.getElementById("resultCanvas").style.display = "block";
  document.getElementById("downloadButton").style.display = "block";
  document.getElementById("shareButton").style.display = "block";
  document.getElementById("emailButton").style.display = "block";
}

function downloadResult() {
  const canvas = document.getElementById("resultCanvas");
  const link = document.createElement("a");
  link.download = "quiz_result.png";
  link.href = canvas.toDataURL();
  link.click();
}

function shareResult() {
  const canvas = document.getElementById("resultCanvas");
  const image = canvas.toDataURL("image/png");
  const blob = dataURItoBlob(image);
  const file = new File([blob], "quiz_result.png", { type: "image/png" });

  const shareData = {
    title: "Which Type of Sensemaker Are You?",
    text:
      "I just took a quiz and found out I am a: " +
      document.getElementById("result").innerText,
    files: [file],
  };

  if (navigator.canShare && navigator.canShare(shareData)) {
    navigator
      .share(shareData)
      .then(() => {
        console.log("Thanks for sharing!");
      })
      .catch(console.error);
  } else {
    console.warn("Your system doesn't support sharing files.");
  }
}

function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

function emailResult() {
  const email = prompt("Please enter your email:");
  if (email) {
    saveResultToDatabase(email, document.getElementById("result").innerText);
    alert("Result sent to " + email);
  }
}
