FROM python:3.9.9-slim-buster
WORKDIR /app

RUN apt-get update && apt-get install -y libsndfile1 && apt install -y ffmpeg

COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN rm -f .env

EXPOSE 8080

CMD ["python", "server.py"]