# Horizon Formulary Scraper – Technologies, Rationale, and Alternatives

This document explains the tools, libraries, and technologies used in the **Horizon Formulary Scraper & Query System**, along with the reasons for choosing them and alternatives considered.

---

## Backend

### Python
- **Why:** Python is versatile, has excellent libraries for web scraping, data processing, and AI integration.
- **Use:** Core backend language for scraping, parsing, and semantic search.
- **Alternatives Considered:**
  - **Node.js:** Good for asynchronous requests but lacks mature AI and data libraries like Pandas and FAISS.
  - **Java:** More verbose, not ideal for rapid prototyping.

### BeautifulSoup4
- **Why:** Powerful library for parsing HTML and extracting structured data.
- **Use:** Parsing formulary HTML pages to extract drug information.
- **Alternatives Considered:**
  - **lxml:** Faster, but less beginner-friendly and more complex for HTML parsing.
  - **Selenium:** Overhead-heavy for static HTML scraping.

### Requests
- **Why:** Simple and reliable HTTP library to fetch web pages.
- **Use:** Downloading HTML pages from the formulary website.
- **Alternatives Considered:**
  - **urllib:** Built-in but more verbose and lower-level.
  - **aiohttp:** Asynchronous, useful for large-scale scraping but unnecessary for small scale.

### Pandas & NumPy
- **Why:** Efficient libraries for data manipulation and numerical operations.
- **Use:** Storing, processing, and transforming drug data into CSV/JSON formats.
- **Alternatives Considered:**
  - **Pure Python lists/dictionaries:** Less efficient for large datasets.
  - **SQL database:** Overhead unnecessary for small offline data cache.

### FAISS (Facebook AI Similarity Search)
- **Why:** High-performance library for vector similarity search.
- **Use:** Creating embeddings of drug information to enable fast semantic search.
- **Alternatives Considered:**
  - **Annoy:** Simpler, but FAISS is more accurate and faster for large embeddings.
  - **ElasticSearch:** Heavyweight solution; FAISS is sufficient for local use.

### OpenAI / Google Gemini API
- **Why:** State-of-the-art LLM APIs for natural language understanding. Gemini was chosen because it offers a free tier with a good token limit, making it more practical for this project compared to OpenRouter, which had stricter token limits.
- **Use:** Answering user queries about drugs intelligently.
- **Alternatives Considered:**
  - **Custom trained model:** Resource-heavy, requires large dataset and GPU.
  - **Other open-source LLMs (LLaMA, Falcon):** Can work locally but requires complex deployment.
  - **OpenRouter API:** Limited token quota made it less suitable for this project.

### Python-dotenv
- **Why:** Manages environment variables securely.
- **Use:** Storing API keys without exposing them in code.

---

## Frontend

### React
- **Why:** Modern, component-based framework for building interactive UIs.
- **Use:** Creating the query interface for users.
- **Alternatives Considered:**
  - **Vue.js:** Also good, but React is more popular in enterprise projects.
  - **Angular:** Overkill for small, lightweight frontend.

### Vite
- **Why:** Fast frontend build tool with hot module replacement.
- **Use:** Development and bundling of the frontend code.
- **Alternatives Considered:**
  - **Webpack:** Powerful but slower and more configuration-heavy.
  - **Parcel:** Easy but Vite is faster for React projects.

### Axios
- **Why:** Promise-based HTTP client for the browser.
- **Use:** Sending requests from frontend to backend API.
- **Alternatives Considered:**
  - **Fetch API:** Built-in, but Axios simplifies requests and error handling.

### Lucide-react
- **Why:** Lightweight icon library.
- **Use:** Adding intuitive icons for UI/UX.
- **Alternatives Considered:**
  - **FontAwesome:** Heavier and requires extra setup.
  - **Material Icons:** Larger bundle, more design-heavy.

### TailwindCSS
- **Why:** Utility-first CSS framework for responsive and clean designs.
- **Use:** Styling the frontend quickly and efficiently.
- **Alternatives Considered:**
  - **Bootstrap:** Works, but less flexible for modern UI designs.
  - **Material-UI:** More components but heavier bundle.

---

## Why These Choices
- **Python backend:** Ideal for scraping, AI, and data processing.
- **React frontend:** Provides fast, interactive interface.
- **APIs like Gemini/OpenAI:** Enable natural language queries without building a model from scratch.
- **FAISS:** Efficient semantic search for large drug datasets.
- **Tailwind + Lucide:** Make the UI clean and intuitive with minimal effort.
