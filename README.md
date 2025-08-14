# SoilSense – Google Earth Engine Vegetation Index Calculator

## 📌 Overview
**SoilSense** is a full-stack web application that allows users to:
- Select an area on an interactive map.
- Calculate vegetation and water indices:
  - **NDVI** (Normalized Difference Vegetation Index)  
  - **NDMI** (Normalized Difference Moisture Index)  
  - **NDSI** (Normalized Difference Snow Index)  
  - **GCI** (Green Chlorophyll Index)  
  - **EVI** (Enhanced Vegetation Index)  
  - **AWEI** (Automated Water Extraction Index)  
  - **LST** (Land Surface Temperature)  
- View results as interactive graphs and interpretive summaries.
- Save and revisit past calculations.

The project is divided into two main parts:
- **Backend** – Node.js + Express API  
- **Frontend** – React.js client interface  

---

## 📂 Folder Structure

project-root/
│
├── backend/ # Node.js + Express API
├── frontend/ # React.js frontend
├── .gitignore
├── requirements.txt # Python dependencies for GEE calculations
└── README.md # Project documentation


---

## 🛠 Prerequisites
- **Node.js** (v16+ recommended)  
- **Python 3.9+**  
- **MongoDB** (Local or Atlas)  
- **Google Earth Engine** account + Service Account credentials  

---

## ⚙️ Environment Variables
Create a `.env` file **inside the `backend/` folder** with the following content:

```env
GOOGLE_APPLICATION_CREDENTIALS=./<your_service_account_json>.json
GEE_PROJECT_ID=<your_gee_project_id>
EARTHENGINE_INIT_MODE=localhost
JWT_SECRET=<your_secret_key>
MONGO_URI=<your_mongo_connection_string>

Notes:

    The <your_service_account_json>.json file must be placed in the project root, alongside the backend/ and frontend/ folders.

    Do NOT commit this JSON file to GitHub.

    Replace <...> placeholders with your actual values.

🚀 Backend Setup

# Navigate to backend folder
cd backend

# Install backend dependencies
npm install express cors mongoose bcryptjs jsonwebtoken express-validator dotenv

# Install Python packages for GEE
pip install -r requirements.txt

# Start backend server
npm start

🎨 Frontend Setup

# Navigate to frontend folder
cd frontend

# Install frontend dependencies
npm install

# Start React app
npm start

🌍 Google Earth Engine Setup

    Create a Service Account in your GEE project.

    Download the JSON key file for the service account.

    Place it in the project root (not inside backend or frontend).

    Update .env in backend/ with:

        Path to the JSON file.

        GEE Project ID.

📄 .gitignore

Your .gitignore should include:

# Node.js
node_modules/
.env

# Python
__pycache__/
*.pyc

# Credentials
*.json

▶ Running the Project

    Start MongoDB (local or connect to Atlas).

    Start the backend:

cd backend
npm start

Start the frontend:

cd frontend
npm start

Open the app in your browser: http://localhost:3000
