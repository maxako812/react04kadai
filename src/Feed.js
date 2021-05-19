import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import Post from "./Post";
import TweetInput from "./TweetInput";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import ListSubheader from "@material-ui/core/ListSubheader";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
// import tileData from "./tileData";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: 450,
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
}));

const Feed = () => {
  //useState
  //firebaseに登録した項目を受け取るために必要なuseState
  //記述１：useStateを記述して、firebaseに登録されているデータ項目と同じにする（オブジェクト）
  const classes = useStyles();
  const [posts, setPosts] = useState([
    {
      id: "",
      image: "",
      text: "",
      timestamp: null,
    },
  ]);

  // 記述２：useEffectを使ってfirebaseのデータを取得、保持
  useEffect(() => {
    const firebaseData = db
      .collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            image: doc.data().image,
            text: doc.data().text,
            timestamp: doc.data().timestamp,
          }))
        )
      );

    console.log(posts, "firebaseの中身");
    return () => {
      firebaseData();
    };
  }, []);

  return (
    <div>
      {/*  */}
      <TweetInput />
      <hr />
      {/* ここにfirebaseのデータをUseEffectを使って表示する */}
      <div className={classes.root}>
        <GridList cellHeight={180} className={classes.gridList}>
          <GridListTile key="Subheader" cols={2} style={{ height: "auto" }}>
            <ListSubheader component="div">Photolist</ListSubheader>
          </GridListTile>
          {posts.map((postItem) => (
            <Post
              key={postItem.id}
              image={postItem.image}
              text={postItem.text}
              timestamp={postItem.timestamp}
            />
          ))}
        </GridList>
      </div>
    </div>
  );
};

export default Feed;
