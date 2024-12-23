from flask import Flask, request, jsonify   
from flask_cors import CORS

from database import load_database, get_transcriptions, search_transcriptions, save_transcription, delete_transcription
from transcribe import transcribe_audio

app = Flask(__name__)
CORS(app)

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'Healthy'})

@app.route('/api/transcribe', methods=['POST'])
def transcribe():
    # Check if the 'file' key is in the request files
    if 'file' not in request.files:
        return jsonify({'error': 'No audio file uploaded'}), 500
    
    # Get the uploaded file from the request
    file = request.files['file']
    filename = file.filename
    transcript = ""
    language = request.args.get('language')
    if language is None:
        language = 'en'

    # Search for existing transcriptions with the same filename
    #results = search_transcriptions(filename)   
    #if results:
        # Return the filename and transcript as a JSON response
        #return jsonify({'error': 'filename exists'}), 500 
    
    try:
        # Transcribe the audio file
        transcript = transcribe_audio(file, language)
    except Exception as e:
        # Return an error response if transcription fails
        return jsonify({'error': str(e)}), 500

    # Save the new transcription if no existing transcription is found
    #save_transcription(filename, transcript, language)

    # Return the filename and transcript as a JSON response
    return jsonify({'filename': filename, 'transcript': transcript, 'language': language}), 200

@app.route('/api/transcriptions', methods=['GET'])
def get_all_transcriptions():
    
    # Retrieve all transcriptions from the database
    results = get_transcriptions()
    
    # Initialize an empty list to store the transcriptions
    transcriptions = []
    
    # Iterate over the results and format each transcription
    for _, transcription in enumerate(results):
        transcriptions.append({
            'filename': transcription[1],  # Add the filename to the list
            'transcript': transcription[2],  # Add the transcript to the list
            'language': transcription[3],  # Add the language to the list
            'created_at': transcription[4]  # Add the creation date to the list
        })

    # Return the list of transcriptions as a JSON response
    return jsonify(transcriptions), 200

@app.route('/api/search', methods=['GET'])
def search():
    # Get the search query from the request arguments
    query = request.args.get('filename')

    # Search for transcriptions that match the query
    results = search_transcriptions(query)
    
    # Initialize an empty list to store the matching transcriptions
    transcriptions = []
    
    # Iterate over the search results and format each transcription
    for _, transcription in enumerate(results):
        transcriptions.append({
            'filename': transcription[1],  # Add the filename to the list
            'transcript': transcription[2],  # Add the transcript to the list
            'language': transcription[3],  # Add the language to the list
            'created_at': transcription[4]  # Add the creation date to the list
        })

    # Return the list of matching transcriptions as a JSON response
    return jsonify(transcriptions), 200

@app.route('/api/delete', methods=['DELETE'])
def delete():
    # Get the filename from the request arguments
    query = request.args.get('filename')
    
    # Search for transcriptions that match the filename
    results = search_transcriptions(query)
    
    # If no matching transcription is found, return an error response
    if not results:
        return jsonify({'error': 'No such file found'}), 500

    # Delete the transcription with the matching filename
    delete_transcription(query)
    
    # Return a success message as a JSON response
    return jsonify({'message': 'File deleted successfully'}), 200

def load():
    load_database()

if __name__ == '__main__':
    load_database()
    app.run(debug=True, host="0.0.0.0", port=8080)