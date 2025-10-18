# 🌐 Horizon Formulary Scraper & Query System

An **AI-powered drug formulary scraper and query assistant** that extracts, processes, and answers questions from Horizon BCBSNJ’s formulary data.  
The system scrapes the drug formulary webpage, parses structured data, stores it locally, and allows intelligent querying through a frontend interface.

---

## 🚀 Features

- **Automated Web Scraping:** Extracts and parses formulary data from HTML pages.  
- **AI Query Engine:** Uses Gemini / OpenAI API to answer natural language queries about drugs.  
- **Search Interface:** React + Vite frontend for interactive queries.  
- **Backend Processing:** Python-based scraper and semantic search logic.  
- **Local Storage:** Stores parsed data as JSON and CSV for offline analysis.

---

## 🏗️ Project Structure

HORIZON-FORMULARY-SCRAPER/
│                          
├── backend/                    
│   ├── run.py                   # Main entry point for backend  
│   ├── requirements.txt         # Python dependencies  
│   ├── .env                     # Environment variables (API keys, etc.)  
│   ├── src/                     # Parsing and scraping logic  
│   ├── data/                    # Local data cache  
│   │   ├── preferred_drugs.json  
│   │   └── preferred_drugs.csv  
│   └── page2.html               # Example HTML file used for local scraping  
│
├── frontend/
│   ├── src/                     # React + Vite frontend code  
│   ├── index.html  
│   ├── package.json  
│   └── vite.config.js  
│
└── README.md

---

## ⚙️ Setup Instructions

### 🧩 1. Clone the Repository

- `git clone https://github.com/yourusername/horizon-formulary-scraper.git`
- `cd horizon-formulary-scraper`




**🐍 2. Backend Setup**

- **Go to backend folder**
  - `cd backend`

- **Install dependencies:**
  - `pip install -r requirements.txt`

- **Set up environment variables (temporary):**
  - For Gemini API:
    - `export GEMINI_API_KEY="your_api_key_here"`        # macOS/Linux
    - `set GEMINI_API_KEY=your_api_key_here`             # Windows CMD
  - Alternatively, create a `.env` file in the backend folder:
    - `GEMINI_API_KEY=your_api_key_here`

---

**⚛️ 4. Frontend Setup (React + Vite)**

- **Go to backend folder**
  - `cd frontend`
- **Install dependencies:**
  - `npm install`
- **Start the server:**
  - `npm run dev`

Then open the displayed local URL (usually `http://localhost:5173/`) in your browser.


**🧰 Example Commands**

- **Run backend:**
  - `python run.py`

- **Run frontend:**
  - `npm run dev`

- **Check API key:**
  - macOS/Linux: `echo $GEMINI_API_KEY`
  - Windows PowerShell: `echo $env:GEMINI_API_KEY`

---

**🧭 Environment Variables**

| Variable        | Description                  | Example           |
|-----------------|-----------------------------|-----------------|
| GEMINI_API_KEY  | API key for Google Gemini    | AIzaSyDxxxxxxx  |
| OPENAI_API_KEY  | (Optional) OpenAI API key   | sk-xxxxxx       |

---

**🧱 Example Response Flow**

| Step | Component | Action |
|------|----------|--------|
| 1    | Frontend | User enters drug query |
| 2    | Backend  | Fetches embeddings and formulary data |
| 3    | AI Engine | Generates response using Gemini/OpenAI |
| 4    | Frontend | Displays answer neatly |

---

**🚧 Extending to Production**

To move this system into a production-grade service, you can:

- ✅ Use FastAPI or Flask for a persistent backend API  
- ✅ Host the model on Google Cloud Run or AWS Lambda  
- ✅ Store data in a vector database (e.g., Pinecone, Chroma, FAISS server)  
- ✅ Add authentication & rate limiting for secure API access  
- ✅ Deploy frontend via Vercel or Netlify  
- ✅ Integrate real-time scraping or scheduled updates via Celery + Redis

---

**🧑‍💻 Author**

Vanshika Dahiya  
AI Engineer — Horizon Formulary Scraper Project

---

**🪪 License**

This project is for educational and research purposes only.  
All scraped content belongs to their respective sources.
