const targetWord = "привет"; // Загаданное слово
const maxAttempts = 6;
const board = document.getElementById("board");
const input = document.getElementById("guessInput");
const submitButton = document.getElementById("submitGuess");
const message = document.getElementById("message");

let attempts = 0;

// Создание игрового поля
function createBoard() {
  board.style.gridTemplateColumns = `repeat(${targetWord.length}, 50px)`;
  for (let i = 0; i < maxAttempts * targetWord.length; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    board.appendChild(cell);
  }
}

// Проверка слова
function checkGuess(guess) {
  const result = [];
  const targetArray = targetWord.split("");

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === targetWord[i]) {
      result.push("correct");
      targetArray[i] = null; // Убираем букву
    } else if (targetArray.includes(guess[i])) {
      result.push("present");
      targetArray[targetArray.indexOf(guess[i])] = null; // Убираем букву
    } else {
      result.push("absent");
    }
  }

  return result;
}

// Обработка ввода
function handleGuess() {
  const guess = input.value.toLowerCase();
  if (guess.length !== targetWord.length) {
    message.textContent = `Слово должно быть из ${targetWord.length} букв.`;
    return;
  }

  const result = checkGuess(guess);
  const cells = board.querySelectorAll(".cell");
  const start = attempts * targetWord.length;

  for (let i = 0; i < guess.length; i++) {
    const cell = cells[start + i];
    cell.textContent = guess[i];
    cell.classList.add(result[i]);
  }

  attempts++;

  if (guess === targetWord) {
    message.textContent = "Поздравляем! Вы угадали слово!";
    submitButton.disabled = true;
    input.disabled = true;
  } else if (attempts === maxAttempts) {
    message.textContent = `Увы, вы не угадали. Загаданное слово: ${targetWord}`;
    submitButton.disabled = true;
    input.disabled = true;
  } else {
    message.textContent = "";
  }

  input.value = "";
}

// Инициализация
createBoard();
submitButton.addEventListener("click", handleGuess);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleGuess();
});
