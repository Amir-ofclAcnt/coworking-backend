# 🏢 Coworking Bokningsplattform – Backend

Detta är en backendapplikation för en bokningsplattform där användare kan registrera sig, logga in och boka arbetsplatser eller konferensrum. Administratörer kan hantera användare, rum och bokningar. Projektet är byggt som en del av ett skolprojekt med Node.js och MongoDB.

## 🚀 Funktioner

### 👥 Användarroller

- **User**: Registrera, logga in, se, skapa, uppdatera och ta bort sina egna bokningar.
- **Admin**: Hantera rum, se alla användare och bokningar, ta bort användarkonton.

### 🧠 Funktionalitet

- JWT-baserad autentisering och rollbaserad auktorisering
- Rumshantering (skapande, uppdatering, borttagning)
- Bokningssystem med krock-kontroll (rum kan inte dubbelbokas)
- Realtidsnotifieringar via Socket.io
- Redis-caching för rum
- Felhantering och loggning

## 🛠️ Teknisk Stack

- **Backend**: Node.js, Express.js
- **Databas**: MongoDB med Mongoose
- **Autentisering**: JWT, bcrypt
- **Caching**: Redis
- **Realtid**: Socket.io
- **Deploy**: Render

## 📦 Installation

1. Klona repot:

   ```bash
   git clone https://github.com/ditt-användarnamn/coworking-booking-backend.git
   cd coworking-booking-backend
   ```

2. Installera beroenden:

   ```bash
   npm install
   ```

3. Skapa en `.env`-fil i root:

   ```
   PORT=5000
   MONGO_URI=mongodb+srv://<ditt-URI>
   JWT_SECRET=hemlig_nyckel
   REDIS_URL=redis://localhost:6379
   ```

4. Starta servern:
   ```bash
   npm run dev
   ```

## 📘 API-dokumentation

### 🔐 Autentisering

#### POST `/api/auth/register`

Registrera en ny användare  
**Body:**

```json
{
  "username": "amir",
  "password": "hemligtLosenord"
}
```

#### POST `/api/auth/login`

Logga in och få en JWT-token  
**Body:**

```json
{
  "username": "amir",
  "password": "hemligtLosenord"
}
```

---

### 🏢 Rum (Endast Admin)

#### POST `/api/rooms`

Skapa ett nytt rum  
**Body:**

```json
{
  "name": "Konferensrum 1",
  "capacity": 8,
  "type": "conference"
}
```

#### GET `/api/rooms`

Hämta alla rum (tillgängligt för alla inloggade användare)

#### PUT `/api/rooms/:id`

Uppdatera ett rum  
**Body:**

```json
{
  "name": "Uppdaterat Rum",
  "capacity": 10,
  "type": "workspace"
}
```

#### DELETE `/api/rooms/:id`

Ta bort ett rum

---

### 📆 Bokningar

#### POST `/api/bookings`

Skapa en ny bokning  
**Body:**

```json
{
  "roomId": "<room_id>",
  "startTime": "2025-04-12T09:00:00Z",
  "endTime": "2025-04-12T11:00:00Z"
}
```

#### GET `/api/bookings`

- **User:** Hämta sina egna bokningar
- **Admin:** Hämta alla bokningar

#### PUT `/api/bookings/:id`

Uppdatera en bokning (endast skapare eller admin)

#### DELETE `/api/bookings/:id`

Ta bort en bokning (endast skapare eller admin)

---

### 🔔 Notifieringar

Realtidsnotifieringar med Socket.io:

- `bookingCreated`
- `bookingUpdated`
- `bookingDeleted`

## 🌐 Deployment

Skapa ett Render-konto (om du inte redan har ett)

Konfigurera miljövariabler (MONGO_URI, JWT_SECRET, REDIS_URL)

Push till GitHub → koppla GitHub-repot till Render

Testa att allt funkar

## 👨‍💼 Utvecklare

- **Amir Husseini** – Fullstack Developer

## 📄 Licens

MIT License – fritt att användas och modifieras.
