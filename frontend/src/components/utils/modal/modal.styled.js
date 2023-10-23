import styled from "styled-components";

export const Container = styled.div`
    background-color: rgba(100, 100, 100, 0.5);
    width: 100vw;
    height: 100vh;
    position: absolute;
    left: 0;
    top: 0;
`

export const ModalDiv = styled.div`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    border-radius: 20px;
    width: 80%;
    height: 600px;
    justify-content: center;
`