import React from 'react'
import Attach from '../img/attach.png'
import Img from '../img/img.png'

const Input = ({ inputValue, setInputValue, onSend  }) => {



  return (
    <div className='input'>
        <input type="text" placeholder='Type something....' value={inputValue}  
        onChange={(e) =>setInputValue(e.target.value)}
      />
        <div className='send'>
            <img src={Attach} alt="" />
            <input type="file" style={{display:"none"}} id="file" />
            <label htmlFor="file">
                <img src={Img} alt="" />
            </label>
              <button onClick={onSend}>send</button>
        </div>
    </div>
  )
}

export default Input