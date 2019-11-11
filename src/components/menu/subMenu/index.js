import React from 'react';

class subMenu extends React.Component{
  constructor (props) {
    super(props);
  }

  render(){
    const children = this.props.children;
    return(
      <li
        onMouseOver = {this.props.onMouseOver}
        onMouseLeave = {this.props.onMouseLeave}
        className = {this.props.subMenuIndex == this.props.index ? 'menuHover' : ''}
      >
        <h3 className = "itemTitle">
          <span className="itimIcon"></span>
          <a href="javascript:;">{this.props.text}</a>
        </h3>
        <p className = "itemRow">
          {
            children.map((item,i) => (
              <a href={item.url} key={i}>{`${item.text}&nbsp;`}</a>
            ))
          }
        </p>
        <div
          className = {["subMenuBox", 
          this.props.subMenuIndex == this.props.index ? 'show' : ''].join(' ')
          }
        >
          {
            children.map((item,i) => (
              <a href={item.url} key={i}>{item.text}</a>
            ))
          }
        </div>
      </li>
    )
  }
}

export default subMenu;