import React from 'react';
import {
    ImageBackground,
    View,
    TextInput,
    BackHandler,
    Image, Text,
    StatusBar, TouchableOpacity, Platform,
} from 'react-native';
import { Buffer } from 'buffer';
import encoding from 'text-encoding';
import { connect } from 'react-redux';
import { removeItem } from '../../utility/AsyncConfig.js';
import Fetch from '../../utility/apiConnection.js';
import { COLORS, IMAGES } from '../../Assets';
import { mapDispatchToProps, mapStateToProps } from '../../Reducers/ApiClass.js';
import Colors from '../../Assets/Colors/index.js';

 class ChangePassword extends React.Component { 
    constructor(props) {
        super(props)
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            Password: '',
            ConfirmPassword: '',
            Otp: '',NhidePassword: true,
            ChidePassword: true,
            
        };
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        this.props.navigation.replace('ResetPassword');
        return true;
    }
    chekTextinput(PASSWORD) {
        var filter = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
        if (PASSWORD != '') {
            if (filter.test(PASSWORD)) {
            if (this.state.ConfirmPassword != "") {
                    if (this.state.Password === this.state.ConfirmPassword) {
                        if (this.state.Otp != "") {
                            if (this.state.Otp === global.otpmsg) {
                                this.resetPassword(PASSWORD)
                            }
                            else {
                                alert('OTP Mismatch');
                            }
                        }
                        else {
                            alert('Please enter OTP.');
                        }
                    }
                    else {
                        alert('New Password and Confirm New Password are not matching');
                    }
                }
                else {
                    alert('Password enter Confirm Password');
                }
            }
            else {
                alert('Password must contain at least minimum 6,at least one letter, one number and one special character');
            }
        }
        else {
            alert('Please Enter Password');
        }
    }
    chekTextinputforconform() {
        var filter = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
        if (this.state.Password != '') {
            if (filter.test(this.state.Password)) {
                return true
            }
            else {
                alert('Password must contain at least minimum 6,at least one letter, one number and one special character');
                this.setState({ ConfirmPassword: '' })
            }
        }
        else {
            alert('Please Enter Password');
            this.setState({ ConfirmPassword: '' })
        }
    }
    encriptPass(PASSWORD) {
        var saltString = "VizNBPL2020";
        var saltBytes = new encoding.TextEncoder("utf-8").encode(saltString);
        var plainTextBytes = new encoding.TextEncoder("utf-8").encode(PASSWORD);
        var plainTextWithSaltBytes = [saltBytes.byteLength + plainTextBytes.byteLength];
        for (let i = 0; i < plainTextBytes.byteLength; i++) {
            plainTextWithSaltBytes[i] = plainTextBytes[i];
        }
        for (var i = 0; i < saltBytes.byteLength; i++) {
            plainTextWithSaltBytes[plainTextBytes.byteLength + i] = saltBytes[i];
        }

        var sha512 = require('js-sha512');
        var hashByte = sha512.update(plainTextWithSaltBytes).digest('byte');
        var hashWithSaltByte = [hashByte.Length + saltBytes.byteLength]
        for (let i = 0; i < hashByte.length; i++) {
            hashWithSaltByte[i] = hashByte[i];
        }

        for (var i = 0; i < saltBytes.byteLength; i++) {
            hashWithSaltByte[hashByte.length + i] = saltBytes[i];
        }

        var buff = new Buffer(hashWithSaltByte);
        var base64data = buff.toString('base64');
        return base64data
    }

    forogotPasswordSucceess = (Response) => (
        this.afterForgotSucceess(Response)
    )
    afterForgotSucceess(){
        removeItem("LoginDetails")
        this.props.navigation.replace('LoginScreen')
    }
     resetPassword(PASSWORD) {
        let param = {
            usrid: global.mobileUserid,
            password: this.encriptPass(PASSWORD)
        }
        this.props.forgotPasswordSet(param,this.forogotPasswordSucceess)
       
    }

    render() {
        return (
            <View style={{ flex: 1,backgroundColor:Colors.whitef4 }}>
                <ImageBackground
                    style={{ height: '100%', width: '100%', justifyContent: 'center' }}
                    source={IMAGES.finalS}
                    imageStyle={{ resizeMode: 'cover' }}>
                    <StatusBar backgroundColor={COLORS.primary}/>
                    <Text style={{ color:COLORS.white, fontSize: 21, alignSelf: 'center' }}>
                        {/* CHANGE PASSWORD */}
               </Text>

               <View style={{ flexDirection: 'row', alignItems: "center", borderBottomColor:COLORS.white, borderBottomWidth: 1, top: '5%', width: '85%', alignSelf: 'center', height: null }}>
                        <TextInput
                            style={{ height: 60, width: '100%', padding: 15, fontSize: 20, color:COLORS.white, }}
                            ref={(el) => { this.Password = el; }}
                            selectionColor={COLORS.white}
                            maxLength={20}
                            secureTextEntry={this.state.NhidePassword}
                            onChangeText={(Password) => this.setState({ Password })}
                            value={this.state.Password} placeholder="New Password *"
                            placeholderTextColor={COLORS.white}
                        />
                        <TouchableOpacity style={{ position: "absolute", right: '0%' }} onPress={() => this.setState({ NhidePassword: !this.state.NhidePassword })}>
                            <Image style={{ height: 20, tintColor:COLORS.white, width: 20, resizeMode: 'contain' }} source={(this.state.NhidePassword) ? IMAGES.hidden : IMAGES.eye} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: "center", borderBottomColor:COLORS.white, borderBottomWidth: 1, top: '5%', width: '85%', alignSelf: 'center', height: null }}>
                        <TextInput
                            style={{ height: 60, width: '100%', padding: 15, fontSize: 20, color:COLORS.white,  alignSelf: 'center' }}
                            ref={(el) => { this.ConfirmPassword = el; }}
                            selectionColor={COLORS.white}
                            maxLength={20}
                            secureTextEntry={this.state.ChidePassword}
                            onFocus={() => this.chekTextinputforconform()}
                            onChangeText={(ConfirmPassword) => this.setState({ ConfirmPassword })}
                            value={this.state.ConfirmPassword} placeholder="Confirm New Password *"
                            placeholderTextColor={COLORS.white}
                        />
                        <TouchableOpacity style={{ position: "absolute", right: '0%' }} onPress={() => this.setState({ ChidePassword: !this.state.ChidePassword })}>
                            <Image style={{ height: 20, tintColor:COLORS.white, width: 20, resizeMode: 'contain' }} source={(this.state.ChidePassword) ? IMAGES.hidden : IMAGES.eye} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomColor:COLORS.white, borderBottomWidth: 1, top: '5%', width: '85%', alignSelf: 'center', height: null }}>
                        <TextInput
                            style={{ height: 60, width: '100%', padding: 15, fontSize: 20, color:COLORS.white, }}
                            ref={(el) => { this.Otp = el; }}
                            selectionColor={COLORS.white}
                            maxLength={6}
                            onChangeText={(Otp) => this.setState({ Otp })}
                            value={this.state.Otp} placeholder="OTP *"
                            placeholderTextColor={COLORS.white}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            
                                    this.chekTextinput(this.state.Password)
                        }}
                        style={{ top: 27, justifyContent: 'center', margin: 18, height: 37, width: '60%', backgroundColor: COLORS.white, alignSelf: 'center', borderRadius: 30 }}>
                        <Text style={{ textAlign: 'center', color: COLORS.black, fontSize: 22, fontWeight: 'bold',  }} >
                            RESET
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.replace('LoginScreen')} style={{  justifyContent: 'center', margin: 18, height: 37, width: '60%', alignSelf: 'center', borderRadius: 30 }}>
                        <Text style={{ textAlign: 'center', color:COLORS.white, fontSize: 18, fontWeight: 'bold', }} >
                            LOGIN
                                 </Text>
                    </TouchableOpacity>
                
                </ImageBackground>
            </View>
        );
    }
}

// const mapStateToProps = (state) => ({
    
  
// });
// const mapDispatchToProps = (dispatch) => ({
//     forgotPasswordSet: (params, onSuccess,isLoading) => dispatch(Fetch('Account/ChangePassword', 'POST', params, undefined, onSuccess, isLoading)),
// })

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);