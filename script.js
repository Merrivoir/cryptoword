// Переменные для управления игрой
const targetWord = "слово"; // Загаданное слово
const maxAttempts = 6; // Максимальное количество попыток
let attempts = 0; // Счетчик попыток
let board = document.getElementById("board"); // Контейнер для игрового поля
let input = document.getElementById("guess-input"); // Поле для ввода
let submitButton = document.getElementById("submit-button"); // Кнопка для отправки
let message = document.getElementById("message"); // Сообщение для игрока

// Функция для создания ячейки
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

// Функция для создания игрового поля
function createBoard() {
  board.style.gridTemplateColumns = `repeat(${targetWord.length}, 50px)`;
  for (let i = 0; i < maxAttempts * targetWord.length; i++) {
    const cell = createCell();
    board.appendChild(cell);
  }
}

// Функция для проверки ввода
function checkGuess(guess) {
  const result = [];
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === targetWord[i]) {
      result.push("correct"); // Буква на правильном месте
    } else if (targetWord.includes(guess[i])) {
      result.push("present"); // Буква есть в слове, но не на правильном месте
    } else {
      result.push("absent"); // Буквы нет в слове
    }
  }
  return result;
}

// Функция для обработки попытки угадать слово
function handleGuess() {
  const guess = input.value.toLowerCase();
  if (guess.length !== targetWord.length) {
    message.textContent = `Слово должно быть из ${targetWord.length} букв.`;
    return;
  }

  const result = checkGuess(guess);
  const cells = board.querySelectorAll(".cell");
  const start = attempts * targetWord.length;

  // Добавляем буквы и анимацию переворота
  guess.split("").forEach((letter, i) => {
    const cell = cells[start + i];
    const front = cell.querySelector(".cell-front");
    const back = cell.querySelector(".cell-back");

    front.textContent = letter; // Добавляем букву на переднюю сторону
    back.textContent = letter;  // Добавляем букву на заднюю сторону

    setTimeout(() => {
      cell.classList.add("flip"); // Переворот
      setTimeout(() => {
        cell.classList.add(result[i]); // Добавляем цвет после переворота
      }, 300); // Задержка для плавного изменения цвета
    }, i * 300); // Задержка для каждой буквы
  });

  attempts++;

  // Проверка выигрыша
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

// Функция для инициализации игры
function initGame() {
  createBoard(); // Создаем поле
  submitButton.addEventListener("click", handleGuess); // Обработчик нажатия кнопки
}

// Инициализация игры
initGame();
