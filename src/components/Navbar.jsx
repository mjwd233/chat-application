import React from 'react'
import { useUser } from './UserContext'
import { useNavigate, Link  } from "react-router-dom";
import { auth } from "../firebaseconfig";

const Navbar = props => {

  const {mainuser ,seTheMainUser} = useUser()
  const navigate = useNavigate();
  

  const handleLogout = async () => {
    try {
      await auth.signOut();
      seTheMainUser([])
      navigate("/login");
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
<>


    <div className='navbar'>


        <span className='logo'>Lama Chat</span>
        <div className='user'>
           
        {mainuser && mainuser.length > 1 ? (
            <>
              <Link to={`/user/${mainuser[0].userId}`}>
                <img src={mainuser[1].photo} alt="" />
              </Link>
              <span>{mainuser.map(user => user.displayName)}</span>
            </>
          ) : (
            <span>Loading...</span>
          )}
  
            <button  onClick={handleLogout}>Logout</button>
        </div>
    </div>

    </>
  )
}

export default Navbar
