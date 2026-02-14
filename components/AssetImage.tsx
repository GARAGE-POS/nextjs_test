import { getAssetPath } from '@/lib/helpers'
import Image from 'next/image'

export const AssetImage = (props: React.ComponentProps<typeof Image>) => {
  const { src, ...rest } = props

  return (
    <Image
      {...rest}
      alt={rest.alt ?? 'picture'}
      src={typeof src === 'string' ? getAssetPath(src) : src}
    />
  )
}
