import styled from "styled-components";
import { NftDiv } from "../nft/nft.styled";

export const NftListDiv = styled.div`
    display: flex;
    flex-wrap: wrap;

    & ${NftDiv} {
        margin-right: 10px;
    }
`