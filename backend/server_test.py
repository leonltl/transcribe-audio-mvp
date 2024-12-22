import unittest
from unittest.mock import patch
from server import app, load_database

class BackendAppTestCase(unittest.TestCase):
    def setUp(self):
        load_database()
        self.app = app.test_client()
        self.app.testing = True

    @patch('server.load_database')
    def test_health(self, mock_load_database):
        response = self.app.get('/api/health')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {'status': 'Service is up and running!'})

    @patch('server.save_transcription')
    def test_transcribe(self, mock_save_transcription):
        mock_save_transcription.return_value = {
            'filename': 'unit_test.mp3',
            'transcript': 'My name is Ethan. I was asked to come here by 11. Now it is already 3 p.m. They did not even serve me any food or drinks. Terrible.',
            'language': 'en'
        }

        data = {
            'file': (open('data/unit_test.mp3', 'rb'), 'unit_test.mp3')
        }
        response = self.app.post('/api/transcribe?language=en', data=data, content_type='multipart/form-data')
        print(response.json)
        self.app.delete('/delete?filename=unit_test.mp3')
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {
            'filename': 'unit_test.mp3', 
            'transcript': 'My name is Ethan. I was asked to come here by 11. Now it is already 3 p.m. They did not even serve me any food or drinks. Terrible.', 
            'language': 'en'}
        )

    
    @patch('server.get_transcriptions')
    def test_get_transcriptions(self, mock_get_transcriptions):
        mock_get_transcriptions.return_value = [
            [1, 'unit_test.mp3', 'Transcript 1', 'en', '2021-10-01 12:00:00'],
        ]
        response = self.app.get('/api/transcriptions')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, [
            {'filename': 'unit_test.mp3', 'transcript': 'Transcript 1', 'language': 'en', 'created_at': '2021-10-01 12:00:00'},
        ])

    @patch('server.search_transcriptions')
    def test_search_transcriptions(self, mock_search_transcriptions):
        mock_search_transcriptions.return_value = [
            [1, 'unit_test.mp3', 'Transcript 1', 'en', '2021-10-01 12:00:00'],
        ]
        response = self.app.get('/api/search?filename=unit_test.mp3')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, [
            {'filename': 'unit_test.mp3', 'transcript': 'Transcript 1', 'language': 'en', 'created_at': '2021-10-01 12:00:00'},
        ])

    

if __name__ == '__main__':
    unittest.main()