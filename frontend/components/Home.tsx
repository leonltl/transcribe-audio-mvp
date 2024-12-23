import React, { useEffect, useState } from 'react';
import CommonTable, { Column } from './CommonTable';

const Home: React.FC = () => {
  interface Transcription {
    key: string;
    filename: string;
    transcript: string;
    language: string;
    createdAt: string;
  }

  const [healthStatus, setHealthStatus] = useState('');
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const columns: Column[] = [
    { key: 'filename', label: 'Filename', width: "15%" },
    { key: 'language', label: 'Language', width: "10%"},
    { key: 'transcript', label: 'Transcript' },
    { key: 'createdAt', label: 'Created At', width: "20%" },
    { key: 'action', label: 'Delete?', width: "10%" },
  ];

  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const language: string = 'en'

  const [errorMessage, setError] = useState('');
  const url = `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/api`

  const fetchHealth = async () => {
      const data: { status: string } = await fetch(`/api/health`).then(res => res.json());
      const { status } = data;
      setHealthStatus(status);
  };

  const fetchTranscriptions = async () => {
    await fetchHealth()
    if (healthStatus === 'Unhealthy') {
      return
    }

    const data = await fetch(`/api/transcriptions`).then(res => res.json());
    setTranscriptions(data);
  };

  const uploadTranscript = async (files: any) => {
    await fetchHealth()
    if (healthStatus === 'Unhealthy') {
      return
    }

    setError('');
    if (files.length === 0) {
      return;
    }
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', files[0]);
    const response = await fetch(`/api/transcribe?language=${language}`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json()
      setError(error.error);
      setIsUploading(false);
    }

    fetchTranscriptions(); // Refresh the transcriptions list after upload
    setIsUploading(false);
  };

  const searchTranscriptions = async () => {
    await fetchHealth()
    if (healthStatus === 'Unhealthy') {
      return
    }

    const data = await fetch(`/api/search?filename=${searchQuery}`).then(res => res.json());
    setTranscriptions(data);
  };

  const clearSearch = async () => {
    setError('');
    setSearchQuery('');
    fetchTranscriptions();
  };

  const deleteAction = async (item: any) => {
    await fetchHealth()
    if (healthStatus === 'Unhealthy') {
      return
    }

    const filename = item.filename
    const response = await fetch(`/api/delete?filename=${filename}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const data: { error: string }  = await response.json();
      const { error } = data;
      setError(error);
      return;
    }

    fetchTranscriptions();
  };
  
  useEffect(() => {
    (async () => {
        fetchTranscriptions();
    })();
  }, [])

  return (
    <div className="w-4/5 mx-auto">
      <div className="mt-4 text-lg font-bold" role='healthStatus'>Health Status: {healthStatus}</div>
      <div className="mt-4 flex justify-between">
        <div>
          <input
            type="text"
            placeholder="Search Filename"
            accept='audio/mp3'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded py-2 px-4"
            role="SearchField"
              />
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
              onClick={searchTranscriptions} role="Search">
              Search
            </button>
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
              onClick={clearSearch} role="Clear">
              Clear
            </button>
        </div>
        <div role="UploadContainer">
          <input
              type="file"
              accept="audio/*"
              id="audio-upload"
              style={{ display: 'none' }}
              onChange={(e) => uploadTranscript(e.target.files)} 
              role='UploadAudioInput'
              aria-label='UploadAudioInput'
          />
          <label htmlFor="audio-upload">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => document.getElementById('audio-upload')?.click()}
              disabled={isUploading}
              role="Upload"
            >
              {isUploading ? 'Uploading...' : 'Upload Audio'}
            </button>
          </label>
        </div>
      </div>   
      <div className="mt-4">
        {errorMessage && <div className="text-red-500">Error: {errorMessage}</div>}
      </div>
      <div className="py-4">
        <CommonTable rows={transcriptions} columns={columns} onDelete={deleteAction}/>
      </div>
    </div>
  );
}
  
export default Home;