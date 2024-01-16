import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { UbiquitiLogo } from '../assets/Logo'

export const Header = () => {
  return (
    <HeaderWrapper>
      <LogoWrapper to='/'>
        <UbiquitiLogo />
      </LogoWrapper>
      <PageTitle>{`Devices`}</PageTitle>
      <DeveloperName>{`Emil Nikolov`}</DeveloperName>
    </HeaderWrapper>
  )
}

const HeaderWrapper = styled.header`
  display: grid;
  grid-template-columns: 50px 1fr auto;
  height: 50px;
  width: 100vw;
  background-color: #f4f5f6;
  align-items: center;
`

const LogoWrapper = styled(Link)`
  width: 50px;
  height: 50px;
  cursor: pointer;
  outline-offset: -1px;

  svg {
    width: 50px;
    height: 50px;

    path {
      fill: var(--ui-color-neutral);
    }
  }

  &:hover svg path {
    fill: var(--ui-color-blue);
  }

  &:focus {
    svg path {
      fill: var(--ui-color-neutral);
    }

    outline: 1px solid var(--ui-color-blue);
  }
`

const PageTitle = styled.div`
  margin-left: 8px;
  font-size: 14px;
`

const DeveloperName = styled.div`
  margin-right: 32px;
  font-size: 14px;
`
