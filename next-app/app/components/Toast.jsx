'use client'
import { useEffect } from 'react'

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">{icons[type]}</div>
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={onClose}>×</button>
      
      <style jsx>{`
        .toast {
          position: fixed;
          top: 2rem;
          right: 2rem;
          min-width: 300px;
          max-width: 500px;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          animation: slideIn 0.3s ease-out;
          z-index: 10000;
          backdrop-filter: blur(10px);
        }

        .toast-success {
          background: linear-gradient(135deg, rgba(134, 255, 0, 0.95) 0%, rgba(100, 200, 0, 0.95) 100%);
          border: 1px solid rgba(134, 255, 0, 0.5);
          color: #000;
        }

        .toast-error {
          background: linear-gradient(135deg, rgba(255, 68, 68, 0.95) 0%, rgba(200, 50, 50, 0.95) 100%);
          border: 1px solid rgba(255, 68, 68, 0.5);
          color: #fff;
        }

        .toast-warning {
          background: linear-gradient(135deg, rgba(255, 193, 7, 0.95) 0%, rgba(255, 160, 0, 0.95) 100%);
          border: 1px solid rgba(255, 193, 7, 0.5);
          color: #000;
        }

        .toast-info {
          background: linear-gradient(135deg, rgba(33, 150, 243, 0.95) 0%, rgba(25, 118, 210, 0.95) 100%);
          border: 1px solid rgba(33, 150, 243, 0.5);
          color: #fff;
        }

        .toast-icon {
          font-size: 1.5rem;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          flex-shrink: 0;
        }

        .toast-message {
          flex: 1;
          font-weight: 600;
          font-size: 0.95rem;
          line-height: 1.4;
        }

        .toast-close {
          background: none;
          border: none;
          color: inherit;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s;
          flex-shrink: 0;
          opacity: 0.7;
        }

        .toast-close:hover {
          opacity: 1;
          background: rgba(255, 255, 255, 0.2);
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .toast {
            top: 1rem;
            right: 1rem;
            left: 1rem;
            min-width: auto;
          }
        }
      `}</style>
    </div>
  )
}
