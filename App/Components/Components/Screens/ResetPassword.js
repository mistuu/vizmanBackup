import React from 'react';
import {
    BackHandler,
    Image, ImageBackground,








    StatusBar, StyleSheet,








    Text, TextInput,


    TouchableOpacity, View
} from 'react-native';
import Toast from 'react-native-simple-toast';
import { connect } from 'react-redux';
import { IMAGES } from '../../Assets';
import { mapDispatchToProps, mapStateToProps } from '../../Reducers/ApiClass.js';

class ResetPassword extends React.Component {
    constructor(props) {
        super(props)
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            Mobile: '',
            text1: '',
        };
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }


    handleBackButtonClick() {
        this.props.navigation.replace('LoginScreen');
        return true;
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
        clearInterval(this._interval);
    }

    makeid(length) {
        var result = '';
        var characters = '0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    accountResetSucceess = (Response) => (
        this.afterResetLogin(Response)
    )
    afterResetLogin(Response) {
        if (Response == 0 || this.state.Mobile == '' || Response.rollid == 1 || Response.usrid == 0) {
            Toast.show('Mobile No. does not exist')
        } else {
            global.otpmsg = this.makeid(6)
            var msg = "Hello ,Oppss you forgot the password.Try this OTP " + global.otpmsg + " to reset it. VizMan"
            var userid = "2000186085";
            var passwd = "gkoCNjbta";
            var url = "http://enterprise.smsgupshup.com/GatewayAPI"
            var param = "/rest?msg=" + msg + "&v=1.1&userid=" + userid + "&password=" + passwd + "&send_to=" + this.state.Mobile + "&msg_type=text&method=sendMessage&mask=VizMan"
            fetch(url + param).then((res) => res.text()).then((response) => {
                global.mobileUserid = Response.usrid
                Toast.show('OTP send to your mobile')
                this.props.navigation.replace('ChangePassword')
            }).catch((error) => console.log("error", error));
        }
    }


    async resetPassword() {
        var Mobile = this.state.Mobile
        this.props.loginReset(Mobile, this.accountResetSucceess)
    }
    handleInputChange = (Mobile) => {
        this.setState({ Mobile: Mobile.replace(/[- #*;,.+<>N()\{\}\[\]\\\/]/gi, '') });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <ImageBackground
                    style={{ paddingTop: 25,flex: 1 , justifyContent: 'center' }}
                    source={IMAGES.finalS}
                    imageStyle={{ resizeMode: 'cover' }}>
                    {/* <StatusBar backgroundColor={COLORS.primary} /> */}
                    <StatusBar barStyle={'dark-content'} backgroundColor='transparent' translucent={true} />

                    <Text style={{ color: COLORS.white, fontSize: 21, alignSelf: 'center' }}>
                        RESET PASSWORD
                   </Text>
                    <View style={{ flexDirection: 'row', borderBottomColor: COLORS.white, borderBottomWidth: 1, top: '5%', width: '85%', alignSelf: 'center', height: null }}>
                        <Image source={IMAGES.username}
                            style={{ alignSelf: 'center', resizeMode: 'cover', height: 20, width: 17 }} />
                        <TextInput
                            style={{ height: 60, width: '100%', top: '1%', padding: 15, fontSize: 20, color: COLORS.white, alignSelf: 'center' }}
                            ref={(el) => { this.Mobile = el; }}
                            selectionColor={COLORS.white}
                            maxLength={10}
                            keyboardType={'phone-pad'}
                            onChangeText={(Mobile) => this.handleInputChange(Mobile)}
                            value={this.state.Mobile} placeholder="Mobile No *"
                            placeholderTextColor={COLORS.white}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={() => {

                            if (this.state.Mobile != '' && this.state.Mobile.length == 10) {
                                this.resetPassword()
                            } else {
                                Toast.show('Please enter valid mobile.');
                            }

                        }}
                        style={{ top: 27, justifyContent: 'center', margin: 18, height: 37, width: '60%', backgroundColor: COLORS.white, alignSelf: 'center', borderRadius: 30 }}>
                        <Text style={{ textAlign: 'center', color: COLORS.black, fontSize: 22, fontWeight: 'bold', }} >
                            RESET
                                 </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ justifyContent: 'center', margin: 18, height: 37, width: '60%', alignSelf: 'center', borderRadius: 30 }}>
                        <Text style={{ textAlign: 'center', color: COLORS.white, fontSize: 18, fontWeight: 'bold', }} >
                            LOGIN
                                 </Text>
                    </TouchableOpacity>
                </ImageBackground>
            </View>
        )

    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

// const mapStateToProps = (state) => ({

// });
// const mapDispatchToProps = (dispatch) => ({
//     loginReset: (params, onSuccess, isLoading) => dispatch(Fetch('Account/ResetPassword', 'GET', params, undefined, onSuccess, isLoading)),
// })

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);