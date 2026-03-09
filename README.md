# Appointment Booking System

A web application where users can book appointments and admins can manage services and approve or reject bookings. 

## Built with
Node.js, Express, PostgreSQL, and vanilla JS with Bootstrap.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Frontend | HTML + Bootstrap + Vanilla JS |
| Auth | JWT |
| Password Hashing | bcrypt |

---

## Features

- User registration and login.
- Role-based access (admin vs user) using JWT.
- Users can create, read, edit, and cancel their own pending appointments.
- Admins can manage services (create, edit, delete) and approve or reject appointments.
- Mobile responsive via Bootstrap 5 grid.


---

## Main parts

### Routes
Route files give the URL patterns and which middleware and controller functions apply to each. They have no logic.

- `auth.routes.js` — public routes for register and login.
- `service.routes.js` — GET is public; POST, PUT, DELETE need admin token.
- `appointment.routes.js` — all routes require a token; GET `/all` and PUT `/:id/status` are admin-only.

### Controllers
Controllers contain all the business logic and database queries.

- `auth.controller.js` — hashes passwords with bcrypt on register, compares on login, and signs a JWT token containing `userId` and `role`.
- `service.controller.js` — standard CRUD for `services` table.
- `appointment.controller.js` — handles booking , fetching a user's own appointments,fetching all appointments for admin, status updates, and deletion.

### Frontend JS
Each page loads one JS file that calls the backend API using `fetch`.

- `auth.js` — handles login and registration form submissions, stores the token and user object in `localStorage` and redirects.
- `dashboard.js` — loads services into the booking dropdown, renders the user's appointments as editable rows, and sends create/update/delete requests.
- `admin.js` — loads all services as editable rows and all appointments with approve/reject buttons.

---

## Database Schema

```sql
users          -- id, name, email, password (hashed), role ('user' or 'admin')
services       -- id, service_name, description, duration_minutes
appointments   -- id, user_id (FK), service_id (FK), appointment_date,
               --   appointment_time, status ('pending','approved','rejected'), notes
```

---



## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | None | Register new user |
| POST | `/api/auth/login` | None | Login, returns JWT |
| GET | `/api/services` | None | List all services |
| POST | `/api/services` | Admin | Create service |
| PUT | `/api/services/:id` | Admin | Update service |
| DELETE | `/api/services/:id` | Admin | Delete service |
| POST | `/api/appointments` | User | Book appointment |
| GET | `/api/appointments/my` | User | Get own appointments |
| GET | `/api/appointments/all` | Admin | Get all appointments |
| PUT | `/api/appointments/:id/status` | Admin | Approve or reject |
| PUT | `/api/appointments/:id` | User | Edit pending appointment |
| DELETE | `/api/appointments/:id` | User/Admin | Cancel appointment |

---



## Default Admin Account

```
Email:    admin@booking.com
Password: admin123
```


