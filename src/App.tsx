import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import styled from 'styled-components'

import { DevicesContext } from './context/DevicesContext'

import { Header } from './components/Header'
import { Devices } from './components/Devices'
import { DeviceDetails } from './components/DeviceDetails'

import './main.css'
import { Filters, FiltersContext } from './context/FiltersContext'
import useLocalStorageState from './useLocalStorageState'

export const App = () => {
  const [devices, setDevices] = useState<Device[]>([])
  const [filters, setFilters] = useLocalStorageState<Filters>('uidb_filters', { searchWord: '', productLines: [], view: 'list' })

  return (
    <AppWrapper>
      <FiltersContext.Provider value={[filters, setFilters]}>
        <DevicesContext.Provider value={[devices, setDevices]}>
          <Header />
          <Routes>
            <Route path='/devices/:id' Component={DeviceDetails} />
            <Route path='/devices' Component={Devices} />
            <Route path='/' Component={Devices} />
          </Routes>
        </DevicesContext.Provider>
      </FiltersContext.Provider>
    </AppWrapper>
  )
}

const AppWrapper = styled.main`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: grid;
  grid-template-rows: 50px 64px 1fr;
`
