# Проект Movies-explorer (бэкенд)

В проекте создаю сервер для работы сервиса Movies-explorer, созданного в рамках выполнения дипломной работы в Яндекс.Практикуме.
Реализованы ручки для запроса сохраненных фильмов, информации о своем профиле. Можно создавать пользователей, фильмы, а 
также удалять их и ставить/убирайть лайки фильмов, тем самым сохраняя их у себя. Также есть возможность редактирования профиля, 
просмотра сохраненных фильмов. Добавила валидацию данных, обработку ошибок.
Использовала: `Express`, `Node.js`, `JavaScript`, `MongoDB`, `Mongoose`,`Editorconfig`, `ESLint`, `Airbnb`, `Api`, 
`Postman`, `Celebrate`, `Winston`, `Jsonwebtoken`.

### Планы по доработке

Добавить возможности:
* подключение фронтенда

## Директории
 
`/controllers` — папка с файлами контроллеров пользователя и фильма  
`/errors` — папка с кастомными ошибками  
`/middlewares` — папка с мидлварами: аутентификация, обработчик ошибок, лимитер, логгер, валидация  
`/models` — папка с файлами описания схем пользователя и фильма  
`/routes` — папка с файлами роутера  
`/utils` — папка с константами и конфигурацией

## Запуск проекта

`npm install` — установка зависимостей  
`npm run start` — запускает сервер   
`npm run dev` — запускает сервер с hot-reload

Ссылка на backend - api.movies.irinaosipova.nomoredomains.sbs

Публичный IP-адрес сервера - 84.201.139.124
