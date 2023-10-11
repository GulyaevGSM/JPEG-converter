import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('png');
  const [convertedImageUrl, setConvertedImageUrl] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFormatChange = (e) => {
    setSelectedFormat(e.target.value);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select an image to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('format', selectedFormat);

    try {
      await axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Assuming the image was successfully converted and saved on the server,
      // you can construct the URL based on your server's logic
      const convertedImageUrl = `http://localhost:3001/images/converted.${selectedFormat}`;
      setConvertedImageUrl(convertedImageUrl);
      alert('Изображение успешно преобразовано и сохранено.');
    } catch (error) {
      console.error(error);
      alert('An error occurred during upload and conversion.');
    }
  };

  return (
    <div>
      <h1>JPEG Converter</h1>
      <input type="file" accept=".jpg, .jpeg" onChange={handleFileChange} />

      <label>Выбрать формат:</label>
      <select value={selectedFormat} onChange={handleFormatChange}>
        <option value="png">PNG</option>
        <option value="jpeg">JPEG</option>
        <option value="bmp">BPM</option>
        <option value="tiff">TIFF</option>
        <option value="gif">GIF</option>
      </select>

      <button onClick={handleUpload}>Загрузить и конвертировать</button>

      {convertedImageUrl && (
        <div className='download'>
          <div className='coverted__images'>
            <p>Конвертированное изображение:</p>
            <img src={convertedImageUrl} alt="Converted" />
          </div>
          <a href={`http://localhost:3001/download/converted.${selectedFormat}`} target="_blank" rel="noopener noreferrer">
            Загрузить
          </a>
        </div>
      )}

    </div>
  );
}

export default App;
