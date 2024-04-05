

type DeviceImages = {
  default: string
  nopadding?: string
  topology?: string
}

type DeviceImageName = keyof DeviceImages

interface Device {
  id: string

  shortnames: string[]

  line: {
    id: string
    name: string
  }

  product: {
    abbrev: string
    name: string
  }

  images: DeviceImages

  unifi?: {
    network?: {
      ethernetMaxSpeedMegabitsPerSecond?: number
      numberOfPorts?: number
      radios?: {
        '6e'?: { gain: number; maxPower: number; maxSpeedMegabitsPerSecond: number }
        na: { gain: number; maxPower: number; maxSpeedMegabitsPerSecond: number }
        ng: { gain: number; maxPower: number; maxSpeedMegabitsPerSecond: number }
      }
    }
  }
}