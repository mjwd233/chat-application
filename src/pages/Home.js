
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import Chat from '../components/Chat';
import Sidebar from '../components/Sidebar';
import UserDetails from './UserDetails';


const Home = () => {
  const [showUserDetails, setShowUserDetails] = useState(false);
  
  
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [isBlackOverlay, setIsBlackOverlay] = useState(false);
  const [highlightedUsers, setHighlightedUsers] = useState([]);
 
  

  const navigateToUserDetails = () => {
   
    setShowUserDetails(true);
  };

  const handleCloseUserDetails = () => {
    setShowUserDetails(false);
    setSelectedUserId(null);
  };

  const handleSelectUser = (searchTerm) => {
    setSelectedUserId(searchTerm);
    navigateToUserDetails();
  };

  const toggleBlackOverlay = (usersToHighlight) => {
    setHighlightedUsers(usersToHighlight);
    setIsBlackOverlay(!isBlackOverlay);
  };

  


  return (
    <div className="home">
      <div className="container" >
        <div className='mainmenubar'></div>
     <div className='sidebarmenu'>  
     <Link to="/main">
            <p>Main</p>
          </Link>
          <Link to="/friends">
            <p>Friends</p>
          </Link>
          <Link to="/chat-groups">
            <p>Chat Groups</p>
          </Link>
   
       </div>
        <Sidebar highlightedUsers={highlightedUsers} isBlackOverlay={isBlackOverlay} />
       
  
        {showUserDetails ? (
          <UserDetails
            userId={selectedUserId}
            onClose={handleCloseUserDetails}
          />
        ) : (
          <Chat onSearchChat={handleSelectUser} toggleBlackOverlay={toggleBlackOverlay} />
        )}
      </div>

      {isBlackOverlay && <div className="overlay"></div>}
   
    
    </div>
  );
};

export default Home;