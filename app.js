const tileSection = document.querySelector(".tile-section");
const keySection = document.querySelector(".keys-section");
const messageSection = document.querySelector(".message-section");

let wordle;
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
  //   ["", "", "", "", ""],
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

const handleClick = (letter) => {
  //console.log("clicked", letter)
  if (!isGameOver) {
    if (letter === "<<") {
      deleteLetter();
      return;
    }
    if (letter === "ENTER") {
      //alert("ENTER")
      console.log(statusCode);
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
  if (currentTile < 5 && currentRow < 5) {
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
          showMessage("Word not in list");
          statusCode = 0;
          return;
        } else {
          manuverColor();
          if (wordle == guess) {
            showMessage("Magnificent!");
            isGameOver = true;
            return;
          } else {
            if (currentRow >= 4) {
              isGameOver = true;
              showMessage("Game Over!");
              return;
            }
            if (currentRow < 4) {
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

const showMessage = (message) => {
  const messageBox = document.createElement("p");
  messageBox.textContent = message;
  messageSection.append(messageBox);
  setTimeout(() => messageSection.removeChild(messageBox), 2000);
};

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
