# Запуск

server:

```bash
cd server
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

# установка зависимостей
pip install -r requirements.txt

# предобработка данных
python preprocess.py 
# запуск сервера
uvicorn server.main:app --reload
```

client:

```bash
cd client
# установка зависимостей
npm install 
# запуск клиента в режиме разработки
npm run dev 
```
