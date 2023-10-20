import React from 'react'
import { NavDiv } from './nav.styled'
import { Btn } from '../components/utils/btn.styled'
import { useNavigate } from 'react-router-dom'

const Nav = ({user}) => {
  const nav = useNavigate();
  console.log(user.balance.split("."));

  return (
    <NavDiv>
        <h3>{user.account}</h3><br />
        <h3>{user.balance.split(".")[0]}.{user.balance.toString().split(".")[1].substr(0,4)}</h3>
        {/* {user.balance.toString().split(".")[1].substr(0,4)} */}

        <Btn onClick={()=>{nav("/register")}}>등록</Btn>
        <Btn onClick={()=>{nav("/mypage")}}>마이페이지</Btn>

    </NavDiv>
  )
}

export default Nav