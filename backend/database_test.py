import os
import sqlite3
import unittest
from database import load_database, save_transcription, DATABASE_NAME

class TestDatabase(unittest.TestCase):
    def setUp(self):
        # Load the database to ensure the table is created
        load_database()

    def tearDown(self):
        # Remove the database file after tests
        if os.path.exists(DATABASE_NAME):
            os.remove(DATABASE_NAME)

    def test_load_database_creates_table(self):
        # Connect to the database
        conn = sqlite3.connect(DATABASE_NAME)
        c = conn.cursor()
        # Check if the transcriptions table exists
        c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='transcriptions'")
        table_exists = c.fetchone()
        # Close the connection
        conn.close()
        # Assert that the table exists
        self.assertIsNotNone(table_exists)

    def test_save_transcription(self):
        # Save a transcription
        save_transcription('testfile.wav', 'This is a test transcript', 'en')
        # Connect to the database
        conn = sqlite3.connect(DATABASE_NAME)
        c = conn.cursor()
        # Check if the transcription was saved
        c.execute("SELECT * FROM transcriptions WHERE filename='testfile.wav'")
        transcription = c.fetchone()
        # Close the connection
        conn.close()
        # Assert that the transcription was saved
        self.assertIsNotNone(transcription)

    def test_delete_transcription(self):
        # Save a transcription
        save_transcription('testfile.wav', 'This is a test transcript', 'en')
        # Connect to the database
        conn = sqlite3.connect(DATABASE_NAME)
        c = conn.cursor()
        # Delete the transcription
        c.execute("DELETE FROM transcriptions WHERE filename='testfile.wav'")
        conn.commit()
        # Check if the transcription was deleted
        c.execute("SELECT * FROM transcriptions WHERE filename='testfile.wav'")
        transcription = c.fetchone()
        # Close the connection
        conn.close()
        # Assert that the transcription was deleted
        self.assertIsNone(transcription)

if __name__ == '__main__':
    unittest.main()