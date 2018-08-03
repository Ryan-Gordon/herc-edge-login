import React, { Component } from "react";
import MainNavigation from "./navigation/MainNavigation";
import { Provider } from "react-redux";
import store from "./store";
import { Platform, StyleSheet, Text, View, Button } from "react-native";
// import '../global';

export default class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <MainNavigation />
      </Provider>
      );
    }
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  }
});
