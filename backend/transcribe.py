
import transformers
from transformers import WhisperProcessor, WhisperForConditionalGeneration
import tempfile
import os
import pathlib
import librosa  
import torch

SAMPLE_RATE = 16000

def load_audio(path):
    audio_raw, sr = librosa.load(path, sr=SAMPLE_RATE)

    # Ensure the audio is mono (Whisper expects mono audio)
    if audio_raw.ndim > 1:
        audio_raw = librosa.to_mono(audio_raw)

    return audio_raw, sr

def transcribe_audio(file, language="en"): 
    try:
        temp_dir = tempfile.TemporaryDirectory()
        temp_path = os.path.join(pathlib.Path(temp_dir.name), file.filename)
        file.save(temp_path)

        device = "cuda:0" if torch.cuda.is_available() else "cpu"
        torch_dtype = torch.float32
 
        # transformer logging
        transformers.logging.set_verbosity_error()
        
        # configuration 
        model_path = 'openai/whisper-tiny'
        processor = WhisperProcessor.from_pretrained(model_path)
        model = WhisperForConditionalGeneration.from_pretrained(model_path, torch_dtype=torch_dtype)

        # calling on our model, we are enabling the use of fp16 precision
        model.to(device)
        
        # language
        forced_decoder_ids = processor.get_decoder_prompt_ids(language=language, task="transcribe")
        
        # Process the audio bytes
        audio_raw, sr = load_audio(temp_path)
        input = processor(audio_raw, sampling_rate=sr, return_tensors="pt")
        input_features = input.input_features
        input_features = input_features.to(device)
        
        predicted_ids = model.generate(input_features,
                                       max_length=model.config.max_target_positions,
                                    forced_decoder_ids=forced_decoder_ids,
                                    length_penalty=1.0)
        
        transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True, clean_up_tokenization_spaces=True)
        os.remove(temp_path)

        # Decode the generated IDs to text
        text = str(transcription[0])

        return text.strip()
    except Exception as e:
        raise e




'''
# for longer audio sequences, you can adjust the following parameters:
def transcribe_audio(file): 
    try:
        temp_dir = tempfile.TemporaryDirectory()
        temp_path = os.path.join(pathlib.Path(temp_dir.name), file.filename)
        file.save(temp_path)

        device = "cuda:0" if torch.cuda.is_available() else "cpu"
        torch_dtype = torch.float32
 
        # transformer logging
        transformers.logging.set_verbosity_error()
        
        model_path = 'openai/whisper-tiny'
        processor = WhisperProcessor.from_pretrained(model_path)
        model = WhisperForConditionalGeneration.from_pretrained(model_path, torch_dtype=torch_dtype)

        # language
        forced_decoder_ids = WhisperProcessor.get_decoder_prompt_ids(language=language, task="transcribe")
        #forced_decoder_ids = processor.get_decoder_prompt_ids(language="en", task="translate")

         #  calling on our model, we are enabling the use of fp16 precision
        model.to(device)
        
        chunk_length_s = 30.0
        sample_rate = 16000
        chunk_length_samples = int(chunk_length_s * sample_rate)

        # Process the audio bytes
        audio = load_audio(temp_path)
       
        # List to store aggregated transcriptions
        transcriptions = []

        # Loop through and transcribe each chunk
        for start_idx in range(0, len(audio), chunk_length_samples):
            end_idx = min(start_idx + chunk_length_samples, len(audio))
            audio_chunk = audio[start_idx:end_idx]

            # Preprocess the audio chunk for the model
            input_features = processor(audio_chunk, return_tensors="pt", sampling_rate=sample_rate).input_features
            # calling .half() on our model, we are enabling the use of fp16 precision
            input_features = input_features.to(device)

            # Generate the transcription for the chunk
            with torch.no_grad():
                # - `length_penalty`, and `early_stopping` to control the generation process.
                # - `max_new_tokens`: Defines the maximum number of tokens to generate. You can adjust this value according to your audio's content length.
                # - `num_beams`: Controls the beam search for generation, helping to get a more accurate transcription, particularly for longer audio sequences.
                predicted_ids = model.generate(input_features,
                                               max_length=model.config.max_target_positions,
                                               num_beams=5,
                                               length_penalty=1.0,
                                               forced_decoder_ids=forced_decoder_ids)

            # Decode the predicted IDs to text and append to results
            transcription_chunk = processor.batch_decode(predicted_ids, skip_special_tokens=True, clean_up_tokenization_spaces=True)[0]
            transcriptions.append(transcription_chunk)
        
        os.remove(temp_path)
        full_transcription = " ".join(transcriptions)
        return full_transcription.strip()
    
    except Exception as e:
        print(e)
        raise e
'''

       