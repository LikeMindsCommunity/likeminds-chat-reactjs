import React from 'react'
import giffyIcon from "./../../assets/img/giffy.png";
import {useMenu} from '../../hooks/useMenu'
import { Menu } from '@mui/material';
import ReactGiphySearchbox from 'react-giphy-searchbox'
const Giphy = () => {
    const {menuAnchor, openMenu, closeMenu} = useMenu()
  return (
    <div className='lm-input-giffy'>
        <Menu open={Boolean(menuAnchor)} anchorEl={menuAnchor} onClose={closeMenu}>
        <ReactGiphySearchbox
            apiKey="95y3zXD0UBxE5tNIHHfqhp09n00yiWOG" 
            onSelect={item => console.log(item)}
            
  />    
        </Menu>
      <img src={giffyIcon} alt="giffy" onClick={openMenu} />
    </div>
  )
}

export default Giphy
