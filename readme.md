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

### Running the Backend without Docker
To run the backend service without Docker:

1. Navigate to the backend directory:
    ```sh
    cd path/to/backend
    ```

2. Create a virtual environment:
    ```sh
    python3 -m venv .venv
    ```

3. Activate the virtual environment:
    - On macOS and Linux:
        ```sh
        source .venv/bin/activate
        ```
    - On Windows:
        ```sh
        .venv\Scripts\activate
        ```

4. Install the dependencies:
    ```sh
    pip install -r requirements.txt
    ```

5. Run the Flask server:
    ```sh
    python server.py
    ```

### Running the unit test for Backend
To run the unit tests for the backend service:

1. Ensure you are in the backend directory:
    ```sh
    cd path/to/backend
    ```

2. Run the tests using the following command:
    ```sh
    python server_test.py
    ```

### Running the Backend using Docker
To run the backend service:
```sh
docker compose up backend
```

## Frontend
The frontend is a Next.js application.

### Files
- `components/`: Contains React components.
- `pages/`: Contains Next.js pages.
- `next.dockerfile`: Dockerfile for building the frontend container.
- `__test__/`: Unit test of the component and api  

### Running the Frontend without Docker
To run the frontend service without Docker:

1. Navigate to the frontend directory:
    ```sh
    cd path/to/frontend
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Build the application:
    ```sh
    npm run build
    ```

4. Start the Next.js server:
    ```sh
    npm run start
    ```

### Running the unit test for Frontend
To run the unit tests for the frontend service:

1. Ensure you are in the frontend directory:
    ```sh
    cd path/to/frontend
    ```

2. Run the tests using the following command:
    ```sh
    npm run test
    ```

### Running the Frontend using Docker
To run the frontend service:
```sh
docker compose up frontend
```

## To build Frontend and Backend services
```sh
docker compose -f docker-compose.yml build
```

## To start Frontend and Backend services
```sh
docker compose docker-compose.yml up
```
