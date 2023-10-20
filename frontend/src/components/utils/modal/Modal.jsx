import React, { useEffect, useState } from 'react'
import { Container, ModalDiv } from './modal.styled'

const Modal = ({setModal, title, content}) => {

    // useEffect(()=>{
    //     if (modal) {
    
    //     } else {
    
    //     }
    // }, [modal]);

  return (
    <Container>
        <ModalDiv>
            <h1>{title}</h1>
            {content}
            <button onClick={()=>{setModal(false)}}>X</button>

        </ModalDiv>
    </Container>
  )
}

export default Modal