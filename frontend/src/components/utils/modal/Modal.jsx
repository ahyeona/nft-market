import React, { useEffect, useState } from 'react'
import { CloseSpan, Container, ModalDiv } from './modal.styled'

const Modal = ({setModal, title, content}) => {

  document.body.style.overflow = "hidden";
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
            <CloseSpan onClick={()=>{setModal(false);}}>&#215;</CloseSpan>

        </ModalDiv>
    </Container>
  )
}

export default Modal