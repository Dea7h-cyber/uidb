import { useContext } from 'react'
import styled from 'styled-components'

import { IconFilterList } from '../../assets/IconFilterList'
import { IconFilterGrid } from '../../assets/IconFilterGrid'

import { Filters, FiltersContext } from '../../context/FiltersContext'

export const ViewChanger = () => {
  const [filters, setFilters] = useContext(FiltersContext)

  const handleViewChange = (view: Filters['view'], event?: React.KeyboardEvent<HTMLDivElement>) => {
    if (filters.view !== view && (!event || ['Enter', ' '].includes(event.key))) {
      setFilters({ ...filters, view })
    }
  }

  return (
    <ViewChangerWrapper>
      <IconBody
        tabIndex={0}
        className={filters.view === 'list' ? 'active' : undefined}
        onKeyDown={(event) => handleViewChange('list', event)}
        onClick={() => handleViewChange('list')}
      >
        <IconFilterList />
      </IconBody>
      <IconBody
        tabIndex={0}
        className={filters.view === 'grid' ? 'active' : undefined}
        onKeyDown={(event) => handleViewChange('grid', event)}
        onClick={() => handleViewChange('grid')}
      >
        <IconFilterGrid />
      </IconBody>
    </ViewChangerWrapper>
  )
}

const ViewChangerWrapper = styled.div`
  padding: 0 8px;
  display: flex;

  svg {
    display: block;
  }
`

const IconBody = styled.div`
  padding: 6px;
  border-radius: 4px;
  outline-offset: -1px;
  cursor: pointer;

  &:hover {
    background-color: var(--ui-color-grey-01);
  }

  &:focus {
    outline: 1px solid var(--ui-color-blue);
  }

  &.active {
    background-color: var(--ui-color-grey-00);

    svg .focus_path {
      fill: var(--ui-color-blue);
    }
  }
`
