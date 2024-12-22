/**
 * @jest-environment jsdom
 */
import React, { act, useState } from 'react';
import { render, screen, fireEvent, waitFor, renderHook } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import Index from '../pages/index'
import "@testing-library/jest-dom";

describe('Index Page', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    
  });

  it('renders health status', async () => {
    fetchMock.mockResponse(JSON.stringify({ status: 'Healthy' }));
    render(<Index />);

    await waitFor(() => {
      const healthStatusElement = screen.getByText('Health Status:', { exact: false });
      expect(healthStatusElement).toBeInTheDocument();
      
      const healthStatusText = healthStatusElement.textContent;
      expect(['Health Status: Unhealthy', 'Health Status: Healthy']).toContain(healthStatusText);
    });
  });

  it('handles button click', async () => {
    render(<Index />);
    const button = screen.getByRole('button', { name: /Upload/i });
    fireEvent.click(button);
    await waitFor(() => {
      const resultElement = screen.getByText('Upload Audio');
      expect(resultElement).toBeInTheDocument();
    });
  });

  it('renders empty transcriptions table', async () => {
    fetchMock.mockResponse(JSON.stringify({ status: 'Healthy' }));
    render(<Index />);
    await waitFor(() => {
      const healthStatusElement = screen.getByText('Health Status:', { exact: false });
      expect(healthStatusElement).toBeInTheDocument();
      
      const healthStatusText = healthStatusElement.textContent;
      if (healthStatusText?.includes('Health Status')) {
        const noRowsElement = screen.getByText('No rows to display.');
        if (noRowsElement != null)  {
          expect(screen.getByText('No rows to display.')).toBeInTheDocument();
        } 
      }
    });
  });
  
  
  it('fetches and sets transcriptions', async () => {
    fetchMock.mockResponse(JSON.stringify({ status: 'Healthy' }));
    render(<Index />);
    await waitFor(() => {
      const healthStatusElement = screen.getByText('Health Status:', { exact: false });
      expect(healthStatusElement).toBeInTheDocument();
      expect(healthStatusElement).toHaveTextContent('Healthy');
    });

    await waitFor(() => {
      expect(screen.getByText('en')).toBeInTheDocument();
    });


  });
  

  /*
  it('handles search transcriptions', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ status: 'Healthy' }));
    fetchMock.mockResponseOnce(JSON.stringify([
      { filename: 'searchfile.mp3', transcript: 'Search Transcript', language: 'en', created_at: '2023-01-01' }
    ]));
    render(<Index />);
    const searchInput = screen.getByPlaceholderText('Search Filename');
    fireEvent.change(searchInput, { target: { value: 'searchfile' } });
    const searchButton = screen.getByText('Search');
    fireEvent.click(searchButton);
    await waitFor(() => {
      expect(screen.getByText('searchfile.mp3')).toBeInTheDocument();
    });
  });

  it('handles clear search', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ status: 'Healthy' }));
    fetchMock.mockResponseOnce(JSON.stringify([
      { filename: 'file1.mp3', transcript: 'Transcript 1', language: 'en', created_at: '2023-01-01' }
    ]));
    render(<Index />);
    const searchInput = screen.getByPlaceholderText('Search Filename');
    fireEvent.change(searchInput, { target: { value: 'searchfile' } });
    const clearButton = screen.getByText('Clear');
    fireEvent.click(clearButton);
    await waitFor(() => {
      expect(screen.getByText('file1.mp3')).toBeInTheDocument();
    });
  });

  it('handles delete action', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ status: 'Healthy' }));
    fetchMock.mockResponseOnce(JSON.stringify([
      { filename: 'file1.mp3', transcript: 'Transcript 1', language: 'en', created_at: '2023-01-01' }
    ]));
    fetchMock.mockResponseOnce(JSON.stringify({}));
    render(<Index />);
    await waitFor(() => {
      expect(screen.getByText('file1.mp3')).toBeInTheDocument();
    });
    const deleteButton = screen.getByText('Delete?');
    fireEvent.click(deleteButton);
    await waitFor(() => {
      expect(screen.queryByText('file1.mp3')).not.toBeInTheDocument();
    });
  });
  */
});