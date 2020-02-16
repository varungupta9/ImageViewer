import React , {Component} from 'react';
import  './Header.css';
import {Link, Redirect} from 'react-router-dom';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import Avatar from '@material-ui/core/Avatar';
import MenuItem from '@material-ui/core/MenuItem';
import { Popover } from '@material-ui/core';

//Common header for all screens.
class Header extends Component
{
    constructor() {
        super();
        this.state = {
            anchorEl: null,
            loggedIn: sessionStorage.getItem('access-token') != null //Retrieve access token stored in session
        }
    }
    onProfileIconHandler=(event) =>
    {
        this.setState({
            anchorEl: event.currentTarget
          })
    }  
    handleClose = () => {
        this.setState({ anchorEl: null }); //Hides the modal 
    }

    myAccountClickHanlder = () => { //Function callled when image icon is clicked
        this.props.history.push("/profile"); //Route to Profile page 
    }

    logoutClickHandler = () => { //Function callled Logout is clicked
        sessionStorage.removeItem('access-token'); //removes the access-token from session
        this.setState({ loggedIn: false }); 
    }

    searchItemHanlder = (event) => {
        this.props.searchItemHanlder(event.target.value);
    };

    //Renders header on all pages with specific components for individual screen.
    render()
    {
        return (
            <div >
                <header className="app-header">
                    {!this.state.loggedIn && <Redirect to='/' />}
                    <div className="logo">
                        <Link to="/home" className="logo-style">Image Viewer</Link>
                    </div>
                    {this.state.loggedIn &&
                        <div className="right">
                            {this.props.pageId === 'home' &&
                                <div className="searchBox">
                                    <SearchOutlinedIcon />
                                    <Input className="serach-area" placeholder="Search..." disableUnderline onChange={this.searchItemHanlder} />
                                </div>
                            }
                            <IconButton className="icons" onClick={this.onProfileIconHandler}>
                                <Avatar src={this.props.profilePicture} alt="PF" ></Avatar>
                                <Popover
                                    id="simple-menu"
                                    anchorEl={this.state.anchorEl}
                                    open={Boolean(this.state.anchorEl)}
                                    onClose={this.handleClose}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                >
                                    <div className="popmenu">
                                        {this.props.pageId === 'home' &&
                                            <div>
                                                <MenuItem onClick={this.myAccountClickHanlder}>My Account</MenuItem>
                                                <hr className="line-separator-one" />
                                            </div>}
                                        <div>
                                            <MenuItem onClick={this.logoutClickHandler}>Logout</MenuItem>
                                        </div>
                                    </div>
                                </Popover>
                            </IconButton>
                        </div>
                    }
                </header>
            </div>
        );
    }

}

export default Header;