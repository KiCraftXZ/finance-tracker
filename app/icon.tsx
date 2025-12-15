import { ImageResponse } from 'next/og'

// Image metadata
export const contentType = 'image/png'

export function generateImageMetadata() {
    return [
        {
            contentType: 'image/png',
            size: { width: 192, height: 192 },
            id: 'small',
        },
        {
            contentType: 'image/png',
            size: { width: 512, height: 512 },
            id: 'medium',
        },
    ]
}

export default function Icon({ id }: { id: string }) {
    const isSmall = id === 'small';
    const size = isSmall ? 192 : 512;
    const fontSize = isSmall ? 100 : 250;

    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: fontSize,
                    background: 'linear-gradient(to bottom right, #111827, #000000)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    borderRadius: isSmall ? '30px' : '80px',
                    fontFamily: 'sans-serif',
                    fontWeight: 'bold',
                    border: '2px solid #333',
                }}
            >
                SF
            </div>
        ),
        {
            width: size,
            height: size,
        }
    )
}
