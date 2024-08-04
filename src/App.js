

import Register from "./pages/Register"
import Login from "./pages/Login"
import Home from "./pages/Home"
import "./style.scss";
import { BrowserRouter , Routes, Route } from 'react-router-dom';
import { UserProvider } from './components/UserContext';
import MyEdit from './components/MyEdit';
import UserDetails from './pages/UserDetails';
import Userspage from './pages/Userspage';
import FriendPage from './components/FriendPage';
function App() {
  return (
  
    <BrowserRouter>
        <UserProvider>
      
    <Routes>

        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route  path="/userdetails/:userId" element={<UserDetails/>} />
        <Route  path="/userspage" element={<Userspage/>} />
        <Route path="/user/:uid" element={<MyEdit />} />
        <Route path="/friends" element={<FriendPage />} />
       
       
   
    </Routes>

    </UserProvider>
  </BrowserRouter>

  );
}

export default App;
