# Lens — Backend API

Express.js + MySQL REST API for the Lens photographer platform.

## Stack

- **Runtime:** Node.js ≥ 18 (CommonJS)
- **Framework:** Express.js 4.21
- **Database:** MySQL 8+ (mysql2 connection pool)
- **Auth:** JWT (jsonwebtoken) + bcryptjs
- **Email:** Nodemailer (SMTP)
- **Uploads:** Multer (disk storage → `uploads/`)
- **CORS:** Configured via `FRONTEND_URL` env var

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env
# Edit .env with your values:
#   PORT=3000
#   DB_HOST=localhost
#   DB_USER=root
#   DB_PASSWORD=your_password
#   DB_NAME=lens
#   JWT_SECRET=your_jwt_secret
#   EMAIL_HOST=mail.example.com
#   EMAIL_PORT=465
#   EMAIL_USER=noreply@example.com
#   EMAIL_PASS=email_password
#   FRONTEND_URL=http://localhost:5173

# 3. Create database & tables
mysql -u root -p < db/api.sql

# 4. Start server (seeds default data on first run)
npm run dev        # development with nodemon
npm start          # production
```

## Project Structure

```
back_end/
├── index.js              # Entry point — starts server, inits DB pool, runs seed
├── db/
│   └── api.sql           # MySQL schema (9 tables with foreign keys + CASCADE)
└── src/
    ├── app.js            # Express config (CORS, body parser, static files, routes)
    ├── config/
    │   └── db.js         # MySQL connection pool (sets global.db)
    ├── models/           # Data access layer
    │   ├── User.js       # CRUD + findByEmail, findByRole
    │   ├── Gallery.js    # CRUD + findByOwner
    │   ├── Event.js      # CRUD + findByToken, findByGalleryIds
    │   ├── Photo.js      # CRUD + findByEvent, countByEventIds, bulkCreate, bulkDelete
    │   ├── Order.js      # CRUD + findAll
    │   ├── Settings.js   # CRUD + findByOwner, findByBranch
    │   ├── Terms.js      # CRUD + findByOwner
    │   ├── Visit.js      # create + findByEventIds
    │   └── UserEvent.js  # CRUD + findByUser, findByEventIds, check, bulkDelete
    ├── controllers/      # Request handlers
    │   ├── authController.js      # register (+ email), login (JWT), confirm-email, getMe
    │   ├── userController.js      # getAll, getByIds, getByRole, update, delete
    │   ├── galleryController.js   # CRUD
    │   ├── eventController.js     # CRUD + getByToken, getByGalleryIds
    │   ├── photoController.js     # CRUD + upload (multer), bulkCreate, bulkDelete
    │   ├── orderController.js     # getAll, create, update
    │   ├── settingsController.js  # CRUD + getByOwner, getByBranch
    │   ├── termsController.js     # CRUD + getByOwner
    │   ├── visitController.js     # create + getByEventIds
    │   └── userEventController.js # CRUD + getByUser, getByEventIds, check, bulkDelete
    ├── middlewares/
    │   └── auth.js       # generateToken, checkToken (Bearer JWT), checkRole (RBAC)
    ├── helpers/
    │   ├── utils.js      # generateId (nano-id style), generateToken
    │   ├── mail.js       # sendConfirmationEmail (HTML template, Nodemailer SMTP)
    │   └── seed.js       # Seeds admin, photographer, settings, terms, sample gallery/event/photos
    └── routes/
        └── api.js        # All API routes (50+ endpoints, public + protected)
```

## API Endpoints

All routes are prefixed with `/api`.

### Public

| Method | Path | Description |
|---|---|---|
| POST | `/auth/register` | Register new user (sends confirmation email) |
| POST | `/auth/login` | Login (returns JWT token, 7-day expiry) |
| GET | `/auth/confirm-email/:token` | Confirm email address |
| GET | `/events/by-token/:token` | Get event by shareable token |
| GET | `/photos/by-event/:eventId` | Get photos for an event |
| GET | `/settings` | Get all settings |
| GET | `/settings/:id` | Get settings by ID |
| GET | `/settings/branch/:branchName` | Get settings by branch name |
| GET | `/terms/:id` | Get terms by ID |
| POST | `/visits` | Record an event visit |

### Protected (requires JWT)

| Method | Path | Roles | Description |
|---|---|---|---|
| GET | `/auth/me` | Any | Get current user |
| GET/PUT/DELETE | `/users/*` | Admin/Photographer | User management |
| GET/POST/PUT/DELETE | `/galleries/*` | Photographer+ | Gallery CRUD |
| GET/POST/PUT/DELETE | `/events/*` | Photographer+ | Event CRUD |
| POST | `/photos/upload` | Photographer+ | Upload photos (multipart) |
| POST/PUT/DELETE | `/photos/*` | Photographer+ | Photo management |
| GET/POST/PUT | `/orders/*` | Any/Photographer+ | Order management |
| PUT | `/settings/*` | Photographer+ | Update settings |
| PUT | `/terms/*` | Photographer+ | Update terms |
| GET/POST/DELETE | `/user-events/*` | Any | User-event links |

## Database

9 tables defined in `db/api.sql`: `users`, `galleries`, `events`, `photos`, `user_events`, `orders`, `settings`, `terms`, `visits`. All foreign keys use `ON DELETE CASCADE`.

## Seeding

On first start, `seed.js` creates:
- **Photographer** account: `admin@lens.com` / `admin`
- **Super Admin** account: `superadmin@lens.com` / `superadmin`
- Default settings (Sky Blue theme, branch name `ms78_visuals`)
- Default terms (placeholder content)
- Sample gallery with one event and demo photos