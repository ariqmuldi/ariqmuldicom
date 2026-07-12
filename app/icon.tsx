import { ImageResponse } from 'next/og'

// Image metadata
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

// Favicon — concept F3, the "whoami echo": lowercase "am" + a block cursor, on a dark square
// with a 1px hairline. Square (no border-radius) so the mark matches the site's no-radius system,
// replacing the old bold-"AM" circle. Colors are the theme tokens from app/globals.css.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#23242f', // --dark-bg
          border: '1px solid #555879', // --accent hairline
          color: '#f4ebd3', // --dark-head (cream)
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: '-0.03em',
          lineHeight: 1,
        }}
      >
        {/* inner row needs display:flex — satori requires it on any element with >1 child */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          am
          {/* block cursor */}
          <div style={{ width: 4, height: 12, marginLeft: 1.5, background: '#f4ebd3' }} />
        </div>
      </div>
    ),
    { ...size }
  )
}

// Optional — exact IBM Plex Mono glyphs (satori's default font is a sans, which still reads fine
// at 16–32px). To match the site font, read a .ttf and pass it via the ImageResponse `fonts`
// option, then add `fontFamily: 'IBM Plex Mono'` to the outer div:
//
//   import { readFile } from 'node:fs/promises'
//   import { join } from 'node:path'
//   const plex = await readFile(join(process.cwd(), 'assets/IBMPlexMono-Bold.ttf'))
//   return new ImageResponse(<...>, {
//     ...size,
//     fonts: [{ name: 'IBM Plex Mono', data: plex, weight: 700, style: 'normal' }],
//   })
