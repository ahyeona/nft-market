import React from 'react'
import { NavDiv } from './nav.styled'
import { Btn } from '../components/utils/btn.styled'
import { useNavigate } from 'react-router-dom'

const Nav = ({user}) => {
  const nav = useNavigate();

  return (
    <NavDiv>
        {user.account}<br/>
        {user.balance}

        <Btn onClick={()=>{nav("/register")}}>등록</Btn>
        <Btn onClick={()=>{nav("/mypage")}}>마이페이지</Btn>

    </NavDiv>
  )
}

export default Nav