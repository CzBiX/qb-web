/* eslint-disable @typescript-eslint/camelcase */
export default {
  lang: 'Русский',
  auto: 'Автоматически',

  close: 'Закрыть',
  no: 'Нет',
  yes: 'Да',
  cancel: 'Отмена',
  ok: 'ОК',

  start: 'Запустить',
  stop: 'Остановить',
  submit: 'Отправить',
  edit: 'Изменить',
  delete: 'Удалить',
  todo: 'Список дел',
  resume: 'Продлжить',
  pause: 'Приостановить',
  force_start: 'Запустить принудительно',
  info: 'Информация',
  reset: 'Сброс',
  login: 'Вход',
  search: 'Поиск',
  refresh: 'Обновить',
  location: 'Расположение',
  rename: 'Переименовать',
  trigger_application_shutdown: 'Выйти из qBittorrent',
  reannounce: 'Объявить повторно',
  recheck: 'Перепроверить',

  username: 'Имя пользователя',
  password: 'Пароль',

  name: 'Название',
  size: 'Размер',
  progress: 'Прогресс',
  status: 'Статус',
  seeds: 'Сиды',
  peers: 'Пиры',
  dl_speed: 'Скорость скачивания',
  up_speed: 'Скорость раздачи',
  eta: 'Осталось',
  ratio: 'Ратио',
  added_on: 'Добавлен',

  settings: 'Настройки',
  logs: 'Логи',
  light: 'Светлый',
  dark: 'Тёмный',

  all: 'Все',
  category: 'Категория |||| Категории',
  uncategorized: 'Без категории',
  others: 'Другие',
  sites: 'Сайты',
  files: 'Файлы',
  less: 'Меньше',
  more: 'Больше',
  feed: 'Feed',
  date: 'Дата',
  query: 'Запрос',
  plugin: 'Плагин |||| Плагины',
  action: 'Действие |||| Действия',
  search_engine: 'Поисковый движок',
  usage: 'применение',
  plugin_manager: 'Управление плагинами',

  title: {
    _: 'Заголовок',
    add_torrents: 'Добавить торрент',
    delete_torrents: 'Удалить торрент',
    set_category: 'Установить категорию',
    edit_tracker: 'Изменить трекер',
    set_location: 'Установить расположение',
    recheck_torrents: 'Перепроверить торренты',
  },

  label: {
    switch_to_old_ui: 'Переключиться на старый интерфейс',
    create_subfolder: 'Создать подпапку',
    start_torrent: 'Запустить торрент',
    skip_hash_check: 'Пропустить проверку хеша',
    in_sequential_order: 'В последовательном порядке',
    first_and_last_pieces_first: 'Сначала первая и последняя часть',

    also_delete_files: 'Также удалить файлы',

    auto_tmm: 'Авто ТММ',

    adding: 'Добавление…',
    reloading: 'Перезагрузка…',
    deleting: 'Удаление…',
    moving: 'Перемещение…',
    moved: 'Перемещено',
    next: 'Далее',
    back: 'Назад',
    confirm: 'Подтвердить',
    reannounced: 'Объявлен повторно',
    rechecking: 'Перепроверка…',
    dht_nodes: '%{smart_count} узел |||| Узлов: %{smart_count}',
    base_url: 'Базовый URL',
  },

  msg: {
    item_is_required: 'Требуется %{item}',
  },

  dialog: {
    trigger_exit_qb: {
      title: 'Выйти из qBittorrent',
      text: 'Выйти из qBittorrent?'
    },
    add_torrents: {
      placeholder: 'Начните скачивать торренты, переместив их сюда,\nили нажмите кнопку вложения справа, чтобы выбрать.',
      hint: 'Одна ссылка на строку',
    },
    delete_torrents: {
      msg: 'Удалить выбранные торренты из списка передачи?',
      also_delete_same_name_torrents: 'Также удалить один торрент с тем же именем |||| Также удалить торренты с тем же именем (всего %{smart_count})',
    },
    set_category: {
      move: 'Переместить выбранные торренты в категорию %{category}?',
      reset: 'Вы уверены, что хотите сбросить категорию выбранных торрентов?',
      also_move_same_name_torrents: 'Также переместить один торрент с тем же именем |||| Также переместить торренты с тем же именем (всего %{smart_count})',
    },
    switch_locale: {
      msg: 'Переключить язык на %{lang}?\nЭто действие перезагрузит страницу.',
    },
    recheck_torrents: {
      msg: 'Перепроверить торренты?',
    },
    rss: {
      add_feed: 'Добавить Feed',
      feed_url: 'Ссылка Feed',
      auto_refresh: 'Автообновление',
      auto_download: 'Автоскачивание',
      delete_feeds: 'Удалить выбранные каналы?',
      date_format: '%{date} (%{duration} назад)',
    },
    rss_rule: {
      add_rule: 'Добавить правило',
      new_rule_name: 'Название нового правила',
      delete_rule: 'Удалить выбранное правило?',
      title: 'Загрузчик RSS',
      rule_settings: 'Настройки правила',

      use_regex: 'Использовать регулярное выражение',
      must_contain: 'Должен содержать',
      must_not_contain: 'Не должен содержать',
      episode_filter: 'Фильтр эпизодов',
      smart_episode: 'Использовать умный фильтр эпизодов',
      assign_category: 'Назначить категорию',

      apply_to_feeds: 'Применить правило к Feed',
    },
  },

  state: {
    _: 'Статистика',

    downloading: 'Скачивается',
    seeding: 'Раздаётся',
    completed: 'Завершено',
    resumed: 'Возобновлён',
    paused: 'Приостановлен',
    active: 'Активный',
    inactive: 'Не активный',
    errored: 'Ошибочный',
  }
}
