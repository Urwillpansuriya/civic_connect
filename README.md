# 🌍 Civic Connect – Smart Civic Complaint Portal (MERN)

Civic Connect is a full-stack MERN application that allows citizens to report civic issues such as road damage, drainage problems, garbage collection, etc.  
The platform helps administrators track, manage, and resolve complaints efficiently using maps, analytics, comments, and notifications.

---

## 🚀 Features

### 👤 User Features
- Submit complaints with image and location
- Map-based complaint visualization
- Comment on complaints
- Like / Upvote complaints
- Track complaint status
- Auto-detected location

### 🧑‍💼 Admin Features
- Admin dashboard with statistics
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

### 📊 Analytics (Ready)
- Status wise stats
- Category trends
- Daily complaint count

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

Backend:
- Node.js
- Express.js
- MongoDB
- JWT Authentication

Other:
- Multer (image upload)
- Cloudinary (optional)
- Chart.js (analytics)

---

## 📂 Project Structure
client/
components/
pages/
utils/

server/
controllers/
models/
routes/
middleware/


---

## ⚙️ Installation

### 1️⃣ Clone repo
git clone https://github.com/yourusername/civic-connect.git

### 2️⃣ Install dependencies
cd client
npm install

cd ../server
npm install

### 3️⃣ Environment variables

Create `.env` in server:
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret

### 4️⃣ Run project

Server:
npm start

Client:
npm start

---

## 🔑 Key Functionalities Implemented

- Complaint CRUD
- Pagination
- Search & filtering
- Comment system
- Comment count aggregation
- Map markers
- Image upload
- Admin status update

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
