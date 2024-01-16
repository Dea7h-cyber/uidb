import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import styled from 'styled-components'

import { IconArrow } from '../assets/IconArrow'
import { fetchUIDB } from '../query_fns/fetch_uidb'

export const ActionsBar = () => {
  const { data: devicesList } = useQuery({ queryKey: ['uidb'], queryFn: fetchUIDB })
  const { id } = useParams()
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/')
  }

  const handleDeviceChange = (action: 'prev' | 'next') => {
    if (!devicesList?.length) return
    const isNext = action === 'next'

    const currentDeviceIndex = devicesList.findIndex((device) => device.id === id)
    let nextDevice = devicesList[currentDeviceIndex + (isNext ? 1 : -1)]
    if (!nextDevice) nextDevice = devicesList[isNext ? 0 : devicesList.length - 1]
    navigate('/devices/' + nextDevice.id)
  }

  return (
    <ActionBarWrapper>
      <ArrowButton onClick={handleBack}>
        <ArrowWrapper>
          <IconArrow />
        </ArrowWrapper>
        <ButtonText>Back</ButtonText>
      </ArrowButton>
      <ArrowGroup>
        <ArrowButton onClick={() => handleDeviceChange('prev')}>
          <ArrowWrapper>
            <IconArrow />
          </ArrowWrapper>
        </ArrowButton>
        <ArrowButton onClick={() => handleDeviceChange('next')}>
          <ArrowWrapper className='right'>
            <IconArrow />
          </ArrowWrapper>
        </ArrowButton>
      </ArrowGroup>
    </ActionBarWrapper>
  )
}

const ActionBarWrapper = styled.section`
  display: flex;
  height: 64px;
  padding: 0 32px;
  align-items: center;
  justify-content: space-between;
`

const ArrowButton = styled.button`
  border: 0;
  display: flex;
  align-items: center;
  background-color: #ffffff;
  padding: 4px;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.06), 0px 8px 24px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  height: 20px;
  box-sizing: content-box;
  cursor: pointer;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  outline-offset: -1px;

  &:focus {
    outline: 1px solid var(--ui-color-blue);
  }
`

const ArrowWrapper = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  &.right {
    transform: rotate(180deg);
  }
`

const ButtonText = styled.span``

const ArrowGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`
