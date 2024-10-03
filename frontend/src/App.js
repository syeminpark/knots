import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/home';
import Login from './components/login/login';
import Admin from './components/login/admin';
import './App.css';
import { useEffect, useState } from 'react';
import apiRequest from './utility/apiRequest';


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [initialData, setInitialData] = useState({ characters: [], journalBooks: [] });
  const [panels, setPanels] = useState([]); // Move panels state to App.js




  const initializeData = async () => {
    try {
      const characterData = await apiRequest('/getAllCharacters', 'GET',);
      const journalBookData = await apiRequest('/getAllJournalBooks', 'GET',);
      setInitialData({ characters: characterData, journalBooks: journalBookData.journalBooks })
      console.log('!!! INITIALIZED!!')

    }
    catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user || !user.token) {
      setLoggedIn(false)
      setIsAdmin(false);

      return
    }

    const verifyToken = async () => {
      try {
        const result = await apiRequest('/verify', 'POST',)

        setLoggedIn(result.success);
        setUserName(user.userName || '');

        initializeData()
      }
      catch (error) {
        console.log(error)
        setLoggedIn(false)
      }
      try {
        await apiRequest('/verifyAdmin', 'POST',)
        // setIsAdmin(result.isAdmin)
      }
      catch (error) {
        console.log(error)
        setIsAdmin(false);
      }
    }
    verifyToken();
  }, [loggedIn]);

  return (
    <div className="App">
      {/* <SidebarLeft panels={panels} setPanels={setPanels} loggedIn={loggedIn} /> */}
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              loggedIn ? (
                <Navigate to="/" replace />
              ) : (
                <Login
                  setLoggedIn={setLoggedIn}
                  setUserName={setUserName}
                  setIsAdmin={setIsAdmin}
                />
              )
            }
          />
          <Route
            path="/admin"
            element={
              loggedIn && isAdmin ? (
                <Admin />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/"
            element={
              loggedIn ? (
                <Home
                  userName={userName}
                  loggedIn={loggedIn}
                  setLoggedIn={setLoggedIn}
                  initialData={initialData}
                  panels={panels}
                  setPanels={setPanels}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
