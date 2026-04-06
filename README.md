# 🌍 Civic Connect – Smart Civic Complaint Portal (MERN)

Civic Connect is a full-stack MERN application that allows citizens to report civic issues such as road damage, drainage problems, garbage collection, etc.  
The platform helps administrators track, manage, and resolve complaints efficiently using maps, real-time analytics, comments, and notifications.

---

## 🚀 Features

### 👤 User Features
- Submit complaints with image (uploaded to Cloudinary) and location
- Map-based complaint visualization
- Comment on complaints
- Like / Upvote complaints
- Track complaint status
- Auto-detected location

### 🧑‍💼 Admin Features
- Admin dashboard with statistics
- **Real-time analytics charts** (complaints per day + status breakdown) via Socket.io
- Search & filter complaints
- Comment count per complaint
- Change complaint status
- Category management
- Export complaints (PDF/Excel ready)

### 🗺 Map Features
- Leaflet map integration
- Pin complaints on map
- Popup with complaint details
- Heatmap ready structure

### 📊 Analytics (Live)
- Status-wise stats (Pending / In-Progress / Resolved / Rejected)
- Daily complaint count with 7-day / 30-day toggle
- Both charts auto-refresh via Socket.io when complaints change

### 🖼 Image Upload
- Images uploaded directly to **Cloudinary**
- Full Cloudinary URL stored in MongoDB
- Optional `imagePublicId` stored for future Cloudinary deletion
- Deleted complaints also remove their Cloudinary image

---

## 🖼 Screenshots

### 📍 Map View
<img width="1918" height="916" alt="image" src="https://github.com/user-attachments/assets/cd759230-f526-443e-87a7-d7b3ba65e728" />

### 📊 Dashboard Overview
<img width="1897" height="915" alt="image" src="https://github.com/user-attachments/assets/d8b2bfc5-9220-4734-9017-3bbf597844a3" />

### 💬 Complaint Comments
<img width="721" height="557" alt="Screenshot 2025-09-22 104844444" src="https://github.com/user-attachments/assets/9c836c48-e908-4a58-99f2-83ebc3826b28" />

### 🧾 Complaint List
<img width="1358" height="805" alt="image" src="https://github.com/user-attachments/assets/ad0691dc-53d2-4a73-b34a-1bfade1a1bae" />

### ➕ Submit Complaint
<img width="665" height="834" alt="image" src="https://github.com/user-attachments/assets/5d625d55-8c1d-4eec-a8c8-372886079a5b" />


---

## 🛠 Tech Stack

Frontend:
- React.js
- Axios
- React Router
- Leaflet
- Recharts (charts)
- Socket.io-client (real-time updates)

Backend:
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Socket.io (WebSocket events)
- Cloudinary (image storage)
- Multer + multer-storage-cloudinary (upload middleware)

---

## 📂 Project Structure
```
civic_connect/
├── backend/
│   ├── config/cloudinary.js      # Cloudinary SDK config
│   ├── controllers/
│   ├── middleware/upload.js       # Multer + Cloudinary storage
│   ├── models/
│   ├── routes/analytics.js       # /api/analytics endpoints
│   └── server.js                 # Express + Socket.io server
└── frontend/
    ├── src/
    │   ├── components/AdminCharts.js  # Real-time admin charts
    │   └── pages/
```

---

## ⚙️ Installation

### 1️⃣ Clone repo
```bash
git clone https://github.com/Urwillpansuriya/civic_connect.git
```

### 2️⃣ Install dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3️⃣ Environment variables

**Backend** – create `backend/.env` (never commit this file):

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# Cloudinary – get these from https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS – comma-separated list of allowed frontend origins
# Leave blank during local dev to allow all origins
CORS_ORIGIN=https://your-app.vercel.app
```

**Frontend** – create `frontend/.env` (optional):

```env
# Override the default backend URL
REACT_APP_API_URL=https://your-backend.onrender.com
```

### 4️⃣ Run project locally

```bash
# Terminal 1 – backend
cd backend && npm run dev

# Terminal 2 – frontend
cd frontend && npm start
```

---

## 🚢 Deployment

### Backend → Render

1. Push code to GitHub.
2. Create a new **Web Service** on [Render](https://render.com).
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
3. Add all environment variables listed above in the Render dashboard
   (Environment → Add Environment Variable).
4. Set `CORS_ORIGIN` to your Vercel frontend URL, e.g.  
   `CORS_ORIGIN=https://civic-connect-xxx.vercel.app`
5. Note the Render URL (e.g. `https://civic-connect-hams.onrender.com`).

### Frontend → Vercel

1. Import the GitHub repo on [Vercel](https://vercel.com).
   - Root directory: `frontend`
   - Framework preset: **Create React App**
2. Add environment variable:  
   `REACT_APP_API_URL=https://civic-connect-hams.onrender.com`
3. Deploy – Vercel will run `npm run build` automatically.
4. Copy the Vercel URL and update `CORS_ORIGIN` on Render.

> **Note:** Socket.io requires WebSocket support. Render Web Services support WebSockets by default. Vercel only hosts static files, so the Socket.io server must remain on Render.

---

## 🔑 Key Functionalities

- Complaint CRUD with Cloudinary image storage
- Pagination & search / filtering
- Comment system
- Real-time admin charts (Socket.io)
- Map markers
- Admin status updates (broadcast via socket)
- Complaint deletion removes Cloudinary image

---

## 🤖 Future ML Enhancements

- Complaint category prediction
- Duplicate complaint detection
- Priority scoring
- Hotspot prediction
- Smart routing for admins

---

## 👨‍💻 Author

Urwill Ashwinbhai Pansuriya

---

## ⭐ If you like this project
Give it a star ⭐
