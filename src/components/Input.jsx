import React, { useState } from 'react';
import Attach from '../img/attach.png';
import Img from '../img/img.png';

const Input = ({ inputValue, setInputValue, onSend }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    console.log('Selected file:', selectedFile);
  };

  const uploadFile = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('http://localhost:5000/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error response data:', errorData);
          throw new Error(errorData.error || 'Error uploading file');
        }
        
        const data = await response.json();
        const fileURL = data.filePath;
        console.log(fileURL)

        console.log('Uploaded file URL:', fileURL);

        // Clear the file input
        setFile(null);
        return fileURL;
      } catch (error) {
        console.error('Error uploading file:', error);
        return null;
      }
    }
    return null;
  };

  const handleSend = async () => {
    const fileURL = await uploadFile();
    console.log('Sending message with text:', inputValue, 'and file URL:', fileURL);
    onSend(inputValue, fileURL);
    setInputValue('');
  };

  return (
    <div className='input'>
      <input
        type="text"
        placeholder='Type something....'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <div className='send'>
        <img src={Attach} alt="" />
        <input type="file" style={{ display: "none" }} id="file" onChange={handleFileChange} />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
