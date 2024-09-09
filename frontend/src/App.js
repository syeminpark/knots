//BrowserRouter wraps the entire application to enable routing. 

//Routes defines all possible routes in the application.
//Route define specific routes
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Home from './components/home'
import Login from './components/login'
import Admin from './components/admin'
import './App.css'
import { useEffect, useState } from 'react'
import apiRequest from './utility/apiRequest'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const [isAdmin, setIsAdmin] = useState(false); // State to track if the user is an admin

  //using the loggedIn as a dependency creates an infinte loop so only use it when 
  //the component firstmounts 
  //the purpose is to log out 
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
      }
      catch (error) {
        console.log(error)
        setLoggedIn(false)
      }
      try {
        const result = await apiRequest('/verifyAdmin', 'POST',)

        setIsAdmin(result.isAdmin)
      }
      catch (error) {
        console.log(error)
        setIsAdmin(false);
      }
    }
    verifyToken();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              loggedIn ? (
                <Navigate to="/" replace /> // Redirect to /home if logged in
              ) : (
                <Login setLoggedIn={setLoggedIn} setUserName={setUserName} setIsAdmin={setIsAdmin} />
              )
            }
          />
          <Route
            path="/admin"
            element={
              loggedIn && isAdmin ? ( // Check if the user is logged in and is an admin
                <Admin />
              ) : (
                <Navigate to="/login" replace /> // Redirect to login if not admin or not logged in
              )
            }
          />
          <Route
            path="/"
            element={
              loggedIn ? (
                <Home userName={userName} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
              ) : (
                <Navigate to="/login" replace /> // Redirect to login if not logged in
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App

