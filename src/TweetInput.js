import React, { useState } from "react";
import { storage, db } from "./firebase";
import firebase from "firebase/app";
import Button from '@material-ui/core/Button';

const TweetInput = () => {
  // useStateもいりまーす

  const [inputImage, setInputImage] = useState(null);

  // 入力された文字を保持します

  const [message, setMessage] = useState(""); //パターンA
  //   const handleInputChange = (e) => {
  //       setMessage(e.target.value);
  //   }　//パターンB

  //ファイル選択→画像を選ぶ→画像保持
  const onChangeImageHandler = (e) => {
    if (e.target.files[0]) {
      console.log(e.target.files[0], "画像");
      setInputImage(e.target.files[0]);
      //入力部分をからにする
      e.target.value = "";
    }
  };


  const sendTweet = (e) => {
    // formタグを使うと送信の際にリフレッシュされます（画面がリロードされるということ）
    // formタグを使う時は必須！絶対入ります！
    e.preventDefault();

    if (inputImage) {
      // 画像 + テキストを登録させる
      // 記述6
      // firebaseの仕様で同じファイル名の画像を複数回アップしてしまうと元々あったファイルが削除される
      // そのためにファイル名をランダムなファイル名を作る必要がある、それが下
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; //ランダムな文字列を作るための候補、62文字
      const N = 16; //16文字の文字列を作るという意味　生成したい文字数が１６の文字列になる
      const randomMoji = Array.from(crypto.getRandomValues(new Uint32Array(N))) //乱数を生成してくれるもので0からランダムな数字が１６こ選ばれる
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomMoji + "_" + inputImage.name;
      // firebase storageに登録する処理
      const uploadTweetImg = storage.ref(`images/${fileName}`).put(inputImage);
      // 記述7
      // firebaseのDBに登録する処理
      uploadTweetImg.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        // 3つ設定できる
        // 進捗度合い = プログレス
        // エラーに関する = アップロードがうまくいかないなどのエラーを管理する
        // 成功した時 今回でいうと async（非同期＝何かを実行した後に次のことをするためのもの）
        () => {}, //進捗度合いの管理するもの、
        (err) => {
          //エラーに関する処理
          alert(err.message);
        },
        async () => {
          //成功したとき
          await storage
            .ref("images")
            .child(fileName)
            .getDownloadURL()
            .then(async (url) => {
              await db.collection("posts").add({
                image: url,
                text: message,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              });
            });
        }
      );
    } else {
        //テキストだけ入力されているケース
      db.collection("posts").add({
        image: "",
        text: message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
  };

  return (
    <div>
      <h1>Tweet Input</h1>
      {/* 登録の担当をするパーツ（コンポーネント） */}
      {/* TweetInputではinputタグや送信ボタンを置いて、firebaseにデータを登録するものを記述します */}
      {/* Formタグを使います */}
      <form onSubmit={sendTweet}>
        <div>
          <input
            type="text"
            placeholder="文字を入力してください"
            autoFocus
            value={message}
            // 入力された文字を取得するためにonChangeイベントを設定します
            // 直接setMessageで更新して書く方法
            onChange={(e) => setMessage(e.target.value)} //パターンA
            // ↓前回まではこっち、上とこっちどちらも結果は同じ
            // onChange={handleInputChange}　//パターンB
          />
        </div>
        <hr />
        <div>
          {/* 画像登録するようのインプット */}
          <input type="file" onChange={onChangeImageHandler} />
        </div>
        <hr />
        <div>
          {/* 登録ボタン */}
          <Button variant="contained" color="primary" type="submit" disabled={!message}>送信</Button>
          {/* <button type="submit" disabled={!message}>送信</button> */}
        </div>
      </form>
    </div>
  );
};

export default TweetInput;
