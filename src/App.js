

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
import Mainpage from './components/Mainpage'
import Test from "./components/Test";
import ProfilePage from "./components/ProfilePage";
import Forgotpassword from './pages/Forgotpassword';
import Resetpassword from "./pages/ResetPassword";

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
        <Route path="/main" element={<Mainpage />} />
        <Route path="/Test" element={<Test />} />
        <Route path="/profilepage" element={<ProfilePage />} />
        <Route path="/forgot-password" element={<Forgotpassword />} />
        <Route path="/reset-password" element={<Resetpassword />} />
       
       
   
    </Routes>

    </UserProvider>
  </BrowserRouter>

  );
}

export default App;
