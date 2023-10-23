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
    display: flex;
    justify-content: center;
    align-items: center;
`
export const Title = styled.p`
    font-weight: bold;
    font-size: 18px;
`

export const Content = styled.p`
    font-size: 16px;
`
export const ContentDiv = styled.div`
    display: flex;
    align-items: center;
    width: 500px;
    & ${Title} {
        width: 20%;
    }
    & ${Content} {
        width: 80%;
    }
    & input {
        width: 80%;
        height: 24px;
    }
`

export const TextDiv = styled.div`
    margin : auto 0;
`


export const Container = styled.div`
    width: 80%;
    background-color: bisque;
    display: flex;
    margin: 0 auto;

    & ${ImgDiv} {

    }
`