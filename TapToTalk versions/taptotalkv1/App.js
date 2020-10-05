import React, { Component } from 'react';
import {View,Text,StyleSheet,Button, TouchableOpacity, TextInput} from 'react-native';
import {GoogleSignin,GoogleSigninButton,statusCodes} from '@react-native-community/google-signin';
import * as firebase from 'firebase';
import { firebaseConfig } from './config';

if(!firebase.apps.length)
  firebase.initializeApp(firebaseConfig);

export default class App extends Component 
{  

  constructor(props)
  {
    super(props);
    GoogleSignin.configure({
      webClientId: '378754635240-7uprm9do8fd63odv18c14cotlmf771pi.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      hostedDomain: '', // specifies a hosted domain restriction
      loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      accountName: '', // [Android] specifies an account name on the device that should be used
      //iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });

    this.signIn=this.signIn.bind(this);
  }

  signIn = async () => 
  {
  try {
    //await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    
    console.log(userInfo);
    
    const provider = firebase.auth.GoogleAuthProvider;
    const credential = provider.credential(userInfo.idToken);
    
    firebase.auth().signInWithCredential(credential)
      .then((data) => {
        console.log('SUCCESS', data);
      })
      .catch((error) => {
        console.log('ERROR', error);
      });

   }catch (error) {
    console.log(error);
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // user cancelled the login flow
    } else if (error.code === statusCodes.IN_PROGRESS) {
      // operation (e.g. sign in) is in progress already
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      // play services not available or outdated
    } else {
      // some other error happened
    }
  }
};

  render() 
  {  
      return (  
        <View style={{flex:1}}>       
        <TouchableOpacity style={{backgroundColor:'#fff000',height:40}} onPress={this.signIn}><Text>Login</Text></TouchableOpacity>
      </View>
      );  
  }  
}