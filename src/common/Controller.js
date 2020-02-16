import React , {Component} from 'react';
import Home from '../screens/home/Home';
import Login from '../screens/login/Login';
import Profile from '../screens/profile/Profile'
import {BrowserRouter as Router,Route} from 'react-router-dom';

class Controller extends Component
{
constructor()
{
    super();
    this.state={
        loggedIn: sessionStorage.getItem("access-token")!==null ? false:true
    }
    this.baseUrl = "https://api.instagram.com/v1/users/self";

}

    render()
    {
        return(
            <div>
                <Router>
                <Route exact path='/' render={(props) => <Login {...props} baseUrl={this.baseUrl}/>}/>
                <Route  path='/home' render={(props) => <Home {...props} baseUrl={this.baseUrl}/>}/>
                <Route  path='/profile' render={(props) => <Profile {...props} baseUrl={this.baseUrl}/>}/>


                </Router> 
            </div>
        )
    }

}
export default Controller;