import { Buffer } from 'buffer';
import React from 'react';
import {
    Image, ScrollView, StatusBar,
    Text, TextInput, TouchableOpacity, View
} from 'react-native';
import Toast from 'react-native-simple-toast';
import { connect } from 'react-redux';
import encoding from 'text-encoding';
import { COLORS, IMAGES } from '../../Assets';
import { mapDispatchToProps, mapStateToProps } from '../../Reducers/ApiClass';
import { Header } from '../CusComponent';
class AppChangePassword extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            oldPwd: '',
            newPwd: '',
            confirmPwd: '',
            OhidePassword: true,
            NhidePassword: true,
            ChidePassword: true,
        };
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
    CheckTextInput() {
        if (this.state.oldPwd != '') {
            if (this.state.newPwd != '') {
                if (this.state.newPwd.length > 5 && (/([@!#$%^&*_-]+)/g.test(this.state.newPwd)) && (/([0-9]+)/g.test(this.state.newPwd)) && (!/([.]+)/g.test(this.state.newPwd))) {
                    if (this.state.newPwd == this.state.confirmPwd) {
                        this.insertData()
                    }
                    else {
                        alert('New Password and Confirm New Password are not matching');
                    }

                } else {
                    alert('Password must contain at least minimum 6,at least one letter, one number and one special character')
                }
            } else {
                alert('Please Enter New Password');
            }
        } else {
            alert('Please Enter Old Password');
        }
    }
    chekOldPWD = (respp) => (
        this.adterSucceessOldPWD(respp)
    )
    navigateScreen = () => (
        this.navigateSucceess()
    )
    navigateSucceess() {
        Toast.show('Password Change successfully.');
        this.props.navigation.replace('LoginScreen')
        this.setState({
            newPwd: '', oldPwd: '', confirmPwd: ''
        })
    }
    adterSucceessOldPWD(chekOldpwd) {
        if (chekOldpwd == true) {
            let params = {
                "usrid": this.props.LoginDetails.empID,
                "password": this.encriptPass(this.state.newPwd),
                "oldPassword": this.encriptPass(this.state.oldPwd)
            }
            this.props.ChangePassword(params, this.navigateScreen)
        } else {
            alert('Old Password Not Match')
        }
    }
    async insertData() {
        let params = {
            "usrid": this.props.LoginDetails.empID,
            "password": this.encriptPass(this.state.newPwd),
            "oldPassword": this.encriptPass(this.state.oldPwd)
        }
        this.props.CheckOldPwd(params, this.chekOldPWD)
    }
    chekTextinputforconform() {
        // console.log("passspecial111",  !(/(.+)/g.test(this.state.Password)))
        var filter = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
        if (this.state.newPwd != '') {
            if (filter.test(this.state.newPwd)) {
                return true
            }

            else {
                alert('Password must contain at least minimum 6,at least one letter, one number and one special character');
                this.setState({ confirmPwd: '' })
            }
        }
        else {
            alert('Please Enter Password');
            this.setState({ confirmPwd: '' })
        }
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: COLORS.whitef4 }}>
                <StatusBar backgroundColor={COLORS.primary} />
                <View style={{ width: "100%" }}>
                    <Header title={"Change Password"} navigation={this.props.navigation} /></View>
                <View style={{ flex: 1 }}>

                    <ScrollView style={{ flex: 1 }}>

                        <View style={{ padding: '5%', width: '100%', height: null, justifyContent: 'center' }}>
                            <Text style={{ color: COLORS.black, fontSize: 18, }}>Old Password *</Text>
                            <View style={{ borderBottomWidth: 0.7, width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <TextInput
                                    style={{height:55, width: '95%', fontSize: 18, color: COLORS.black, paddingStart: 10 }}
                                    ref={(el) => { this.oldPwd = el; }}
                                    returnKeyType={"next"}
                                    maxLength={20}
                                    onSubmitEditing={() => { this.newPwd.focus(); }}
                                    secureTextEntry={this.state.OhidePassword}
                                    onChangeText={(oldPwd) => this.setState({ oldPwd })}
                                    value={this.state.oldPwd}
                                />
                                <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => this.setState({ OhidePassword: !this.state.OhidePassword })}>
                                    <Image style={{ height: 20, tintColor: COLORS.black, width: 20, resizeMode: 'contain' }} source={(this.state.OhidePassword) ? IMAGES.hidden : IMAGES.eye} />
                                </TouchableOpacity>
                            </View>

                            <Text style={{ marginTop: 10, color: COLORS.black, fontSize: 18, }}>New Password *</Text>
                            <View style={{ borderBottomWidth: 0.7, width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                                <TextInput
                                    style={{height:55, width: '95%', fontSize: 18, color: COLORS.black, paddingStart: 10 }}
                                    ref={(el) => { this.newPwd = el; }}
                                    returnKeyType={"next"}
                                    maxLength={20}
                                    keyboardType='numbers-and-punctuation'
                                    onSubmitEditing={() => { this.confirmPwd.focus(), this.chekTextinputforconform() }}
                                    secureTextEntry={this.state.NhidePassword}
                                    onChangeText={(newPwd) => this.setState({ newPwd })}
                                    value={this.state.newPwd}
                                />
                                <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => this.setState({ NhidePassword: !this.state.NhidePassword })}>
                                    <Image style={{ height: 20, tintColor: COLORS.black, width: 20, resizeMode: 'contain' }} source={(this.state.NhidePassword) ? IMAGES.hidden : IMAGES.eye} />
                                </TouchableOpacity>
                            </View>
                            <Text style={{ marginTop: 10, color: COLORS.black, fontSize: 18, }}>Confirm New Password *</Text>
                            <View style={{ borderBottomWidth: 0.7, width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                                <TextInput
                                    style={{height:55, width: '95%', fontSize: 18, color: COLORS.black, paddingStart: 10 }}
                                    ref={(el) => { this.confirmPwd = el; }}
                                    maxLength={20}
                                    secureTextEntry={this.state.ChidePassword}
                                    // onFocus={() => this.chekTextinputforconform()}
                                    returnKeyType="go"
                                    onSubmitEditing={() => {

                                        this.CheckTextInput()

                                    }}
                                    onChangeText={(confirmPwd) => this.setState({ confirmPwd })}
                                    value={this.state.confirmPwd}
                                />
                                <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => this.setState({ ChidePassword: !this.state.ChidePassword })}>
                                    <Image style={{ height: 20, tintColor: COLORS.black, width: 20, resizeMode: 'contain' }} source={(this.state.ChidePassword) ? IMAGES.hidden : IMAGES.eye} />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={() => {

                                this.CheckTextInput()

                            }} style={{ marginTop: 40, alignSelf: 'center', justifyContent: 'center', borderRadius: 20, width: '50%', height: 45, backgroundColor: COLORS.secondary, }}>
                                <Text style={{ color: COLORS.white, fontSize: 22, textAlign: 'center', }}>
                                    Submit
                            </Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>

                </View>
            </View>
        );
    }
}



// const mapStateToProps = (state) => ({
//     empID: state.CommanReducer.LoginDetails.empID,
//     isLoading: state.CommanReducer.isLoading,

// });
// const mapDispatchToProps = (dispatch) => ({
//     CheckOldPwd: (params, onSuccess) => dispatch(Fetch('Account/CheckOldPwd', 'POST', params, undefined, onSuccess, false)),
//     ChangePassword: (params, onSuccess) => dispatch(Fetch('Account/ChangePassword', 'POST', params, undefined, onSuccess, false)),

// })

export default connect(mapStateToProps, mapDispatchToProps)(AppChangePassword);