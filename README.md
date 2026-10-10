# Fullstack starter

Обычный каркас веб-проекта: **Next.js** спереди, **NestJS + GraphQL** сзади, **PostgreSQL** через **Prisma**, **Redis**, сборка в **Docker**.

Доменной логики здесь нет. Пользователь, регистрация, вход и проверка сервисов — только чтобы сразу было куда наращивать API и страницы.

## Стек

| Часть | Что стоит |
| --- | --- |
| Frontend | Next.js 16, React 19, next-intl, Apollo Client, Tailwind CSS 4 |
| Backend | NestJS 12, Apollo Server 5, GraphQL |
| База | Prisma ORM 7, PostgreSQL 17 |
| Кэш | Redis 8 |
| Прокси | Nginx, только для Linux-сервера |

Prisma 8 на момент шаблона ещё release candidate и не умеет привычные `migrate` / `generate`. Здесь зафиксирован стабильный Prisma 7.

## Как устроено

```text
Браузер
   │
   ├─ локально :3000  Next.js  ──rewrite /graphql──►  NestJS :4000
   │
   └─ сервер :80      Nginx    ── /graphql ────────►  NestJS :4000
                                └── всё остальное ──►  Next.js :3000

NestJS ──► PostgreSQL, Redis
```

Локали фронтенда: `en` (по умолчанию) и `ru`. Строки лежат в `frontend/messages`.

Сессия — httpOnly cookie `access_token` и `refresh_token`. Пароль хранится как bcrypt-хеш.

## Локальная разработка

Нужны Node.js 22+ и Docker.

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

docker compose --env-file backend/.env up -d

cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

Второй терминал:

```bash
cd frontend
npm install
npm run dev
```

- Сайт: http://localhost:3000
- GraphQL: http://localhost:4000/graphql
- Health: http://localhost:4000/health
- Adminer: http://127.0.0.1:8080 (сервер `postgres`, база и пароль из `backend/.env`)

Админа можно создать так: в `backend/.env` заполнить `ADMIN_EMAIL` и `ADMIN_PASSWORD`, затем из `backend` выполнить `npm run db:seed`.

## Docker-сборка приложения

Сеть `app-net` создаётся первым запуском инфраструктуры. Backend и frontend подключаются к ней отдельными compose-файлами — так можно пересобрать только одну часть.

```bash
docker compose --env-file backend/.env up -d
docker compose -f backend/docker-compose.yml --env-file backend/.env up -d --build
docker compose -f frontend/docker-compose.yml up -d --build
```

После этого API на http://127.0.0.1:4000, сайт на http://127.0.0.1:3000.

`NEXT_PUBLIC_*` и адрес бэкенда для Next вшиваются при сборке образа фронтенда. Внутри Docker это всегда `http://backend:4000`. Локальный `frontend/.env` на эту сборку не влияет.

На Linux-сервере nginx с `network_mode: host` занимает порт 80 и проксирует на `127.0.0.1:3000` и `:4000`:

```bash
chmod +x deploy.sh
./deploy.sh
```

`deploy.sh` поднимает инфраструктуру, оба приложения и nginx. На Windows и macOS режим `host` у nginx не используйте: открывайте порты 3000 и 4000 напрямую.

Перед общим деплоем замените секреты JWT в `backend/.env`. `POSTGRES_*` применяются только при первом создании volume.

Бэкап PostgreSQL пишется раз в сутки в `backend/backups/`.

## Куда добавлять код

Backend, новый модуль:

1. Модель в `backend/prisma/schema.prisma`.
2. `npx prisma migrate dev --name <change>`.
3. Папка в `backend/src/<module>`: module, service, resolver.
4. Импорт модуля в `backend/src/app.module.ts`.

Уже есть:

- `register`, `login`, `logout`, `refreshToken`
- `me` — текущий пользователь
- `usersList` — только роль `ADMIN`
- `healthStatus` и `GET /health`
- подписка `serverTime`

Frontend:

- страницы в `frontend/src/app/[locale]`
- запросы рядом с компонентами через Apollo Client
- тексты в `frontend/messages/en.json` и `ru.json`

GraphQL-клиент в браузере ходит на `/graphql` того же origin. Next проксирует этот путь на API, поэтому cookie сессии остаются на сайте.
