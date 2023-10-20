import styled from "styled-components";
import { BigImg } from "./bigImg.styled";

export const Label = styled.label`
    width: 200px;
    font-weight: bold;
`
// export const Input = styled.input

export const labelInputDiv = styled.div`
    width: ${(props) => props.width ? props.width : "500px"};
    height: ${(props) => props.height ? props.height : "100px"};
    display: flex;
    background-color: beige;

`
export const ImgDiv = styled.div`
    width: 500px;
    height: 500px;
    border: 1px solid black;
`

export const TextDiv = styled.div`

`


export const Container = styled.div`
    width: 80%;
    background-color: bisque;
    display: flex;

    & ${ImgDiv} {

    }
`