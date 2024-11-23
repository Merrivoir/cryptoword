const targetWord = "привет"; // Загаданное слово
const maxAttempts = 6;
const board = document.getElementById("board");
const input = document.getElementById("guessInput");
const submitButton = document.getElementById("submitGuess");
const message = document.getElementById("message");

let attempts = 0;

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

//добавление анимации
function handleGuess() {
  const guess = input.value.toLowerCase();
  if (guess.length !== targetWord.length) {
    message.textContent = `Слово должно быть из ${targetWord.length} букв.`;
    return;
  }

  const result = checkGuess(guess);
  const cells = board.querySelectorAll(".cell");
  const start = attempts * targetWord.length;

  guess.split("").forEach((letter, i) => {
    const cell = cells[start + i];
    const front = cell.querySelector(".cell-front");
    const back = cell.querySelector(".cell-back");

    front.textContent = letter; // Добавляем букву на переднюю сторону
    back.textContent = letter; // Добавляем букву на заднюю сторону

    setTimeout(() => {
      cell.classList.add("flip"); // Переворот
      setTimeout(() => {
        cell.classList.add(result[i]); // Добавляем цвет после переворота
      }, 300); // Задержка для плавного изменения цвета
    }, i * 300); // Плавный переворот по одной карточке
  });

  attempts++;

  if (guess === targetWord) {
    setTimeout(() => {
      message.textContent = "Поздравляем! Вы угадали слово!";
      submitButton.disabled = true;
      input.disabled = true;
    }, guess.length * 300);
  } else if (attempts === maxAttempts) {
    setTimeout(() => {
      message.textContent = `Увы, вы не угадали. Загаданное слово: ${targetWord}`;
      submitButton.disabled = true;
      input.disabled = true;
    }, guess.length * 300);
  } else {
    message.textContent = "";
  }

  input.value = "";
}

// Создание клетки с анимацией переворота
function createCell() {
  const cell = document.createElement("div");
  cell.classList.add("cell");

  // Контейнер для передней и задней стороны
  const inner = document.createElement("div");
  inner.classList.add("cell-inner");

  // Передняя сторона карточки
  const front = document.createElement("div");
  front.classList.add("cell-front");
  inner.appendChild(front);

  // Задняя сторона карточки
  const back = document.createElement("div");
  back.classList.add("cell-back");
  inner.appendChild(back);

  // Вставляем контейнер внутрь карточки
  cell.appendChild(inner);

  return cell;
}

// Добавление карточек в игровое поле
function createBoard() {
  board.style.gridTemplateColumns = `repeat(${targetWord.length}, 50px)`;
  for (let i = 0; i < maxAttempts * targetWord.length; i++) {
    const cell = createCell();
    board.appendChild(cell);
  }
}

// Инициализация
createBoard();
submitButton.addEventListener("click", handleGuess);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleGuess();
});
