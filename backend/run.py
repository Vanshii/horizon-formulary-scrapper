from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
from google import genai

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# -----------------------------
# Load cached data and embeddings
# -----------------------------
CACHE_FILE = "data/parsed/formulary.json"
EMBEDDING_FILE = "data/parsed/formulary_embeddings.npz"
VECTOR_DIM = 384

# Load embeddings
npz = np.load(EMBEDDING_FILE, allow_pickle=True)
embeddings = npz["embeddings"]
metadata = npz["metadata"]

# Setup FAISS
index = faiss.IndexFlatL2(VECTOR_DIM)
index.add(embeddings)

# Setup models
sentence_model = SentenceTransformer("all-MiniLM-L6-v2")
client = genai.Client()

print(f"✅ Loaded {len(metadata)} drugs")
print(f"✅ FAISS index ready with {index.ntotal} vectors")

# -----------------------------
# RAG Query Function
# -----------------------------
def query_rag(question, top_k=3):
    q_emb = sentence_model.encode([question], convert_to_numpy=True).astype("float32")
    distances, indices = index.search(q_emb, top_k)
    results = [metadata[i] for i in indices[0]]
    return results, distances[0]

def ask_ai(query, retrieved_data):
    contents = f"""
You are a helpful pharmaceutical assistant. Answer using ONLY the following structured drug data:

{json.dumps(retrieved_data, indent=2)}

Question: {query}

Provide a clear, concise answer. If the data doesn't contain enough information, say so.
"""
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=contents
    )
    return response.text

# -----------------------------
# API Routes
# -----------------------------
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "total_drugs": len(metadata),
        "source": "Horizon Blue Cross Blue Shield Formulary"
    })

@app.route('/api/query', methods=['POST'])
def query():
    try:
        data = request.get_json()
        question = data.get('question', '').strip()
        
        if not question:
            return jsonify({"error": "Question is required"}), 400
        
        # Get relevant drugs
        retrieved_drugs, distances = query_rag(question, top_k=5)
        
        # Get AI answer
        ai_response = ask_ai(question, retrieved_drugs)
        
        # Format response
        return jsonify({
            "question": question,
            "answer": ai_response,
            "relevant_drugs": [
                {
                    **dict(drug),
                    "relevance_score": float(1 / (1 + dist))  # Convert distance to similarity
                }
                for drug, dist in zip(retrieved_drugs, distances)
            ],
            "source_url": "https://www.horizonblue.com/providers/products-programs/pharmacy/pharmacy-programs/preferred-medical-drugs"
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/stats', methods=['GET'])
def stats():
    """Get database statistics"""
    try:
        with open(CACHE_FILE, 'r') as f:
            all_drugs = json.load(f)
        
        categories = {}
        statuses = {}
        
        for drug in all_drugs:
            cat = drug.get('Category', 'Unknown')
            status = drug.get('Drug Status', 'Unknown')
            categories[cat] = categories.get(cat, 0) + 1
            statuses[status] = statuses.get(status, 0) + 1
        
        return jsonify({
            "total_drugs": len(all_drugs),
            "categories": categories,
            "statuses": statuses,
            "source": "Horizon Blue Cross Blue Shield Formulary",
            "source_url": "https://www.horizonblue.com/providers/products-programs/pharmacy/pharmacy-programs/preferred-medical-drugs"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
