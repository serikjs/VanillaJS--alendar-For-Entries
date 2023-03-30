---- Vue - data ----
  settings - Пользовательские настройки рабочей недели
    settings.worksDay - рабочие дни ( Понедельник - 0, Воскресенье - 6)
    settings.startWorkTime - Начало рабочего дня
    settings.endWorkTime - Конец рабочего дня 
    settings.workTypes - типы предоставляемых услуг и затраты времени на них
    settings.cliendDelay - время требуемое на обслуживание одного клиента
  dataCalendar - Обьект записей 
  thisDate - текущая дата
  currentMonth - текущий месяц 
  calendarPosition - позиция календаря
  calendar - Обьект текущего календарного месяца для рендера
  prevCalendar - Обьект прошлого посещенного календарного месяца
  nextCalendar - Обьект следующего посещенного календарного месяца
  clickedDate - текущая выбраная дата
  workTimes - обьект возможного времени для каждого типа записи

  showDayPopap - показывать ли окно записи
  popapStep - этап записи
  personDataType - выбраный тип предоставляемых услуг для записи
  personDataTime - выбранное время для записи
  personDataName - имя клиента для записи
  personDataTel - номер телефона клиента для записи


---- Vue - computed ----
  datePosition - текущий месяц отрисовки
  currentDate - текущая дата в строковом виде
  currentDate - текущая выбраная дата в строковом виде
  currentWeekDay - текущий день недели в строковом виде
  currentYearMonth - текущий месяц в строковом виде
  mbTime - приблизительное время на тип услуги в строковом виде
  isPopapBtnDisabled - блокировка кнопок внутри записи


---- Vue - methods ----
  setRenderCalendar - установка нового календарного месяца для рендера
  setRenderPrevMonth - формирование недостающих дней с прошлого месяца
  setRenderCurrentMonth - формирование дней текущего месяца
  setRenderNextMonth - формирование недостающих дней с следующего месяца
  generateTimes - генерация возможных часов записи по типам
  getCurrentDayOfWeek - получение текущего дня недели начиная с Понедельника
  getFirstDayOfMonth - получение первого дня месяца
  getLastDayOfMonth - получение последнего дня месяца
  setDate - установка даты на день вперед или назад
  createNewDate - установка новой даты зависящей от передаваемой

  ifThisDate - проверка на соотвецтвие даты текущей дате
  ifNotWorksDay - проверка даты на соотвецтвие рабочему дню 
  ifNoTimesInDay - проверка на то что в данной дате еще остались часы для записи
  ifClikedDay - проверка даты на соотвецтвие нажатому деню

  getDayClass - метод получение нужного класса для дня при рендере

  getTimeToDate - получение времени в дате в строковом виде

  stringTimeToFloat - перевод строкового отображения времени в float число
  stringTimeToObj - перевод строкового отображения времени в формат объекта


  nextMonthClick - переход к следующему месяцу
  prevMonthClick - переход к предыдущему месяцу
  dayClick - нажатие на день месяца
  nextPopapStep - переход к следующему блоку записи
  formSubmite - отправка записи
