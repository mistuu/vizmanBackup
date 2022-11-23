import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  ScrollView, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import {Buffer} from 'buffer';

import CodeInput from 'react-native-confirmation-code-input';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-simple-toast';
import { Hoshi } from 'react-native-textinput-effects';
import ToggleSwitch from 'toggle-switch-react-native';
import Colors from '../../Assets/Colors/index.js';
import Images from '../../Assets/Images/index.js';
import { COLORS, IMAGES } from '../../Assets/index.js';
import { axiosAuthGet, axiosPost } from '../../utility/apiConnection.js';

const {width, height} = Dimensions.get('window');

export default class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formToggle: false,
      name: null,
      phone: null,
      email: null,
      pwd: null,
      referalCode: null,
      code: null,
      showOtp: false,
      userId: null,
    };
  }

  switchToggle = toggle => {
    this.setState({formToggle: toggle});
    if (toggle == true) {
      Toast.show('Builder Form');
    } else {
      Toast.show('Organization Form');
    }
  };
  handleVerify = code => {
    console.log(code);
    this.setState({code: code});

    // this.login(code)
  };
  veriFyAccount=async()=>{
      let res=await axiosAuthGet("Account/GetOTP/"+this.state.userId)
      console.log("OTP=",res);
      if(this.state.code===res[0].smsOTP){
        // console.log("success");
        let response=await axiosPost("Account/VerifyAccount/"+this.state.userId,this.state.userId)
        console.log("verify response:=",response);
        if(response==true){
            this.props.navigation.goBack()

        }
      }
      else{
          Toast.show("OTP Invalid")
      }
  }
  encriptPass(Password) {
    var saltString = 'VizNBPL2020';
    const encoder = new TextEncoder();
    var saltBytes = encoder.encode(saltString);
    var plainTextBytes = encoder.encode(Password);
    var plainTextWithSaltBytes = [
      saltBytes.byteLength + plainTextBytes.byteLength,
    ];
    for (let i = 0; i < plainTextBytes.byteLength; i++) {
      plainTextWithSaltBytes[i] = plainTextBytes[i];
    }
    for (var i = 0; i < saltBytes.byteLength; i++) {
      plainTextWithSaltBytes[plainTextBytes.byteLength + i] = saltBytes[i];
    }
    var sha512 = require('js-sha512');
    var hashByte = sha512.update(plainTextWithSaltBytes).digest('byte');
    var hashWithSaltByte = [hashByte.Length + saltBytes.byteLength];
    for (let i = 0; i < hashByte.length; i++) {
      hashWithSaltByte[i] = hashByte[i];
    }
    for (var i = 0; i < saltBytes.byteLength; i++) {
      hashWithSaltByte[hashByte.length + i] = saltBytes[i];
    }
    var buff = new Buffer(hashWithSaltByte);
    var base64data = buff.toString('base64');
    return base64data;
  }
  submitData = async () => {
    const data = this.state;
    const params = {
      fullName: data.name,
      mobile: data.phone,
      emailId: data.email,
      password: this.encriptPass(data.pwd),
      userName: data.phone,
      userRoleId: data.formToggle ? 5 : 1,
      captchaCode: '1234',
      refferalCode: data.referalCode,
    };
    console.log(params);
    let res = await axiosPost('Account/Registration', params);
    if (res != null) {
      this.setState({userId: res, showOtp: true});
    }
    console.log(res);
  };
  render() {
    return (
      <View style={{flex: 1, backgroundColor: Colors.whitef4}}>
        <LinearGradient
          style={{
            height: Platform.OS == 'ios' ? '12%' : '10%',
            paddingTop: 25,
            width: '100%',
            justifyContent: 'center',
          }}
          colors={[COLORS.primary, COLORS.third]}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: Platform.OS == 'ios' ? 17 : 5,
            }}>
            <TouchableOpacity
              style={{
                marginLeft: 10,
                padding: 10,
                height: 50,
                width: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => this.props.navigation.goBack()}>
              <Image source={IMAGES.back} style={{height: 22, width: 22}} />
            </TouchableOpacity>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                paddingLeft: 20,
                padding: 5,
                fontSize: 22,
              }}>
              Registration
            </Text>
          </View>
        </LinearGradient>
        {!this.state.showOtp ? (
          <View style={{flex:1}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 40,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 18,
                  marginRight: 5,
                  color: Colors.black,
                }}>
                Organization
              </Text>
              <ToggleSwitch
                isOn={this.state.formToggle}
                onColor="green"
                offColor={Colors.grayCCC}
                // label="Urgent"
                labelStyle={{fontSize: 18, color: Colors.white}}
                size="medium"
                onToggle={isOn => this.switchToggle(isOn)}
              />
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 18,
                  marginLeft: 5,
                  color: Colors.black,
                }}>
                Builder
              </Text>
            </View>

            <View
              style={{
                margin: 10,
                paddingTop: 10,
                paddingBottom: 10,
                
                // backgroundColor: Colors.white,
                borderRadius: 9,
              }}>
              <ScrollView>
                <Hoshi
                  label="Name"
                  style={styles.regTextInput}
                  onChangeText={txt => this.setState({name: txt})}
                  value={this.state.name}
                />
                <Hoshi
                  label="Phone"
                  keyboardType="phone-pad"
                  value={this.state.phone}
                  onChangeText={txt => this.setState({phone: txt})}
                  style={styles.regTextInput}
                />
                <Hoshi
                  label="Email"
                  style={styles.regTextInput}
                  onChangeText={txt => this.setState({email: txt})}
                  value={this.state.email}
                  keyboardType="email-address"
                />
                <Hoshi
                  label="Password"
                  style={styles.regTextInput}
                  onChangeText={txt => this.setState({pwd: txt})}
                  value={this.state.pwd}
                />
                <Hoshi
                  label="Referral Code"
                  style={styles.regTextInput}
                  onChangeText={txt => this.setState({referalCode: txt})}
                  value={this.state.referalCode}
                />
              </ScrollView>
              <TouchableOpacity
                onPress={() => this.submitData()}
                style={{marginLeft: 100, marginRight: 100}}>
                <View
                  style={{
                    marginTop: 30,
                    borderRadius: 8,
                    backgroundColor: Colors.primary,
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      paddingRight: 20,
                      paddingLeft: 20,
                      paddingTop: 5,
                      fontSize: 18,
                      paddingBottom: 5,
                      // justifyContent: 'center',
                      textAlign: 'center',
                    }}>
                    {' '}
                    Submit{' '}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
            <View>

            <View style={styles.imageView}>
            <Image
              style={styles.image}
              resizeMode="contain"
              source={Images.Logo1}
            />
          </View>
          <View style={styles.loginView}>
            
                  <Text style={styles.loginFontView}>{'OTP'}</Text>

                  <View
                    style={{
                      marginTop: 50,
                      height: 100,
                      width: 200,
                      marginLeft: 10,
                    }}>
                    <CodeInput
                      // ref={inputRef}
                    //   secureTextEntry
                      ignoreCase={false}
                      className='border-b'
                      activeColor={Colors.primary}
                      inactiveColor={Colors.graye00}
                      space={30}
                      scrollEnabled={true}
                      cellBorderWidth={2}
                      keyboardType="numeric"
                      autoFocus={false}
                      codeLength={6}
                      size={30}
                      inputPosition="left"
                      onFulfill={code => this.handleVerify(code)}
                    />
                  </View>
                  <TouchableOpacity onPress={()=>this.veriFyAccount()}>
                    <View
                      style={{
                        marginTop: 46,
                        borderRadius: 10,
                        backgroundColor: Colors.primary,
                      }}>
                      <Text
                        style={{
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: 'bold',
                          paddingLeft: 50,
                          paddingRight: 50,
                          paddingTop: 10,
                          paddingBottom: 10,
                          textAlign: 'center',
                        }}>
                        Submit
                      </Text>
                    </View>
                  </TouchableOpacity>
          </View>
</View>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.primary,
    },
    regTextInput:{
      marginTop:20,
      borderColor:Colors.grayColor,
      borderWidth:1
    },
    imageView: {
    //   height: Dimensions.get('window').height / 3.8,
    //   backgroundColor: Colors.white,
      // width: "100%",
      marginTop:100,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    image: {
      // height: height/4.5 ,
      // width: width/1.4 ,
      // margin:50,
    //   height: 130,
    //   width: 150,
    },
    changeLanguageView: {
      backgroundColor: Colors.YellowDark,
      marginTop: 9,
      borderRadius: 999,
      position: 'absolute',
      marginLeft: Dimensions.get('window').width / 1.2,
      marginTop: Dimensions.get('window').height / 3.6,
      width: Dimensions.get('window').width / 7,
      height: Dimensions.get('window').height / 25.5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    languageFontView: {
      fontWeight: 'bold',
      color: Colors.primary,
      letterSpacing: 2,
    },
    loginView: {
      marginTop: Dimensions.get('window').height / 7,
      margin: 29,
    },
    loginFontView: {
      fontWeight: 'bold',
      color: Colors.black,
      fontSize: 18,
    },
    otpView: {
      flexDirection: 'row',
      width: '100%',
      borderBottomWidth: 1,
      borderBottomColor: Colors.graye00,
      marginTop: 40,
      alignItems: 'center',
      backgroundColor: Colors.primary,
    },
   
    TextInput: {
      fontSize: 18,
      width: '100%',
      borderBottomWidth: 1,
      borderBottomColor: Colors.white,
      color: Colors.white,
      marginTop: 40,
      backgroundColor: Colors.primary,
    },
    registerView: {
      // position: 'absolute',
      justifyContent: 'center',
      flexDirection: 'row',
      marginBottom: 10,
    },
    noAccountFont: {
      textAlign: 'center',
      color: Colors.white,
      fontSize: 14,
    },
    registerFont: {
      textAlign: 'center',
      color: Colors.white,
      fontWeight: 'bold',
      marginLeft: 5,
      fontSize: 14,
    },
  });