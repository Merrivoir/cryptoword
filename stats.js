//-----------------------------------------------------------------------------------------------------------------
// Обновление статистики по завершении игры
function updateGameStats(isWin, word) {
  // Загружаем текущую статистику из localStorage
  const stats = loadStat()
  
  // Обновляем победы или поражения
  if (isWin) {
    stats.wins += 1;
  } else {
    stats.losses += 1;
  }

  // Слово сегодняшнего дня
  stats.today.word = word
  // Добавляем в исторические данные
  stats.history.date = getCurrentFormattedDate()
  stats.history.word = word
  stats.history.attempts = stats.today.attempts
  
  // Сохраняем обновлённую статистику обратно в localStorage
  localStorage.setItem("gameStats", JSON.stringify(stats));
}

//-----------------------------------------------------------------------------------------------------------------
// Сохранение текущей попытки
function saveAttempt(guess, feedback) {
  // Загружаем текущую статистику из localStorage
  const stats = loadStat()
  
  // Добавляем текущую попытку
  stats.today.attempts.push({ guess, feedback });
  
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
    wins: 0,
    losses: 0,
    today: {
      word: "",
      attempts: [],
    },
    history: {
      date: "",
      word: "",
    attempts: [],
    }
  }
    return stats
}