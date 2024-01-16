import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import { fetchUIDB } from '../query_fns/fetch_uidb'
import { ActionsBar } from './ActionsBar'

export const DeviceDetails = () => {
  const { data: devicesList, isPending, isError } = useQuery({ queryKey: ['uidb'], queryFn: fetchUIDB })
  const { id } = useParams()
  const [showJSON, setShowJSON] = useState(false)
  const jsonWrapperRef = useRef<HTMLPreElement>(null)

  const getImageSrc = (device: Device) => {
    if (!device?.icon?.resolutions || !device.icon.resolutions.length) return
    const [width, height] =
      device.icon.resolutions.find((r) => r[0] === 255 || r[0] === 256) ||
      device.icon.resolutions[device?.icon?.resolutions.length - 1]

    return `https://static.ui.com/fingerprint/ui/icons/${device?.icon?.id}_${width}x${height}.png`
  }

  const currentDevice = useMemo<Device | null>(
    () => devicesList?.find((device) => device.id === id) || null,
    [id, devicesList]
  )

  const getDeviceMaxPower = (device: Device) => {
    if (!device.unifi?.network?.radios || !Object.values(device.unifi?.network?.radios).length) return 'n/a'
    const maxPower = Math.max(...Object.values(device.unifi.network.radios).map((radio) => radio.maxPower))
    return !maxPower ? 'n/a' : maxPower + ' W'
  }

  const getDeviceMaxSpeed = (device: Device) => {
    if (device.unifi?.network?.ethernetMaxSpeedMegabitsPerSecond)
      return device.unifi?.network?.ethernetMaxSpeedMegabitsPerSecond + ' Mbps'

    return 'n/a'
  }

  const handleShowJSON = () => {
    setShowJSON(!showJSON)
  }

  useEffect(() => {
    if (showJSON) jsonWrapperRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [showJSON])

  return (
    <>
      <ActionsBar />
      {currentDevice && !isPending && !isError ? (
        <ContentWrapper>
          <DeviceDetailsWrapper>
            <DeviceImageWrapper>
              <img src={getImageSrc(currentDevice)} alt={currentDevice.product.name} />
            </DeviceImageWrapper>
            <div></div>
            <DetailsWrapper>
              <DeviceTitle>
                <DeviceName>{currentDevice.product.name}</DeviceName>
                <DeviceLine>{currentDevice.line.name}</DeviceLine>
              </DeviceTitle>
              <DeviceDetailsList>
                <DeviceDetailsListRow>
                  <DeviceDetailsListRowName>{`Product Line`}</DeviceDetailsListRowName>
                  <DeviceDetailsListRowValue>{currentDevice.line.name}</DeviceDetailsListRowValue>
                </DeviceDetailsListRow>
                <DeviceDetailsListRow>
                  <DeviceDetailsListRowName>{`ID`}</DeviceDetailsListRowName>
                  <DeviceDetailsListRowValue>{currentDevice.line.id}</DeviceDetailsListRowValue>
                </DeviceDetailsListRow>
                <DeviceDetailsListRow>
                  <DeviceDetailsListRowName>{`Name`}</DeviceDetailsListRowName>
                  <DeviceDetailsListRowValue>{currentDevice.product.name}</DeviceDetailsListRowValue>
                </DeviceDetailsListRow>
                <DeviceDetailsListRow>
                  <DeviceDetailsListRowName>{`Short Name`}</DeviceDetailsListRowName>
                  <DeviceDetailsListRowValue>{currentDevice.shortnames[0]}</DeviceDetailsListRowValue>
                </DeviceDetailsListRow>
                <DeviceDetailsListRow>
                  <DeviceDetailsListRowName>{`Max Power`}</DeviceDetailsListRowName>
                  <DeviceDetailsListRowValue>{getDeviceMaxPower(currentDevice)}</DeviceDetailsListRowValue>
                </DeviceDetailsListRow>
                <DeviceDetailsListRow>
                  <DeviceDetailsListRowName>{`Speed`}</DeviceDetailsListRowName>
                  <DeviceDetailsListRowValue>{getDeviceMaxSpeed(currentDevice)}</DeviceDetailsListRowValue>
                </DeviceDetailsListRow>
                <DeviceDetailsListRow>
                  <DeviceDetailsListRowName>{`Number of Ports`}</DeviceDetailsListRowName>
                  <DeviceDetailsListRowValue>
                    {currentDevice.unifi?.network?.numberOfPorts || 'n/a'}
                  </DeviceDetailsListRowValue>
                </DeviceDetailsListRow>
              </DeviceDetailsList>
            </DetailsWrapper>
          </DeviceDetailsWrapper>
          <SeeJSON onClick={handleShowJSON}>{!showJSON ? 'See All Details as JSON' : 'Hide JSON'}</SeeJSON>
          {showJSON && (
            <div>
              <JsonWrapper ref={jsonWrapperRef}>{JSON.stringify(currentDevice, null, 2)}</JsonWrapper>
            </div>
          )}
        </ContentWrapper>
      ) : null}
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

  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  padding: 16px;

  @media screen AND (max-width: 768px) {
    padding: 16px 0 0 0;
  }
`

const DeviceDetailsWrapper = styled.div`
  width: 768px;
  height: 296px;
  display: grid;
  grid-template-columns: 292px 32px 1fr;

  @media screen and (max-width: 768px) {
    grid-template-rows: 292px 32px 1fr;
    grid-template-columns: none;
    width: auto;
    height: auto;
  }
`

const DeviceImageWrapper = styled.div`
  padding: 16px;
  background-color: var(--ui-color-grey-00);
  border-radius: 8px;

  img {
    width: 100%;
    height: 100%;
  }
`

const DetailsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`

const DeviceDetailsList = styled.div`
  display: flex;
  flex-direction: column;
`

const DeviceDetailsListRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
  font-size: 14px;
  line-height: 20px;
`

const DeviceDetailsListRowName = styled.div`
  color: rgba(0, 0, 0, 0.85);
`
const DeviceDetailsListRowValue = styled.div`
  color: rgba(0, 0, 0, 0.45);
`

const DeviceTitle = styled.div`
  display: grid;
  grid-gap: 4px;
`

const DeviceName = styled.div`
  font-size: 20px;
  line-height: 28px;
  color: rgba(0, 0, 0, 0.85);
`

const DeviceLine = styled.div`
  font-size: 14px;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.45);

  @media screen AND (max-width: 768px) {
    display: none;
  }
`

const SeeJSON = styled.button`
  border: 0;
  background-color: #ffffff;
  color: var(--ui-color-blue);
  font-size: 14px;
  line-height: 20px;
  margin: 16px 0;
  cursor: pointer;
  outline-offset: -1px;
  padding: 4px;

  &:focus {
    outline: 1px solid var(--ui-color-blue);
  }
`

const JsonWrapper = styled.pre`
  margin: 0 0 16px 0;
  padding: 32px;
  background-color: var(--ui-color-grey-00);
  width: 768px;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 8px;

  @media screen AND (max-width: 768px) {
    width: 100vw;
    margin: 0;
    border-radius: 0;
    overflow: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`
