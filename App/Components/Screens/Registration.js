import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,BackHandler, StyleSheet, Text, TouchableOpacity, View
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
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
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
      OhidePassword: false,
    };
  }
  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

  }
  handleBackButtonClick() {
    this.props.navigation.goBack()
    return true;
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);

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
          alert("New Organization Create succesfully")
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
  chekTextinputforconform() {
    var filter =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    if (this.state.pwd != '') {
      if (filter.test(this.state.pwd)) {
        return true;
      } else {
        alert(
          'Password must contain at least minimum 6,at least one letter, one number and one special character',
        );
        // const userProfile = Object.assign({}, this.state.userProfile, { password: "" });
        // this.setState({ userProfile })
      }
    } else {
      alert('Please Enter Password');
      // const userProfile = Object.assign({}, this.state.userProfile, { password: "" });
      // this.setState({ userProfile })
    }
  }
  submitData = async () => {
    
    const data = this.state;
    if(data.name!=null){
      if(data.phone.length>=8 ){
        if (
         data.email==null || this.validate(data.email)
        ){
          if(this.chekTextinputforconform()){
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
          }
        }else{
          alert('Invalid Email Id')
        }
       
      }else{
        alert("Invalid Mobile Number")
      }
    }else{
      alert("Please Fill Mendetory Field")
    }
  
  };
  checkDuplicateMobile=async(text)=>{
    this.setState({phone: text})
    let response=await axiosAuthGet("Account/CheckDuplicate/"+text)
    console.log(response);
    if(response==true){
      alert("Mobile Number Already Exists")
      this.setState({phone: null})
    }
  } 
  checkDuplicateUsrname=async(text)=>{
    let response=await axiosAuthGet("Account/CheckDuplicateUsrNm/"+text)
    console.log(response);
    if(response==true){
      alert("UserName Already Exists")
      this.setState({name: null})
    }
  }
  checkDuplicateEmail=async(text)=>{
    this.setState({email: text})
    let response=await axiosAuthGet("Account/CheckDuplicateEmail/"+text)
    console.log(response);
    if(response==true){
      alert("Email Already Exists")
      this.setState({email: null})
    }
  }
  validate = text => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      return false;
    } else {
      return true;
    }
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
              onPress={() => this.handleBackButtonClick()}>
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
                  label="Name*"
                  style={styles.regTextInput}
                  onChangeText={txt =>     this.setState({name: txt})                }
                  value={this.state.name}
                />
                <Hoshi
                  label="Phone*"
                  keyboardType="phone-pad"
                  value={this.state.phone}
                  maxLength={15}
                  onSubmitEditing={(mobile) => {
                    this.checkDuplicateMobile(mobile)
                  }}
                  returnKeyType={Platform.OS=="android"?"next":"done"}
                  onChangeText={txt =>this.setState({phone:txt}) }
                  style={styles.regTextInput}
                />
                <Hoshi
                  label="Email"
                  style={styles.regTextInput}
                  onChangeText={txt => this.checkDuplicateEmail(txt)}
                  value={this.state.email}
                  keyboardType="email-address"
                />
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Hoshi
                  label="Password*"
                  style={styles.regTextInput,{flex:1}}
                  secureTextEntry={this.state.OhidePassword}
                  onChangeText={txt => this.setState({pwd: txt})}
                  value={this.state.pwd}
                />
                <TouchableOpacity
                  style={{
                    height: 50,
                    width: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    right: '0%',
                  }}
                  onPress={() =>
                    this.setState({OhidePassword: !this.state.OhidePassword})
                  }>
                  <Image
                    style={{
                      height: 20,
                      tintColor: COLORS.black,
                      width: 20,
                      resizeMode: 'contain',
                    }}
                    source={
                      this.state.OhidePassword ? IMAGES.hidden : IMAGES.eye
                    }
                  />
                </TouchableOpacity>
                </View>
                <Hoshi
                  label="Referral Code"
                  style={styles.regTextInput}
                  onChangeText={txt => this.setState({referalCode: txt})}
                  value={this.state.referalCode}
                />
              </ScrollView>
              <View style={{alignItems:'center',alignSelf:'center'}}> 
              <TouchableOpacity
                  onPress={() => this.submitData()}
                  style={{
                    margin: 30,
                    alignSelf: 'center',
                    padding: 10,
                    borderRadius: 9,
                    backgroundColor: COLORS.primary,
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: COLORS.white,
                      fontWeight: 'bold',
                      width: 100,
                      textAlign: 'center',
                    }}>
                    Submit
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={{}}>
                <Text style={{fontSize:15,fontWeight:'bold'}}>Already have account? Sign in</Text>
                </TouchableOpacity>
              {/* <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={{}}>
                <View
                  style={{
                    marginTop: 30,
                    borderRadius: 50/2,
                    backgroundColor: Colors.primary,
                    alignItems:'center',
                    justifyContent:'center',
                    height:50,
                    width:50,
                    alignSelf:'center'
                  }}>
                  <Image
                    source={Images.leftArrow}
                    style={{height:"70%",resizeMode:'contain', width:"70%"}}
                  />
                </View>
              </TouchableOpacity> */}
              {/* <TouchableOpacity
                onPress={() => }
                style={{marginLeft: 100, }}>
                <View
                  style={{
                    marginTop: 30,
                    borderRadius: 50/2,
                    backgroundColor: Colors.primary,
                    alignItems:'center',
                    justifyContent:'center',
                    height:50,
                    width:50,
                    alignSelf:'center'
                  }}>
                  <Image
                    source={Images.rightArrow}
                    style={{height:"70%",resizeMode:'contain', width:"70%"}}
                  />
                </View>
              </TouchableOpacity> */}

                </View>
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