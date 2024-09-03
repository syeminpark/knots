//BrowserRouter wraps the entire application to enable routing. 

//Routes defines all possible routes in the application.
//Route define specific routes
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/home'
import Login from './components/login'
import Admin from './components/admin'
import './App.css'
import { useEffect, useState } from 'react'
import apiRequest from './utility/apiRequest'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user || !user.token) {
      setLoggedIn(false)
      return
    }
    const verifyToken = async () => {
      const result = await apiRequest('/verify', 'POST',)
      console.log('Verification result:', result);
      setLoggedIn(result.success);
      setUserName(user.userName || '');
    };
    verifyToken();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Login setLoggedIn={setLoggedIn} setUserName={setUserName} />}
          />
          <Route path="/admin"
            element={<Admin />}
          />
          <Route path="/home"
            element={<Home userName={userName} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App