import axios from 'axios'

export const fetchUIDB = async () => {
  const { data } = await axios.get<{ devices: Device[] }>('https://static.ui.com/fingerprint/ui/public.json')
  return data.devices
}
