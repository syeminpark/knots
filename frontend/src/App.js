//BrowserRouter wraps the entire application to enable routing. 
//It provides the routing functionality to the entire application.

//Routes defines all possible routes in the application.
//Route define specific routes
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './home'
import Login from './login'
import './App.css'
import { useEffect, useState } from 'react'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [ID, setID] = useState('')

//lets you run code after the component has rendered
  useEffect(() => {
    // Fetch the user email and token from local storage
 
    const user = JSON.parse(localStorage.getItem('user'))
    console.log('eeef',user)
  
    // If the token/email does not exist, mark the user as logged out
    if (!user || !user.token) {
      setLoggedIn(false)
      return
    }
    // If the token exists, verify it with the auth server to see if it is valid
    fetch('/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })
      .then((r) => r.json())
      .then((r) => {
     console.log(r)
        setLoggedIn(r.success)
        setID(user.ID || '')
      })
  }, [])

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Home ID={ID} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}
          />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setID={setID} />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
// path="/": This route matches the root URL. It renders the Home component. 
//The Home component receives email, loggedIn, and setLoggedIn as props.

export default App