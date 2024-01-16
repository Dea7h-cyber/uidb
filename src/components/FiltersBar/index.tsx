import { useContext } from 'react'
import styled from 'styled-components'

import { DevicesContext } from '../../context/DevicesContext'

import { SearchBox } from './SearchBox'
import { ViewChanger } from './ViewChanger'
import { FilterDropdown } from './FilterDropdown'

export const FiltersBar = () => {
  const [devices] = useContext(DevicesContext)

  return (
    <FiltersBarWrapper>
      <SearchWrapper>
        <SearchBox />
        <MatchCount>{devices?.length ? `${devices.length} Devices` : null}</MatchCount>
      </SearchWrapper>
      <FiltersWrapper>
        <ViewChanger />
        <FilterDropdown />
      </FiltersWrapper>
    </FiltersBarWrapper>
  )
}

const FiltersBarWrapper = styled.section`
  display: flex;
  height: 64px;
  padding: 0 32px;
  align-items: center;
  justify-content: space-between;
`

const SearchWrapper = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
`

const MatchCount = styled.div`
  margin-left: 16px;
  font-size: 12px;
  color: #bdbdbd;

  @media screen and (max-width: 450px) {
    display: none;
  }
`

const FiltersWrapper = styled.div`
  height: 32px;
  display: flex;
  align-items: center;
`
