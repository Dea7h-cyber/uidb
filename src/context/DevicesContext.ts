import { createContext } from 'react'

type DevicesContextType = [Device[], React.Dispatch<React.SetStateAction<Device[]>>]

export const DevicesContext = createContext<DevicesContextType>([[], () => {}])
