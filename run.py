# run.py
import os
import json
import pandas as pd
from bs4 import BeautifulSoup
from src.scraper import parser
from google import genai

# -----------------------------
# Step 0: Setup Gemini Client
# -----------------------------
# Make sure your GEMINI_API_KEY is set in your environment variables
# Example in PowerShell: $env:GEMINI_API_KEY="your_key_here"
client = genai.Client()

def ask_ai(query, context_data):
    """
    Send question + structured drug data to Gemini LLM
    """
    contents = f"Answer the following question using the data: {json.dumps(context_data)}\nQuestion: {query}"
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=contents
    )
    return response.text

# -----------------------------
# Step 1: Read HTML from local file
# -----------------------------
html_file = "page2.html"
with open(html_file, "r", encoding="utf-8") as f:
    html = f.read()

print("✅ HTML file loaded successfully.")
print(f"HTML length: {len(html)} characters")

# Quick keyword check
if "drug" in html.lower():
    print("🔍 Found 'drug' keyword in HTML")
else:
    print("⚠️ 'drug' keyword not found in HTML")

# -----------------------------
# Step 2: Parse HTML
# -----------------------------
soup = BeautifulSoup(html, "html.parser")
print(f"Soup title: {soup.title.string if soup.title else 'No title found'}")

drugs = parser.parse_drug_table(html)
print(f"✅ Parsed {len(drugs)} drugs successfully!")



if len(drugs) == 0:
    tables = soup.find_all("table")
    print(f"Found {len(tables)} tables in HTML")
    for i, table in enumerate(tables):
        print(f"\n--- Table {i} ---\n", table.prettify()[:500])

# Optional: show first 5 entries
print(drugs[:5])

# -----------------------------
# Step 3: Save structured data
# -----------------------------
df = pd.DataFrame(drugs)
df.to_csv("preferred_drugs.csv", index=False)
df.to_json("preferred_drugs.json", orient="records", indent=2)
print("✅ Structured data saved to CSV and JSON")


with open("preferred_drugs.json", "r", encoding="utf-8") as f:
    context_data = json.load(f)

# -----------------------------
# Step 4: AI-Powered Query Loop
# -----------------------------
print("\n💬 AI-Powered Query System Ready!")
print("Type 'exit' to quit.\n")

while True:
    query = input("Enter your question: ").strip()
    if query.lower() == "exit":
        print("Exiting AI query system. Goodbye! 👋")
        break

    try:
        answer = ask_ai(query, context_data)
        print("\n📝 AI Response:\n", answer, "\n")
    except Exception as e:
        print("❌ Error querying Gemini LLM:", e)
