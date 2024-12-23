import { render, screen, waitFor, fireEvent } from '@testing-library/react';

it('receives a mocked response to health request', async () => {
    const response = await fetch('/api/health')
    expect(response.status).toBe(200)
    expect(response.statusText).toBe('OK')
    expect(await response.json()).toEqual({
        status: 'Healthy', 
    })
})
  
it('receives a mocked response to get transcription request', async () => {
    const response = await fetch('/api/transcriptions')
    expect(response.status).toBe(200)
    expect(response.statusText).toBe('OK')
    expect(await response.json()).toEqual([
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
    ])
})

it('receives a mocked response to search transcription request', async () => {
    const response = await fetch('/api/search?filename=sample1.mp3')
    expect(response.status).toBe(200)
    expect(response.statusText).toBe('OK')
    expect(await response.json()).toEqual([
        {
            key: 'sample1.mp3',
            filename: 'sample1.mp3',
            transcript: 'transcript 1',
            language: 'en',
            createdAt: '2024-12-23 10:00:00'
        }
    ])
})

it('receives a mocked response to delete transcription request', async () => {
    const response = await fetch('/api/delete?filename=sample1.mp3', { method: 'DELETE' })
    expect(response.status).toBe(200)
    expect(response.statusText).toBe('OK')
    expect(await response.json()).toEqual(
        {
            message: 'File deleted successfully'
        }
    )
})

it('receives a mocked response to upload transcription request', async () => {
    const str = JSON.stringify('Sample3.mp3');
    const blob = new Blob([str]);

    const file = new File([new Blob([blob], { type: 'audio/mp3' })], 'sample3.mp3', { type: 'audio/mp3' });
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/transcribe?language=en', { method: 'POST',body: formData })
    
    expect(response.status).toBe(200)
    expect(response.statusText).toBe('OK')
    expect(await response.json()).toEqual(
        {
            filename: 'sample3.mp3',
            transcript: 'transcript 3',
            language: 'en',
            createdAt: '2024-12-23 10:00:00'
        }
    )
})
  
  
  