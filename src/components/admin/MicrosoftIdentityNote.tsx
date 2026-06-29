'use client'

import React from 'react'

import './MicrosoftIdentityNote.css'

const MicrosoftIdentityNote = () => {
  return (
    <div className="microsoft-identity-note">
      <strong>Office account linking</strong>
      <span>
        Microsoft identity is linked automatically after the user signs in with Office. Object ID
        and tenant ID are system metadata and are not entered manually.
      </span>
    </div>
  )
}

export default MicrosoftIdentityNote
