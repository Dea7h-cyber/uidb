import { createContext } from 'react'

export type Filters = {
  searchWord: string
  productLines: string[]
  view: 'list' | 'grid'
}

type FiltersContextType = [Filters, React.Dispatch<React.SetStateAction<Filters>>]

export const FiltersContext = createContext<FiltersContextType>([
  { searchWord: '', productLines: [], view: 'list' },
  () => {},
])
