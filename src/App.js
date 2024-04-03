// General Imports
import { Routes, Route } from "react-router-dom";
import { useEffect, useContext } from "react";
import FriendsListContext from "./context/FriendsListContext";
import useFriends from "./hooks/useFriends";
import useAuth from "./hooks/useAuth";
import "./App.css";

// Pages Imports
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import AccountPage from "./pages/AccountPage/AccountPage";
import MatchHistoryPage from "./pages/MatchHistoryPage/MatchHistoryPage";
import MatchDetailsPage from "./pages/MatchDetailsPage/MatchDetailsPage";

// Component Imports
import Navbar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";

// Util Imports
import PrivateRoute from "./utils/PrivateRoute";
import FriendsAccountPage from "./pages/FriendsAccountPage/FriendsAccountPage";

function App() {
  const [friendsList] = useFriends();
  const {handleFriendsListContext} = useContext(FriendsListContext)

  useEffect(() => {
    if(friendsList.length === 0){
      handleFriendsListContext()
    }
  }, []);

  return (
      <div className="viewdota">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/friendsAccount/:friendId" element={<FriendsAccountPage />}/>
          {friendsList.length > 0 && (
            <>
              <Route path="/account" element={<AccountPage />} />
              <Route path="/matches" element={<MatchHistoryPage />} />
              <Route path="/match/:matchId" element={<MatchDetailsPage/> } />
            </>
          )}
        </Routes>
      </div>
  );
}

export default App;
