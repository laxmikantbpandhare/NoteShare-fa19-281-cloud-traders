import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton'

class UserTile extends Component {
    constructor(props){
        super(props);

        this.state = {
            isFollow: false
        }

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick = e =>{
        this.setState(
            {
                isFollow: !this.state.isFollow
            }
        )
    }
    
    render(){
        return(
            <li>
                    <div style = {{display: 'block'/*, flexDirection:'row'*/, padding:'10px 10px', fontSize:'18px', color:'#333'}}>
                    
                    <Link to={`/notes/${this.props.option.userid}/${this.props.option.firstname}`}>{this.props.option.firstname +" " + this.props.option.lastname}</Link>
                    <FlatButton type = "submit" style = {{ float: 'right', alignItems:'right'}} 
                    onClick = {this.handleClick}
                    // onClick={this.followHandler(option.userid)} 
                    >{!this.state.isFollow ? "Follow":"Unfollow"}</FlatButton>
                    </div>
            </li>
        );
    }
}

export default UserTile;