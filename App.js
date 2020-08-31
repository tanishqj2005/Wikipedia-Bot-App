import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  FlatList,
} from "react-native";

const renderMessageItem = (owner, text) => {
  let MsgStyle = null;
  let Msg = null;
  if (owner === "BOT") {
    MsgStyle = styles.msgBoxBot;
    Msg = styles.messageBot;
  } else {
    MsgStyle = styles.msgBoxUser;
    Msg = styles.messageUser;
  }
  return (
    <View style={MsgStyle}>
      <View style={Msg}>
        <Text style={styles.textOfMsg}>{text}</Text>
      </View>
    </View>
  );
};

export default function App() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const addMessageHandler = async () => {
    const newMessage = {
      owner: "User",
      text: query,
    };
    setMessages((prevState) => prevState.concat(newMessage));
    const answerResp = await getAnswer(query);
    setQuery("");
    const newMessage2 = {
      owner: "BOT",
      text: answerResp.length >5 ? answerResp : 'Sorry Could not find any Information :(',
    };
    setMessages((prevState) => prevState.concat(newMessage2));
  };
  const getAnswer = async (question) => {
    let fd = new FormData();
    fd.append("question", question);
    const response = await fetch("https://wikipedia-bot-app-1.herokuapp.com/info", {
      method: "POST",
      body: fd,
    });
    const respData = await response.json();
    return respData.Answer;
  };
  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={{ color: "white", fontSize: 19 }}>
          Wikipedia Search Bot
        </Text>
      </View>
      {messages.length === 0 ? (
        <View style={styles.heading}>
          <Text style={{ color: "white", fontSize: 19 }}>
            Welcome To Wikipedia Search Bot.
          </Text>
        </View>
      ) : (
        <View style={styles.fl}>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.text}
            renderItem={(itemData) =>
              renderMessageItem(itemData.item.owner, itemData.item.text)
            }
          />
        </View>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter Your Query"
          value={query}
          onChangeText={(newText) => setQuery(newText)}
          style={{
            width: "70%",
            fontSize: 16,
            marginRight: 5,
            textAlign: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        />
        <View style={{ width: "30%" }}>
          <Button
            title="SEND"
            color="#056308"
            disabled={query.length < 5}
            onPress={addMessageHandler}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
  },
  inputContainer: {
    position: "absolute",
    bottom: 8,
    backgroundColor: "#fff",
    flexDirection: "row",
    width: "100%",
    padding: 15,
    borderWidth: 2,
    borderColor: "#eb6446",
    borderRadius: 13,
    marginHorizontal: 15,
    marginBottom: 8,
  },
  msgBoxUser: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginHorizontal: 15,
    padding: 20,
  },
  msgBoxBot: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginHorizontal: 15,
    padding: 20,
  },
  messageUser: {
    width: "70%",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: "#d6c918",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: 25,
    borderWidth: 2,
    borderColor: "white",
  },
  messageBot: {
    width: "87%",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: "#96ff45",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: 25,
    borderWidth: 2,
    borderColor: "white",
  },
  textOfMsg: {
    fontSize: 15,
  },
  fl: {
    width: "100%",
    position: "absolute",
    top: 100,
    height: 570,
  },
  heading: {
    marginTop: 345,
  },
  title: {
    position: "absolute",
    top: 8,
    backgroundColor: "#63000c",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    padding: 15,
    borderWidth: 2,
    borderColor: "#eb6446",
    borderRadius: 13,
    marginHorizontal: 15,
    marginTop: 32,
  },
});
