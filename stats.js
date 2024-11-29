function updateGameStats(isWin, word) {
    // Загружаем текущую статистику из localStorage или создаём новую
    const stats = JSON.parse(localStorage.getItem("gameStats")) || {
      wins: 0,
      losses: 0,
      todayWord: "",
      attempts: [],
    };
  
    // Обновляем статистику
    if (isWin) {
      stats.wins += 1;
    } else {
      stats.losses += 1;
    }

    stats.todayWord = word
  
    // Сохраняем обновлённую статистику обратно в localStorage
    localStorage.setItem("gameStats", JSON.stringify(stats));
  }

  function showStat() {
    const stats = JSON.parse(localStorage.getItem("gameStats")) || {
      wins: 0,
      losses: 0,
      todayWord: "",
      attempts: [],
    };

    modalHead.textContent = 'Ваша статистика'
    modalInfo.innerHTML = `Побед: ${stats.wins}<br><br>Поражений: ${stats.losses}`
    modalWindow.style.display = 'block'
  }

  function saveAttempt(guess, feedback) {
    // Загружаем текущую статистику из localStorage или создаём новую
    const stats = JSON.parse(localStorage.getItem("gameStats")) || {
      wins: 0,
      losses: 0,
      todayWord: "",
      attempts: [], // Добавляем поле для хранения попыток
    };
  
    // Добавляем текущую попытку
    stats.attempts.push({ guess, feedback });
  
    // Сохраняем обновлённую статистику
    localStorage.setItem("gameStats", JSON.stringify(stats));
  }