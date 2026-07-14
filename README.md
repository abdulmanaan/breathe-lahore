# BreatheLahore

**Live:** [breathe-lahore.vercel.app](https://breathe-lahore.vercel.app) · **API docs:** [breathe-lahore.fastapicloud.dev/docs](https://breathe-lahore.fastapicloud.dev/docs)

Lahore consistently ranks among the most polluted cities in the world, but the only
information most residents ever see is a single AQI number in a news headline.
BreatheLahore records the city's air quality every hour, builds a historical record,
and turns it into practical answers: how bad is the air right now, at what time of
day is it cleanest, and is it getting better or worse?

![Dashboard screenshot](docs/screenshot.png)

## Features

- **Live summary** with US AQI, PM2.5/PM10 levels, health guidance, and 24-hour change
- **Safest hours** chart showing the average AQI for each hour of the day, so outdoor
  activity can be planned around the cleanest windows
- **Daily trend** chart with average and worst AQI per day over a selectable
  7/14/30-day range
- **Self-updating pipeline**: data is fetched hourly by an in-app scheduler, backed up
  by a GitHub Actions cron job so no hour is missed even when the server sleeps

## How it works

1. **Collect.** Every hour, the backend pulls hourly pollution measurements for Lahore
   from the Open-Meteo Air Quality API.
2. **Store.** Readings are written to PostgreSQL with an idempotent upsert, so the
   job can run any number of times without creating duplicates.
3. **Analyze.** Insight endpoints aggregate the history at the database level
   (hour-of-day averages, daily min/avg/max) and enrich the latest reading with EPA
   category and health advice.
4. **Present.** A React dashboard renders the insights as interactive charts.

## Tech stack

| Layer      | Technology                                              |
| ---------- | ------------------------------------------------------- |
| Backend    | Python, FastAPI, SQLAlchemy (async), APScheduler, httpx  |
| Database   | PostgreSQL (Neon)                                        |
| Frontend   | React (Vite), Tailwind CSS, Recharts, React Router       |
| Scheduling | APScheduler in-app + GitHub Actions hourly cron          |
| Hosting    | FastAPI Cloud (API) + Vercel (frontend)                  |

## Running locally

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create `backend/.env`:   
Add: DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST/DBNAME

Then start the server:

```bash
fastapi dev app/main.py
```

The API runs at `http://127.0.0.1:8000` (interactive docs at `/docs`). Tables are
created automatically on startup. Trigger the first data load with
`POST /api/readings/refresh` from the docs page.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The dashboard runs at `http://localhost:5173` and expects the backend on port 8000
(override with a `VITE_API_URL` environment variable).

## Author

**Abdul Manan** · Software Engineer
[GitHub](https://github.com/abdulmanaan) · [LinkedIn](https://www.linkedin.com/in/helloabdulmanan/)
