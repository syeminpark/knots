import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

//useState[''} initializes the state variable email with an empty string.
//SetEmail is a function that can be used to update the value of the email state variable.

const Login = (props) => {
  const [ID, setID] = useState('')
  const [password, setPassword] = useState('')
  const [IDError, setIDError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const navigate = useNavigate()

  const onButtonClick = () => {
    //clear any error messages before performing any further logic
    setIDError('')
    setPasswordError('')

    if ('' === ID) {
        setIDError('Please enter your ID')
        return
      }

    if ('' === password) {
        setPasswordError('Please enter a password')
        return
      }
    

  }

  return (
    <div className={'mainContainer'}>
      <div className={'titleContainer'}>
        <div>Login</div>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
          value={ID}
          placeholder="Enter your ID here"
          onChange={(ev) => setID(ev.target.value)}
          className={'inputBox'}
        />
        <label className="errorLabel">{IDError}</label>
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