import styled from "styled-components";
import { Btn } from "../components/utils/btn.styled";

export const NavDiv = styled.div`
    width: 100%;
    height: 80px;
    background-color: aliceblue;
    display: flex;
    align-items: center;
    padding-left: 20px;
    padding-right: 20px;
    position: relative;

    & div:nth-child(1) {
        margin-right: 20px;
    }

    & div:nth-child(3) {
        position: absolute;
        right: 20px;
        display: flex;
    }

    & ${Btn} {
        /* margin-left: 6px; */
    }
`




