import { KeyboardEventHandler } from 'react'
import styled from 'styled-components'

interface Props {
  label: string
  defaultChecked?: boolean
  checked: boolean
  setChecked: () => void
}

export const Checkbox = ({ label, checked, setChecked }: Props) => {
  const handleCheck: KeyboardEventHandler<HTMLLabelElement> = (event) => {
    const isClicked = ['Enter', ' '].includes(event.key)
    if (isClicked) setChecked()
  }

  return (
    <CheckboxWrapper tabIndex={0} onKeyDown={handleCheck}>
      <Checkmark type='checkbox' checked={checked} onClick={() => setChecked()} />
      <InputVisual checked={checked} className='input-visual' />
      <span>{label}</span>
    </CheckboxWrapper>
  )
}

const CheckboxWrapper = styled.label`
  border-radius: 4px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  line-height: 20px;
  display: flex;
  align-items: center;
  background: none;
  padding: 0 2px;
  box-sizing: border-box;
  border: 1px solid transparent;
  outline: none;
  cursor: pointer;
  user-select: none;

  &:focus {
    border: 1px solid var(--ui-color-blue);
  }

  &:hover .input-visual {
    border-color: var(--ui-color-blue);
  }
`

const Checkmark = styled.input`
  display: none;
`

const InputVisual = styled.span<{ checked: boolean }>`
  display: block;
  width: 16px;
  height: 16px;
  margin-right: 8px;
  border: 1px solid var(--ui-color-neutral-00);
  box-sizing: border-box;
  border-radius: 4px;

  ${({ checked }) =>
    checked
      ? {
          border: 0,
          background: "url('/assets/checked.svg') no-repeat",
        }
      : null}
`
