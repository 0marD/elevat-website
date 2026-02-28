import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'ÉLEVA. — Agencia de Viajes de Lujo en México'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0A0A0A',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Background radial glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '700px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(92,26,46,0.4) 0%, transparent 70%)',
          }}
        />

        {/* Gold top line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)',
          }}
        />

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', zIndex: 1 }}>
          {/* Label */}
          <div
            style={{
              color: 'rgba(201,168,76,0.7)',
              fontSize: '14px',
              letterSpacing: '6px',
              textTransform: 'uppercase',
              fontFamily: 'sans-serif',
            }}
          >
            AGENCIA DE VIAJES DE AUTOR · MÉXICO
          </div>

          {/* Logo */}
          <div
            style={{
              fontSize: '96px',
              fontWeight: 300,
              color: '#F5F0E8',
              letterSpacing: '12px',
              fontFamily: 'serif',
              lineHeight: 1,
            }}
          >
            ÉLEVA<span style={{ color: '#C9A84C' }}>.</span>
          </div>

          {/* Gold divider */}
          <div
            style={{
              width: '80px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)',
            }}
          />

          {/* Tagline */}
          <div
            style={{
              color: 'rgba(245,240,232,0.6)',
              fontSize: '22px',
              fontStyle: 'italic',
              fontFamily: 'serif',
              fontWeight: 300,
              letterSpacing: '2px',
            }}
          >
            "Cada destino, una experiencia diseñada sólo para ti."
          </div>

          {/* CTA */}
          <div
            style={{
              marginTop: '16px',
              border: '1px solid #C9A84C',
              color: '#C9A84C',
              padding: '10px 32px',
              fontSize: '12px',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              fontFamily: 'sans-serif',
            }}
          >
            elevaviajes.shop
          </div>
        </div>

        {/* Gold bottom line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)',
          }}
        />
      </div>
    ),
    { ...size },
  )
}
