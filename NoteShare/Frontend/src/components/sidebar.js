import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import '../Sidebar.css'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {follow, unfollow} from "../actions/tweet"
import UserTile from '../components/tweet/user-tile'

const searchingFor = term => x =>
  x.firstname.toLowerCase().includes(term.toLowerCase()) ||
  x.lastname.toLowerCase().includes(term.toLowerCase()) ||
  !term;

//create the Sidebar Component
class Sidebar extends Component {
    constructor(props){
        super(props);
        console.log("Sidebar props: ",props)
        this.state = {
            term: "",
            isFollow: false
          };
        this.searchHandler = this.searchHandler.bind(this);
       // this.onSubmit = this.onSubmit.bind(this);
    }

    searchHandler = e => {
        this.setState({
          term: e.target.value
        });
      };


followHandler = userid => e =>
{
    e.preventDefault()
    if(!this.state.isFollow)
    {
        this.props.follow(userid)
        this.setState(
            {
                isFollow: true
            }
        )
    }
    else{
        this.props.unfollow(userid)
        this.setState(
            {
                isFollow: false
            }
        )

    }

}
      
    
    
    render(){
       
        let menuOptions = (this.props.users!==undefined && this.props.users!==null && this.props.users!==[]
        ) ? this.props.users.filter(searchingFor(this.state.term)).map(option => {
            return(
                // <li>
                //     <div style = {{display: 'block'/*, flexDirection:'row'*/, padding:'10px 10px', fontSize:'18px', color:'#333'}}>
                    
                //     <Link to={`/notes/${option.userid}/${option.firstname}`}>{option.firstname +" " + option.lastname}</Link>
                //     <FlatButton type = "submit" style = {{ float: 'right', alignItems:'right'}} onClick={this.followHandler(option.userid)} >{!this.state.isFollow ? "Follow":"Unfollow"}</FlatButton>
                //     </div>
                // </li>
                <UserTile option = {option}/>
            )
        }) : ""
        return(
            <nav class="navbar navbar-inverse navbar-fixed-left">
                  <div>
                    <ul class="nav navbar-nav">
                    <TextField
                        margin="normal"
                        variant="outlined"
                        type="text"
                        name="term"
                        value={this.state.term}
                        onChange={this.searchHandler}
                        floatingLabelText="Search for User"
                        fullWidth={false}
                    /> 
                      {menuOptions}
                    </ul>
                  </div>
            </nav>
        )
    }
}

Sidebar.propTypes = {
    users: PropTypes.object.isRequired,
    id: PropTypes.object.isRequired,
    follow: PropTypes.func,
    unfollow: PropTypes.func,
  }
  
  function sidebar (state) {
    return {
      users: state.user.users
    }
  }
export default connect(sidebar, {follow,unfollow})(Sidebar)