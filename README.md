# Habit Tracker

Приложение для трекинга привычек двух партнёров.

## Стек

- **Backend** — Python FastAPI, SQLAlchemy, SQLite, JWT (Bearer)
- **Frontend** — React 18, TypeScript, Vite 6
- **Mobile** — Flutter (WebView wrapper)
- **Deploy** — Docker Compose

## Структура проекта

```
startup-project-2026-30-06
├── backend/                  # FastAPI сервер
│   ├── src/
│   │   ├── main.py           # Точка входа
│   │   ├── models.py         # SQLAlchemy модели
│   │   ├── schemas.py        # Pydantic схемы
│   │   ├── crud.py           # Операции с БД
│   │   ├── database.py       # Подключение к БД
│   │   ├── config.py         # Конфигурация (JWT_KEY)
│   │   ├── middleware.py     # JWT middleware
│   │   └── routers/
│   │       ├── auth.py       # Регистрация, вход
│   │       ├── habits.py     # CRUD привычек
│   │       └── profile.py    # Профили
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/my-app/          # React + Vite клиент
│   ├── src/
│   │   ├── app/App.tsx       # Корневой компонент
│   │   ├── api/              # API клиент, типы, ошибки
│   │   ├── providers/        # AuthProvider (Context)
│   │   └── features/
│   │       ├── auth/         # AuthPage, LoginForm, RegisterForm
│   │       └── habits/       # DashboardPage, HabitCard, HabitForm, HabitList
│   ├── package.json
│   └── Dockerfile
├── mobile_app/               # Flutter WebView оболочка
│   ├── lib/main.dart
│   └── pubspec.yaml
├── docker-compose.yaml       # Production развёртывание
├── deploy-checklist.md       # Инструкция по деплою
└── .env.example              # Пример переменных окружения
```

## Быстрый старт

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate    # Windows
pip install -r requirements.txt
uvicorn src.main:app --reload --port 8000
```

### Frontend (разработка)

```bash
cd frontend/my-app
npm install
npm run dev
```

Открыть http://localhost:5173

Vite автоматически проксирует `/api/*` запросы на backend (http://localhost:8000).

### Flutter (мобильное приложение)

```bash
cd mobile_app
flutter pub get
flutter run --dart-define=SITE_URL=http://10.0.2.2:5173
```

Для реального телефона укажите IP компьютера с запущенным frontend.

## Docker Compose (production)

```bash
cp .env.example .env
# Отредактировать JWT_KEY в .env
docker compose up --build -d
```

Приложение будет доступно на http://localhost (порт 80).

## Доступные команды

### Frontend

| Команда | Описание |
|---|---|
| `npm run dev` | Запуск dev-сервера |
| `npm run build` | TypeScript проверка + Vite build |
| `npm run lint` | ESLint проверка |
| `npm run preview` | Preview production сборки |

## API эндпоинты

| Метод | Путь | Описание |
|---|---|---|
| POST | `/api/register` | Регистрация |
| POST | `/api/login` | Вход |
| GET | `/api/profile/` | Текущий профиль |
| GET | `/api/profile/partner` | Профиль партнёра |
| GET | `/api/habits/` | Список привычек |
| POST | `/api/habits/create` | Создать привычку |
| PATCH | `/api/habits/update` | Обновить привычку |
| DELETE | `/api/habits/delete?habit_id=` | Удалить привычку |
| GET | `/health` | Health check |

## Примечания

- Авторизация через JWT Bearer token в заголовке `Authorization`
- В проекте могут быть зарегистрированы максимум два пользователя (партнёра)
- Пустой список привычек backend возвращает как 404 — frontend корректно обрабатывает это как пустой массив
- Привычки можно отметить выполненными, снять выполнение через API пока нельзя
- Для локальной разработки frontend использует Vite proxy, чтобы избежать CORS-проблем
