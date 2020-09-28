import React from 'react'
// components
import Button from './../../UIElements/Buttons/Button/Button'
// styles
import './styles.css'

const Modal = (props) => {
  const { text, onYesClick, onNoClick } = props
  return (
    <div className="modal_container">
      <div className="modal">
        <div>{text}</div>
        <Button name={'yes'} onClick={() => onYesClick()} />
        <Button name={'no'} onClick={() => onNoClick()} />
      </div>
    </div>
  )
}

export default Modal