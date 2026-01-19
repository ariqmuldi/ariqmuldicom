import { ImageResponse } from 'next/og'
 
// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'
 
// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 12,
          background: '#2c2e3f', // dark purple from theme
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#F4EBD3', // cream from theme
          borderRadius: '50%',
          fontWeight: 900,
          border: '1px solid #555879',
          lineHeight: 1,
        }}
      >
        AM
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  )
}
