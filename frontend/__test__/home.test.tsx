import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Home from '../components/Home';
import "@testing-library/jest-dom";

describe('Home Componnent', () => {
  beforeEach(() => {
  });

  it('mock renders health status', async () => {
    render(<Home />);
    await waitFor(() => {
      const healthStatusElement = screen.getByRole('healthStatus');
      expect(healthStatusElement).toBeInTheDocument();
      expect(healthStatusElement).toHaveTextContent('Health Status: Healthy');
    }, { timeout: 5000 });
  });
  
  
  it('mock renders empty transcriptions table', async () => {
    render(<Home />);
    await waitFor(() => {
        const noRowsElement = screen.getByText('No rows to display.');
        if (noRowsElement != null)  {
          expect(screen.getByText('No rows to display.')).toBeInTheDocument();
        } 
    });
  });
  
  it('mock renders transcriptions with data', async () => {
    render(<Home />);
    await waitFor(() => {
      expect(screen.getByText('sample1.mp3')).toBeInTheDocument();
      expect(screen.getByText('sample2.mp3')).toBeInTheDocument();
    });
  });

  it('mock renders upload button', async () => {
    render(<Home />);
    await waitFor(() => {
      const resultElement = screen.getByText('Upload Audio');
      expect(resultElement).toBeInTheDocument();
    });
  });

  it('mock renders search button', async () => {
    render(<Home />);
    await waitFor(() => {
      const resultElement = screen.getByText('Search');
      expect(resultElement).toBeInTheDocument();
    });
  });

  it('mock renders search field', async () => {
    render(<Home />);
    await waitFor(() => {
      const resultElement = screen.getByPlaceholderText('Search Filename');
      expect(resultElement).toBeInTheDocument();
    });
  });

  it('mock renders clear button', async () => {
    render(<Home />);
    await waitFor(() => {
      const resultElement = screen.getByText('Clear');
      expect(resultElement).toBeInTheDocument();
    });
  });

  it('mock handles search button', async () => {
    render(<Home />);
    const searchInput = screen.getByPlaceholderText('Search Filename');
    fireEvent.change(searchInput, { target: { value: 'sample1.mp3' } });
    const searchButton = screen.getByText('Search');
    fireEvent.click(searchButton);
    await waitFor(() => {
      expect(screen.getByText('sample1.mp3')).toBeInTheDocument();
    });
  });
  
  it('mock handles clear button', async () => {
    render(<Home />);
    const clearButton = screen.getByText('Clear');
    fireEvent.click(clearButton);
    await waitFor(() => {
      expect(screen.getByText('sample1.mp3')).toBeInTheDocument();
    });
  });
  
  it('mock handles delete action', async () => {
    render(<Home />);
    await waitFor(() => {
      expect(screen.getByText('sample2.mp3')).toBeInTheDocument();
    });

    const sample2Row = screen.getByText('sample2.mp3').closest('tr');
    const deleteButton = sample2Row?.querySelector('button[aria-label="Delete"]');
    if (deleteButton) {
      fireEvent.click(deleteButton);
    }

    await waitFor(() => {
      expect(screen.queryByText('sample2.mp3')).not.toBeInTheDocument();
    });
  });

  
  it('mock handles upload action', async () => {
    render(<Home />);
    const uploadContainer = screen.getByRole('UploadContainer');
    expect(uploadContainer).toBeInTheDocument();

    const str = JSON.stringify('Sample3.mp3');
    const blob = new Blob([str]);

    const file = new File([new Blob([blob], { type: 'audio/mp3' })], 'sample3.mp3', { type: 'audio/mp3' });
    const input = uploadContainer.querySelector('input[aria-label="UploadAudioInput"]');
    expect(input).toBeInTheDocument();
    if (input) {
      fireEvent.change(input, { target: { files: [file] } });     
    }

    await waitFor(() => {
      expect(screen.getByText('sample3.mp3')).toBeInTheDocument();
    }, { timeout: 5000 });
  });
  
  
});