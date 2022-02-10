const tileSection = document.querySelector(".tile-section");
const keySection = document.querySelector(".keys-section");
const messageSection = document.querySelector(".message-section");
const bodySection = document.querySelector("body");

let wordle = "SUPER";
const getWordle = () => {
  fetch("https://wordle-plus-plus.herokuapp.com/word")
    .then((response) => response.json())
    .then((json) => {
      //console.log(json);
      wordle = json.toUpperCase();
    })
    .catch((err) => console.log(err));
};
getWordle();
const keys = [
  "Q",
  "W",
  "E",
  "R",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "P",
  "A",
  "S",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "ENTER",
  "Z",
  "X",
  "C",
  "V",
  "B",
  "N",
  "M",
  "<<",
];

const guessRows = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
];
let currentRow = 0;
let currentTile = 0;
let isGameOver = false;
let statusCode = 0;

guessRows.forEach((entireRow, rowIndex) => {
  const entireRowContainer = document.createElement("div");
  entireRowContainer.setAttribute("id", "row-" + rowIndex);
  entireRow.forEach((charElement, index) => {
    const charElementContainer = document.createElement("div");
    charElementContainer.setAttribute(
      "id",
      "row-" + rowIndex + "-charElement-" + index
    );
    charElementContainer.classList.add("tile");
    entireRowContainer.append(charElementContainer);
  });
  tileSection.append(entireRowContainer);
});

keys.forEach((key) => {
  const buttonElement = document.createElement("button");
  buttonElement.textContent = key;
  buttonElement.setAttribute("id", key);
  buttonElement.addEventListener("click", () => handleClick(key));
  keySection.append(buttonElement);
});

//* Handle Key Press START

const handleKeyPress = (e) => {
  console.log(e.key);
  let letter = e.key.toUpperCase();
  if (!isGameOver) {
    if (letter === "BACKSPACE") {
      deleteLetter();
      return;
    }
    if (letter === "ENTER") {
      //alert("ENTER")
      //console.log(statusCode);
      if (currentTile === 0) {
        statusCode == 0;
      }
      if (statusCode === 0) {
        checkRow();
        statusCode++;
      }
      return;
    }

    addLetter(letter);
  }
};
document.addEventListener("keydown", handleKeyPress);
//* Handle Key Press END

const handleClick = (letter) => {
  //console.log("clicked", letter)
  if (!isGameOver) {
    if (letter === "<<") {
      deleteLetter();
      return;
    }
    if (letter === "ENTER") {
      //alert("ENTER")
      //console.log(statusCode);
      if (currentTile === 0) {
        statusCode == 0;
      }
      if (statusCode === 0) {
        checkRow();
        statusCode++;
      }
      return;
    }
    addLetter(letter);
  }
};

const addLetter = (letter) => {
  if (currentTile < 5 && currentRow < 6) {
    const tile = document.getElementById(
      "row-" + currentRow + "-charElement-" + currentTile
    );
    tile.textContent = letter;
    tile.setAttribute("data", letter);
    guessRows[currentRow][currentTile] = letter;
    //console.log(guessRows)
    currentTile++;
  }
};

const deleteLetter = () => {
  if (currentTile > 0) {
    currentTile--;
    const tile = document.getElementById(
      "row-" + currentRow + "-charElement-" + currentTile
    );
    tile.textContent = "";
    guessRows[currentRow][currentTile] = "";
    tile.setAttribute("data", "");
  }
};

const checkRow = () => {
  //console.log("Inside Checkrow");
  const guess = guessRows[currentRow].join("");
  if (currentTile > 4) {
    fetch(`https://wordle-plus-plus.herokuapp.com/check/?word=${guess}`)
      .then((response) => response.json())
      .then((json) => {
        //console.log(json);
        if (json == "Entry word not found") {
          // showMessage("Word not in list");
          messageChip("redChip", "The word doesn't exist!", 2500);
          statusCode = 0;
          return;
        } else {
          manuverColor();
          if (wordle == guess) {
            // showMessage("Magnificent!");
            messageChip("greenChip", "Hurrey! You did it👍", 3000);
            isGameOver = true;
            successCelebration();
            setTimeout(() => {
              successModal();
            }, 3000);
            return;
          } else {
            if (currentRow >= 5) {
              isGameOver = true;
              // showMessage("Game Over! Wordle is " + wordle);
              messageChip("yellowChip", "Game Over! Wordle is " + wordle, 5000);
              setTimeout(() => {
                successModal();
              }, 3100);
              return;
            }
            if (currentRow < 5) {
              currentRow++;
              currentTile = 0;
              statusCode = 0;
            }
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

// const showMessage = (message) => {
//   const messageBox = document.createElement("p");
//   messageBox.textContent = message;
//   messageSection.append(messageBox);
//   setTimeout(() => messageSection.removeChild(messageBox), 2000);
// };

const addColorToKey = (keyLetter, colorClass) => {
  const key = document.getElementById(keyLetter);
  key.classList.add(colorClass);
};

const manuverColor = () => {
  const rowTiles = document.querySelector("#row-" + currentRow).childNodes;
  let checkWordle = wordle;
  const guess = [];
  rowTiles.forEach((tile) => {
    guess.push({ letter: tile.getAttribute("data"), color: "change-to-grey" });
  });
  guess.forEach((guess, index) => {
    if (guess.letter == wordle[index]) {
      guess.color = "change-to-green";
      checkWordle = checkWordle.replace(guess.letter, "");
    }
  });
  guess.forEach((guess) => {
    if (checkWordle.includes(guess.letter)) {
      guess.color = "change-to-yellow";
      checkWordle = checkWordle.replace(guess.letter, "");
    }
  });
  rowTiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add("flip");
      tile.classList.add(guess[index].color);
      addColorToKey(guess[index].letter, guess[index].color);
    }, 500 * index);
  });
};

// rowTiles.forEach((tile, index) => {
//   const dataLetter = tile.getAttribute("data");
//   setTimeout(() => {}, 500 * index);
// });
//  tile.classList.add("flip");
//  if (dataLetter == wordle[index]) {
//    tile.classList.add("change-to-green");
//    addColorToKey(dataLetter, "change-to-green");
//  } else if (wordle.includes(dataLetter)) {
//    tile.classList.add("change-to-yellow");
//    addColorToKey(dataLetter, "change-to-yellow");
//  } else {
//    tile.classList.add("change-to-grey");
//    addColorToKey(dataLetter, "change-to-grey");
//  }

const successCelebration = () => {
  const celebration = document.createElement("div");
  celebration.classList.add("celebration");
  celebration.innerHTML = ` <lottie-player
    src="https://assets9.lottiefiles.com/packages/lf20_lg6lh7fp.json"
    background="transparent"
    speed="0.6"
    style="width: 800px; height: 800px;"
    autoplay
  ></lottie-player>`;

  bodySection.append(celebration);
};

const successModal = () => {
  const modal = document.createElement("div");
  modal.classList.add("modal");
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");
  modalContent.innerHTML = `
  <div class="closeIcon">
  <span class="close">&times;</span>
  </div>
  <div class="modalMessage">
  <lottie-player src="https://assets10.lottiefiles.com/packages/lf20_fgltupfx.json"  background="transparent"  speed="0.8"  style="width: 300px; height: 250px;"  loop  autoplay></lottie-player>
  </div>
  <div class="buttonDiv">
  <button onclick="refreshPage()">Play Again</button>
  </div>
  `;
  modal.append(modalContent);
  bodySection.append(modal);
};

const modal = document.getElementsByClassName("modal");
const closeButton = document.getElementsByClassName("closeIcon");
window.onclick = function (event) {
  if (
    event.target.classList[0] == "modal" ||
    event.target.classList[0] == "close"
  ) {
    bodySection.removeChild(modal[0]);
  }
};

const messageChip = (code, message, time) => {
  const chip = document.createElement("div");
  chip.classList.add("chipId");
  chip.innerHTML = `
  <div class=${code}>${message}</div>
  `;
  bodySection.append(chip);
  setTimeout(() => {
    // console.log(chip);
    const deleteChip = document.querySelector(".chipId");
    console.log(deleteChip);
    bodySection.removeChild(deleteChip);
  }, time);
};

// messageChip("redChip", "The word doesn't exist!");

const refreshPage = () => {
  window.location.reload();
};
