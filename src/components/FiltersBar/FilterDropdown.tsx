import { MouseEventHandler, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import styled from 'styled-components'

import { FiltersContext } from '../../context/FiltersContext'
import { fetchUIDB } from '../../query_fns/fetch_uidb'
import { Checkbox } from '../Checkbox'

export const FilterDropdown = () => {
  const [filters, setFilters] = useContext(FiltersContext)
  const { data: devicesList } = useQuery({ queryKey: ['uidb'], queryFn: fetchUIDB })
  const [filter, setFilter] = useState(false)
  const filtersWrapperRef = useRef<HTMLDivElement>(null)

  const productLines = useMemo(
    () => [...new Set(devicesList?.map((device) => device.line.name) || [])].sort(),
    [devicesList]
  )

  useEffect(() => {
    const handleClickOutside: (this: Document, event: globalThis.MouseEvent) => void = (event) => {
      if (filtersWrapperRef.current && !filtersWrapperRef.current.contains(event.target as Node)) {
        setFilter(false)
      }
    }

    const handleKeyDown: (this: Document, ev: KeyboardEvent) => void = (event) => {
      if (event.key === 'Escape') setFilter(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
      setFilter(false)
    }
  }, [])

  const handleFilterChange = (productLine: string) => {
    if (filters.productLines.includes(productLine)) {
      setFilters({
        ...filters,
        productLines: [...filters.productLines.filter((product_line) => product_line !== productLine)],
      })
    } else {
      setFilters({ ...filters, productLines: [...filters.productLines, productLine] })
    }
  }

  const handleFiltersReset = () => {
    setFilters({ ...filters, productLines: [] })
  }

  const handleFilterClick: MouseEventHandler<HTMLDivElement> = (event) => {
    if (filtersWrapperRef.current === (event.target as Node)) {
      setFilter(!filter)
    }
  }

  return (
    <FiltersDropdownWrapper
      className={filter ? 'active' : 'inactive'}
      tabIndex={0}
      onClick={handleFilterClick}
      ref={filtersWrapperRef}
    >
      {`Filter`}
      <FiltersDropdown className={filter ? 'show' : 'hide'}>
        <FiltersTitle>{`Product Line`}</FiltersTitle>
        {productLines.map((productLine) => (
          <FilterRow key={productLine}>
            <Checkbox
              label={productLine}
              checked={filters.productLines.includes(productLine)}
              setChecked={() => handleFilterChange(productLine)}
            />
          </FilterRow>
        ))}
        <ResetFiltersWrapper>
          <ResetFiltersButton
            disabled={!filters.productLines.length}
            onClick={handleFiltersReset}
          >{`Reset`}</ResetFiltersButton>
        </ResetFiltersWrapper>
      </FiltersDropdown>
    </FiltersDropdownWrapper>
  )
}

const FiltersDropdownWrapper = styled.div`
  position: relative;
  padding: 0 6px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  height: 32px;
  display: flex;
  align-items: center;
  outline-offset: -1px;
  border-radius: 4px;
  border: 0;
  cursor: pointer;
  background-color: #ffffff;

  &:hover {
    background-color: var(--ui-color-grey-01);
  }

  &:focus {
    outline: 1px solid var(--ui-color-blue);
  }

  &.active {
    background-color: var(--ui-color-grey-00);
    color: var(--ui-color-blue);
  }
`

const FiltersDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #ffffff;
  box-shadow: 0px 16px 32px rgba(28, 30, 45, 0.2);
  border-radius: 8px;
  padding: 8px 0;
  box-sizing: border-box;
  transition: 0.1s ease-in-out;
  opacity: 1;
  padding: 16px;
  z-index: 10;

  &.hide {
    opacity: 0;
    pointer-events: none;
  }
`

const FiltersTitle = styled.div`
  font-size: 14px;
  font-family: 'UI Sans v7 Bold';
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 16px;
  display: flex;
  justify-content: flex-start;
`

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  margin: 8px 0;
  white-space: nowrap;
`

const ResetFiltersWrapper = styled.div`
  margin: 16px 0 0 0;
`

const ResetFiltersButton = styled.button`
  background-color: transparent;
  border: 0;
  outline: none;
  height: 20px;
  font-size: 14px;
  color: var(--ui-color-red-02);
  cursor: pointer;
  display: flex;
  justify-content: flex-start;

  &:disabled {
    color: var(--ui-color-red-01);
  }
`
