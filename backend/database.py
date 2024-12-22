
import sqlite3
DATABASE_NAME = 'transcription.db'

def load_database():
    # Connect to the SQLite database
    conn = sqlite3.connect(DATABASE_NAME)
    c = conn.cursor()
    try:
        # Create the transcriptions table if it doesn't exist
        c.execute('''CREATE TABLE IF NOT EXISTS transcriptions
                    (id INTEGER PRIMARY KEY, 
                     filename TEXT, 
                     transcript TEXT, 
                     language TEXT,
                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
                    ''')
        # Commit the changes and close the connection
        conn.commit()
        conn.close()
    except sqlite3.Error as e:
        # Print and raise any errors that occur
        print('error', e)
        raise e

def save_transcription(filename, transcript, language="en"):
    # Connect to the SQLite database
    conn = sqlite3.connect(DATABASE_NAME)
    c = conn.cursor()
    try:
        # Insert the transcription into the transcriptions table
        c.execute('INSERT INTO transcriptions (filename, transcript, language) VALUES (?, ?, ?)', (str(filename), str(transcript), str(language)))
        # Commit the changes and close the connection
        conn.commit()
        conn.close()
    except sqlite3.Error as e:
        # Print and raise any errors that occur
        print('error', e)
        raise e
    

def get_transcriptions():
    # Connect to the SQLite database
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()

    try:
        # Select all records from the transcriptions table
        cursor.execute("SELECT * FROM transcriptions")
        # Fetch all the results
        transcriptions = cursor.fetchall()
        # Close the connection
        conn.close()
    except sqlite3.Error as e:
        # Print and raise any errors that occur
        print('error', e)
        raise e

    # Return the fetched transcriptions
    return transcriptions

def search_transcriptions(query):
    # Connect to the SQLite database
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()
    try:
        # Select records from the transcriptions table where the filename matches the query
        cursor.execute("SELECT * FROM transcriptions WHERE filename LIKE ?", ('%' + query + '%',))
        # Fetch all the matching results
        results = cursor.fetchall()
        # Close the connection
        conn.close()
    except sqlite3.Error as e:
        # Print and raise any errors that occur
        print('error', e)
        raise e

    # Return the fetched results
    return results

def delete_transcription(query):
    # Connect to the SQLite database
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()
    try:
        # Delete records from the transcriptions table where the filename matches the query
        cursor.execute("DELETE FROM transcriptions WHERE filename LIKE ?", ('%' + query + '%',))
        # Commit the changes and close the connection
        conn.commit()
        conn.close()
    except sqlite3.Error as e:
        # Print and raise any errors that occur
        print('error', e)
        raise e


