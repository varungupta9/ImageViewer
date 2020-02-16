import React , {Component} from 'react';
import Header from '../../common/header/Header';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent'
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import Avatar from '@material-ui/core/Avatar';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import './Home.css';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import FavoriteIcon from '@material-ui/icons/Favorite';


const styles = theme =>({
    gridContainer: {
        width: "90%",
        margin: "0px auto 0px auto"
      },
    media:{
        width: "100%"
    },
    addComments:{
        display: "flex",
        flexDirection: "row",
        alignItems: "baseline"    }

})

class Home extends Component {
 constructor()
 {
     super();
     this.state={
        loggedIn: sessionStorage.getItem('access-token')!= null,
        accessToken: sessionStorage.getItem('access-token'),
        profilePicture: '',
        username: '',
        postedImages: [],
        displayImages: [],
        commentedImageId: ''
     }
    }
componentDidMount()
{
    if(this.state.loggedIn) {
    let xhr = new XMLHttpRequest();
    let that = this;
    xhr.addEventListener("readystatechange",function(){
     if(this.readyState=== 4)
     {
       that.setState({profilePicture : JSON.parse(this.responseText).data.profile_picture,
                     username : JSON.parse(this.responseText).username
                         })  
     }
    });
    xhr.open("GET" , this.props.baseUrl + "?access_token=" + this.state.accessToken);
    xhr.send();

    let xhrPost = new XMLHttpRequest();
    xhrPost.addEventListener("readystatechange",function(){
        if(this.readyState=== 4)
        {
          let responseData = JSON.parse(this.response).data;
          responseData.forEach(image => {
            let date = parseInt(image.created_time,10);
            date = new Date(date * 1000);
            image.created_time = date.toLocaleString().replace(',','');
               image.caption.text = image.caption.text.split('\n');
               image.userComments = [];
               image.commentText = '';

          });  
          that.setState({postedImages: responseData,
            displayImages: responseData,
            commentText: '' })  
        }
       });
       xhrPost.open("GET" , this.props.baseUrl + "/media/recent?access_token=" + this.state.accessToken);
       xhrPost.send();
}
}

likeHandler=(image) =>
{
   if(image.userliked)
   {
       if(image.likes.count>0)
       {
           image.likes.count--;
       }
       else{
           image.likes.count=0;
       }
   }
   else
   {
       image.likes.count++;
   }
   image.userliked = !image.userliked;
    this.setState({...this.state});
}
commentsChangeHandler = (event, image) => {
    this.setState({
      commentedImageId: image.id
    });
    image.commentText = event.target.value;
  };
addCommentsHandler =(event , image ) =>
{
    if(image.commentText!=='')
    {
        image.comments.count++;
        image.userComments.push(
            {
                id: image.comments.count ,
                text: image.commentText,
                username: image.user.username
            }
        );
        image.commentText = '';
        this.setState({...this.state});
    }
}
searchItemHanlder = (search) =>
{
    let displayImages = (search === "")
    ? this.state.postedImages
    : this.state.postedImages.filter(
        image => image.caption.text[0].toLowerCase().includes(
            search.toLowerCase())
            || image.caption.text[1].toLowerCase().includes(
                search.toLowerCase()));
    this.setState({displayImages: displayImages});
}

    
 render() {
    const {classes} = this.props;
       return (
         <div>
               <Header pageId="home" profilePicture={this.state.profilePicture} {...this.props} 
               onProfileIconHandler={this.onProfileIconHandler} searchItemHanlder={this.searchItemHanlder}/>
             <Grid container spacing={3} className={classes.gridContainer}>
              {this.state.displayImages.map(image => (
             <Grid key={"post" + image.id} item xs={12} sm={6}>
             <Card>
                 <CardHeader
                      avatar={
                        <Avatar  src={this.state.profilePicture} alt="logo"/>
                      }
                      title={image.user.username}
                      subheader={image.created_time}
                    />
                         <CardContent>
                          <img src={image.images.standard_resolution.url} alt="post"
                           className={classes.media}/>
                           <hr className="line-separator"/>
                           <Typography variant="subtitle2" >
                              {image.caption.text[0]}
                            </Typography>
                            <Typography variant="body2" className="captions">
                              {image.caption.text[1]}
                            </Typography>
                            <IconButton onClick={() => this.likeHandler(image)}>
                             {image.userliked?<FavoriteIcon color="error"/>:
                            <FavoriteBorderOutlinedIcon />
                             }
                            </IconButton>
                            <Typography className="like-counter" variant="subtitle1">
                                {
                                image.likes.count ===1?<span>{image.likes.count} like</span>:<span>{image.likes.count} likes</span>
                                }
                            </Typography>
                            <div className="comments-area">
                                {image.userComments!==null  && image.userComments.map(comments =>(
                                          <div key ={"comment"+comments.id}>
                                           <Typography>
                                               <span className="comments-username">{comments.username}:  </span>
                                               <span className="comments-item">{comments.text}</span>
                                               </Typography>
                                               </div>   
                                ))}
                            </div>
                            <div className="add-comments">
                            <FormControl className={classes.addComments} >
                            <InputLabel htmlFor="comments">Add a
                            comment</InputLabel>
                            <Input id={"comments" + image.id}
                                 className="comments-add"
                                 onChange={(event) => this.commentsChangeHandler(
                                     event, image)}
                                 value={image.id === this.state.commentedImageId
                                     ? image.commentText : ''}></Input>
                            <Button variant="contained" color="primary" onClick={(event) => this.addCommentsHandler(event , image)}>ADD</Button>
                            </FormControl>
                            </div>
                           </CardContent>
                        </Card>
                        </Grid>
             ))}
             </Grid>
         </div>
        );
    }
}

export default withStyles(styles)(Home);
