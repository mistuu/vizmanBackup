import moment from 'moment';
import Moment from 'moment';
import React, { Component } from 'react';
import { Dimensions, FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import LinearGradient from "react-native-linear-gradient";
import { connect } from 'react-redux';
import { COLORS } from '../../Assets/index.js';
import { mapDispatchToProps, mapStateToProps } from '../../Reducers/ApiClass';
import { AllSettingEmpty, visitorDetailEmpty } from '../../utility/emptyClass.js';
import { getOrientation } from '../../utility/util';
import { CusAlert, Header } from "../CusComponent";
import VisitorDetails from '../Screens/VisitorDetails';
const { width, height } = Dimensions.get('window');

global.colors = ["#ffffff00", "#ffffff00"]

class AdminEmp extends Component {
  constructor(props) {
    super(props);
    this.onEndReachedCalledDuringMomentum = true;
    this.state = {
      isRefreshing: false,
      modalVisible: false,
      userID: '',
      userRoleId: '',
      orgId: '',
      empID: '',
      selectedStartDate: null,
      selectedEndDate: null,
      Calendar: true,
      selectedDate: '',
      empMeetingList: null,
      listempMeeting: [],
      selectedItem: visitorDetailEmpty,
      latestDate: "",
      months: [
        'January',
        'Febraury',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      dateArray: [],
      visitorSetting: AllSettingEmpty.settingsVM,
      mappingVM: AllSettingEmpty.mappingVM,
      orientation: getOrientation()
    };
    this.onDateChange = this.onDateChange.bind(this);
  }
  onRefresh() {
    this.setState({ isRefreshing: true, search: '', dateArray: [] });
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    if (date.toString().length == 1) {
      date = "0" + date
    }
    else if (month.toString().length == 1) {
      month = "0" + month
    }
    var date = month + '-' + date + '-' + year

    this.callApi(date)
    this.setState({ selectedStartDate: new Date() })
    // global.this.getNotification()
    setTimeout(() => {
      this.setState({ isRefreshing: false });
    }, 1000);
  }
  componentDidMount() {
    Dimensions.addEventListener('change', () => {
      this.setState({ orientation: getOrientation() })
    });
    this.focusListener = this.props.navigation.addListener('focus', () => {
      var date = new Date().getDate();
      var month = new Date().getMonth() + 1;
      var year = new Date().getFullYear();
      if (date.toString().length == 1) {
        date = "0" + date
      }
      else if (month.toString().length == 1) {
        month = "0" + month
      }
      var date = month + '-' + date + '-' + year
      this.callApi(date)
      this.setState({ selectedStartDate: new Date() })
    })
  }
  saveEmpDashList = (res1) => (
    this.afterSaveEmpDashList(res1)
  )
  afterSaveEmpDashList(empMeetingList) {
    // console.log(empMeetingList);
    var groups = empMeetingList.reduce((groups, game) => {
      const date = game.currDate.split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(game);
      return groups;
    }, {});

    var groupArrays = Object.keys(groups).map((date) => {
      return {
        date,
        allData: groups[date]
      };
    });
    // console.log("group array:=", groupArrays);
    groupArrays = groupArrays.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date)
    })
    // console.log("New Emp Data=", groupArrays);
    this.setState({ empMeetingList: groupArrays })
  }
  saveEmpVisitorList = (res1) => (
    this.afterSaveEmpVisitorList(res1)
  )
  afterSaveEmpVisitorList(response) {

    var Templist = []
    if (response != null) {
      response.forEach(child => {
        Templist.push(new Date(child.date))
      }
      )
    }
    this.setState({ dateArray: Templist })
  }
  saveGetAllSettings = (res1) => (
    this.afterSaveGetAllSettings(res1)
  )
  afterSaveGetAllSettings(settings) {
    this.setState({ visitorSetting: settings.settingsVM, mappingVM: settings.mappingVM })
  }
  saveEmpDashBoard = (res1) => (
    this.afterSaveEmpDashBoardLisr(res1)
  )
  afterSaveEmpDashBoardLisr(listempMeeting) {
    this.setState({ listempMeeting })
  }
  callApi(date) {
    console.log("====================",this.props.LoginDetails.userID, date, this.props.LoginDetails.empID);
    this.props.GetEmpDateVizList(this.props.LoginDetails.userID, date, this.props.LoginDetails.empID, this.saveEmpDashList)
    this.props.EmpVisitorList(this.props.LoginDetails.userID, this.props.LoginDetails.empID, this.saveEmpVisitorList)
    this.props.GetAllSettings(this.props.LoginDetails.userID, this.saveGetAllSettings)
    this.props.GetEmpDashboard(this.props.LoginDetails.userID, this.props.LoginDetails.userRoleId, this.props.LoginDetails.empID, this.saveEmpDashBoard)
  }
  onDateChange(date, type) {
    // console.log("TYT", type);
    // console.log("date", date);
    if (type === 'END_DATE') {
      this.setState({
        selectedEndDate: date,
      });
    } else {
      this.setState({
        selectedStartDate: date,
        selectedEndDate: null,
      });
    }
    this.setState({ latestDate: date })
    this.callApi(this.convertdate(date._d))
  }

  getSelectedDateformate(startDate) {
    // console.log("startDate", startDate);
    var weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    if (startDate.length != 0) {
      var date
      var strDate = startDate.split(' ')
      weekdays.forEach(element => {
        var str = strDate[0].split(0, 2)
        if (element.indexOf(str) > -1) {
          date = element
        }
      });
      // date = date + "-" + strDate[2]
      date = date

    } else {
      // date = weekdays[new Date().getDay() - 1] + "-" + new Date().getDate()

      date = weekdays[new Date().getDay() - 1]
    }
    return date
  }

  responseVistirDtls = (response) => (
    this.successDetails(response)
  )
  successDetails(response) {
    this.props.VisitorDetails(response),
    this.props.navigation.navigate('VizDetails'),
    this.setState({
      selectedItem: response,
      //  modalVisible: true,
    })

  }

  modalOpenMethod(item) {
    this.props.GetVisitorDtls(item.inOutId, this.responseVistirDtls)

  }
  addZero(no) {
    if (no.toString().length == 1) {
      return "0" + no
    } else {
      return no
    }
  }
  listgetParsedDate(date) {
    date = String(date).split('T');
    var fDate = date[1].split(':')
    return [this.addZero(parseInt(fDate[0])) + ":" + this.addZero(parseInt(fDate[1]))];
  }

  getMonthPosition(month) {
    for (var i = 0; i < this.state.months.length; i++) {
      if (this.state.months[i].indexOf(month) > -1) {
        i++
        if (i.toString().length != 2) {
          return "0" + i
        } else {
          return i
        }
      }
    }

  }
  convertdate(startDate) {
    var dateArr = startDate.toString().split(" ")
    var month = this.getMonthPosition(dateArr[1])
    var date = dateArr[2]
    var year = dateArr[3]
    return month + "-" + date + "-" + year

  }
  // modalVisitor() {
  //   return (
  //     <Modal
  //       backgroundColor={"black"}
  //       backdropColor={"black"}
  //       animationType={"slide"} transparent={true}
  //       visible={this.state.modalVisible}
  //       onRequestClose={() => { this.setState({ modalVisible: false }) }} >
  //       <View style={{ backgroundColor: 'rgba(52, 52, 52, 0.8)', width: '100%', height: '100%', justifyContent: "center", alignItems: "center" }}>
  //         <ScrollView style={{ width: '100%', height: '100%', }} contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", paddingVertical: 45 }}>
  //           <TouchableWithoutFeedback onPressOut={() =>
  //             this.setState({ modalVisible: false })
  //           } >
  //             <View style={{
  //               position: 'absolute',
  //               top: 0,
  //               bottom: 0,
  //               left: 0,
  //               right: 0,
  //               flex: 1,
  //             }}></View>
  //           </TouchableWithoutFeedback>

  //           <View style={{ paddingBottom: this.state.paddingBottom, height: null, width: '90%', justifyContent: "center", alignItems: "center", borderRadius: 10 }}>
  //             <View style={{ height: null, width: '100%', backgroundColor: COLORS.white, justifyContent: "center", alignItems: "center", borderRadius: 10 }}>
  //               {/* <LinearGradient
  //                 style={{ alignSelf: 'center', top: -45, position: "absolute", borderRadius: 90 / 2, height: 90, width: 90, }}
  //                 colors={[
  //                   COLORS.primary,
  //                   COLORS.third
  //                 ]}
  //               >
  //               </LinearGradient> */}
  //               <TouchableOpacity style={{ top: -30,  borderRadius: 60 / 2, height: 60, width: 60, justifyContent: "center", alignContent: "center" }} 
  //                                       onPress={() => { this.setState({ modalVisible: false })}}>
  //                                   {/* <View style={{ width: "50%", alignItems: "center" }}> */}
  //                                   <LinearGradient
  //                 style={{ alignSelf: 'center',justifyContent:'center', alignItems:'center', position: "absolute", borderRadius: 60 / 2, height: 60, width: 60, }}
  //                 colors={[
  //                   COLORS.primary,
  //                   COLORS.third
  //                 ]}
  //               >

  //                                       <Image source={IMAGES.cross} style={{borderRadius: 30 / 2, height: 30, width: 30, tintColor:COLORS.white}}/>

  //                                       </LinearGradient>
  //                                       {/* </View> */}
  //                                       </TouchableOpacity>
  //               <Text style={{ fontWeight: 'bold', fontSize: 15, alignSelf: 'center',  }}>VISITOR DETAILS</Text>

  //               <View style={{ paddingBottom: 12, }}>
  //                 <View style={{ flexDirection: 'row', width: '100%', padding: 4, }}>
  //                   <View style={{ flex: 1, margin: 2, }}>
  //                     <Text style={{ fontWeight: 'bold', fontSize: 13 }}>
  //                       Full Name
  //                                           </Text>
  //                     <Text style={{ fontSize: 13, }}>
  //                       {this.state.selectedItem.fullName}
  //                     </Text>
  //                   </View>
  //                   <View style={{ flex: 1, margin: 2, alignItems: "flex-end" }}>
  //                     <Text style={{ fontWeight: 'bold', fontSize: 13, width: 100, textAlign: 'right' }}>
  //                       Mobile No
  //                                               </Text>
  //                     <Text style={{ fontSize: 13 }}>
  //                       {this.state.selectedItem.mobile}
  //                     </Text>
  //                   </View>
  //                 </View>
  //                 <View style={{ flexDirection: 'row', width: '100%', padding: 4, }}>
  //                   <View style={{ flex: 1, margin: 2, }}>
  //                     <Text style={{ fontWeight: 'bold', fontSize: 13 }}>
  //                       Email
  //                                           </Text>
  //                     <Text style={{ fontSize: 13, }}>
  //                       {this.state.selectedItem.email}
  //                     </Text>
  //                   </View>
  //                   <View style={{ flex: 1, margin: 2, alignItems: "flex-end" }}>
  //                     <Text style={{ fontWeight: 'bold', fontSize: 13, width: 100, textAlign: 'right' }}>
  //                       Date
  //                                               </Text>
  //                     <Text style={{ fontSize: 13 }}>
  //                       {Moment(this.state.selectedItem.date).format('DD-MMM-yyyy')}
  //                     </Text>
  //                   </View>
  //                 </View>
  //                 <View style={{ flexDirection: 'row', width: '100%', padding: 4, }}>
  //                   <View style={{ flex: 1, margin: 2, }}>
  //                     <Text style={{ fontWeight: 'bold', fontSize: 13, }}>
  //                       Checkin Time
  //                                           </Text>
  //                     <Text style={{ fontSize: 13, }}>
  //                       {

  //                         this.state.selectedItem.status == 3 ?
  //                           this.state.selectedItem.rescheduleInTime == null ? "" :
  //                             Moment(this.state.selectedItem.rescheduleInTime).format('HH:mm')
  //                           :
  //                           this.state.selectedItem.checkInTime == null ? "" :
  //                             Moment(this.state.selectedItem.checkInTime).format('HH:mm')
  //                       }
  //                     </Text>
  //                   </View>
  //                   <View style={{ flex: 1, margin: 2, alignItems: "flex-end" }}>
  //                     <Text style={{ fontWeight: 'bold', fontSize: 13, width: 100, textAlign: 'right' }}>
  //                       Checkout Time
  //                                               </Text>
  //                     <Text style={{ fontSize: 13, textAlign: 'right' }}>
  //                       {

  //                         this.state.selectedItem.status == 3 ?
  //                           this.state.selectedItem.rescheduleOutTime == null ? "" :
  //                             Moment(this.state.selectedItem.rescheduleOutTime).format('HH:mm')
  //                           :
  //                           this.state.selectedItem.checkOutTime == null ? "" :
  //                             Moment(this.state.selectedItem.checkOutTime).format('HH:mm')
  //                       }
  //                     </Text>
  //                   </View>
  //                 </View>
  //                 <View style={{ flexDirection: 'row', width: '100%', padding: 4, }}>
  //                   <View style={{ flex: 1, margin: 2, }}>
  //                     <Text style={{ fontWeight: 'bold', fontSize: 13 }}>
  //                       Exp. In Time
  //                                           </Text>
  //                     <Text style={{ fontSize: 13, }}>
  //                       {

  //                         this.state.selectedItem.status == 3 ?
  //                           this.state.selectedItem.rescheduleInTime == null ? "" :
  //                             Moment(this.state.selectedItem.rescheduleInTime).format('HH:mm')
  //                           :
  //                           this.state.selectedItem.inTime == null ? "" :
  //                             Moment(this.state.selectedItem.inTime).format('HH:mm')
  //                       }
  //                     </Text>
  //                   </View>
  //                   <View style={{ flex: 1, margin: 2, alignItems: "flex-end" }}>
  //                     <Text style={{ fontWeight: 'bold', fontSize: 13, width: 100, textAlign: 'right' }}>
  //                       Exp. Out Time
  //                                               </Text>
  //                     <Text style={{ fontSize: 13, textAlign: 'right' }}>
  //                       {
  //                         this.state.selectedItem.status == 3 ?
  //                           this.state.selectedItem.rescheduleOutTime == null ? "" :
  //                             Moment(this.state.selectedItem.rescheduleOutTime).format('HH:mm')
  //                           :
  //                           this.state.selectedItem.outTime == null ? "" :
  //                             Moment(this.state.selectedItem.outTime).format('HH:mm')
  //                       }
  //                     </Text>
  //                   </View>
  //                 </View>
  //                 <View style={{ flexDirection: 'row', width: '100%', padding: 4, }}>
  //                   <View style={{ flex: 1, margin: 2, }}>
  //                     <Text style={{ fontWeight: 'bold', fontSize: 13 }}>
  //                       {"Department"}
  //                     </Text>
  //                     <Text style={{ fontSize: 13, }}>
  //                       {this.state.selectedItem.department}
  //                     </Text>
  //                   </View>
  //                   <View style={{ flex: 1, margin: 2, alignItems: "flex-end" }}>
  //                     <Text style={{ fontWeight: 'bold', fontSize: 13, width: 100, textAlign: 'right' }}>
  //                       {"Purpose"}
  //                     </Text>
  //                     <Text style={{ fontSize: 13, }}>
  //                       {this.state.selectedItem.purpose}
  //                     </Text>

  //                   </View>

  //                 </View>
  //                 <View style={{ flexDirection: 'row', width: '100%', padding: 4, }}>
  //                   <View style={{ flex: 1, margin: 2, }}>
  //                     <Text style={{ fontWeight: 'bold', fontSize: 13 }}>
  //                       {"Company"}
  //                     </Text>
  //                     <Text style={{ fontSize: 13, }}>
  //                       {this.state.selectedItem.company}
  //                     </Text>
  //                   </View>
  //                   <View style={{ flex: 1, margin: 2, alignItems: "flex-end" }}>
  //                     <Text style={{ fontWeight: 'bold', fontSize: 13, width: 100, textAlign: 'right' }}>
  //                       {"Designation"}
  //                     </Text>
  //                     <Text style={{ fontSize: 13, }}>
  //                       {this.state.selectedItem.designation}
  //                     </Text>
  //                   </View>

  //                 </View>
  //                 <View style={{ flexDirection: 'row', width: '100%', padding: 4, }}>
  //                   <View style={{ flex: 1, margin: 2, }}>
  //                     <Text style={{ fontWeight: 'bold', fontSize: 13 }}>
  //                       {"Address"}
  //                     </Text>
  //                     <Text style={{ fontSize: 13, }}>
  //                       {this.state.selectedItem.address}
  //                     </Text>
  //                   </View>

  //                   <View style={{ flex: 1, margin: 2, alignItems: "flex-end" }}>
  //                     <Text style={{ fontWeight: 'bold', fontSize: 13, width: 100, textAlign: 'right' }}>
  //                       {'Remarks'}
  //                     </Text>
  //                     <Text style={{ fontSize: 13, }}>
  //                       {this.state.selectedItem.remarks}
  //                     </Text>
  //                   </View>

  //                 </View>
  //                 <View style={{ flexDirection: 'row', width: '100%', padding: 4, }}>
  //                   <View style={{ flex: 1, margin: 2, }}>
  //                     <Text style={{ fontWeight: 'bold', fontSize: 13 }}>
  //                       {"Temparature"}
  //                     </Text>
  //                     <Text style={{ fontSize: 13, }}>
  //                       {this.state.selectedItem.vizTemp}
  //                     </Text>
  //                   </View>

  //                   <View style={{ flex: 1, margin: 2, alignItems: "flex-end" }}>
  //                     <Text style={{ fontWeight: 'bold', fontSize: 13, width: 100, textAlign: 'right' }}>
  //                       {'Aarogya Setu'}
  //                     </Text>
  //                     <Text style={{ fontSize: 13, }}>
  //                       {this.state.selectedItem.isVizArogyaSetu == true ? 'Yes' : "No"}
  //                     </Text>
  //                   </View>

  //                 </View>
  //                 <View style={{ flexDirection: 'row', width: '100%', padding: 4, }}>
  //                   {this.state.visitorSetting.vAddlCol1 ? <View style={{ flex: 1, margin: 2, }}>
  //                     <Text style={{ fontWeight: 'bold', fontSize: 13 }}>
  //                       {this.state.selectedItem.colName1}
  //                     </Text>
  //                     <Text style={{ fontSize: 13, }}>
  //                       {this.state.selectedItem.addlCol1 == "true" ? "Yes" : this.state.selectedItem.addlCol1 == "false" ? "No" : this.state.selectedItem.addlCol1}
  //                     </Text>
  //                   </View> : null}
  //                   {this.state.visitorSetting.vAddlCol2 ? <View style={{ flex: 1, margin: 2, alignItems: "flex-end" }}>
  //                     <Text style={{ fontWeight: 'bold', fontSize: 13, width: 100, textAlign: 'right' }}>
  //                       {this.state.selectedItem.colName2}
  //                     </Text>
  //                     <Text style={{ fontSize: 13, }}>
  //                       {this.state.selectedItem.addlCol2 == "true" ? "Yes" : this.state.selectedItem.addlCol2 == "false" ? "No" : this.state.selectedItem.addlCol2}
  //                     </Text>
  //                   </View>
  //                     : null}
  //                 </View>
  //                 <View style={{ flexDirection: 'row', width: '100%', padding: 4, }}>
  //                   {this.state.visitorSetting.vAddlCol3 ? <View style={{ flex: 1, margin: 2, }}>
  //                     <Text style={{ fontWeight: 'bold', fontSize: 13 }}>
  //                       {this.state.selectedItem.colName3}
  //                     </Text>
  //                     <Text style={{ fontSize: 13, }}>
  //                       {this.state.selectedItem.addlCol3 == "true" ? "Yes" : this.state.selectedItem.addlCol3 == "false" ? "No" : this.state.selectedItem.addlCol3}
  //                     </Text>
  //                   </View> : null}
  //                   {this.state.visitorSetting.vAddlCol4 ? <View style={{ flex: 1, margin: 2, alignItems: "flex-end" }}>
  //                     <Text style={{ fontWeight: 'bold', fontSize: 13, width: 100, textAlign: 'right' }}>
  //                       {this.state.selectedItem.colName4}
  //                     </Text>
  //                     <Text style={{ fontSize: 13, }}>
  //                       {this.state.selectedItem.addlCol4 == "true" ? "Yes" : this.state.selectedItem.addlCol4 == "false" ? "No" : this.state.selectedItem.addlCol4}
  //                     </Text>
  //                   </View>
  //                     : null}
  //                 </View>
  //                 <View style={{ flexDirection: 'row', width: '100%', padding: 4, }}>

  //                   {this.state.visitorSetting.vAddlCol5 ? <View style={{ flex: 1, margin: 2, }}>
  //                     <Text style={{ fontWeight: 'bold', fontSize: 13 }}>
  //                       {this.state.selectedItem.colName5}
  //                     </Text>
  //                     <Text style={{ fontSize: 13, }}>
  //                       {this.state.selectedItem.addlCol5 == "true" ? "Yes" : this.state.selectedItem.addlCol5 == "false" ? "No" : this.state.selectedItem.addlCol5}
  //                     </Text>
  //                   </View> : null}
  //                   <View style={{ flex: 1, margin: 2, alignItems: "flex-end" }}>
  //                     <Text style={{ fontWeight: 'bold', fontSize: 13, width: 100, textAlign: 'right' }}>
  //                       VIP
  //                                               </Text>
  //                     <Text style={{ fontSize: 13 }}>
  //                       {this.state.selectedItem.isVip == true ? 'Yes' : "No"}
  //                     </Text>
  //                   </View>
  //                 </View>
  //                 <View style={{ flexDirection: 'row', width: '100%', padding: 4, }}>
  //                   {this.state.selectedItem.idProof != null ? <View style={{ flex: 1, margin: 2, }}>
  //                     <Text style={{ fontWeight: 'bold', fontSize: 13 }}>
  //                       ID Proof
  //                                           </Text>
  //                     <Image
  //                       source={{ uri: IMAGEURL + this.state.selectedItem.idProof }}
  //                       style={{ width: 70, height: 70, marginBottom: 5, }}
  //                     />
  //                   </View> : null}
  //                   {this.state.selectedItem.photoProof != null ? <View style={{ flex: 1, margin: 2, alignItems: "flex-end" }}>
  //                     <Text style={{ fontWeight: 'bold', fontSize: 13, width: 100, textAlign: 'right' }}>
  //                       Photo Proof
  //                                           </Text>
  //                     <Image
  //                       source={{ uri: IMAGEURL + this.state.selectedItem.photoProof }}
  //                       style={{ width: 70, height: 70, marginBottom: 5, }}
  //                     />
  //                   </View>
  //                     : null}
  //                 </View>
  //               </View>
  //             </View>
  //           </View>
  //         </ScrollView>
  //       </View>
  //     </Modal>
  //   )
  // }
  render() {
    Moment.locale('en');
    var dt = '2016-05-02T00:00:00';
    const { selectedStartDate, selectedEndDate } = this.state;
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    const minDate = new Date(year - 1, month, date); // Min date
    const maxDate = new Date(year, month, date + 30); // Max date
    const startDate = selectedStartDate ? selectedStartDate.toString() : ''; //Start date
    const endDate = selectedEndDate ? selectedEndDate.toString() : ''; //End dat
    let customDatesStyles = [];
    this.state.dateArray.forEach(child => {
      customDatesStyles.push({
        date: child,
        style: { backgroundColor: COLORS.white },
        textStyle: { color: 'red', width: 50, textAlign: 'center' }, // sets the font color
        containerStyle: [],
      });

    })
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.whitef4 }}>
        <View style={{ width: "100%",marginTop:Platform.OS=="ios"?-20:0 }}>
          <Header title={"Dashboard"} navigation={this.props.navigation} /></View>
        <View style={{ flex: 1, flexDirection: this.state.orientation === 'landscape' ? 'row' : 'column' }}>
          {this.state.orientation === 'landscape' ? <View style={{ flex: 1 }}>
            <LinearGradient
              style={{ width: '100%', height: "100%", }}
              colors={[
                COLORS.primary,
                COLORS.third
              ]}>
              <CalendarPicker
                width={Dimensions.get('window').width / 2 - 30}
                customDatesStyles={customDatesStyles}
                startFromMonday={true}
                allowRangeSelection={false}
                minDate={minDate}
                maxDate={maxDate}
                weekdays={['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']}
                months={this.state.months}
                previousTitle={'<<'}
                nextTitle=">>"
                todayBackgroundColor="rgba(224, 233, 217, 0.237)"
                todayTextStyle={{ fontWeight: 'bold', color: COLORS.black }}
                selectedDayColor="rgba(224, 233, 217, 0.237)"
                selectedDayTextColor={COLORS.white}
                textStyle={{
                  color: COLORS.white,
                }}
                onDateChange={this.onDateChange}
              />
            </LinearGradient>
          </View> : null}
          <FlatList
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1, }}
            refreshing={this.state.isRefreshing}
            onRefresh={() => this.onRefresh()}
            ListHeaderComponent={
              this.state.orientation === 'portrait' ? <View style={{ flex: 1 }}>
                <LinearGradient
                  style={{ borderBottomLeftRadius: 10, borderBottomRightRadius: 10, width: '100%', height: "100%" }}
                  colors={[
                    COLORS.primary,
                    COLORS.third
                  ]}>
                  <CalendarPicker
                    customDatesStyles={customDatesStyles}
                    startFromMonday={true}
                    allowRangeSelection={false}
                    minDate={minDate}
                    maxDate={maxDate}
                    weekdays={['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']}
                    months={this.state.months}
                    previousTitle={'<<'}
                    nextTitle=">>"
                    todayBackgroundColor="rgba(224, 233, 217, 0.237)"
                    todayTextStyle={{ fontWeight: 'bold', color: COLORS.black }}
                    selectedDayColor="rgba(224, 233, 217, 0.237)"
                    selectedDayTextColor={COLORS.white}
                    textStyle={{
                      color: COLORS.white,
                    }}
                    onDateChange={this.onDateChange}
                  />
                </LinearGradient>

              </View> : null
            }
            data={this.state.empMeetingList}
            renderItem={({ item, key }) => {
              return (
                <View>
                  <LinearGradient style={{ padding: 7, alignItems: 'center', alignSelf: 'center', width: '32%', borderRadius: 8, marginTop: 10, marginBottom: 10 }}
                    colors={[COLORS.primary, COLORS.third]}>
                    <Text style={{ color: COLORS.white, alignItems: 'center' }}>{moment(item.date).format('DD-MM-YYYY')}</Text>
                  </LinearGradient>

                  <FlatList
                    data={item.allData}
                    style={{ margin: 5 }}
                    inverted={true}
                    //   refreshing={this.state.setRefreshing}
                    //   onRefresh={() => this.handleRefresh()}
                    // inverted={true}
                    renderItem={({ item }) =>
                    // <View />
                    {
                      var time
                      time = item.status == 3 ?
                        item.rescheduleInTime == null ? "" :
                          Moment(item.rescheduleInTime).format('HH:mm')
                        :
                        item.inTime == null ? "" :
                          Moment(item.inTime).format('HH:mm')
                      var otime
                      otime = item.status == 3 ?
                        item.rescheduleOutTime == null ? "" :
                          Moment(item.rescheduleOutTime).format('HH:mm')
                        :
                        item.outTime == null ? "" :
                          Moment(item.outTime).format('HH:mm')
                      // console.log("empList==", item);
                      return (
                        <View style={{ width: '100%', zIndex: 10, justifyContent: 'center', alignItems: 'center' }}>

                          <TouchableOpacity style={{ marginLeft: "1%", marginRight: "1%", width: '98%', borderRadius: 10, marginTop: 5, backgroundColor: COLORS.white, elevation: 0.5 }}
                            onPress={() => this.modalOpenMethod(item)}
                            style={{ marginTop: 5, marginBottom: 5, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ width: "90%", borderRadius: 8, backgroundColor: COLORS.white, padding: 10 }}>
                              <View style={{ flexDirection: 'row' }}>
                                <View style={{ width: width / 2 }}>
                                  <Text style={{ color: COLORS.graye00 }}>Name</Text>
                                  <Text style={{ fontWeight: 'bold' }}>{item.fullName}</Text>
                                  <Text style={{ color: COLORS.graye00, }}>In Time</Text>
                                  {time != "" ? <Text style={{ fontWeight: 'bold', }}>{time}</Text> : null}
                                </View>

                                <View style={{ width: width / 2 }}>
                                  <Text style={{ color: COLORS.graye00, }}>Mobile</Text>
                                  <Text style={{ fontWeight: 'bold', }}>{item.mobile}</Text>
                                  <Text style={{ color: COLORS.graye00, }}>Out Time</Text>
                                  {otime != "" ? <Text style={{ fontWeight: 'bold' }}>{otime}</Text> : null}
                                </View>
                                {/* <View style={{ width: width / 2 }}>
                          <Text style={{ color: COLORS.graye00, }}>Day</Text>
                          <Text style={{ fontWeight: 'bold', }}>{this.getSelectedDateformate(startDate)}</Text>
                        </View> */}
                              </View>
                              {/* <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <Text style={{ color: COLORS.graye00, width: width / 2 }}>In Time</Text>
                        <Text style={{ color: COLORS.graye00, width: width / 2 }}>Out Time</Text>
                        <Text style={{ color: COLORS.graye00, width: width / 2 }}>Status</Text>
                      </View> */}

                            </View>
                          </TouchableOpacity>
                        </View>
                        // <View style={{ marginTop: 5, marginBottom: 5, width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        //   <View style={{ width: '20%', alignSelf: 'flex-start', paddingTop: 7 }}>
                        //     <Text >{this.getSelectedDateformate(startDate)}</Text>
                        //   </View>
                        //   <TouchableOpacity onPress={() => this.modalOpenMethod(item)} style={{ width: '72%', backgroundColor: COLORS.white, elevation: 1, borderRadius: 10 }}>
                        //     <LinearGradient
                        //       style={{ borderRadius: 10, padding: 7 }}
                        //       colors={[
                        //         COLORS.primary,
                        //         COLORS.third
                        //       ]}
                        //     >
                        //       <Text style={{ color: COLORS.white }}>{item.fullName}</Text>
                        //     </LinearGradient>
                        //     <View style={{ padding: 7 }}>
                        //       <Text style={{ color: '#6a7989', fontWeight: 'bold', }}>Mobile No. : {item.mobile}</Text>
                        //       <View style={{ flexDirection: 'row' }}>
                        //         {time != "" ? <Text style={{ flex: 1, marginRight: 10, color: '#6a7989', fontWeight: 'bold', }}>In Time : {time}</Text> : null}
                        //         {otime != "" ? <Text style={{ flex: 1, marginRight: 10, color: '#6a7989', fontWeight: 'bold', }}>Out Time : {otime}</Text> : null}
                        //       </View>
                        //     </View>
                        //   </TouchableOpacity>
                        // </View>

                      )
                    }
                    }
                    numColumns={1}
                    keyExtractor={item => item.courierId}
                  />
                </View>
              )

            }}


            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: COLORS.placeholderColor, fontSize: 20 }}>No Meeting on this date</Text></View>}
          />
          <View style={{ backgroundColor: COLORS.whitef4, width: this.state.orientation === 'portrait' ? '100%' : 100, height: this.state.orientation === 'portrait' ? 70 : '100%', marginLeft: this.state.orientation === 'portrait' ? 0 : null, flexDirection: this.state.orientation === 'portrait' ? 'row' : 'column', justifyContent: 'space-evenly', alignItems: "center", marginTop: this.state.orientation === 'portrait' ? 5 : 15, marginBottom: 5, alignSelf: 'center' }}>
            <LinearGradient
              style={styles.box}
              colors={[
                COLORS.primary,
                COLORS.third
              ]}
            >
              {/* {
                Platform.OS === 'ios'? */}
              <View style={styles.headerWrapper}>
                <Text numberOfLines={2} style={{ alignSelf: 'auto', width: this.state.orientation === 'portrait' ? null : 85, color: COLORS.white, fontSize: 12, textAlign: 'center' }}>Average Visits / day</Text>
              </View>
              {/* :
                <Text numberOfLines={2} style={{borderWidth:1,height:25, width: this.state.orientation === 'portrait' ? null : 85, color: COLORS.white, borderBottomColor: COLORS.white, borderBottomWidth: 1, fontSize: 9, textAlign: 'center' }}>Average Visits / day</Text> */}

              {/* } */}
              <View style={styles.headerWrapper2}>
                <Text style={{ color: COLORS.white, fontSize: 25,paddingBottom:5, alignSelf: 'center', marginTop: Platform.OS === 'ios' ? 5 : null }}>{this.state.listempMeeting.averageVisitor}</Text>
              </View>
            </LinearGradient>
            <LinearGradient
              style={styles.box}
              colors={[
                COLORS.primary,
                COLORS.third
              ]}
            >
              {/* {
                Platform.OS === 'ios'? */}
              <View style={styles.headerWrapper}>
                <Text numberOfLines={2} style={{ width: this.state.orientation === 'portrait' ? null : 85, color: COLORS.white, fontSize: 12, textAlign: 'center' }}>Today's Visitors</Text>
              </View>
              {/* :
                <Text numberOfLines={2} style={{paddingTop:10, width: this.state.orientation === 'portrait' ? null : 85, color: COLORS.white, borderBottomColor: COLORS.white, borderBottomWidth: 1, fontSize: 9, textAlign: 'center' }}>Today's Visitors</Text>
              } */}
              <View style={styles.headerWrapper2}>
                <Text style={{ color: COLORS.white, fontSize: 25, alignSelf: 'center', marginTop: Platform.OS === 'ios' ? 5 : null }}>{this.state.listempMeeting.todayVisitors}</Text>
              </View>
            </LinearGradient>

            <LinearGradient
              style={styles.box}
              colors={[
                COLORS.primary,
                COLORS.third
              ]}
            >
              
              {/* {
                Platform.OS === 'ios'? */}
              <View style={styles.headerWrapper}>
                <Text numberOfLines={2} style={{ width: this.state.orientation === 'portrait' ? null : 85, color: COLORS.white, fontSize: 12, textAlign: 'center' }}>Upcoming Visitors</Text>
              </View>

              {/* :
                <Text numberOfLines={2} style={{paddingTop:10, width: this.state.orientation === 'portrait' ? null : 85, color: COLORS.white, borderBottomColor: COLORS.white, borderBottomWidth: 1, fontSize: 9, textAlign: 'center' }}>Upcoming Visitors</Text>
              } */}

              <View style={styles.headerWrapper2}>
                <Text style={{ color: COLORS.white, fontSize: 25, alignSelf: 'center', marginTop: Platform.OS === 'ios' ? 5 : null }}>{this.state.listempMeeting.upcoming}</Text>
              </View>
            </LinearGradient>

            <LinearGradient
              style={styles.box}
              colors={[
                COLORS.primary,
                COLORS.third
              ]}
            >

              {/* {
                Platform.OS === 'ios'? */}
              <View style={styles.headerWrapper}>
                <Text numberOfLines={2} style={{ width: this.state.orientation === 'portrait' ? null : 85, color: COLORS.white, fontSize: 12, textAlign: 'center' }}>Overtime Visitors</Text>
              </View>
              {/* :
                <Text numberOfLines={2} style={{paddingTop:10, width: this.state.orientation === 'portrait' ? null : 85, color: COLORS.white, borderBottomColor: COLORS.white, borderBottomWidth: 1, fontSize: 9, textAlign: 'center' }}>Overtime Visitors</Text>
              } */}
              <View style={styles.headerWrapper2}>
                <Text style={{ textAlign: 'center', color: COLORS.white, fontSize: 25, marginTop: Platform.OS === 'ios' ? 5 : null }}>{this.state.listempMeeting.overtimeVisitor}</Text>
              </View>
            </LinearGradient>
          </View>
        </View>
        {/* {this.modalVisitor()} */}
        {/* {this.state.selectedItem?.fullName != null ? */}
        {this.state.modalVisible ? <VisitorDetails
          modalVisible={this.state.modalVisible}
          VisitorDetails={this.state.selectedItem}
          onClose={() => this.setState({ modalVisible: false })}
          onUpdate={() => this.callApi(Moment(this.state.selectedItem.date).format("MM-DD-YYYY"))}
        /> : null}
        {/* :null} */}
        <CusAlert
          displayAlert={this.props.network.isConnected ? this.props.error != null && this.props.error != "" ? true : !this.props.network.isConnected : !this.props.network.isConnected}
          iconInternet={true}
          alertMessageText={"NO INTERNET CONNECTION"}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: null,
    width: null,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: COLORS.white,
    paddingTop: 100,
  },
  box: {
    borderRadius: 10, flex: 1, marginBottom: 10, marginRight: 2, marginLeft: 2, justifyContent: 'center', alignItems: 'center'
  },

  headerWrapper: {
    borderBottomColor: COLORS.white, height: 40, padding: 3,paddingTop:7,
    borderBottomWidth: 1, justifyContent: 'center', alignItems: 'center'
  },
  headerWrapper2: {
    height: 40, justifyContent: 'center', alignItems: 'center',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminEmp);