// jest.setup.ts

import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

const handlers = [
    http.get('/api/health', () => HttpResponse.json({
            'status': "Healthy"
    })),

    http.get('/api/transcriptions', () => HttpResponse.json([
        {
            key: 'sample1.mp3',
            filename: 'sample1.mp3',
            transcript: 'transcript 1',
            createdAt: '2024-12-23 10:00:00'
        },
    ])),
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
})
 
afterAll(() => {
  // Disable request interception and clean up.
  server.close()
})