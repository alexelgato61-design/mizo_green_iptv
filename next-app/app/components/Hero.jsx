'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import devicesImg from '../../public/images/devices.webp'
import tvImg from '../../public/images/tv-1024x636-1-1.webp'

export default function Hero({ settings }){
  const whatsappNumber = settings?.whatsapp_number || ''
  const heroHeading = settings?.hero_heading || 'POD IPTV <span class="accent">Premium</span><br/>TV Service'
  const heroParagraph = settings?.hero_paragraph || 'Enjoy premium TV with POD IPTV. Access a wide range of channels and exclusive content, with over 40,000 channels and more than 54,000 VOD.'

  const getWhatsAppLink = () => {
    if (!whatsappNumber) return '/#pricing'
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '')
    return `https://wa.me/${cleanNumber}?text=Hi,  I'm interested in a free trial For your subscription service`
  }
  
  return (
    <section className="hero" id="home">
      <div className="container hero-inner">
        <div className="hero-left">
          <h1 dangerouslySetInnerHTML={{ __html: heroHeading }} />
          <p className="lead">{heroParagraph}</p>
          <div className="hero-ctas">
            <Link href={getWhatsAppLink()} className="btn-cta" target={whatsappNumber ? "_blank" : "_self"} rel={whatsappNumber ? "noopener noreferrer" : ""}>Free Trial</Link>
          </div>
          <div className="devices">
            <Image src={devicesImg} alt="devices" width={640} height={80} style={{width:'50%', height:'auto'}} />
          </div>
        </div>
        <div className="hero-right">
          <Image src={tvImg} alt="tv" width={1024} height={636} priority style={{width:'100%', height:'auto'}} />
        </div>
      </div>
    </section>
  )
}
