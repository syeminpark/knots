import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiRequest from '../../utility/apiRequest';

const Login = (props) => {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [userNameError, setUserNameError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const navigate = useNavigate()

  // Log in a user using email and password
  const logIn = async () => {
    console.log(userName, password)
    try {
      const response = await apiRequest('/loginUser', 'POST', { userName: userName, password: password });
      if (response.success) {
        localStorage.setItem('user', JSON.stringify({ userName: userName, token: response.token }))
        props.setLoggedIn(true)
        props.setUserName(userName)
        console.log('auth', response.auth_type)
        if (response.auth_type == 'participant') {
          props.setIsAdmin(false)
          navigate('/')
        }
        else {
          props.setIsAdmin(true)
          navigate('/admin')
        }
      } else {
        window.alert('Wrong userName or password')
      }
    }
    catch (error) {
      window.alert(error);
    }
  }
  // })



  const onButtonClick = () => {
    //clear any error messages before performing any further logic
    setUserNameError('')
    setPasswordError('')
    if ('' === userName) {
      setUserNameError('Please enter your userName')
      return
    }
    if ('' === password) {
      setPasswordError('Please enter a password')
      return
    }
    logIn()
  }

  return (
    <div className={'mainContainer'}>
      <div className={'titleContainer'}>
        <div>Login</div>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
          value={userName}
          placeholder="Enter your userName here"
          onChange={(ev) => setUserName(ev.target.value)}
          className={'inputBox'}
        />
        <label className="errorLabel">{userNameError}</label>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
          value={password}
          placeholder="Enter your password here"
          onChange={(ev) => setPassword(ev.target.value)}
          className={'inputBox'}
        />
        <label className="errorLabel">{passwordError}</label>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input className={'inputButton'} type="button" onClick={onButtonClick} value={'Log in'} />
      </div>
    </div>
  )
}

export default Login