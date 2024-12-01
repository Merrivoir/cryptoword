//-----------------------------------------------------------------------------------------------------------------
// Обновление статистики по завершении игры
function updateGameStats(word) {
  // Загружаем текущую статистику из localStorage
  const stats = loadStat()

  // Слово сегодняшнего дня
  stats.today.word = word
  
  const toHist = {
    word: word,
    date: startGame,
    attempts: stats.today.attempts
  }
  // Добавляем в исторические данные
  stats.history.push(toHist) 
  stats.today.attempts = []
  
  // Сохраняем обновлённую статистику обратно в localStorage
  localStorage.setItem("gameStats", JSON.stringify(stats));
}

//-----------------------------------------------------------------------------------------------------------------
// Сохранение текущей попытки
function saveAttempt(guess, feedback, timestamp) {
  // Загружаем текущую статистику из localStorage
  const stats = loadStat()
  
  // Добавляем текущую попытку
  stats.today.attempts.push({ guess, feedback, timestamp });
  
  // Сохраняем обновлённую статистику
  localStorage.setItem("gameStats", JSON.stringify(stats));
  console.log(loadStat())
}

//-----------------------------------------------------------------------------------------------------------------
// Загрузка статистики из локального хранилища
function loadStat () {
  // Загружаем статистику из хранилища или создаем новую
  const stats = JSON.parse(localStorage.getItem("gameStats")) || {
    newUser: true,
    today: {
      word: "",
      attempts: [],
    },
    history: []
  }
    return stats
}