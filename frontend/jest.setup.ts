// jest.setup.ts
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

let isFileDeleted = false;
let isFileTranscribed = false;

const handlers = [
    http.get('/api/health', () => HttpResponse.json({'status': "Healthy"})),

    http.get('/api/transcriptions', () => {
        let transcriptions = [
            {
                key: 'sample1.mp3',
                filename: 'sample1.mp3',
                transcript: 'transcript 1',
                language: 'en',
                createdAt: '2024-12-23 10:00:00'
            },
            {
                key: 'sample2.mp3',
                filename: 'sample2.mp3',
                transcript: 'transcript 2',
                language: 'en',
                createdAt: '2024-12-23 10:00:00'
            }
        ];

        if (isFileDeleted) {
            return HttpResponse.json(transcriptions.filter(t => t.filename === 'sample1.mp3'));
        }

        if (isFileTranscribed) {
            transcriptions = [
                {
                    key: 'sample1.mp3',
                    filename: 'sample1.mp3',
                    transcript: 'transcript 1',
                    language: 'en',
                    createdAt: '2024-12-23 10:00:00'
                },
                {
                    key: 'sample2.mp3',
                    filename: 'sample2.mp3',
                    transcript: 'transcript 2',
                    language: 'en',
                    createdAt: '2024-12-23 10:00:00'
                },
                {
                    key: 'sample3.mp3',
                    filename: 'sample3.mp3',
                    transcript: 'transcript 3',
                    language: 'en',
                    createdAt: '2024-12-23 10:00:00'
                },
            ];
        }

        return HttpResponse.json(transcriptions);
    }),

    http.delete('/api/delete', ({ request }) => {
        const url = new URL(request.url)
        const filename = url.searchParams.get('filename')   
        if (!filename) {
            return HttpResponse.json({error: 'Error'}, { status: 500 })
        }
        if (filename === 'sample2.mp3') {
            isFileDeleted = true;
        }
        return HttpResponse.json({message: 'File deleted successfully'})
    }),

    http.get('/api/search', ({ request }) => {
        const url = new URL(request.url) 
        const filename = url.searchParams.get('filename')
        if (!filename) {
            return HttpResponse.json({error: 'Error'}, { status: 500 })
        }
        return HttpResponse.json([
            {
                key: 'sample1.mp3',
                filename: 'sample1.mp3',
                transcript: 'transcript 1',
                language: 'en',
                createdAt: '2024-12-23 10:00:00'
            },
        ])
    }),

    http.post('/api/transcribe', ({ request }) => {
        const url = new URL(request.url) 
        const language = url.searchParams.get('language')
        if (!language) {
            return HttpResponse.json({error: 'Error'}, { status: 500 })
        }
        isFileTranscribed = true;
        return HttpResponse.json(
            {
                filename: 'sample3.mp3',
                transcript: 'transcript 3',
                language: 'en',
                createdAt: '2024-12-23 10:00:00'
            },
        )
    }),
]

const server = setupServer(...handlers)

beforeAll(() => {
  // Start the interception.
  server.listen()
})
 
afterEach(() => {
  // Remove any handlers you may have added
  // in individual tests (runtime handlers).
  server.resetHandlers()
  isFileDeleted = false; 
  isFileTranscribed = false;
})
 
afterAll(() => {
  // Disable request interception and clean up.
  server.close()
})