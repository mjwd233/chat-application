import React, { useEffect,useState } from 'react';
import FriendSearchCss from '../FriendSearch.module.css'; // Import the CSS file for styling
import { collection, query, where, getDocs, doc,getDoc, onSnapshot } from "firebase/firestore";
import {firestore} from '../firebaseconfig'
import { useUser } from '../components/UserContext';
import { useNavigate } from 'react-router-dom';

const FriendSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestedResults, setSuggestedResults] = useState([]);
  const navigate = useNavigate();
  const { mainuser } = useUser();
 
  
  const userId = mainuser.map(user => user.userId)[0];

  useEffect(() => {
    if (searchTerm) {
      const q = query(collection(firestore, 'users'),
       where('displayName', '>=', searchTerm),
        where('displayName', '<=', searchTerm + '\uf8ff'));
  
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const results = snapshot.docs.map((doc) => ({
          id: doc.id,
        ...doc.data(),

        }));
        const resultsWithoutCurrentUser = results.filter(result => result.id!== userId);
        setSuggestedResults(resultsWithoutCurrentUser);
      });
      
    
      return () => unsubscribe();
    }
  }, [searchTerm, userId]);


  

  const handleSearch = () => {
   
      navigate('/userspage', { state: { searchTerm } });

  };
  return (
    <div className={FriendSearchCss.friendsearchcontainer}>
      <input
        type="text"
        placeholder="Enter friend's username"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={FriendSearchCss.searchinput}
      />
  <button onClick={ handleSearch} className={FriendSearchCss.searchbutton}>
  Search
</button>
      <ul className={FriendSearchCss.searchresults}>
  {suggestedResults.map((user) => (
    <li key={user.id}>
      <button onClick={() => onSearch(user.id)}>
        <img src={user.photoURL} alt="" />
        <p>{user.displayName}</p>
      </button>
    </li>
  ))}
</ul>

    </div>
  );
};


export default FriendSearch;