import React , { useState }from 'react'
import {  useUser } from '../components/UserContext';




const Search = () => {

  
  const [searchTerm, setSearchTerm] = useState('');
  const {selectedUser} = useUser();
 



  return (
    <div className='search'>
        <div className='searchForm'>
            <input type="text" placeholder='Find a user' value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} />
         


              <button>Search</button>
        </div> 
        
        {selectedUser  ? (
        <div className="userChat">
          <img src={selectedUser.photo} alt="" />
          <div className="userChatInfo">
            <span>{selectedUser.friendName}</span>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Search