const gasURL = "https://script.google.com/macros/s/AKfycbyxhETGvMWEiFfHP6FRzxxtwtwHUTNqwBLOEv47aObKVYNXsYTuD5WLUvj-D1Il4uhv/exec"

const board = document.getElementById("board")
const keyboardContainer = document.getElementById("keyboard")
const message = document.getElementById("message")

const modalWindow = document.getElementById("myModal")
const modalContent = document.getElementsByClassName('modal-content')
const modalHead = document.getElementById("modal-head")
const modalInfo = document.getElementById("modal-info")
const closeBtn = document.querySelector(".close")

const statBtn = document.querySelector('[aria-label="stat"]')
const attempts = 6; // Количество попыток

// Русская раскладка клавиатуры (3 ряда)
const keyboardLayout = [
  "ЙЦУКЕНГШЩЗХЪ".split(""), // Верхний ряд
  "ФЫВАПРОЛДЖЭ".split(""),  // Средний ряд
  ["⌫", "Я", "Ч", "С", "М", "И", "Т", "Ь", "Б", "Ю", "Enter"], // Нижний ряд
]

let listWord

//Переменные для игрового поля
let currentAttempt = 0; // Текущая попытка
let currentGuess = ""; // Слово, которое вводится
let targetWord = ""; // Загаданное 
let maxWordLength;
