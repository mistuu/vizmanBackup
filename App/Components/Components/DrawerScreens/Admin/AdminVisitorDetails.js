import Moment from 'moment';
import React from 'react';
import {
    Text, View, Animated, Image, StatusBar, ScrollView, FlatList, Dimensions, StyleSheet, TextInput, TouchableOpacity, SafeAreaView,
    PermissionsAndroid,
    Platform,
} from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import { connect } from 'react-redux';
import { COLORS, IMAGES } from '../../../Assets';
import { mapDispatchToProps, mapStateToProps } from '../../../Reducers/ApiClass';
import { RFPercentage } from "react-native-responsive-fontsize";
import { visitorDetailEmpty } from '../../../utility/emptyClass';
import VisitorDetails from "../../Screens/VisitorDetails.js";
import { IMAGEURL } from '../../../utility/util.js';

const colors = [
    COLORS.primary,
    COLORS.primary
]
class AdminVisitorDetails extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            AdmindVisitordtls: [], selectedItem: [], isRefreshing: false, modalVisible: false,
        }
    }
    componentDidMount() {
        this.props.GetVisitorDtlsForAdmin(this.props.route.params.visitorDtl.visitorId+"/"+this.props.LoginDetails.empID, this.visitorListSuccess)

    }
    visitorListSuccess = (AdmindVisitordtls) => {
        this.setState({
            AdmindVisitordtls
        });
    }

    // (this.afterVisitorListSuccess(res))
    // afterVisitorListSuccess(AdmindVisitordtls) {
    //     this.setState({
    //         AdmindVisitordtls
    //     });
    // }
    onRefresh() {
        this.setState({ isRefreshing: true, });
        setTimeout(() => {
            this.componentDidMount()
            this.setState({ isRefreshing: false });
        }, 3000);
    }
    handleBackButtonClick() {
        this.props.navigation.goBack()
        return true;
    }
    render() {
        return (
            <View style={{ width: '100%', height: '100%', backgroundColor: COLORS.whitef4 }}>
                <LinearGradient style={{
                    height: 75, paddingTop: 25,
                    width: '100%',
                    justifyContent: 'center'
                }}
                    colors={colors}
                >
                    <StatusBar barStyle={'dark-content'} backgroundColor='transparent' translucent={true} />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity style={{ height: 30, width: 30, left: 10, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.props.navigation.goBack()}>
                            <Image source={IMAGES.back}
                                style={{ height: 22, width: 22, }} />
                        </TouchableOpacity>
                        <View style={{ width: '100%', flexDirection: "row", paddingLeft: 20 }}>
                            <Text style={{ color: "white", textAlign: "center", padding: 5, fontSize: 22 }}>Visitor Details</Text>
                        </View>
                    </View>
                </LinearGradient>
                <View style={{ backgroundColor: COLORS.white, borderRadius: 10, width: '98%', elevation: 0.5, alignSelf: 'center', paddingBottom: 4 }}>
                    {/* <View style={{width:'50%',}}> */}
                    <Text style={{ fontSize: 16, padding: 5, fontWeight: "bold", color: '#6a7989', }}>Full Name  :  {this.props.route.params.visitorDtl.fullName}</Text>
                    <Text style={{ fontSize: 16, padding: 5, fontWeight: "bold", color: '#6a7989', }}>Mobile  :  {this.props.route.params.visitorDtl.mobile}</Text>
                    <Text style={{ fontSize: 16, padding: 5, fontWeight: "bold", color: '#6a7989', }}>VIP  :  {this.props.route.params.visitorDtl.isVip ? "Yes" : "No"}</Text>

                    <View style={{ flexDirection: 'row', }}>
                        {this.props.route.params.visitorDtl.idProof != null ? <View style={{ flexDirection: 'row', flex: 1, }}>
                            <Text style={{ fontSize: 16, padding: 5, fontWeight: "bold", color: '#6a7989', }}>
                                ID Proof  :{"  "}
                            </Text>
                            <Image
                                source={{ uri: IMAGEURL + this.props.route.params.visitorDtl.idProof }}
                                style={{ width: 90, height: 90, resizeMode: 'contain' }}
                            />
                        </View> : null}
                        {this.props.route.params.visitorDtl.photoProof != null ? <View style={{ flexDirection: 'row', flex: 1 }}>
                            <Text style={{ fontSize: 16, padding: 5, fontWeight: "bold", color: '#6a7989', }}>
                                Photo Proof  :{"  "}
                            </Text>
                            <Image
                                source={{ uri: IMAGEURL + this.props.route.params.visitorDtl.photoProof }}
                                style={{ width: 90, height: 90, resizeMode: 'contain' }}
                            />
                        </View> : null}
                    </View>

                </View>
                {this.state.modalVisible ? <VisitorDetails
                    modalVisible={this.state.modalVisible}
                    VisitorDetails={this.state.selectedItem}
                    onClose={() => this.setState({ modalVisible: false, AdminVisitorDetails: visitorDetailEmpty })}

                /> : null}
                <View style={{ flexGrow: 1, }} >
                    <View style={{ marginTop: 5, backgroundColor: COLORS.whitef4 }}>
                        <View style={{ alignSelf: 'center', justifyContent: 'center' }}>
                            <View style={{ flexDirection: 'row', backgroundColor: COLORS.placeholderColor, borderRadius: 10, paddingVertical: 5, justifyContent: 'center', marginLeft: "1%", marginRight: "1%", width: '98%', elevation: 0.5, alignSelf: 'center' }}>
                                <View style={{ alignItems: "center", width: '25%', }} >
                                    <Text numberOfLines={1} style={{ width: '100%', paddingLeft: 10, textAlign: 'left', fontWeight: 'bold', }}>
                                        Name
                                            </Text>
                                </View>
                                <View style={{ paddingLeft: 2, width: '25%', }}>
                                    <Text numberOfLines={1} style={{ width: '100%', textAlign: 'left', fontWeight: 'bold', }}>
                                        Mobile
                                     </Text>
                                </View>
                                <View style={{ paddingLeft: 2, width: '25%' }}>
                                    <Text numberOfLines={1} style={{ width: '100%', textAlign: 'center', fontWeight: 'bold', }}>Check In</Text>
                                </View>
                                <View style={{ alignItems: "center", width: '25%' }}>
                                    <Text numberOfLines={1} style={{ width: '100%', paddingRight: 10, textAlign: 'right', fontWeight: 'bold', }}>Check Out</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <FlatList
                        style={{ flex: 1, }}
                        contentContainerStyle={{ flexGrow: 1, }}
                        data={this.state.AdmindVisitordtls}
                        ref={r => this.refs = r}
                        refreshing={this.state.isRefreshing}
                        onRefresh={() => this.onRefresh()}
                        renderItem={({ item, key }) => {
                            var inTime =
                                item.checkInTime == null ? '' :
                                    Moment(item.checkInTime).format("hh:mm A")
                            var outTime = // item.status === 4 || item.status === 3 ?
                                item.checkOutTime == null ? '' :
                                    Moment(item.checkOutTime).format("hh:mm A")
                            var backgroundColor = COLORS.white
                            var status = ''
                            if (this.props.LoginDetails.userRoleId != 2) {
                                if (item.status == 3) {
                                    backgroundColor = COLORS.tempYellow
                                    status = "RESCHEDULED"
                                } else if (item.status == 4) {
                                    if (item.checkInTime != null && item.checkOutTime != null) {
                                        backgroundColor = "#961448"
                                        status = "ALREADY CHECKOUT"
                                    } else {
                                        backgroundColor = COLORS.skyBlue
                                        status = "WAITING"
                                    }
                                } else if (item.status == 5) {
                                    backgroundColor = "#4667cc"
                                    status = "INVITED"
                                } else if (item.status == 2) {
                                    backgroundColor = COLORS.tempRed
                                    status = "REJECTED"
                                } else if (item.status == 1) {
                                    backgroundColor = COLORS.tempGreen
                                    status = "APPROVED"
                                } else if (item.status == 0) {
                                    backgroundColor = COLORS.white
                                    status = ""
                                }
                            }
                            return (
                                <TouchableOpacity style={{ height: null, paddingTop: 5, marginLeft: "1%", marginRight: "1%", width: '98%', borderRadius: 10, marginTop: 5, backgroundColor: COLORS.white, elevation: 0.5 }}
                                    onPress={() => this.setState({ selectedItem: item, modalVisible: true })}>
                                    <View style={{ flexDirection: "row", justifyContent: "center", paddingBottom: 5, width: "100%" }}>
                                        <Text numberOfLines={1} style={{ paddingLeft: 10, textAlign: 'left', flex: 1, color: '#6a7989', fontWeight: 'bold', fontSize: RFPercentage(1.7) }} numberOfLines={1} >
                                            {Moment(item.date).format('DD-MMM-yyyy')}
                                        </Text>
                                        <Text numberOfLines={1} style={{ flex: 1.5, textAlign: 'center', color: '#6a7989', fontWeight: 'bold', fontSize: RFPercentage(1.7) }} numberOfLines={1} >
                                            {"Invite Code: " + item.inviteCode.trim()}
                                        </Text>
                                        {status != "" ? <Text style={{ marginHorizontal: 10, fontSize: RFPercentage(1.5), flex: 1.2, paddingTop: 2, height: 20, alignSelf: 'center', textAlign: 'center', color: "white", borderRadius: 10, paddingHorizontal: 5, backgroundColor: backgroundColor, overflow: 'hidden' }} numberOfLines={1} >
                                            {status}
                                        </Text> : null}
                                    </View>
                                    <View style={{ borderColor: '#6a7989', borderTopWidth: 0.5, borderRadius: 10, paddingTop: 5, paddingBottom: 5, flexDirection: "row", backgroundColor: COLORS.white }}>
                                        <View style={{ paddingLeft: 5, paddingRight: 2, width: '25%', }} >
                                            <Text numberOfLines={1} style={{ width: '100%', paddingLeft: 5, textAlign: 'left', color: '#6a7989', fontWeight: 'bold', fontSize: RFPercentage(1.7) }}>
                                                {item.fullName}
                                            </Text>
                                        </View>
                                        <View style={{ paddingLeft: 2, alignItems: "center", paddingRight: 2, width: '25%', color: '#6a7989', fontWeight: 'bold', }}>
                                            <Text numberOfLines={1} style={{ width: '100%', color: '#6a7989', fontWeight: 'bold', fontSize: RFPercentage(1.7) }}>
                                                {item.mobile}
                                            </Text>
                                        </View>
                                        <View style={{ paddingLeft: 2, alignItems: "center", paddingRight: 2, width: '25%' }}>
                                            <Text numberOfLines={1} style={{ width: '100%', textAlign: 'center', color: '#6a7989', fontWeight: 'bold', fontSize: RFPercentage(1.7) }}> {inTime}  </Text>
                                        </View>
                                        <View style={{ paddingLeft: 2, alignItems: "center", paddingRight: 0.5, width: '25%' }}>
                                            <Text numberOfLines={1} style={{ width: '100%', textAlign: 'center', color: '#6a7989', fontWeight: 'bold', fontSize: RFPercentage(1.7) }}> {outTime}  </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                        keyExtractor={(item, index) => index.toString()}
                        ListEmptyComponent={<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: COLORS.placeholderColor, fontSize: 20 }}>No {this.state.visitors ? "Visitor" : "Employee"} List Record</Text></View>}
                    />
                </View>

            </View>
        )
    }

}
export default connect(mapStateToProps, mapDispatchToProps)(AdminVisitorDetails);