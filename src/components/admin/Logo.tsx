import React from 'react'

export default function Logo() {
  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        gap: 10,
        letterSpacing: '0.02em',
      }}
    >
      <span
        style={{
          alignItems: 'center',
          background: '#1f7a5a',
          borderRadius: 10,
          color: '#fff',
          display: 'inline-flex',
          fontSize: 14,
          fontWeight: 800,
          height: 34,
          justifyContent: 'center',
          width: 34,
        }}
      >
        云
      </span>
      <span style={{ fontSize: 19, fontWeight: 800 }}>云雀 CMS</span>
    </div>
  )
}
