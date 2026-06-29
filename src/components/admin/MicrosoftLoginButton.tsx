'use client'

import React from 'react'

import './MicrosoftLoginButton.css'

const MicrosoftLoginButton = () => {
  const handleLogin = () => {
    window.location.assign('/api/auth/microsoft/start?returnTo=/admin')
  }

  return (
    <div className="microsoft-login">
      <button className="microsoft-login__button" onClick={handleLogin} type="button">
        <span className="microsoft-login__mark" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </span>
        <span>Continue with Office</span>
      </button>
    </div>
  )
}

export default MicrosoftLoginButton
