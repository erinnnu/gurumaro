type MascotPose = 'base' | 'like' | 'nope' | 'match' | 'thinking'

interface MascotProps {
  pose: MascotPose
  size?: number
  style?: React.CSSProperties
}

export function Mascot({ pose, size = 120, style }: MascotProps) {
  return (
    <img
      src={`/img/mascot_${pose}.png`}
      alt={`ぐるまろくん`}
      style={{
        width: size,
        height: size * (512 / 465),
        objectFit: 'contain',
        display: 'block',
        ...style,
      }}
    />
  )
}
