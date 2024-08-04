import React , { useState }from 'react'
import Navbar from './Navbar'
import Search from './Search'
import Chats from './Chats'
import { useUser } from './UserContext';

const Sidebar = ({highlightedUsers, isBlackOverlay})  => {

  return (
    <div className='sidebar'>
        <Navbar />
        <Search  />
        <Chats highlightedUsers={highlightedUsers} isBlackOverlay={isBlackOverlay}  />


    </div>
  )
}

export default Sidebar  