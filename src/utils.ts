import { ReactEventHandler } from 'react'
import { ORIGIN } from './OriginSelect';
import { IMAGENAME } from './ImageSelect';

export const getJsonUrl = () => {
  return `${ORIGIN}/fingerprint/ui/public.json`;
}


export const getImgHiresUrl = (
  device: Device,
) => {
  const imageId = device.images[IMAGENAME];
  if(!imageId) {
    return undefined;
  };
  return `${ORIGIN}/fingerprint/ui/images/${device.id}/${IMAGENAME}/${imageId}.png`;
};


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
