import React from 'react'
import { NavDiv } from './nav.styled'
import { Btn } from '../components/utils/btn.styled'
import { useNavigate } from 'react-router-dom'

const Nav = ({user}) => {
  const nav = useNavigate();

  return (
    <NavDiv>
        <div><h3>{user.account.substr(0,6)}...{user.account.substr(user.account.length-4, user.account.length)}</h3></div>
        <div><h3>{user.balance.split(".")[0]}.{user.balance.toString().split(".")[1].substr(0,4)}ETH</h3></div>

        <div>
          <Btn onClick={()=>{nav("/register")}}>등록</Btn>
          <Btn onClick={()=>{nav("/mypage")}}>마이페이지</Btn>
        </div>

    </NavDiv>
  )
}

export default Nav