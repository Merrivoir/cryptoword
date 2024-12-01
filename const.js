// API запросы
const gasURL = "https://script.google.com/macros/s/AKfycbyxhETGvMWEiFfHP6FRzxxtwtwHUTNqwBLOEv47aObKVYNXsYTuD5WLUvj-D1Il4uhv/exec"

const board = document.getElementById("board") // Игровое поле
const keyboardContainer = document.getElementById("keyboard") // Игровая клавиатура

// Модальное окно
const modalWindow = document.getElementById("myModal")
const modalContent = document.getElementsByClassName('modal-content')
const modalHead = document.getElementById("modal-head")
const modalInfo = document.getElementById("modal-info")
const closeBtn = document.querySelector(".close")

//Кнопки заголовка
const rulesBtn = document.querySelector('[aria-label="rules"]')
const newBtn = document.querySelector('[aria-label="new"]')
const statBtn = document.querySelector('[aria-label="stat"]')
const settingsBtn = document.querySelector('[aria-label="settings"]')

const attempts = 6; // Количество попыток

// Русская раскладка клавиатуры (3 ряда)
const keyboardLayout = [
  "ЙЦУКЕНГШЩЗХЪ".split(""), // Верхний ряд
  "ФЫВАПРОЛДЖЭ".split(""),  // Средний ряд
  ["⌫", "Я", "Ч", "С", "М", "И", "Т", "Ь", "Б", "Ю", "Enter"], // Нижний ряд
]

//Переменные для игрового процесса
let listWord // Список слов в словаре
let startGame
let currentAttempt = 0; // Текущая попытка
let currentGuess = ""; // Слово, которое вводится
let targetWord = ""; // Загаданное слово
let maxWordLength; // Длина слова
