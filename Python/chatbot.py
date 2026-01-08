import os
import sqlite3
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = "gemini-2.5-flash"
DB_NAME = "chat_history.db"

app = Flask(__name__)
CORS(app)

client = genai.Client(api_key=API_KEY)

def init_db():
    """Cria a tabela de histórico se não existir."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def save_message(role, content):
    """Salva uma mensagem no banco de dados."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO history (role, content, timestamp)
        VALUES (?, ?, ?)
    ''', (role, content, datetime.now()))
    conn.commit()
    conn.close()

def get_formatted_history():
    """Recupera o histórico formatado para o Gemini."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('SELECT role, content FROM history ORDER BY timestamp ASC')
    rows = cursor.fetchall()
    conn.close()
    
    history_list = []
    for role, content in rows:
        history_list.append({"role": role, "parts": [{"text": content}]})
    return history_list

def clear_db():
    """Apaga todas as mensagens do banco de dados."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    # Apaga todos os registros da tabela history
    cursor.execute('DELETE FROM history')
    # Opcional: Reseta o contador de IDs para começar do 1 novamente
    cursor.execute('DELETE FROM sqlite_sequence WHERE name="history"')
    conn.commit()
    conn.close()

init_db()

@app.route('/history', methods=['GET'])
def get_history():
    """Rota para o React carregar as mensagens antigas ao abrir a tela."""
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row # Permite acessar colunas por nome
    cursor = conn.cursor()
    cursor.execute('SELECT role, content, timestamp FROM history ORDER BY timestamp ASC')
    rows = cursor.fetchall()
    conn.close()

    # Converte para lista de dicionários (JSON)
    messages = [dict(row) for row in rows]
    return jsonify(messages)

@app.route('/history', methods=['DELETE'])
def delete_history():
    """Rota para limpar o histórico completo."""
    try:
        clear_db()
        return jsonify({"message": "Histórico apagado com sucesso!"}), 200
    except Exception as e:
        print(f"Erro ao limpar banco: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/chat', methods=['POST'])
def send_message():
    """Rota que recebe a mensagem do usuário e retorna a resposta do Gemini."""
    data = request.json
    user_message = data.get('message')

    if not user_message:
        return jsonify({"error": "Mensagem vazia"}), 400

    try:
        # 1. Carrega o histórico ATUAL do banco (sem a mensagem nova ainda)
        # Isso serve de contexto para o Gemini
        current_history = get_formatted_history()
        
        # 2. Instancia o chat com a memória do banco
        chat = client.chats.create(model=GEMINI_MODEL, history=current_history)

        # 3. Envia a nova mensagem para a IA
        response = chat.send_message(user_message)

        # 4. Se deu certo, salva AMBOS no banco (User e Model)
        # Salvamos apenas agora para garantir que não salvamos msg sem resposta se der erro
        save_message("user", user_message)
        save_message("model", response.text)

        return jsonify({
            "response": response.text,
            "role": "model"
        })

    except Exception as e:
        print(f"Erro: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Roda o servidor na porta 5000
    app.run(debug=True, port=5000)

# loaded_history = get_formatted_history()

# if loaded_history:
#     print("\n" + "="*50 + " Histórico Anterior " + "="*50)
#     for msg in loaded_history: 
#         role_label = "Você" if msg["role"] == "user" else "Gemini"

#         content_text = msg["parts"][0]["text"]
#         print(f"{role_label}: {content_text}")
#     print("-"*100 + "\n")

# chat = client.chats.create(model=GEMINI_MODEL, history=loaded_history)

# print("Chat iniciado! Digite 'fim' para encerrar.")

# prompt = input("Esperando prompt: ")

# while prompt.lower() != "fim":
#     save_message("user", prompt)

#     try:
#         response = chat.send_message(prompt)
        
#         print(f"Gemini: {response.text}")
#         save_message("model", response.text)

#     except Exception as e:
#         print(f"Erro na comunicação: {e}")

#     print("-"*100 + "\n")
#     prompt = input("Esperando prompt: ")

# print("Chat encerrado e salvo")