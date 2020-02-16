import React , {Component} from 'react';
import './Login.css';
import Header from '../../common/header/Header';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText'
import 'typeface-roboto';


class Login extends Component
{
    constructor() //Initialize the state
    {
        super()
        this.state ={
            username: "",
            password: "",
            wrongCredntials: "dispNone",
            userNameRequired : 'dispNone',
            passwordRequired : 'dispNone'           
        }
    }
    loginClickHandler= (props) =>  //funtion called when log-in button is clicked 
    {
        const inputUserName = "upgrad"; // pre-defined username 
        const inputPassword = "upgrad"; // pre-defined password
        const accessToken = "8661035776.d0fcd39.39f63ab2f88d4f9c92b0862729ee2784"; //acess-token for instagram api(upgrad)
        this.state.username===""?this.setState({userNameRequired: "dispBlock"}):this.setState({userNameRequired:"dispNone"}); //required filed validation for username
        this.state.password===""?this.setState({passwordRequired: "dispBlock"}):this.setState({passwordRequired:"dispNone"}); //required filed validation for password
        if((this.state.username!=="" && this.state.password!=="")&&(this.state.username!==inputUserName|| this.state.password!==inputPassword))
        { // vaildation for username & password
            this.setState({wrongCredntials:"dispBlock"});

        }
        if(this.state.username ===inputUserName && this.state.password === inputPassword)
        {
            this.setState({wrongCredntials:"dispNone"});
            sessionStorage.setItem("access-token", accessToken);//store access-token value to session
            this.props.history.push("/home"); // route to home page 
        }
    }
    inputUserNameChangeHandler=(e)=>
    {
        this.setState({ username: e.target.value })
    }
    inputPasswordChangeHandler = (e) =>
    {
        this.setState({ password: e.target.value })
    }
    // Render login page with username and password as the input.   
    render()
    {
        return(
            <div>
                <div>
                    <Header /> 
                </div>
                <div className="center">
                    <Card className="cardStyle">
                        <CardContent>
                            <Typography variant="h5" >LOGIN</Typography>
                            <FormControl required className="formControl">
                                <InputLabel htmlFor="username">Username</InputLabel>
                                <Input id="username" type="text" username={this.state.username} onChange={this.inputUserNameChangeHandler} />
                                <FormHelperText className={this.state.userNameRequired}><span className="red">Required</span></FormHelperText>
                            </FormControl>
                            <FormControl required className="formControl">
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <Input id="password" type="password" password={this.state.password} onChange={this.inputPasswordChangeHandler} />
                                <FormHelperText className={this.state.passwordRequired}><span className="red">Required</span></FormHelperText>
                            </FormControl><br /><br />
                            <FormHelperText className={this.state.wrongCredntials}><span className="red">Incorrect username and/or password</span></FormHelperText>
                            <Button variant="contained" color="primary" onClick={this.loginClickHandler}>LOGIN</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }
}
export default Login; //Export Login page