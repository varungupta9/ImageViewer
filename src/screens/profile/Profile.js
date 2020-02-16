import React , {Component} from 'react';
import Modal from 'react-modal';
import Header from '../../common/header/Header';
import Avatar from '@material-ui/core/Avatar';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import Input from'@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import FavoriteIcon from '@material-ui/icons/Favorite';
import '../profile/Profile.css'


const customStyle = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

const imageCustomStyle = {
    content : {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        width: '60vw',
        height: '60vh'
      }
};

const styles = theme => ({

    root: {
        flexGrow: 1,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper
    },
    bigAvatar: {
        width: '150px',
        height: '150px',
        borderStyle: 'solid'
    },
    gridList: {
        width: 1100,
        height: 800,
    },
    editButton: {
        marginLeft: '4%'
    },
    logoStyle: {
        borderStyle: 'solid',
        borderColor: 'grey',
        borderWidth: 'thin'
    },
    cardHeader: {
        padding: '0 0 10px 10px'
    },
    addComments: {
        display: "flex",
        flexDirection: "row",
        alignItems: "baseline"
    }
});
const TabContainer = function (props) {
    return (
        <Typography component="div" style={{ padding: 0, textAlign: 'center' }}>
            {props.children}
        </Typography>
    );
};
class Profile extends Component {
    constructor()
    {
        super();
        this.state={
            loggedIn: sessionStorage.getItem('access-token')!= null,
            accessToken: sessionStorage.getItem('access-token'),
            profileImages: [],
            userInfo: [],
            postCount: 0,
            followCount: 0,
            followedByCount : 0,
            modalIsOpen:false,
            nameRequired : 'dispNone',
            modifiedFullName : '',
            fullName: '',
            displayImages: [],
            imageModal: false,
            clickedImage : {}

        }
    }
componentDidMount()
{
    if (this.state.loggedIn) {
        let xhr = new XMLHttpRequest();
        let that = this;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({
                    userInfo: JSON.parse(this.responseText).data,
                    postCount: JSON.parse(this.responseText).data.counts.media,
                    followCount: JSON.parse(this.responseText).data.counts.follows,
                    followedByCount: JSON.parse(this.responseText).data.counts.followed_by,
                    fullName: JSON.parse(this.responseText).data.full_name,
                })
            }
        });
        xhr.open("GET", this.props.baseUrl + "?access_token=" + this.state.accessToken);
        xhr.send();

        let xhrPost = new XMLHttpRequest();
        xhrPost.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                let responseData = JSON.parse(this.response).data;
                responseData.forEach(image => {
                    image.caption.text = image.caption.text.split('\n');
                    image.userComments = [];
                    image.commentText = '';
                });
                that.setState({
                    displayImages: responseData,
                })
            }
        });
        xhrPost.open("GET", this.props.baseUrl + "/media/recent?access_token=" + this.state.accessToken);
        xhrPost.send();
    }
}
userNameEditHandler =() => 
{
    this.setState({modifiedFullName:'' ,modalIsOpen:true})
}
closeModalHandler =() =>  //Close modal box
{
    this.setState({ modalIsOpen: false })
}
closeImageModalHandler =() => //Close Image details Modal box
{
    this.setState({ imageModal: false })
}
inputFullNameChangeHandler=(e)=>
    {
        this.setState({ modifiedFullName: e.target.value })
    }
updateFullNameClickHandler =(e) => //Edit the full name
    {
        if (this.state.modifiedFullName === "") {
            this.setState({ nameRequired: "dispBlock" })
        }
        else {
            this.setState({
                fullName: this.state.modifiedFullName,
                modalIsOpen: false
            })
        }
    }    
imageClickHandler = (image) => 
{
    this.setState({ clickedImage: image, imageModal: true });
}
commentsChangeHandler = (event, image) => 
{
    this.setState({
        commentedImageId: image.id
    });
    image.commentText = event.target.value;
};
addCommentsHandler =(event , image ) => //Add comments to post
{
    if (image.commentText !== '') {
        image.comments.count++;
        image.userComments.push(
            {
                id: image.comments.count,
                text: image.commentText,
                username: image.user.username
            }
        );
        image.commentText = '';
        this.setState({ ...this.state });
    }
}
likeHandler=(image) => //Increases/Decreases Like count when like icon is clicked/double-clicked
{
    if (image.userliked) {
        if (image.likes.count > 0) {
            image.likes.count--;
        }
        else {
            image.likes.count = 0;
        }
    }
    else {
        image.likes.count++;
    }
    image.userliked = !image.userliked;
    this.setState({ ...this.state });
}
    render() {
        const { classes } = this.props;
        let clickedImage = this.state.clickedImage;
        return (
            <div>
                <div>
                    <Header profilePicture={this.state.userInfo.profile_picture} />
                </div>
                <Modal style={customStyle} ariaHideApp={false} isOpen={this.state.modalIsOpen}
                    contentLabel="Edit" onRequestClose={this.closeModalHandler} >
                    <Typography>
                    Edit
                    </Typography><br />
                    <TabContainer>
                        <FormControl required>
                            <InputLabel htmlFor="fullName">Full Name</InputLabel>
                            <Input id="fullName" type="text"
                                onChange={this.inputFullNameChangeHandler} />
                            <FormHelperText
                                className={this.state.nameRequired}>
                                <span className="red">Required</span>
                            </FormHelperText>
                        </FormControl><br /><br />
                    </TabContainer><br />
                    <Button variant="contained" color="primary"
                        onClick={this.updateFullNameClickHandler}>Update</Button>
                </Modal>
                <div className="infoSection">
                    {<Avatar className={classes.bigAvatar}>
                        <img src={this.state.userInfo.profile_picture} alt={"logo"} />
                    </Avatar>}
                    <span className="colums">
                        <div className="title">
                            <Typography variant={"h6"}>
                                {this.state.userInfo.username}
                            </Typography>
                        </div>
                        <div>
                            <span className="profile-details">
                                <div className="profile-items">Posts:  {this.state.postCount}  </div>
                                <div className="profile-items">Follows: {this.state.followCount}  </div>
                                <div className="profile-items">Followed By:  {this.state.followedByCount} </div>
                            </span>
                        </div>
                        <div>
                            {this.state.fullName}
                            <span className={classes.editButton}>
                                <Fab color="secondary"
                                    onClick={this.userNameEditHandler}><EditIcon /></Fab>
                            </span>
                        </div>
                    </span>
                </div>
                <div className="images-grid">
                    <GridList cellHeight={300} className="grid-list" cols={3}>
                        {this.state.displayImages.map(image => (
                            <GridListTile key={"image" + image.id} onClick={() => { this.imageClickHandler(image) }}>
                                <img src={image.images.standard_resolution.url} alt={image.id} />
                            </GridListTile>
                        ))}
                    </GridList>
                    <Modal style={imageCustomStyle} ariaHideApp={false} isOpen={this.state.imageModal}
                        contentLabel="Images" onRequestClose={this.closeImageModalHandler} >
                        {clickedImage.images &&
                            <div className="images-grid">
                                <div className="display-grid">
                                    <img src={clickedImage.images.standard_resolution.url} className="display-image" />
                                </div>
                                <div className="display-grid">
                                    <CardHeader className={classes.cardHeader}
                                        classes={{ title: classes.boldFont }}
                                        avatar={
                                            <Avatar
                                                src={clickedImage.user.profile_picture} className={classes.logoStyle}>
                                            </Avatar>
                                        }
                                        title={clickedImage.user.username}>
                                    </CardHeader>
                                    <hr />
                                    <div className="content">
                                        <Typography>{clickedImage.caption.text[0]}</Typography>
                                        <Typography className="hash-tag"> {clickedImage.tags.map(tag => ('#' + tag + ' '))} </Typography>
                                        <div className="comments-area">
                                            {clickedImage.userComments !== null && clickedImage.userComments.map(comments => (
                                                <div key={"comment" + comments.id + clickedImage.id}>
                                                    <Typography>
                                                        <span className="comments-username">{comments.username}:  </span>
                                                        <span className="comments-item">{comments.text}</span>
                                                    </Typography>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="likes-section" >
                                            <IconButton onClick={() => this.likeHandler(clickedImage)}>
                                                {clickedImage.userliked ? <FavoriteIcon color="error" /> :
                                                    <FavoriteBorderOutlinedIcon />
                                                }
                                            </IconButton>
                                            <Typography className="like-counter" variant="subtitle1">
                                                {
                                                    clickedImage.likes.count === 1 ? <span>{clickedImage.likes.count} like</span> : <span>{clickedImage.likes.count} likes</span>
                                                }
                                            </Typography>
                                            <div className="add-comments-area">
                                                <FormControl className={classes.addComments} >
                                                    <InputLabel htmlFor="comments">Add a comment</InputLabel>
                                                    <Input key={"comments" + clickedImage.id}
                                                        className="comments-add"
                                                        onChange={(event) => this.commentsChangeHandler(
                                                            event, clickedImage)}
                                                        value={clickedImage.commentText}></Input>
                                                    <Button variant="contained" color="primary" onClick={(event) => this.addCommentsHandler(event, clickedImage)}>ADD</Button>
                                                </FormControl>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </Modal>
                </div>
            </div>
        )
    }
}
export default withStyles(styles)(Profile);
