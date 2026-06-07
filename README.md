# 🎯 Darts Scoreboard

A modern darts scoreboard application built with ASP.NET Core and Angular.

The application allows registered users to manage players, create and play darts games, track scores, and calculate checkouts.

---

## 🚀 Live Demo

Frontend:

https://dartsscore.atpihome.de

Backend API:

https://darts-scoreboard-ns18.onrender.com

---

## ✨ Features

### Authentication

* User registration
* JWT authentication
* Login and logout
* Welcome email after registration
* Forgot password functionality
* Secure password reset via email

### Players

* Create players
* Edit players
* Deactivate players
* User-specific player management

### Games

* Create X01 games
* Track throws
* Automatic score calculation
* Game history
* Active game management
* Checkout helper

### Administration

* User overview
* Player overview
* Game overview

---

## 🛠️ Technology Stack

### Backend

* ASP.NET Core 10
* Entity Framework Core
* PostgreSQL
* JWT Authentication
* Argon2 Password Hashing
* MailKit

### Frontend

* Angular 20
* TypeScript
* SCSS

### Infrastructure

* Render (Backend Hosting)
* Vercel (Frontend Hosting)
* Supabase PostgreSQL
* IONOS SMTP

---

## 📧 Email Features

The application supports transactional emails:

* Welcome emails
* Password reset emails

Password reset tokens:

* Randomly generated
* SHA256 hashed before storage
* Single use only
* Expire after 1 hour

---

## 🔐 Security

* Argon2 password hashing
* JWT authentication
* Password reset token hashing
* CORS protection
* Environment-based configuration

---

## 🖥️ Local Development

### Backend

```bash
dotnet restore
dotnet build
dotnet run --project DartsScoreboard.Api
```

### Frontend

```bash
cd darts-scoreboard-client

npm install

ng serve
```

Frontend:

```text
http://localhost:4200
```

Backend:

```text
https://localhost:5062
```

---

## ⚙️ Environment Variables

The application uses environment variables for sensitive configuration.

Examples:

```text
ConnectionStrings__DefaultConnection
Jwt__Secret
AdminSeed__Password

Email__SmtpHost
Email__SmtpPort
Email__Username
Email__Password

Cors__AllowedOrigins__0
Cors__AllowedOrigins__1
Cors__AllowedOrigins__2
```

---

## 📦 Releases

### v1.0.0

Initial public release.

### v1.0.1

* SMTP email integration
* Welcome emails
* Forgot password functionality
* Password reset via email
* Improved authentication UX

---

## 📄 License

This project is provided for educational and personal use.
