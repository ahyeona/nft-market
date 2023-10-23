import styled from "styled-components";

export const ListDiv = styled.div`
    /* & details {
        padding : 10px;
    } */

    & summary {
        padding:10px;
        border-top: 1px solid black;
        /* border-bottom: 1px solid black; */
        height:35px;
        line-height:35px;
        font-size: 18px;
        font-weight:bold;
        cursor:pointer;
    }

    & summary::marker {
        font-size: 0;
    }

`