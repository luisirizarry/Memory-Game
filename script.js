const gameContainer = document.getElementById("game");
const startGameButton = document.getElementById("start-game");
const playAgainButton = document.getElementById("play-again");

let cardCount = 0;
let matches = 0;
let turns = 0;

let firstCard;
let firstCardColor = "";
let secondCard;
let secondCardColor = "";

// This key should let the function know whether or not the cards that
// were just clicked have gone away yet, this way a user cannot click on too many cards
let clickKey = false;

// This will be used to check if the user clicks on the same card
const className1 = 'same-card';

// This will be used to check if the user clicks on a card that's already matched
const className2 = 'matched-card';

// Retrieve the lowest guesses from localStorage if it exists
let lowestGuesses = null;
if (localStorage.getItem('lowestGuesses')) {
  lowestGuesses = parseInt(localStorage.getItem('lowestGuesses'));
}
updateLowestGuessesDisplay();

const COLORS = [
  "red",
  "blue",
  "green",
  "yellow",
  "orange",
  "purple",
  "pink",
  "brown",
  "gray",
  "black",
  "cyan",
  "magenta",
  "red",
  "blue",
  "green",
  "yellow",
  "orange",
  "purple",
  "pink",
  "brown",
  "gray",
  "black",
  "cyan",
  "magenta"
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want to research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

function handleCardClick(event) {
  // To prevent spamming
  if (clickKey === true) {
    warningMessage(1);
    return;
  }

  // Show the card's color
  if (cardCount < 2) {
    let color = event.target.classList.value;
    event.target.style.backgroundColor = color;
    cardCount++;
  }

  // Handle the first card click
  if (cardCount === 1) {
    // To prevent someone from clicking on match cards
    if (event.target.classList.contains(className2)) {
      warningMessage(3);
      cardCount = 0;
      return;
    }
    firstCard = event.target;
    firstCardColor = event.target.classList.value;
    // Give the first card a "same-card" class in case the user clicks it again for the second card
    firstCard.classList.add(className1);
  } 
  // Handle the second card click
  else if (cardCount === 2) {
    secondCard = event.target;
    // If the user clicks the same card twice, warning pops up
    if (secondCard.classList.contains(className1)) {
      warningMessage(2);
      secondCard.style.backgroundColor = "";
      secondCard.classList.remove(className1);
      cardCount = 0;
      return;
    }
    secondCardColor = event.target.classList.value;
  }
  
  // Check for a match
  if (cardCount === 2) {
    clickKey = true;

    // If the cards match
    if (firstCardColor === secondCardColor) {
      setTimeout(function() {
        matches += 2;
        updateMatches(matches);
        clickKey = false;
        firstCard.classList.remove(className1);
        secondCard.classList.remove(className1);
        firstCard.classList.add(className2);
        secondCard.classList.add(className2);

        // Check if all matches are found
        if (matches === COLORS2.length) {
          handleGameEnd();
        }
      }, 1000);
      turns += 2;
      updateGuesses(turns);
      cardCount = 0;
    } 
    // If the cards do not match
    else {
      setTimeout(function() {
        firstCard.style.backgroundColor = "";
        secondCard.style.backgroundColor = "";
        clickKey = false;
        firstCard.classList.remove(className1);
        secondCard.classList.remove(className1);
      }, 1000);
      turns += 2;
      updateGuesses(turns);
      cardCount = 0;
    }
  }
}

// Update the match count display
function updateMatches(newNumber) {
  document.getElementById('matches-display').textContent = newNumber;
}

// Update the guesses count display
function updateGuesses(newNumber) {
  document.getElementById('guesses-display').textContent = newNumber;
}

// Update the lowest guesses display
function updateLowestGuessesDisplay() {
  if (lowestGuesses !== null) {
    document.getElementById('lowest-display').textContent = lowestGuesses;
  }
}

// Show warning messages
function warningMessage(type) {
  const warningElement = document.getElementById('warning-display');
  // Three differnent warnings depending on which one the user does
  if (type === 1) {
    warningElement.textContent = "AVOID SPAMMING!";
  } else if (type === 2) {
    warningElement.textContent = "AVOID CLICKING THE SAME CARD!";
  } else if (type === 3) {
    warningElement.textContent = "AVOID CLICKING MATCHED CARDS!";
  }
  // Clear the warning message after 
  setTimeout(function() {
    warningElement.textContent = "";
  }, 2000);
}

// Handle the end of the game
function handleGameEnd() {
  // Check if the current game turns are lower than the stored high score
  if (lowestGuesses === null || turns < lowestGuesses) {
    lowestGuesses = turns;
    localStorage.setItem('lowestGuesses', lowestGuesses);
    updateLowestGuessesDisplay();
  }
}

// Restart the game
function playAgain() {
  // Reset game variables
  cardCount = 0;
  matches = 0;
  turns = 0;
  firstCard = "";
  firstCardColor = "";
  secondCard = "";
  secondCardColor = "";

  // Clear the game container
  gameContainer.innerHTML = "";

  // Shuffle the colors again
  shuffledColors = shuffle(COLORS);

  // Update the match count display
  updateMatches(matches);

  // Update the guesses count display
  updateGuesses(turns);

  // Create new divs for the shuffled colors
  createDivsForColors(shuffledColors);
}

// Add event listener for the start game button
startGameButton.addEventListener("click", function() {
  startGameButton.style.display = "none";
  playAgainButton.style.display = "inline-block";
  createDivsForColors(shuffledColors);
});

// Add event listener for the restart button
playAgainButton.addEventListener("click", playAgain);

