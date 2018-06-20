/*

https://www.youtube.com/watch?v=5f5VEEmMSyE

Copyright (c) 2018 HERC SEZC

Licensed under the Apache License, Version 2.0 (the "License");

you may not use this file except in compliance with the License.

You may obtain a copy of the License at


    http://www.apache.org/licenses/LICENSE-2.0


Unless required by applicable law or agreed to in writing, software

distributed under the License is distributed on an "AS IS" BASIS,

WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and

limitations under the License.

*/
import React, { Component } from "react";
import { StackNavigator } from "react-navigation";
import MainNavigation from "./navigation/MainNavigation";

import { Provider } from "react-redux";
import store from "./store";

// import { LoginScreen } from "edge-login-ui-rn";
import { LoginScreen } from "herc-edge-login-ui-rn";
import { makeEdgeContext } from "edge-core-js";
import { ethereumCurrencyPluginFactory } from 'edge-currency-ethereum';

import { Platform, StyleSheet, Text, View, Button } from "react-native";

import { _postIdology } from "./components/api";

// function setupCore () {
//   return makeEdgeContext({
//     // Replace this with your own API key from https://developer.airbitz.co:
//     apiKey: '0b5776a91bf409ac10a3fe5f3944bf50417209a0',
//     appId: 'com.mydomain.myapp',
//     vendorName: 'Chain Net',
//     vendorImageUrl: 'https://airbitz.co/go/wp-content/uploads/2016/10/GenericEdgeLoginIcon.png',
//     plugins: [ ethereumCurrencyPluginFactory ]
//   })
// }

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      context: null,
      account: null,
      walletId: null,
      wallet: null
    }
    makeEdgeContext({
      // Replace this with your own API key from https://developer.airbitz.co:
      apiKey: '0b5776a91bf409ac10a3fe5f3944bf50417209a0',
      appId: 'com.mydomain.myapp',
      vendorName: 'Chain Net',
      vendorImageUrl: 'https://airbitz.co/go/wp-content/uploads/2016/10/GenericEdgeLoginIcon.png',
      plugins: [ethereumCurrencyPluginFactory]
    }).then(context => {
      this.setState({ context })
      this.logger("State Context")
      this.logger(this.state.context)
    })
    // Creating the context is async, so we store it in our state:
    // setupCore().then(context => this.setState(state => ({ ...state, context })))
  }

  onLogin = (error = null, account) => {
    if (!this.state.account) {
      this.setState({account})
      this.logger("State Account")
      this.logger(this.state.account)
    }
    if (!this.state.walletId) {
      // Check if there is a wallet, if not create it
      let walletInfo = account.getFirstWalletInfo('wallet:ethereum')
      if (walletInfo) {
        this.setState({walletId: walletInfo.id})
        this.logger(`State WalletID: ${this.state.walletId}`)
      } else {
        account.createCurrencyWallet('wallet:ethereum', {
          name: 'My First Wallet',
          fiatCurrencyCode: 'iso:USD'
        }).then(wallet => {
          this.setState({ wallet })
          this.setState({walletId: wallet.id})
          this.logger(`State WalletID: ${this.state.walletId}`)
          this.logger(this.state.wallet)
        })
      }
    }
  }

  handleClick() {
    console.log("Click happened");
  }

  renderLoginApp = () => {
    if (this.state.account) {
      console.log("the context: ", this.state.context)
      console.log("the state", this.state)
      console.log('Hello this is me. You have logged in. ')
      var data = {'firstName':'julie'}
      _postIdology(data)

      return (
        <View>
          <Provider  style={{width: 370}} store={store}>
            <MainNavigation />
          </Provider>
          <Text style={{width: 360, backgroundColor: "blue"}}>WTF</Text>
        </View>
      );

      {
        /* <View>
          <AppStackNavigator />
          <Text>This is a space-holding textblock. The component above renders only in the width of this textblock.</Text>
        </View> */
      }
      // return <Button
      // onPress={this.handleClick}
      //   onPress={() =>
      //           navigate('Welcome')
      //         }
      //   title="Learn More"
      //   color="#841584"
      //   accessibilityLabel="Learn more about this purple button"
      // />
    }

    if (this.state.context && !this.state.account) {
      return (
        <LoginScreen
          context={this.state.context}
          onLogin={this.onLogin.bind(this)}
          accountOptions={{}}
        />
      );
    }
    return <Text style={styles.welcome}>Loading</Text>;
  };

  render() {
      return <View style={styles.container}>{this.renderLoginApp()}</View>;
    }//end render
    // const obj = {prop1: 'prop1Value', prop2: 'prop2Value', child: {childProp1: 'childProp1Value'}}
    // console.log(obj)
    // console.log("Julianaaaaa")
    // this.logger(obj)
    logger (t) {
      if (typeof t === 'object') {
        t = JSON.stringify(t)
      }
      console.log(t)
    }//end logger
  }//end component

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
