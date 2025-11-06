import React from 'react'
import Image from 'next/image'

export default function SupportedDevices({ settings }) {
  const defaultParagraph = 'Watch your favorite content on any device, anywhere. Our IPTV service is compatible with all major platforms including Smart TVs, Android, iOS, Windows, Mac, Fire TV Stick, and more. Enjoy seamless streaming across multiple devices with just one subscription.'
  const paragraph = settings?.supported_devices_paragraph || defaultParagraph

  return (
    <section className="supported-devices" style={{ padding: '1rem 0', background: '#0a0a0a' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#fff' }}>
          Supported <span className="accent">Devices</span>
        </h2>
        <p style={{ 
          fontSize: '1.1rem', 
          color: '#b0b0b0', 
          maxWidth: '800px', 
          margin: '0 auto 50px', 
          lineHeight: '1.8' 
        }}>
          {paragraph}
        </p>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          marginTop: '1rem' 
        }}>
          <Image 
            src="/images/Supported-Devices/Suppordted-Devices.png"
            alt="Supported Devices - Smart TV, Android, iOS, Fire Stick, Mac, Windows"
            width={1200}
            height={400}
            style={{ 
              width: '100%', 
              maxWidth: '900px', 
              height: 'auto',
              borderRadius: '12px'
            }}
            priority={false}
          />
        </div>
      </div>
    </section>
  )
}
