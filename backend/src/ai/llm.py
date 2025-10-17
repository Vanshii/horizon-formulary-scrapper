import os
import json
import openai
from dotenv import load_dotenv

# Load API key from .env
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def ask_ai(query, context_data):
    prompt = f"""
    You are a helpful assistant. 
    Answer the following question using ONLY the given structured drug data.
    
    Data: {json.dumps(context_data)}
    
    Question: {query}
    """

    response = openai.Completion.create(
        model="gpt-4",
        prompt=prompt,
        max_tokens=200,
        temperature=0
    )
    
    return response.choices[0].text.strip()
