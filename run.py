# run.py
import os
import json
import numpy as np
import pandas as pd
from bs4 import BeautifulSoup
from src.scraper import parser
from google import genai  # Gemini LLM
import faiss
from sentence_transformers import SentenceTransformer

# -----------------------------
# Paths & Settings
# -----------------------------
HTML_FILE = "page2.html"
CACHE_FILE = "data/parsed/formulary.json"
EMBEDDING_FILE = "data/parsed/formulary_embeddings.npz"
VECTOR_DIM = 384  # for all-MiniLM-L6-v2
os.makedirs(os.path.dirname(CACHE_FILE), exist_ok=True)

# -----------------------------
# Step 0: Setup AI Clients
# -----------------------------
# Gemini Client
client = genai.Client()  # GEMINI_API_KEY in environment

# -----------------------------
# Step 1: Load / Cache HTML data
# -----------------------------
def load_or_parse_html(html_file):
    try:
        with open(html_file, "r", encoding="utf-8") as f:
            html = f.read()
        print(f"✅ HTML loaded: {len(html)} chars")
    except Exception as e:
        print("❌ Failed to read HTML:", e)
        return []

    drugs = parser.parse_drug_table(html)
    print(f"✅ Parsed {len(drugs)} drugs")

    # Save cache
    os.makedirs(os.path.dirname(CACHE_FILE), exist_ok=True)
    with open(CACHE_FILE, "w", encoding="utf-8") as f:
        json.dump(drugs, f, indent=2)
    print(f"✅ Cached JSON at {CACHE_FILE}")
    return drugs

# -----------------------------
# Step 2: Load cached JSON
# -----------------------------
if os.path.exists(CACHE_FILE):
    with open(CACHE_FILE, "r", encoding="utf-8") as f:
        context_data = json.load(f)
    print(f"✅ Loaded cached JSON ({len(context_data)} entries)")
else:
    context_data = load_or_parse_html(HTML_FILE)

# -----------------------------
# Step 3: Generate or load embeddings
# -----------------------------
def generate_embeddings(data):
    print("🔍 Generating embeddings (local, free)...")
    model = SentenceTransformer("all-MiniLM-L6-v2")
    texts = [
        f"{d['Drug Name']} {d['HCPCS']} {d['Category']} {d['Drug Status']}"
        for d in data
    ]
    embeddings = model.encode(texts, convert_to_numpy=True)
    metadata = np.array(data, dtype=object)
    np.savez(EMBEDDING_FILE, embeddings=embeddings, metadata=metadata)
    print(f"✅ Saved embeddings to {EMBEDDING_FILE}")
    return embeddings, metadata

if os.path.exists(EMBEDDING_FILE):
    npz = np.load(EMBEDDING_FILE, allow_pickle=True)
    embeddings = npz["embeddings"]
    metadata = npz["metadata"]
    print(f"✅ Loaded cached embeddings ({len(metadata)})")
else:
    embeddings, metadata = generate_embeddings(context_data)

# -----------------------------
# Step 4: Setup FAISS
# -----------------------------
index = faiss.IndexFlatL2(VECTOR_DIM)
index.add(embeddings)
print(f"✅ FAISS index built with {index.ntotal} vectors")

def query_rag(question, top_k=3):
    # 1️⃣ Embed the query using local model
    model = SentenceTransformer("all-MiniLM-L6-v2")
    q_emb = model.encode([question], convert_to_numpy=True).astype("float32")

    # 2️⃣ Search top-k relevant drugs
    distances, indices = index.search(q_emb, top_k)
    results = [metadata[i] for i in indices[0]]
    return results

# -----------------------------
# Step 5: AI-powered Question Loop
# -----------------------------
def ask_ai(query, retrieved_data):
    contents = f"""
    You are a helpful assistant. Answer using ONLY the following structured drug data:

    {json.dumps(retrieved_data)}

    Question: {query}
    """
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=contents
    )
    return response.text

print("\n💬 AI-Powered Query System Ready! Type 'exit' to quit.\n")
while True:
    query = input("Enter your question: ").strip()
    if query.lower() == "exit":
        print("👋 Goodbye!")
        break

    try:
        retrieved = query_rag(query)
        answer = ask_ai(query, retrieved)
        print("\n📝 AI Response:\n", answer, "\n")
    except Exception as e:
        print("❌ Error:", e)
