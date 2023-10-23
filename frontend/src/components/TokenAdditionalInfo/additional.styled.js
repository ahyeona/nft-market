import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
`

export const AdditionalInfoDiv = styled.div`
    background-color: aliceblue;
    margin-right: 20px;
    margin-bottom: 20px;
    border-radius: 20px;
    padding: 20px;
    box-shadow: 3px 3px 3px 3px #ddd;
    & input {
        width : 30px;
    }
`