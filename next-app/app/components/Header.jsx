'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { getApiUrl } from '../lib/config'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [logoUrl, setLogoUrl] = useState('')
  const [logoText, setLogoText] = useState('')
  const [useLogoImage, setUseLogoImage] = useState(true)
  const [logoWidth, setLogoWidth] = useState(150)
  const [whatsappNumber, setWhatsappNumber] = useState('')
  
  const toggleMenu = () => setMenuOpen(v => !v)
  const handleLinkClick = () => setMenuOpen(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
        setMenuOpen(false) // close mobile menu when scrolling
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const apiUrl = getApiUrl()
      const res = await fetch(`${apiUrl}/settings`)
      if (!res.ok) return
      const data = await res.json()
      if (data.logo_url) setLogoUrl(data.logo_url)
      if (data.logo_text) setLogoText(data.logo_text)
      if (data.use_logo_image !== undefined) setUseLogoImage(data.use_logo_image)
      if (data.logo_width) setLogoWidth(data.logo_width)
      if (data.whatsapp_number) setWhatsappNumber(data.whatsapp_number)
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }

  // Generate WhatsApp link
  const getWhatsAppLink = () => {
    if (!whatsappNumber) return '/#pricing'
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '')
    return `https://wa.me/${cleanNumber}?text=Hi, I'm interested in a free trial For your subscription service`
  }

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
      <div className="container header-inner">
        <Link href="/" className="logo">
          {useLogoImage && logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="Logo" style={{ width: logoWidth, height: 'auto' }} />
          ) : !useLogoImage && logoText ? (
            <span>{logoText}</span>
          ) : null}
        </Link>
        <nav aria-label="Primary">
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/#pricing">Pricing</Link></li>
            <li><Link href="/channels">Channels List</Link></li>
            <li><Link href="/#faq">FAQ</Link></li>
            <li><Link href="/blog">Blog</Link></li>
          </ul>
        </nav>
        <Link href={getWhatsAppLink()} className="free-trial" target={whatsappNumber ? "_blank" : "_self"} rel={whatsappNumber ? "noopener noreferrer" : ""}>Free Trial</Link>
        {/* Burger for small screens */}
        <button
          className={`burger${menuOpen ? ' open' : ''}`}
          aria-label="Toggle navigation menu"
          aria-controls="mobile-menu"
          aria-expanded={menuOpen}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      {/* Mobile menu panel */}
      <div id="mobile-menu" className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <ul onClick={handleLinkClick}>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/#pricing">Pricing</Link></li>
          <li><Link href="/channels">Channels List</Link></li>
          <li><Link href="/#faq">FAQ</Link></li>
          <li><Link href="/blog">Blog</Link></li>
          <li className="mobile-cta"><Link href={getWhatsAppLink()} className="btn-cta" target={whatsappNumber ? "_blank" : "_self"} rel={whatsappNumber ? "noopener noreferrer" : ""}>Free Trial</Link></li>
        </ul>
      </div>
    </header>
  )
}
