import React from 'react';
import {
    Alert, BackHandler, ImageBackground,



    Linking, StatusBar
} from 'react-native';
import VersionCheck from 'react-native-version-check';
import { connect } from 'react-redux';
import { IMAGES } from '../../Assets';
import { mapDispatchToProps, mapStateToProps } from '../../Reducers/ApiClass';
import { getItem } from '../../utility/AsyncConfig';
import { CusAlert } from '../CusComponent';


class SplashScreen extends React.Component {
    constructor(props) {
        super(props);
        this.checkUpdateNeeded();


    }
    
    componentDidMount(){
    }
    async checkUpdateNeeded() {
        try {
            let updateNeeded = await VersionCheck.needUpdate();
            console.log("updateNeeded", updateNeeded);
            this.navigateScreen()

            // if (updateNeeded.isNeeded) {
            //     Alert.alert(
            //     'Please Update',
            //         "You will have to update vizman to the latest version to continue using.",
            //         [
            //             {
            //                 text: 'Update',
            //                 onPress: () => {
            //                     BackHandler.exitApp();
            //                     Linking.openURL(updateNeeded.storeUrl);
            //                 },
            //                  cancelable: false 
            //             },

            //         ])
            // } else {
            //     this.navigateScreen()
            // }
        } catch (error) {

        }
    }
    naviagte = (rec) => (

        this.naviagte111(rec)
    )
    naviagte111(rec) {
        console.log("RESSSSS", rec)
        this.props.navigation.replace('DrawerScreen')

    }
    navigateScreen() {
        getItem("LoginDetails").then((data) => {
            var LoginDetails = JSON.parse(data)
            setTimeout(() => {
                try {
                    if (LoginDetails != false) {
                        if (LoginDetails.userID != 0 || LoginDetails.userID != false) {
                            this.props.saveData(LoginDetails)
                            this.props.GetUsersDetails(LoginDetails.empID, this.naviagte)
                        } else {
                            this.props.navigation.replace('LoginScreen')
                        }
                    } else {

                        this.props.navigation.replace('LoginScreen')
                    }

                } catch (error) {
                }
            }, 1000);
        })
    }

    render() {

        return (<ImageBackground
            style={{ flex: 1, paddingTop: 25 }}
            source={IMAGES.vizman_splash}
            // imageStyle={{ resizeMode: 'stretch' }}
        >
            {/* <StatusBar backgroundColor={COLORS.primary} /> */}
            <StatusBar barStyle={'dark-content'} backgroundColor='transparent' translucent={true} />
            <CusAlert
                displayAlert={this.props.network.isConnected ? this.props.error != null && this.props.error != "" ? true : !this.props.network.isConnected : !this.props.network.isConnected}
                iconInternet={true}
                alertMessageText={"NO INTERNET CONNECTION"}
            />
        </ImageBackground>)
    }

}
// const mapStateToProps = (state) => ({
//     network: state.NetworkReducer.network,
// });
// const mapDispatchToProps = (dispatch) => ({
//     saveData: (data) => dispatch(serviceActionLoginDetail(data)),
//     GetUsersDetails: (empId, onSuccess) => dispatch(Fetch('Users/GetUsersDetails', 'GET', empId, serviceActionUserDetail, onSuccess, false)),
// })

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);