import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = "gemini-2.5-flash"

client = genai.Client(api_key=API_KEY)
chat = client.chats.create(model=GEMINI_MODEL)

print(chat.get_history())

prompt = input("Esperando prompt: ")

while prompt != "fim":
    response = chat.send_message(prompt)
    print(response.text)
    prompt = input("Esperando prompt: ")

print("teste")