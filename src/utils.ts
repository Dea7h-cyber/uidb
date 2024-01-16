import { ReactEventHandler } from 'react'

export const generateDeviceSearchValue = (device: Device) => {
  return (
    device.id +
    device.line.id +
    device.line.name +
    device.product.abbrev +
    device.product.name +
    device.shortnames.join('')
  )
}

export const handleImageError: ReactEventHandler<HTMLImageElement> = (img) => {
  img.currentTarget.src = '/assets/no_image.svg'
}
