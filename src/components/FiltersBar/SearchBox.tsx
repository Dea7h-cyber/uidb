import { ChangeEventHandler, FormEventHandler, useContext, useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { generateDeviceSearchValue } from '../../utils'
import { SearchIcon } from '../../assets/SearchIcon'
import { fetchUIDB } from '../../query_fns/fetch_uidb'
import { FiltersContext } from '../../context/FiltersContext'

const findMatchingLettersAndStyle = (deviceName: string, searchValue: string) => {
  return deviceName.replace(new RegExp(`(${searchValue})`, 'i'), "<span class='bold_underlined'>$1</span>")
}

export const SearchBox = () => {
  const [localSearchWord, setLocalSearchWord] = useState<string>('')
  const [filters, setFilters] = useContext(FiltersContext)
  const { data: devicesList } = useQuery({ queryKey: ['uidb'], queryFn: fetchUIDB })
  const inputRef = useRef<HTMLInputElement>(null)
  const inputWrapperRef = useRef<HTMLFormElement>(null)
  const [searchResults, setSearchResults] = useState<Device[]>([])
  const [searchDropDown, setSearchDropDown] = useState<boolean>(false)

  useEffect(() => {
    const handleClickOutside: (this: Document, event: globalThis.MouseEvent) => void = (event) => {
      if (inputWrapperRef.current && !inputWrapperRef.current.contains(event.target as Node)) {
        setSearchDropDown(false)
      }
    }

    const handleKeyDown: (this: Document, ev: KeyboardEvent) => void = (event) => {
      if (event.key === 'Escape') setSearchDropDown(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
      setLocalSearchWord('')
      setFilters({ ...filters, searchWord: '' })
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (!localSearchWord.length) setSearchResults([])
  }, [localSearchWord])

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setLocalSearchWord(event.target.value)

    if (!event.target.value.length) setSearchDropDown(false)
    else if (searchDropDown === false) setSearchDropDown(true)

    if (devicesList && event.target.value.length)
      setSearchResults(
        devicesList.filter((device) => {
          return new RegExp(event.target.value, 'i').test(generateDeviceSearchValue(device))
        })
      )
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    setFilters({ ...filters, searchWord: localSearchWord })
    inputRef.current?.blur()
    setSearchDropDown(false)
  }

  return (
    <InputWrapper onSubmit={handleSubmit} ref={inputWrapperRef}>
      <SearchIcon className='search-icon' />
      <SearchInput
        placeholder='Search'
        value={localSearchWord}
        onChange={handleChange}
        ref={inputRef}
        onFocus={() => setSearchDropDown(true)}
      />
      <SearchResults className={!searchDropDown || !searchResults.length ? 'hide' : undefined}>
        {searchResults.map((device, index) => (
          <SearchResultRow key={device.id + index} to={`/devices/${device.id}`}>
            <SearchResultDeviceName
              dangerouslySetInnerHTML={{ __html: findMatchingLettersAndStyle(device.product.name, localSearchWord) }}
            />
            <SearchResultDeviceAbbrev>{device.product.abbrev}</SearchResultDeviceAbbrev>
          </SearchResultRow>
        ))}
      </SearchResults>
    </InputWrapper>
  )
}

const InputWrapper = styled.form`
  position: relative;
  display: flex;
  align-items: center;

  .search-icon {
    position: absolute;
    left: 8px;
    cursor: pointer;
    pointer-events: none;
  }
`

const SearchInput = styled.input`
  height: 32px;
  width: 320px;
  color: rgba(0, 0, 0, 0.45);
  background-color: #f6f6f8;
  border-radius: 4px;
  padding: 0;
  padding-left: 33px;
  font-size: 14px;
  outline-offset: -1px;
  outline: none;
  border: 0;
  box-sizing: border-box;

  &:hover,
  &:focus,
  &:active {
    background-color: var(--ui-color-grey-02);
  }

  &:focus,
  &:active {
    outline: 1px solid var(--ui-color-blue);
  }

  @media screen and (max-width: 600px) {
    width: 100%;
  }
`

const SearchResults = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 200px;
  background-color: #ffffff;
  box-shadow: 0px 16px 32px rgba(28, 30, 45, 0.2);
  border-radius: 8px;
  padding: 8px 0;
  box-sizing: border-box;
  transition: 0.1s ease-in-out;
  opacity: 1;
  overflow: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  z-index: 10;

  &::-webkit-scrollbar {
    display: none;
  }

  &.hide {
    opacity: 0;
    pointer-events: none;
  }
`

const SearchResultRow = styled(Link)`
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding: 0 8px;
  cursor: pointer;
  text-decoration: none;
  outline-offset: -1px;

  &:hover {
    background-color: var(--ui-color-grey-01);
  }

  &:focus {
    outline: 1px solid var(--ui-color-blue);
  }
`

const SearchResultDeviceName = styled.div`
  color: var(--ui-color-neutral);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 8px;
`

const SearchResultDeviceAbbrev = styled.div`
  color: var(--main-font-color);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  @media screen and (max-width: 600px) {
    display: none;
  }
`
