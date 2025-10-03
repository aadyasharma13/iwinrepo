# I-Win Backend API

Backend API server for the I-Win Healthcare Community platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Configure your environment variables in `.env`

4. Start development server:
```bash
npm run dev
```

## API Endpoints

- `GET /` - API status
- `GET /health` - Health check

## Project Structure

```
backend/
├── server.js          # Main server file
├── routes/            # API routes
├── middleware/        # Custom middleware
├── package.json       # Dependencies
└── README.md         # This file
```
