'use client'

import { useEffect } from 'react'

export default function FaviconUpdater() {
  useEffect(() => {
    const updateFavicon = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
        const response = await fetch(`${apiUrl}/settings`)
        const settings = await response.json()
        
        if (settings.favicon_url) {
          // Update all favicon link elements
          const faviconLinks = document.querySelectorAll("link[rel*='icon']")
          faviconLinks.forEach(link => link.remove())
          
          // Add new favicon
          const link = document.createElement('link')
          link.rel = 'icon'
          link.href = settings.favicon_url
          document.head.appendChild(link)
          
          // Add apple touch icon
          const appleLink = document.createElement('link')
          appleLink.rel = 'apple-touch-icon'
          appleLink.href = settings.favicon_url
          document.head.appendChild(appleLink)
        }
      } catch (error) {
        console.error('Failed to load favicon:', error)
      }
    }
    
    updateFavicon()
  }, [])
  
  return null
}
