import axios from 'axios'
import { getJsonUrl } from '../utils'

export const fetchUIDB = async () => {
  const { data } = await axios.get<{ devices: Device[] }>(getJsonUrl())
  return data.devices
}
