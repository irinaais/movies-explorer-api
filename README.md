# Movies Explorer (бэкенд)
Репозиторий для бэкенд-части приложения с интерфейсом на `Node.js` + `Express`.

Приложение — поисковик по фильмам, в котором можно создавать список любимых кинолент.
Использовала: `Express`, `Node.js`, `JavaScript`, `JWT`, `MongoDB`, `Mongoose`,`Editorconfig`, 
`React Router`, `ESLint`, `Airbnb`, `REST API`,`Postman`, `Celebrate`, `Winston`, `Git`, `PM2`.

Дипломная работа в Яндекс.Практикуме по специальности "Веб-разработчик".

### Функциональность
* регистрация и аутентификация
* сохранение и удаление фильмов из избранного
* просмотр сохраненных фильмов
* валидация данных
* обработка ошибок
* сбор логов
* хранение пароля пользователя в виде хеша с солью
* поддержка работы с доступом по https
* ограничение числа запросов с одного ip
* фаервол utf
* SSL-сертификаты от Letsencrypt

### Структура
Приложение состоит из двух частей:

* [фронтенд](https://github.com/irinaais/movies-explorer-frontend)
* бэкенд (этот репозиторий)

### API
#### Регистрация
`POST /signup` - создает пользователя с переданными в теле email, password и name
#### Аутентификация
`POST /signin` - проверяет переданные в теле почту и пароль и возвращает JWT-токен
#### Информация о пользователе
`GET /users/me` - возвращает информацию о пользователе (email и имя)
`PATCH /users/me` - обновляет информацию о пользователе (email и имя)
#### Фильмы
`GET /movies` - возвращает все сохранённые текущим пользователем фильмы
`POST /movies` - создаёт фильм с переданными в теле country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieId
`DELETE /movies/_id` - возвращает все сохранённые текущим пользователем фильмы

### Директории
 
`/controllers` — папка с файлами контроллеров пользователя и фильма
`/errors` — папка с кастомными ошибками
`/middlewares` — папка с мидлварами: аутентификация, обработчик ошибок, лимитер, логгер, валидация
`/models` — папка с файлами описания схем пользователя и фильма
`/routes` — папка с файлами роутера
`/utils` — папка с константами и конфигурацией

### Запуск проекта

`npm install` — установка зависимостей
`npm run start` — запускает сервер
`npm run dev` — запускает сервер с hot-reload

Ссылка на backend - api.movies.irinaosipova.nomoredomains.sbs

Публичный IP-адрес сервера - 37.220.83.8
