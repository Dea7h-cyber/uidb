import { useEffect, useContext, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { generateDeviceSearchValue, handleImageError } from '../utils'
import { fetchUIDB } from '../query_fns/fetch_uidb'
import { DevicesContext } from '../context/DevicesContext'
import { FiltersContext } from '../context/FiltersContext'
import { FiltersBar } from './FiltersBar'

export const Devices = () => {
  const [devices, setDevices] = useContext(DevicesContext)
  const [filters] = useContext(FiltersContext)
  const { data: devicesList, isPending, isError } = useQuery({ queryKey: ['uidb'], queryFn: fetchUIDB })

  useEffect(() => {
    if (!devicesList) return

    setDevices(
      devicesList.filter((device) => {
        if (filters.productLines.length && !filters.productLines.includes(device.line.name)) return false
        if (filters.searchWord.length)
          return new RegExp(filters.searchWord, 'i').test(generateDeviceSearchValue(device))
        return true
      })
    )
  }, [devicesList, filters, setDevices])

  const getImageSrc = useMemo(
    () => (device: Device) => {
      const [width, height] = device.icon.resolutions[filters.view === 'grid' ? 2 : 0]
      return `https://static.ui.com/fingerprint/ui/icons/${device.icon.id}_${width}x${height}.png`
    },
    [filters.view]
  )

  const isViewGrid = useMemo(() => filters.view === 'grid', [filters.view])

  return (
    <>
      <FiltersBar />
      <ContentWrapper>
        <TableWrapper className={filters.view}>
          {!isViewGrid ? (
            <TableHeader>
              <DevicePicture />
              <DeviceRowTitle>{`Name`}</DeviceRowTitle>
              <DeviceRowTitle>{`Product Line`}</DeviceRowTitle>
            </TableHeader>
          ) : null}

          {!isPending &&
            !isError &&
            devices.map((device) => (
              <DeviceWrapper key={device.id} to={`/devices/${device.id}`}>
                <DevicePicture className='device-picture'>
                  <img src={getImageSrc(device)} onError={handleImageError} alt={device.product.name} />
                </DevicePicture>
                <DeviceTitle className='device-title'>{device.product.name}</DeviceTitle>
                <DeviceProductLine className='device-product-line'>
                  {isViewGrid ? device.shortnames.join(', ') : device.line.name}
                </DeviceProductLine>
                {isViewGrid ? <ProductLineBadge>{device.line.name}</ProductLineBadge> : null}
              </DeviceWrapper>
            ))}
        </TableWrapper>
      </ContentWrapper>
    </>
  )
}

const ContentWrapper = styled.section`
  overflow: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`

const TableWrapper = styled.div`
  padding: 0 32px 32px 32px;

  &.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(178px, 1fr));
    grid-gap: 16px;
  }

  @media screen and (max-width: 360px) {
    padding: 0 16px 16px 16px;
  }
`

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 32px 1fr 1fr;
  border-bottom: 1px solid #ededf0;
  border-top: 1px solid transparent;
  font-size: 14px;
`

const DeviceWrapper = styled(Link)`
  display: grid;
  grid-template-columns: 32px 1fr 1fr;
  border-bottom: 1px solid #ededf0;
  border-top: 1px solid transparent;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  text-decoration: none;
  outline: none;
  position: relative;
  overflow: hidden;

  &:not(:first-child):hover {
    cursor: pointer;
    background-color: var(--ui-color-grey-01);
  }

  &:not(:first-child):focus,
  &:not(:first-child):active {
    border-color: var(--ui-color-blue);
  }

  .grid & {
    height: 172px;
    grid-template-rows: 100px 40px 1fr;
    grid-template-columns: auto;
    border: 1px solid var(--ui-color-grey-02);
    border-radius: 8px;
    background-color: #ffffff;

    &:hover {
      .device-picture {
        background-color: var(--ui-color-grey-01);
      }

      background-color: var(--ui-color-grey-00);
    }

    &:focus {
      border-color: var(--ui-color-blue);
    }

    .device-title {
      margin-top: 8px;
      height: auto;
      align-items: flex-start;
      color: rgba(0, 0, 0, 0.85);
    }

    .device-product-line {
      height: auto;
      align-items: flex-end;
      margin: 0;
      margin-bottom: 8px;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.45);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
`

const DeviceRowTitle = styled.div`
  font-family: 'UI Sans v7 Bold';
  color: rgba(0, 0, 0, 0.85);
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 8px;
`

const DevicePicture = styled.div`
  width: 36px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 20px;
    height: 20px;
  }

  .grid & {
    width: 100%;
    height: 100px;
    background-color: var(--ui-color-grey-00);

    img {
      width: auto;
      height: 84px;
    }
  }
`

const DeviceTitle = styled.div`
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 8px;
  white-space: nowrap;
  overflow: hidden;
`

const DeviceProductLine = styled.div`
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 8px;
`

const ProductLineBadge = styled.div`
  position: absolute;
  top: 3px;
  right: 3px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  background-color: #ffffff;
  padding: 2px 4px;
  font-size: 12px;
  color: var(--ui-color-blue);
  line-height: 16px;
`
