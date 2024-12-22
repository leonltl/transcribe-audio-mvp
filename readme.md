
# Project Name

## Overview
The assignment is built using NextJS as the frontend service and Flask Framework for the backend service. The services are containerized using Docker and orchestrated with Docker Compose. The main aim of the assignment is to allow uploading of Audio (in mp3 format) and display the transcript of the audio. For simplicity sake, the database used to store the transcript is Sqlite that is created in the backend service. 

## Project Structure

## Backend
The backend built using Flash Framework

### Files
- `database.py`: Handles database interactions and initialise the Sqlite.
- `server.py`: Main server file to run the Flask application.
- `server_test.py`: Contains tests for the server.
- `transcribe.py`: Handles transcription and processing logic.
- `requirements.txt`: Lists the Python dependencies.
- `flask.dockerfile`: Dockerfile for building the backend container.

### Running the Backend
To run the backend service:
```sh
docker-compose up backend
```

## Frontend
The frontend is a Next.js application.

### Files
- `components/`: Contains React components.
- `pages/`: Contains Next.js pages.
- `next.dockerfile`: Dockerfile for building the frontend container.

### Running the Frontend
To run the frontend service:
```sh
docker-compose up frontend
```

### To start both services
```sh
docker-compose up
```
