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
    hintcount: 3, // количество оставшихся подсказок
    hintFlag: false, // подсказка не использована
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

function calculateStats(stats) {
  const allGames = stats.history; // Учитываем только history
  
  let wins = 0;
  let losses = 0;
  let totalAttempts = 0;
  let totalAttemptTime = 0;
  let totalAttemptsForWins = 0;

  for (const game of allGames) {
    const attempts = game.attempts;

    // Количество попыток для текущей игры
    totalAttempts += attempts.length;

    // Проверка победы
    const lastAttempt = attempts[attempts.length - 1];
    if (lastAttempt.feedback.every(f => f === "correct")) {
      wins++;
      totalAttemptsForWins += attempts.length; // Учитываем попытки только для побед
    } else {
      losses++;
    }

    // Подсчёт времени всех попыток
    for (let i = 0; i < attempts.length; i++) {
      const startTime = new Date(attempts[i - 1]?.timestamp || game.date).getTime();
      const endTime = new Date(attempts[i].timestamp).getTime();
      totalAttemptTime += endTime - startTime;
    }
  }

  // Среднее время на одну попытку
  const averageAttemptTime = totalAttempts > 0 ? totalAttemptTime / totalAttempts : 0;

  // Среднее количество попыток для побед
  const averageAttemptsForWins = wins > 0 ? totalAttemptsForWins / wins : 0;

  return {
    wins,
    losses,
    averageAttemptTime: (averageAttemptTime / 1000).toFixed(2), // В секундах
    averageAttemptsForWins: averageAttemptsForWins.toFixed(1) // Среднее количество попыток
  }
}