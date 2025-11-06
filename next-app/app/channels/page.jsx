'use client'
import { useMemo } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function ChannelsPage() {
  // Array of image names from Channels-Icons folder
  const images = [
    '1.webp',
    '3.webp',
    '4.webp',
    '6.webp',
    '11.webp',
    '17.webp',
    '18.webp',
    '20.webp',
    '26.webp',
    '29.webp',
    '30.webp',
    '32.webp',
    '33.webp',
    '35.webp',
    '40.webp',
    '42.webp',
    '43.webp',
    '44.webp',
    '110.webp',
    'c22.webp',
    'c30.webp',
    'c31.webp',
    'c34.webp',
    'c36.webp',
    'c37.webp',
  ]

  // Duplicate images for seamless infinite scroll
  const duplicatedImages = useMemo(() => [...images, ...images], [])
  const duration = Math.max(12, Math.round(10 + images.length * 1.5))

  return (
    <>
      <Header />
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        paddingTop: '100px',
        paddingBottom: '80px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 5%'
        }}>
          {/* Page Title */}
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: '800',
            textAlign: 'center',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #7dff00 0%, #5bc700 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Channels List
          </h1>
          
          <p style={{
            textAlign: 'center',
            color: '#aaa',
            fontSize: '1.1rem',
            marginBottom: '50px',
            maxWidth: '700px',
            margin: '0 auto 50px'
          }}>
            Explore our comprehensive list of available channels across all categories
          </p>

          {/* Video Container */}
          <div style={{
            maxWidth: '900px',
            margin: '0 auto 60px',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(125, 255, 0, 0.15)',
            border: '1px solid rgba(125, 255, 0, 0.2)'
          }}>
            <div style={{
              position: 'relative',
              paddingBottom: '56.25%', // 16:9 aspect ratio
              height: 0,
              overflow: 'hidden'
            }}>
              <iframe
                src="https://player.vimeo.com/video/916781453?autoplay=1&playsinline=1&color&autopause=0&loop=0&muted=1&title=1&portrait=1&byline=1&h=2ef70cf25f#t="
                title="Channels List Video"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* Image Slider Section */}
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto'
          }}>
            <h2 style={{
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              fontWeight: '700',
              textAlign: 'center',
              marginBottom: '40px',
              color: '#7dff00'
            }}>
              Channel Categories
            </h2>

            {/* Infinite Scroll Container */}
            <div className="movie-strip">
              <div className="movie-row" style={{ '--movie-scroll-duration': `${duration}s` }}>
                {duplicatedImages.map((image, index) => (
                  <div className="movie-card" key={index} style={{ width: 120 }}>
                    <img
                      src={`/Channels-Icons/${image}`}
                      alt={`Channel ${index + 1}`}
                      style={{
                        width: '100%',
                        height: 'auto',
                        objectFit: 'contain'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
