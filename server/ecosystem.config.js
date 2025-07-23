// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "my-app", // 1. Человеко-понятное имя процесса в PM2
      script: "app.js", // 2. Точка входа: основной скрипт вашего приложения
      watch: true, // 3. Включаем “watch” — автоперезапуск при изменении файлов

      // 4. Игнорируемые папки/файлы, за которыми не нужно следить
      ignore_watch: ["node_modules", "logs"],

      // 5. Опции для механизма слежения за файлами
      watch_options: {
        followSymlinks: false, // не отслеживать изменения через симлинки
        usePolling: true, // опрашивать FS вместо inotify (нужно на сетевых/вирт. FS)
        interval: 1000, // интервал опроса в миллисекундах
      },

      // 6. Окружение при запуске по умолчанию
      env: {
        NODE_ENV: "development",
      },
      // 7. Окружение для production-режима
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
