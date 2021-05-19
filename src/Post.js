import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import defaultImg from "./img/test.jpeg";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    flexGrow: 1,
  },
  media: {
    height: 140,
  },
  control: {
    padding: theme.spacing(2),
  },
}));

//①propsを受け取ります！（このデータがくるよーっていう意味）
const Post = ({ text, image, timestamp }) => {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardActionArea>
        {image && (
          <CardMedia className={classes.media} image={image} title={text} />
        )}
        {!image && (
          <CardMedia
            className={classes.media}
            image={defaultImg}
            title={text}
          />
        )}
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {new Date(timestamp?.toDate()).toLocaleString()}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {text}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Share
        </Button>
        <Button size="small" color="primary">
          Learn More
        </Button>
      </CardActions>
    </Card>
    // <div>
    //   {/* ②テキスト情報が渡ってくる */}
    //   <div>{text}</div>
    //   {/* 画像を表示　imgのURLをsrcに渡す */}
    //   <div>
    //     <img src={image} alt=""></img>
    //   </div>
    //   {/* 日付を表示 */}
    //   <div>{new Date(timestamp?.toDate()).toLocaleString()}</div>
    // </div>
  );
};

export default Post;
