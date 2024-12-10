//-----------------------------------------------------------------------------------------------------------------
// Обновление статистики по завершении игры
function updateGameStats(word, date) {
  // Загружаем текущую статистику из localStorage
  const stats = loadStat()

  // Слово сегодняшнего дня
  stats.today.word = word
  stats.today.date = date
  
  const toHist = {
    word: word,
    date: startGame,
    attempts: stats.today.attempts
  }
  // Добавляем в исторические данные
  stats.history.push(toHist)

  // Отправка статистики на сервер (надо дописать функцию)
  
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
    user: true,
    hintcount: 3,
    today: {
      date: "",
      word: "",
      attempts: [],
    },
    history: []
  }
    return stats
}

//-----------------------------------------------------------------------------------------------------------------
// Отправка статистики на сервер
function sendStatsToServer(urlReq) {
  const url = urlReq
  const stat = loadStat()

  const urlEncodedData = new URLSearchParams(
    Object.fromEntries(
      Object.entries(stat).map(([key, value]) => [
        key,
        typeof value === "object" ? JSON.stringify(value) : value,
      ])
    )
  ).toString(); 

  localStorage.setItem("gameStats", JSON.stringify(stat))

  // Используем fetch для отправки POST-запроса
  fetch(url, {
    method: "post",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: urlEncodedData,
  })
    .then((response) => {
      if (!response.ok) {
        console.log("Статистика отправлена без подтверждения со стороны сервера");
      } else {
      console.log("Статистика успешно отправлена!");
      }
    })
    .catch((error) => {
      console.error("Ошибка при отправке статистики:", error);
    });
}