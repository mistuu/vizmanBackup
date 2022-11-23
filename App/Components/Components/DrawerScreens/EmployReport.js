import React, { createRef, useState } from 'react';
import {
    Text, View, Animated, Alert, TouchableWithoutFeedback, ScrollView, FlatList, StyleSheet, TextInput, TouchableOpacity, SafeAreaView,
    PermissionsAndroid,
    Platform,
} from 'react-native';
import { Header } from "../CusComponent";
import { connect } from 'react-redux';
import { COLORS, IMAGES } from '../../Assets';
import { mapDispatchToProps, mapStateToProps } from '../../Reducers/ApiClass';
import DatePicker from 'react-native-datepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import Moment from 'moment';
import { RFPercentage } from "react-native-responsive-fontsize";
import VisitorDetails from '../Screens/VisitorDetails';
import { visitorDetailEmpty } from '../../utility/emptyClass';



class EmployReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedVisitr: 0, selectedItem: [],
            settingArry: [], isRefreshing: false, modalVisible: false,
            additional: false, field: true, badge: false, col1: false, col2: false, col3: false, col4: false, col5: false,
            endDate: "", startDate: "", reportDataName: [], displyReportData: [], closeTime: false
        }
    }

    componentDidMount() {
        var startDate = Moment().clone().startOf('month').format('DD-MM-YYYY')
        var endDate = Moment().format('DD-MM-YYYY')
        this.listReport(startDate, endDate)
        this.setState({ startDate, endDate })
        this.focusListener = this.props.navigation.addListener('focus', () => {
            var startDate = Moment().clone().startOf('month').format('DD-MM-YYYY')
            var endDate = Moment().format('DD-MM-YYYY')
            this.listReport(startDate, endDate)
            this.setState({ startDate, endDate, closeTime: true })

        })
        { (this.state.closeTime && this.state.reportDataName.length > 1) ? this.dropdownClose1.close() : null }

    }
    listReport(startDate, endDate) {
        // this.setState({reportDataName:[]})
        this.props.GetVisitorReportbyEmp(this.props.LoginDetails.userID, startDate, endDate, this.props.LoginDetails.empID, this.afterListData)
    }
    afterListData = (displyReportData) => {
        this.setState({ reportDataName: [] })
        let reportDataName = [];
        reportDataName.push({ label: "All", value: 0 });
        if (displyReportData != undefined) {
            displyReportData.forEach(obj => {
                if (!reportDataName.some(o => o.value === obj.visitorId)) {
                    if (obj.checkOutTime != null) {
                        reportDataName.push({ label: obj.fullName, value: obj.visitorId });
                    }
                }
            });
        }
        this.setState({ displyReportData, selectedVisitr: 0, reportDataName })
    }

    onRefresh() {
        this.setState({ isRefreshing: true, });
        setTimeout(() => {
            this.componentDidMount()
            this.setState({ isRefreshing: false });
        }, 3000);
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: COLORS.white }}>
                <View style={{ width: "100%", }}>
                    <Header title={"Report"} navigation={this.props.navigation} />
                </View>
                <View style={{ width: '98%', alignSelf: 'center', borderRadius: 10, backgroundColor: COLORS.white }}>
                    <Text style={{ marginTop: 10, color: COLORS.primary, fontWeight: "bold", fontSize: 18, }}>Visitors</Text>
                    <View style={{ marginTop: 15, }}>
                        <View style={{ width: "100%", marginBottom: 10, justifyContent: 'space-between', flexDirection: 'row' }}>
                            <View style={{ width: "35%", }}>
                                <Text style={{ fontWeight: "bold", fontSize: 18, }}>From</Text>
                                <DatePicker
                                    style={{ marginTop: 10, width: '100%' }}
                                    date={this.state.startDate}
                                    mode="date"
                                    placeholder="Select Date *"
                                    format="DD-MM-YYYY"//T'HH:mm:ss.SSSSSSz"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                        dateIcon: {
                                            position: 'absolute',
                                            right: 0,
                                            top: 4,
                                            marginLeft: 0
                                        },
                                        dateInput: {
                                            borderWidth: 1,
                                            borderRadius: 7,
                                            borderColor: COLORS.graye3,
                                        },
                                        dateText: {
                                            marginLeft: 10,
                                            alignSelf: "flex-start",
                                        },
                                        placeholderText: {
                                            marginLeft: 10,
                                            alignSelf: "flex-start",
                                            color: COLORS.placeholderColor
                                        }
                                    }}
                                    onDateChange={(date) => {
                                        this.setState({ startDate: date })
                                    }}
                                />
                            </View>
                            <View style={{ width: "35%", }}>
                                <Text style={{ fontWeight: "bold", fontSize: 18, }}>To</Text>
                                <DatePicker
                                    style={{ marginTop: 10, width: '100%' }}
                                    date={this.state.endDate}
                                    mode="date"
                                    placeholder="Select Date *"
                                    format="DD-MM-YYYY"//T'HH:mm:ss.SSSSSSz"
                                    // minDate={Moment().format("DD-MM-YYYY")}
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                        dateIcon: {
                                            position: 'absolute',
                                            right: 0,
                                            top: 4,
                                            marginLeft: 0
                                        },
                                        dateInput: {
                                            borderWidth: 1,
                                            borderRadius: 7,
                                            borderColor: COLORS.graye3,
                                        },
                                        dateText: {
                                            marginLeft: 10,
                                            alignSelf: "flex-start",
                                        },
                                        placeholderText: {
                                            marginLeft: 10,
                                            alignSelf: "flex-start",
                                            color: COLORS.placeholderColor
                                        }
                                    }}
                                    onDateChange={(date) => {
                                        this.setState({ endDate: date })
                                    }}
                                />
                            </View>
                            <View style={{ justifyContent: "flex-end", alignItems: 'center', }}>
                                <TouchableOpacity onPress={() => this.listReport(this.state.startDate, this.state.endDate)} style={{ padding: 5, alignItems: 'center', justifyContent: 'center', marginBottom: 5, borderRadius: 7, backgroundColor: COLORS.primary }}>
                                    <Text style={{ width: 80, color: COLORS.white, textAlign: "center", fontWeight: "bold", fontSize: 18, }}>Search</Text>
                                </TouchableOpacity>
                            </View>
                            {/* <View style={{ justifyContent: "flex-end", alignItems: 'center', }}>
                                <TouchableOpacity onPress={() => this.listReport(this.state.startDate, this.state.endDate)} style={{width:100, alignItems: 'center',height:30, padding: 5, marginBottom: 5, borderRadius: 7, backgroundColor: COLORS.primary }}>
                                    <Text style={{flex:1, color: COLORS.white, fontWeight: "bold", fontSize: 18, }}>Search</Text>
                                </TouchableOpacity>
                            </View> */}

                        </View>
                    </View>
                </View>
                {this.state.reportDataName.length > 1 ?
                    <View style={{ width: '100%',}}>
                        <DropDownPicker
                            items={this.state.reportDataName}
                            defaultValue={this.state.reportDataName[0].value}
                            // defaultValue={this.state.reportDataName.length > 0 ? 0 : undefined}
                            searchable
                            ref={ref => {
                                this.dropdownClose1 = ref
                            }}
                            containerStyle={{ height: 55 }}
                            style={{ borderWidth: 1, borderColor: COLORS.graye3, alignSelf: 'center', width: "98%", padding: 10 }}
                            searchablePlaceholder="Search visitor.."
                            itemStyle={{
                                justifyContent: 'flex-start',
                            }}
                            onChangeItem={item => {
                                this.setState({ selectedVisitr: item.value })
                            }}
                        />
                    </View> : null}
                <View style={{ flexGrow: 1, backgroundColor: COLORS.whitef4,zIndex:9}} >
                    <View style={{ backgroundColor: COLORS.white }}>
                        <View style={{ alignSelf: 'center', marginTop: 10, justifyContent: 'center' }}>
                            <View style={{ paddingTop: 5, flexDirection: 'row', backgroundColor: COLORS.placeholderColor, borderRadius: 10, paddingVertical: 5, justifyContent: 'center', marginLeft: "1%", marginRight: "1%", width: '98%', elevation: 0.5, alignSelf: 'center' }}>
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
                    {this.state.modalVisible ?
                        <VisitorDetails
                            modalVisible={this.state.modalVisible}
                            VisitorDetails={this.state.selectedItem}
                            isReport={1}
                            onClose={() => this.setState({ modalVisible: false, VisitorDetails: visitorDetailEmpty })}
                        /> : null}

                    <FlatList
                        style={{ flex: 1, marginBottom: 10 }}
                        contentContainerStyle={{ flexGrow: 1, }}
                        data={this.state.selectedVisitr > 0 ? this.state.displyReportData.filter(e => e.checkOutTime != null && e.visitorId == this.state.selectedVisitr) : this.state.displyReportData?.filter(e => e.checkOutTime != null)}
                        // data={this.state.displyReportData}
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
                                <TouchableOpacity onPress={() => {
                                this.props.VisitorDetails(item),
                                this.props.navigation.navigate('VizDetails')

                                    // this.setState({ selectedItem: item, modalVisible: true })
                                }} style={{ height: null, paddingTop: 5, marginLeft: "1%", marginRight: "1%", width: '98%', borderRadius: 10, marginTop: 5, backgroundColor: COLORS.white, elevation: 0.5 }}
                                >
                                    <View style={{ flexDirection: "row", justifyContent: "center", paddingBottom: 5, width: "100%" }}>
                                        <Text numberOfLines={1} style={{ paddingLeft: 10, textAlign: 'left', flex: 1, color: '#6a7989', fontWeight: 'bold', fontSize: RFPercentage(1.7) }} numberOfLines={1} >
                                            {Moment(item.date).format('DD-MMM-yyyy')}
                                        </Text>
                                        <Text numberOfLines={1} style={{ flex: 1.5, textAlign: 'center', color: '#6a7989', fontWeight: 'bold', fontSize: RFPercentage(1.7) }} numberOfLines={1} >
                                            {/* {"Invite Code: " + item.inviteCode.trim()} */}
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
                        ListEmptyComponent={<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: COLORS.placeholderColor, fontSize: 20 }}>No Visitor List</Text></View>}
                    />
                </View>
                {/* </ScrollView> */}
            </View>
        )
    }

}
const styles = StyleSheet.create({
    textInputStyle: {
        color: COLORS.black,
        marginBottom: 1,
        height: (Platform.OS === 'ios' ? 40 : null)
    },
    labelColor: {
        color: "#333333", fontWeight: 'bold'
    },
    fieldColColor: { width: '40%', fontSize: 17, fontWeight: 'bold', color: "#333333", },
    enableCOlor: { width: '30%', fontSize: 17, color: "#333333", },
    fieldViewCOlor: { borderBottomWidth: 0.7, padding: 15, width: '97%', alignSelf: 'center', justifyContent: 'space-around', flexDirection: 'row', }
})
export default connect(mapStateToProps, mapDispatchToProps)(EmployReport);