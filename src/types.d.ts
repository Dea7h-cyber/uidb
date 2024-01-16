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

  icon: {
    id: string
    resolutions: [number, number][]
  }

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
