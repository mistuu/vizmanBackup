import React from 'react';
import { Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import { COLORS, IMAGES } from '../../../Assets/index.js';
import { mapDispatchToProps, mapStateToProps } from '../../../Reducers/ApiClass';
import { axiosAuthGet, axiosPost } from '../../../utility/apiConnection.js';
import { getItem } from '../../../utility/AsyncConfig.js';
import { Header } from "../../CusComponent";
const { width, height } = Dimensions.get('window');


global.colors = [
    COLORS.primary,
    COLORS.third
]



var tempList
class BuildingGateKeeper extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
        };
    }
    componentDidMount() {
        this.getData()
    }
    getData = async () => {
        var Userid;
        await getItem("LoginDetails").then((data) => {
            var LoginDetails = JSON.parse(data)
            console.log(data.userID);
            Userid = LoginDetails.userID
        })
        try {

            console.log(Userid);
            // let response = await axiosAuthGet("BuildingAdmin/GetUnit/" + Userid+"/"+"1")
            // console.log("Office response==",response);
            // let params={
            //     name:"cndjcn"
            // }   
            // let response = await axiosPost("BuildingAdmin/SaveVisitor",params)
            // console.log(response);
        } catch (error) {

        }
    }
    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible })
    }
    render() {

        return (
            <View style={{ width: '100%', height: '100%', backgroundColor: COLORS.whitef4 }}>
                <View style={{ width: "100%" }}>
                    <Header title={"Building Gatekeeper"} navigation={this.props.navigation} /></View>

                <View style={{ flex: 1, }}>
                    <View style={{ flex: 1, justifyContent: 'center', }}>
                        <View style={{ height: "100%", width: "100%", flexDirection: this.state.orientation === 'landscape' ? 'row' : 'column' }}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: '2%' }}>

                                <TouchableOpacity onPress={() => this.props.navigation.navigate('AddNewVisitor')} >
                                    <LinearGradient
                                        style={{ height: 200, width: 200, justifyContent: 'center',  alignItems: 'center', borderRadius: 200 / 2, }}
                                        colors={[COLORS.primary, COLORS.third]}>
                                        <Text style={{ fontSize: 60, color: COLORS.white, }}>IN</Text>
                                    </LinearGradient>

                                </TouchableOpacity>

                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: '2%' }}>
                                <TouchableOpacity onPress={() => {
                                    this.props.navigation.navigate('CheckOutVisitorList')
                                }} style={{ justifyContent: 'center', alignSelf: 'center' }}>
                                    <LinearGradient
                                        style={{ height: 200, width: 200, justifyContent: 'center',  alignItems: 'center', borderRadius: 200 / 2, }}
                                        colors={[COLORS.primary, COLORS.third]}>
                                        <Text style={{ fontSize: 60, color: COLORS.white, }}>OUT</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>

                </View>
                <Modal
                    isVisible={this.state.modalVisible}
                    onBackdropPress={() => this.setModalVisible(false)}
                    onSwipeComplete={() => this.setModalVisible(false)}
                    swipeDirection="left"
                    onBackButtonPress={() => this.setModalVisible(false)}
                >
                    <View style={{ alignSelf: 'center', width: '90%', height: 190, backgroundColor: COLORS.white, borderRadius: 13, padding: 10, alignItems: 'center' }}>
                        <Image source={IMAGES.inmodal}
                            style={{ alignSelf: 'center', resizeMode: 'cover', height: 35, width: 70, top: -26 }} />


                    </View>


                </Modal>
            </View>

        )

    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    textInputStyle: {
        color: COLORS.black,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.black,
        height: (Platform.OS === 'ios' ? 40 : null)
    },
    textInputDisableStyle: {
        color: COLORS.black,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.black,
        height: (Platform.OS === 'ios' ? 40 : null),
        backgroundColor: COLORS.whiteE0
    },
    error: { color: 'red', fontSize: 10, padding: 2 },
    switchLable: { paddingLeft: 15, paddingTop: 15, textAlign: "left", alignSelf: 'center', width: "49%" },
    switch: { alignSelf: "flex-end", width: "50%", padding: 5 },
    switchContainer: { width: "100%", height: 55, flexDirection: "row", borderBottomWidth: 1.5, borderColor: 'green' },

})

// const mapStateToProps = (state) => ({
//     // network: state.NetworkReducer.network,
//     // error: state.CommanReducer.error,
//     Update: state.CommanReducer.Update,
//     SubscriptionLimit: state.CommanReducer.SubscriptionLimit,
//     isLoading: state.CommanReducer.isLoading,
//     ReceptionList: state.CommanReducer?.ReceptionList,
//     LoginDetails: state.CommanReducer?.LoginDetails,
//     VisitorList: state.VisitorsReducer?.VisitorList,
//     EmployeeList: state.EmployeReducer?.EmployeeList
// });
// const mapDispatchToProps = (dispatch) => ({
//     GetVisitorForGateKeeper: (userID, onSuccess) => dispatch(Fetch('Visitor/GetVisitorForGateKeeper', 'GET', userID, serviceActionVisitors, onSuccess, true)),
//     SaveNotification: (param) => dispatch(Fetch('Notification/SaveNotification', 'POST', param)),
//     GetReceptionList: (userID) => dispatch(Fetch('Users/GetReceptionList', 'GET', userID, serviceActionReceptionList)),
//     GetEmpCheckInList: (param,onSuccess) => dispatch(Fetch('Users/GetEmpCheckInList', 'GET', param, serviceActionEmployeeList, onSuccess, true)),
//     CheckOut: (inoutid, onSuccess) => dispatch(Fetch('Visitor/CheckOut/' + inoutid, 'POST', undefined, undefined, onSuccess, true)),
//     EmpCheckOut: (param, onSuccess) => dispatch(Fetch('Users/EmpCheckOut', 'POST', param, undefined, onSuccess, true)),
//     EmpCheckIn: (param, onSuccess) => dispatch(Fetch('Users/EmpCheckIn', 'POST', param, undefined, onSuccess, true)),
//     GetVisitorByInviteCode: (inviteCode, onSuccess) => dispatch(Fetch('Visitor/GetVisitorByInviteCode', 'GET', inviteCode, undefined, onSuccess, true)),
//     Update: (Update) => dispatch(serviceActionUpdate(Update)),
// })

export default connect(mapStateToProps, mapDispatchToProps)(BuildingGateKeeper);