import { getAssetPath } from '@/lib/helpers'
import Image from 'next/image'

type AssetImageProps = Omit<React.ComponentProps<typeof Image>, 'alt'> & {
  alt?: string
}

export const AssetImage = (props: AssetImageProps) => {
  const { src, ...rest } = props

  return (
    <Image
      {...rest}
      alt={rest.alt ?? 'picture'}
      src={typeof src === 'string' ? getAssetPath(src) : src}
    />
  )
}
