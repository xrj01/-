import React from 'react';
import SubMenu from './subMenu';
import './index.scss';

const menuItems = [
  {
    text: '菜单 1',
    subMenu:[
      {
        text: '1 Child Test 11 Child Test 11 Child Test 11 Child Test 11 Child Test 1',
        url: 'http://qq.com',
      },
      {
        text: '1 Child Test 21 Child Test 21 Child Test 21 Child Test 21 Child Test 2',
        url: 'http://qq.com',
      },
    ]
  },
  {
    text: '菜单 2',
    subMenu:[
      {
        text: '2 Child Test 12 Child Test 12 Child Test 12 Child Test 12 Child Test 1',
        url: 'http://qq.com',
      },
      {
        text: '1 Child Test 21 Child Test 21 Child Test 21 Child Test 21 Child Test 2',
        url: 'http://qq.com',
      },
    ]
  },
  {
    text: '菜单 3',
    subMenu:[
      {
        text: '3 Child Test 13 Child Test 13 Child Test 13 Child Test 13 Child Test 1',
        url: 'http://qq.com',
      },
      {
        text: '3 Child Test 23 Child Test 23 Child Test 23 Child Test 23 Child Test 2',
        url: 'http://qq.com',
      },
    ]
  }
]

class MainMenu extends React.Component{
  constructor (props) {
    super(props);
    this.state = {
      showMenuItem: -1,
    }
  }

  handleMouseUp = (index) => {
    this.setState({
      showMenuItem : index,
    })
  }
  handleMouseOut = () => {
    this.setState({
      showMenuItem : -1,
    })
  }

  render(){
    return(
        <ul className="menuList">
            {
              menuItems.map((level, index)=>(
                <SubMenu 
                  text = {level.text}
                  index = {index}
                  key = {index}
                  onMouseOver = {() => {this.handleMouseUp(index)}}
                  onMouseLeave = {this.handleMouseOut}
                  subMenuIndex = {this.state.showMenuItem}
                >
                {level.subMenu}
                </SubMenu>
              ))
            }
        </ul>
    )
  }
}

export default MainMenu;