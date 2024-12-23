
import numpy as np
import transformers
from transformers import WhisperProcessor, WhisperForConditionalGeneration
import tempfile
import os
import pathlib
import librosa  
import torch

SAMPLE_RATE = 16000

# Load model and processor
model_path = 'openai/whisper-tiny'
processor = WhisperProcessor.from_pretrained(model_path)
model = WhisperForConditionalGeneration.from_pretrained(model_path)


def transcribe_segment(audio_segment, sampling_rate, language='en'):
    """Transcribes a single audio segment."""

    # configuration 
    device = "cuda:0" if torch.cuda.is_available() else "cpu"
    torch_dtype = torch.float32
    transformers.logging.set_verbosity_error()

    # calling on our model, we are enabling the use of fp16 precision
    model.to(device)
    
    # language
    forced_decoder_ids = processor.get_decoder_prompt_ids(language=language, task="transcribe")

    # process the audio bytes
    input = processor(audio_segment, sampling_rate=sampling_rate, return_tensors="pt")
    input_features = input.input_features
    input_features = input_features.to(device)

    # generate the transcription
    predicted_ids = model.generate(input_features,
                                    max_length=model.config.max_target_positions,
                                    forced_decoder_ids=forced_decoder_ids,
                                    length_penalty=1.0)
        
    transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True, clean_up_tokenization_spaces=True)
    return transcription

def transcribe_audio(file, language="en", chunk_duration=30.0, overlap_duration=5): 
    try:
        temp_dir = tempfile.TemporaryDirectory()
        temp_path = os.path.join(pathlib.Path(temp_dir.name), file.filename)
        file.save(temp_path)

        # Load audio bytes
        print('temp_path', temp_path)
        audio_raw, sr = librosa.load(temp_path, sr=SAMPLE_RATE)

        # Ensure the audio is mono (Whisper expects mono audio)
        if audio_raw.ndim > 1:
            audio_raw = librosa.to_mono(audio_raw)
        
        total_duration = librosa.get_duration(y=audio_raw, sr=sr)
        if float(total_duration) <= float(chunk_duration): 
            transcription = transcribe_segment(audio_raw, sr, language)
            # Decode the generated IDs to text
            text = str(transcription[0])
            os.remove(temp_path)
            return text.strip()
        else:
            num_chunks = int(np.ceil(total_duration / chunk_duration))
            all_transcriptions = []

            for i in range(num_chunks):
                start_time = i * chunk_duration
                end_time = min((i + 1) * chunk_duration, total_duration)

                start_time = max(0, start_time - overlap_duration)
                end_time = min(total_duration, end_time + overlap_duration)

                start_sample = int(start_time * sr)
                end_sample = int(end_time * sr)
                audio_segment = audio_raw[start_sample:end_sample]   
                if len(audio_segment) > 0:     
                    transcription = transcribe_segment(audio_raw, sr, language)
                    text = str(transcription[0])
                    text = text.strip()
                    all_transcriptions.append(text)

            os.remove(temp_path)
            transcription = " ".join(all_transcriptions) 
            return text.strip()
    except Exception as e:
        print(e)
        raise e
