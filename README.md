
# SoilSense – Google Earth Engine Vegetation Index Calculator





## 📌 Overview

SoilSense is a full-stack web application that allows users to:

- Select an area on an interactive map.
- Calculate vegetation and water indices:
    - NDVI (Normalized Difference Vegetation Index)
    - NDMI (Normalized Difference Moisture Index)
    - NDSI (Normalized Difference Snow Index)
    - GCI (Green Chlorophyll Index)
    - EVI (Enhanced Vegetation Index)
    - AWEI (Automated Water Extraction Index)
    - LST (Land Surface Temperature)
- View results as interactive graphs and interpretive summaries.
- Save and revisit past calculations.

The project is divided into two main parts:

- Backend – Node.js + Express API
- Frontend – React.js client interface

## 📂 Folder Structure

project-root/

├── backend/ 

├── frontend/

├── .gitignore

├── requirements.txt

└── README.md # Project documentation

---

## 🛠 Prerequisites
- **Node.js** → v16 or later  
- **Python** → 3.9 or later  
- **MongoDB** → Local or MongoDB Atlas  
- **Google Earth Engine** → Account + Service Account credentials  

---

## ⚙️ Environment Setup

Create a `.env` file **inside the `backend/` folder** with the following variables:

```env
GOOGLE_APPLICATION_CREDENTIALS=./<your_service_account_json>.json
GEE_PROJECT_ID=<your_gee_project_id>
EARTHENGINE_INIT_MODE=localhost
JWT_SECRET=<your_secret_key>
MONGO_URI=<your_mongo_connection_string>
```
## 🚀 Backend Setup

### Navigate to backend folder
```cd backend```

### Install backend dependencies
```npm install express cors mongoose bcryptjs jsonwebtoken express-validator dotenv```

### Install Python dependencies for Google Earth Engine
```pip install -r ../requirements.txt```

### Start backend server
```node index.js```

## 🎨 Frontend Setup

### Navigate to frontend folder
```cd frontend```

### Install frontend dependencies
```npm install```

### Start React development server
```npm start```
## 🌍 Google Earth Engine Setup

- Create a Service Account in your Google Cloud Console for your GEE project.
- Download the JSON key file for the service account.
- Place the file in the project root.
- Update ```.env``` in ```backend/``` with:
    - Path to the JSON file (GOOGLE_APPLICATION_CREDENTIALS)
    - Your GEE Project ID (GEE_PROJECT_ID)
## ▶ Running the Project

- Start MongoDB (local or Atlas).
- Start the backend:
```
cd backend
node index.js
```
- Start the frontend
```
cd frontend
npm start
```
- Open the app in your browser : http://localhost:3000
