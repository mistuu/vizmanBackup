import NetInfo from '@react-native-community/netinfo';
import React from 'react';
import {Platform} from 'react-native';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Switch} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import MultiSelect from 'react-native-multiple-select';
import Pagination from 'react-native-pagination';
import Toast from 'react-native-simple-toast';
import {Hoshi} from 'react-native-textinput-effects';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import {connect} from 'react-redux';
import Images from '../../Assets/Images/index.js';
import {COLORS, IMAGES} from '../../Assets/index.js';
import {mapDispatchToProps, mapStateToProps} from '../../Reducers/ApiClass';
import {axiosAuthGet, axiosPost} from '../../utility/apiConnection.js';
import {getOrientation} from '../../utility/util';
import {Header} from '../CusComponent';
import {EmployListRenderItem} from '../CusComponent/EmployListRenderItem';

global.colors = [COLORS.primary, COLORS.third];

var tempList;
class Gatekeepar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      outModalVisible: false,
      enable: true,
      inviteModalVisible: false,
      selectedVisitorName: '',
      selectedInOutId: [],
      selectedwisitorName: 'Select Visitor Name',
      userId: null,
      whomToMeet: null,
      visitorList: null,
      inOutId: null,
      inviteCode: null,
      text: '',
      selectedItems: [],
      visitorNameForOut: [],
      visitorOutList: [],
      outDetail: '',
      checkOut: false,
      checkIn: false,
      employee: [],
      visitors: true,
      employeeCheckInOrOutModal: false,
      selectedEmployee: null,
      isArogyaSetu: false,
      Temperature: null,
      isRefreshing: false,
      orientation: getOrientation(),
      EmployeeList: [],
    };
  }

  componentWillUnmount() {
    // Unsubscribe
    // unsubscribe();
  }
  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.setState({visitors: true});
      if (this.props.Update) {
        this.props.Update(false);
        this.props.GetVisitorForGateKeeper(
          this.props.LoginDetails.userID,
          this.GetVisitorForGateKeeperSuccess,
        );
      }
    });
    Dimensions.addEventListener('change', () => {
      this.setState({orientation: getOrientation()});
    });

    this.props.GetVisitorForGateKeeper(
      this.props.LoginDetails.userID,
      this.GetVisitorForGateKeeperSuccess,
    );
  }
  onRefresh() {
    this.setState({isRefreshing: true});

    this.props.GetEmpCheckInList(
      this.props.LoginDetails.userID,
      this.onSuccessEmpCheckInList,
    );

    setTimeout(() => {
      this.setState({isRefreshing: false});
    }, 3000);
  }

  GetVisitorForGateKeeperSuccess = response => (
    console.log(response), this.afterGetVisitorForGateKeeperSuccess(response)
  );
  afterGetVisitorForGateKeeperSuccess(Response) {
    var tempArr = [];
    Response.forEach(element => {
      if (element.checkInTime != null && element.checkOutTime == null) {
        tempArr.push(element);
      }
    });
    var tepList = [];
    tempArr.forEach(child => {
      var k =
        'Name: ' +
        child.fullName +
        ' Code:' +
        child.inviteCode.toString().trim();
      // var k = child.inviteCode.toString().trim()+" - "+child.fullName
      const temp = Object.assign({}, child, {FullNameDisplay: k});
      tepList.push(temp);
    });
    tempList = this.state.visitorNameForOut;
    // this.checkLimit()
    // this.props.ChkSubscriptionLimit(this.props.LoginDetails.userID)
    this.setState({visitorNameForOut: tepList, visitorOutList: tempArr});
  }

  AddtoggleModal(visible, checkOut, checkIn) {
    this.setState({
      fullName: '',
      email: '',
      mobile: '',
      imageBase64StringIdProof: '',
      imageBase64StringPhotoProof: '',
      whomToMeetName: '',
    });
    this.setState({
      AddmodalVisible: visible,
      enable: true,
      checkOut: checkOut,
      checkIn: checkIn,
    });
  }
  inviteToggleModal(visible) {
    this.setState({inviteModalVisible: visible, inviteCode: ''});
  }
  async outToggleVisible(visible) {
    console.log(this.props.LoginDetails);
    if (Platform.OS == 'ios') {
      console.log(visible);
      try {
        let res = await axiosAuthGet(
          'Visitor/GetVisitorForGateKeeper/' + this.props.LoginDetails.userID+"/"+this.props.LoginDetails.empID,
        );
        this.afterGetVisitorForGateKeeperSuccess(res);
        this.setState({outModalVisible: visible, selectedInOutId: []});
      } catch (error) {}
    } else {
      let res = await axiosAuthGet(
        'Visitor/GetVisitorForGateKeeper/' + this.props.LoginDetails.userID+"/"+this.props.LoginDetails.empID,
      );
      this.afterGetVisitorForGateKeeperSuccess(res);
      this.setState({outModalVisible: visible, selectedInOutId: []});

      //    this.props.GetVisitorForGateKeeper(this.props.LoginDetails.userID, this.GetVisitorForGateKeeperSuccess)
    }
  }

  backBtnforModal() {
    this.setState({
      inviteModalVisible: false,
      outModalVisible: false,
      selectedInOutId: [],
      selectedVisitorName: '',
      inviteCode: null,
    });
  }

  onChanged(text) {
    let mobile = '';
    let numbers = '0123456789';
    let mobileError = '';

    for (var i = 0; i < text.length; i++) {
      if (numbers.indexOf(text[i]) > -1) {
        mobile = mobile + text[i];
        if (mobile[0] > 5) {
          if (mobile.length == 10) {
            this.getVisitorByMobile(mobile);
          } else {
            this.setState({enable: true});
          }
        } else {
          mobile = '';
          mobileError = 'Please Enter Valid Mobile Number';
          // alert('Please Enter Valid Mobile Number')
        }
      } else {
        mobileError = 'Please Enter Numbers Only';
        // alert("Please Enter Numbers Only");
      }
    }
    // if(mobile.length >= 4){
    //     this.getVisitorByMobile(mobile)
    // }

    this.setState({mobile, mobileError});
    // const visitorDetail = Object.assign({}, this.state.visitorDetail, { mobile: mobile });
    // this.setState({ visitorDetail })
    // this.setState({ myNumber: newText });
  }

  getParsedDate(date) {
    date = String(date).split('-');
    return [
      parseInt(date[2]) + '-' + parseInt(date[1]) + '-' + parseInt(date[0]),
    ];
  }

  checkoutSuccess = res => this.afterCheckOutSuccess(res);
  afterCheckOutSuccess(respp) {
    if (respp == true) {
      this.sendNotification(this.state.outDetail, 21);
      this.getAllReceptionst(this.state.outDetail, 9);
      Alert.alert(
        'Success',
        this.state.selectedVisitorName + ' Check Out successfully',
      );
      this.props.GetVisitorForGateKeeper(
        this.props.LoginDetails.userID,
        this.GetVisitorForGateKeeperSuccess,
      );
    } else {
      alert(this.state.selectedVisitorName + ' Check Out Unsuccessfully');
    }
    this.setState({outModalVisible: false});
  }
  sendNotification(item, tag) {
    let by;
    // console.log("Employee Name:========",this.props.LoginDetails.userName);
    if (
      this.props.LoginDetails.userRoleId === 4 ||
      this.props.LoginDetails.userRoleId === 1
    ) {
      by = this.props.LoginDetails.fullName;
    } else if (this.props.LoginDetails.userRoleId === 3) {
      by = this.props.LoginDetails.fullName;
    } else {
      by = this.props.LoginDetails.fullName;
    }
    // tag = 1 check in, 2 = approve, 3 = reject, 4 = reschedule
    var notifText1;
    if (tag == 1) {
      // if (item.inviteCode != null) {
      notifText1 =
        item.fullName +
        ' ( ' +
        item.inviteCode.toString().trim() +
        ' ) Checked In by ' +
        by;
      // } else {
      //     notifText1 = item.fullName + " Checked In "
      // }
    } else if (tag == 21) {
      // if (item.inviteCode != null) {
      notifText1 =
        item.fullName +
        ' ( ' +
        item.inviteCode.toString().trim() +
        ' ) Checked Out by ' +
        by;
      // } else {
      //     notifText1 = item.fullName + " Checked Out "
      // }
    } else if (tag == 2) {
      notifText1 =
        item.fullName +
        ' ( ' +
        item.inviteCode.toString().trim() +
        ' ) Approved by ' +
        by;
    } else if (tag == 3) {
      notifText1 =
        item.fullName +
        ' ( ' +
        item.inviteCode.toString().trim() +
        ' ) Rejected by ' +
        by;
    } else if (tag == 4) {
      notifText1 =
        item.fullName +
        ' ( ' +
        item.inviteCode.toString().trim() +
        ' ) Rescheduled by ' +
        by;
    }
    var param = {
      notifText: notifText1,
      notifDate: this.getCurrentDate(),
      userId: item.whomToMeet,
    };
    // this.props.SaveNotification(param);
  }
  getAllReceptionst(params1, tag) {
    this.props.ReceptionList.forEach(element => {
      this.sendNotificationRec(params1, element, tag); // 5 = Approve
    });
  }
  addZero(no) {
    if (no.toString().length == 1) {
      return '0' + no;
    } else {
      return no;
    }
  }

  getParsedDate1(date) {
    date = String(date).split('-');
    return [
      this.addZero(parseInt(date[2])) +
        '-' +
        this.addZero(parseInt(date[1])) +
        '-' +
        this.addZero(parseInt(date[0])),
    ];
  }
  getCurrentDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    var d =
      this.addZero(dd) + '-' + this.addZero(mm) + '-' + this.addZero(yyyy);
    var temp = this.getParsedDate1(d);
    let date1 = new Date();
    let hours = date1.getHours();
    let minutes = date1.getMinutes();
    let seconds = date1.getSeconds();
    var t3 =
      temp +
      'T' +
      this.addZero(hours) +
      ':' +
      this.addZero(minutes) +
      ':' +
      this.addZero(seconds);
    return t3;
  }
  async sendNotificationRec(params1, item, tag) {
    // tag = 5 = approve, 6 = reject, 7 = reschedule 8 = check in
    var notifText1;
    if (tag == 5) {
      notifText1 =
        params1.fullName +
        ' ( ' +
        params1.inviteCode.toString().trim() +
        ' ) Checked In by ' +
        this.props.LoginDetails.fullName; // by Employee "
    } else if (tag == 9) {
      notifText1 =
        params1.fullName +
        ' ( ' +
        params1.inviteCode.toString().trim() +
        ' ) Checked Out by ' +
        this.props.LoginDetails.fullName; // by Employee "
    }
    var param = {
      notifText: notifText1,
      notifDate: this.getCurrentDate(),
      userId: item.usrId,
    };
    // this.props.SaveNotification(param);
  }

  // wisSelected = selectedwisitorName => {
  //     var temp = this.state.visitorNameForOut.filter(x => x.visitorId == selectedwisitorName[0]);
  //     var temp2 = temp[0].inOutId

  //     this.setState({ selectedInOutId: temp2 })
  //     this.setState({ selectedwisitorName });

  // }
  outVisit() {
    return (
      <Modal
        backgroundColor={'black'}
        backdropColor={'black'}
        animationType={'slide'}
        transparent={true}
        visible={this.state.outModalVisible}
        onRequestClose={() => {
          this.backBtnforModal();
        }}>
        {/* <TouchableWithoutFeedback onPress={() => {
                    this.backBtnforModal();
                }}> */}

        <View
          style={{
            backgroundColor: 'rgba(52, 52, 52, 0.8)',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
          }}>
          {/* <TouchableWithoutFeedback onPressOut={() => {
                        this.backBtnforModal()
                    }} >
                        <View style={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            flex: 1,
                        }}></View>
                    </TouchableWithoutFeedback> */}
          <View
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: COLORS.white,
              alignItems: 'center',
            }}>
            <View
              style={{
                height: Platform.OS == 'ios' ? '14%' : '8%',
                width: '100%',
                flexDirection: 'row',
                marginTop: 25,
              }}>
              <TouchableOpacity
                style={{
                  marginTop: Platform.OS == 'ios' ? 29 : 0,
                  height: 50,
                  width: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding:10
                }}
                onPress={() => this.backBtnforModal()}>
                <Image
                  source={IMAGES.back}
                  style={{height: 22, width: 22, tintColor: COLORS.primary}}
                />
              </TouchableOpacity>
              <View style={{flexGrow: 1, justifyContent: 'center'}}>
                <Image
                  source={IMAGES.outmodal}
                  style={{
                    alignSelf: 'center',
                    resizeMode: 'cover',
                    height: 35,
                    width: 70,
                  }}
                />
              </View>
            </View>
            <View
              style={{
                height: null,
                marginTop: 10,
                width: '85%',
                alignSelf: 'center',
                borderBottomColor: COLORS.white,
              }}>
              <Text style={{alignSelf: 'flex-start', padding: 5, fontSize: 18}}>
                Visitor Name:
              </Text>
              <View style={{}}>
                <MultiSelect
                  hideTags
                  items={this.state.visitorNameForOut}
                  uniqueKey="inOutId"
                  // ref={(component) => { this.multiSelect = component }}
                  onSelectedItemsChange={this.onSelectedItemsChange}
                  styleListContainer={{height: 200}}
                  selectedItems={this.state.selectedInOutId}
                  selectText="Pick Name and Invite Code"
                  searchInputPlaceholderText="Search Name or Invite Code"
                  styleRowList={{borderBottomWidth: 0.5}}
                  styleMainWrapper={{
                    borderWidth: 0.5,
                    borderRadius: 5,
                    paddingHorizontal: 10,
                    paddingTop: 10,
                  }}
                  tagRemoveIconColor={COLORS.grayCCC}
                  tagBorderColor={COLORS.grayCCC}
                  tagTextColor={COLORS.grayCCC}
                  selectedItemTextColor={COLORS.black}
                  selectedItemIconColor={COLORS.grayCCC}
                  single={true}
                  itemTextColor={COLORS.black}
                  displayText="fullName"
                  displayKey="FullNameDisplay"
                  searchInputStyle={{color: COLORS.black}}
                  submitButtonColor={COLORS.grayCCC}
                  submitButtonText="Submit"
                />
              </View>
            </View>
            <TouchableOpacity
              style={{
                alignSelf: 'center',
                height: 45,
                width: 100,
                borderRadius: 6,
                margin: 5,
              }}
              onPress={() => {
                this.state.selectedInOutId[0] != undefined
                  ? this.props.CheckOut(
                      this.state.selectedInOutId[0]+"/"+this.props.LoginDetails.empID,
                      this.checkoutSuccess,
                    )
                  : alert('Please Select Visitor Name');
              }}>
              <LinearGradient
                style={{
                  flex: 1,
                  borderRadius: 7,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                colors={[COLORS.secondary, COLORS.secondary]}>
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: 17,
                    fontWeight: 'bold',
                    width: 100,
                    textAlign: 'center',
                  }}>
                  Submit
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
  onSelectedItemsChange = selectedInOutId => {
    this.setState({selectedInOutId});
    var temp = this.state.visitorNameForOut.filter(
      x => x.inOutId == selectedInOutId,
    );
    var tt = this.state.visitorOutList.filter(
      x => x.inOutId == selectedInOutId,
    );
    if (temp[0] != undefined) {
      this.setState({
        selectedVisitorName: temp[0].fullName,
        outDetail: tt[0],
      });
    } else {
      alert('Please Select Visitor Name');
    }
  };

  SearchFilterFunction(search) {
    if (search != '') {
      const newData = this.state.visitorNameForOut.filter(function (item) {
        const itemData = item.fullName ? item.fullName : '';
        // const textData = search.toUpperCase();
        return itemData.indexOf(itemData) > -1;
      });
      this.setState({
        visitorNameForOut: newData,
        search: search,
      });
    } else {
      this.setState({
        visitorNameForOut: tempList,
        search: search,
      });
    }
  }
  updateUser = user => {
    this.setState({whomToMeetName: user});
  };

  inviteCodeFillData() {
    return (
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={this.state.inviteModalVisible}
        onRequestClose={() => {
          this.backBtnforModal();
        }}>
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(52, 52, 52, 0.8)',
            justifyContent: 'center',
          }}>
          <StatusBar backgroundColor={COLORS.primary} />
          <TouchableWithoutFeedback
            onPressOut={() => {
              this.backBtnforModal();
            }}>
            <View
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                flex: 1,
              }}></View>
          </TouchableWithoutFeedback>
          {/* <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: 'rgba(52, 52, 52, 0.8)' }}> */}
          <View
            style={{
              alignSelf: 'center',
              width: '90%',
              height: 190,
              backgroundColor: COLORS.white,
              borderRadius: 13,
              padding: 10,
              alignItems: 'center',
            }}>
            <Image
              source={IMAGES.inmodal}
              style={{
                alignSelf: 'center',
                resizeMode: 'cover',
                height: 35,
                width: 70,
                top: -26,
              }}
            />

            {/* <Text style={{ fontWeight: 'bold', color:COLORS.black, fontSize: 20, width: 150, textAlign: 'center' }}>Invite Code</Text> */}
            <View
              style={{
                borderWidth: 1,
                borderRadius: 2,
                height: 55,
                width: '90%',
                margin: 5,
                elevation: 1,
              }}>
              <Hoshi
                maxLength={6}
                style={{fontSize: 18}}
                ref={el => {
                  this.inviteCode = el;
                }}
                onChangeText={inviteCode => this.setState({inviteCode})}
                value={this.state.inviteCode}
                label="Enter Invite Code"
              />
            </View>
            <TouchableOpacity
              style={{
                height: 45,
                width: '90%',
                borderRadius: 2,
                margin: 5,
                elevation: 1,
              }}
              onPress={() => {
                NetInfo.fetch().then(state => {
                  if (state.isConnected) {
                    if (
                      this.state.inviteCode == null ||
                      this.state.inviteCode.length != 6
                    ) {
                      alert('Please Enter Valid Invite Code');
                    } else {
                      this.props.GetVisitorByInviteCode(
                        this.state.inviteCode,
                        this.getVisitorByInviteCodeSuccess,
                      );
                    }
                  } else {
                    alert('Please check Network');
                  }
                });
              }}>
              <LinearGradient
                style={{
                  flex: 1,
                  borderRadius: 7,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                colors={[COLORS.secondary, COLORS.secondary]}>
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: 17,
                    fontWeight: 'bold',
                    width: '100%',
                    textAlign: 'center',
                  }}>
                  Submit
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          {this.props.isLoading ? (
            <View
              style={{
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: '100%',
                backgroundColor: 'rgba(52, 52, 52, 0.8)',
              }}>
              <Image source={IMAGES.progress} style={{width: 95, height: 95}} />
            </View>
          ) : null}
        </View>
      </Modal>
    );
  }
  getVisitorByInviteCodeSuccess = res =>
    this.afterGetVisitorByInviteCodeSuccess(res);
  afterGetVisitorByInviteCodeSuccess(Response) {
    console.log("Eni mane",Response.length);
    if(Response.length==0){
      alert('Please Insert Valid Invite Code');

    }
    else{
      if(Response[0].status==2 || Response[0].status==3  ){
        alert('Please Insert Valid Invite Code');
  
      }
       else{
        if (Response.length != 0) {
          if (Response[0].checkInTime == null) {
            this.setState({inviteModalVisible: false});
            this.props.navigation.navigate('VisitorForm', {
              tag: 2,
              VisitorDetails: Response[0],
            });
          } else {
            alert(Response[0].fullName + ' is already Checked In');
          }
        } else {
          alert('Please Insert Valid Invite Code');
        }
      }
    }
  }
  onSuccessEmpCheckInList = EmployeeList => this.setState({EmployeeList});

  render() {
    var borderColor,
      borderColor1,
      textColor,
      textColor1,
      backgroundColor,
      backgroundColor1;
    if (this.state.visitors) {
      borderColor = COLORS.third;
      borderColor1 = COLORS.primary;
      textColor = COLORS.third;
      textColor1 = COLORS.white;
      backgroundColor = COLORS.white;
      backgroundColor1 = COLORS.primary;
    } else {
      borderColor = COLORS.primary;
      borderColor1 = COLORS.third;
      textColor = COLORS.white;
      textColor1 = COLORS.third;
      backgroundColor = COLORS.primary;
      backgroundColor1 = COLORS.white;
    }
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: COLORS.whitef4,
        }}>
        <View style={{width: '100%',marginTop:Platform.OS=="ios"?-20:0}}>
          <Header title={'Dashboard'} navigation={this.props.navigation} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '97%',
            height: 48,
            alignSelf: 'center',
            paddingTop: 5,
          }}>
          <TouchableOpacity
            onPress={() => {
              this.setState({visitors: true});
              this.props.GetVisitorForGateKeeper(
                this.props.LoginDetails.userID,
                this.GetVisitorForGateKeeperSuccess,
              );
            }}
            disabled={this.state.visitors}
            style={{
              flex: 1,
              padding: 10,
              marginRight: 5,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1.5,
              borderRadius: 5,
              elevation: !this.props.isLoading ? 1 : 0,
              backgroundColor: backgroundColor1,
              borderColor: borderColor1,
            }}>
            <Text
              style={{
                width: 150,
                textAlign: 'center',
                color: textColor1,
                fontWeight: 'bold',
              }}>
              Visitors
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({visitors: false});
              this.props.GetEmpCheckInList(
                this.props.LoginDetails.userID,
                this.onSuccessEmpCheckInList,
              );
            }}
            disabled={!this.state.visitors}
            style={{
              flex: 1,
              padding: 10,
              marginLeft: 5,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1.5,
              borderRadius: 5,
              elevation: !this.props.isLoading ? 1 : 0,
              backgroundColor: backgroundColor,
              borderColor: borderColor,
            }}>
            <Text
              style={{
                width: 150,
                textAlign: 'center',
                color: textColor,
                fontWeight: 'bold',
              }}>
              Employee
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1}}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            {this.state.visitors ? (
              <View
                style={{
                  height: '100%',
                  width: '100%',
                  flexDirection:
                    this.state.orientation === 'landscape' ? 'row' : 'column',
                }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingBottom: '2%',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.inviteToggleModal(!this.state.inviteModalVisible);
                    }}>
                    <LinearGradient
                      style={{
                        height: 200,
                        width: 200,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 200 / 2,
                      }}
                      colors={[COLORS.primary, COLORS.third]}>
                      <Text style={{fontSize: 60, color: COLORS.white}}>
                        IN
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingBottom: '2%',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.outToggleVisible(!this.state.outModalVisible);
                    }}
                    style={{justifyContent: 'center', alignSelf: 'center'}}>
                    <LinearGradient
                      style={{
                        height: 200,
                        width: 200,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 200 / 2,
                      }}
                      colors={[COLORS.primary, COLORS.third]}>
                      <Text style={{fontSize: 60, color: COLORS.white}}>
                        OUT
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
                {/* <LinearGradient
                                style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center', right: 18, bottom: 18, borderRadius: 50 / 2, height: 50, width: 50, }}
                                colors={[
                                    COLORS.primary,
                                    COLORS.third
                                ]}
                            >
                                <TouchableOpacity
                                    style={{ justifyContent: "center", height: 50, width: 50, borderRadius: 50 / 2, alignItems: "center" }}
                                    onPress={() => {
                                        this.props.navigation.navigate("VisitorForm", { tag: 0 })
                                    }}>
                                    <Text style={{ textAlign: 'center', bottom: 2, color: COLORS.white, fontSize: (Platform.OS === 'ios') ? 42 : 50, }}>+</Text>
                                </TouchableOpacity>
                            </LinearGradient> */}
                <View style={{position: 'absolute', bottom: '0%', right: '4%'}}>
                  <LinearGradient
                    style={{
                      marginBottom: 13,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 55 / 2,
                      height: 55,
                      width: 55,
                    }}
                    colors={[COLORS.primary, COLORS.third]}>
                    <TouchableOpacity
                      style={{
                        borderRadius: 55 / 2,
                        height: 55,
                        width: 55,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
        
                      onPress={() => {this.props.mobileNo({mobStatus: 0}),
                        this.props.navigation.navigate('VisitorForm', {tag: 0});
                      }}>
                      <Image
                        source={Images.plus}
                        style={{height: 45, width: 45,tintColor:COLORS.white}}
                      />
                      {/* <Text style={{ alignSelf: 'center', marginBottom: 6, color: COLORS.white, fontSize: (Platform.OS === 'ios') ? 42 : 50, }}>+</Text> */}
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              </View>
            ) : (
              this.employeList()
            )}
          </View>

          {this.inviteCodeFillData()}
          {/* {this.AddRegisterVisit()} */}
          {this.outVisit()}
          {this.employeeCheckInOrOutModal()}
          {/* {this.CheckRegisterVisit()} */}
        </View>
      </View>
    );
  }
  handleInputChange = (Temperature, tag) => {
    var Temp = Temperature.replace(/[- #*;,+<>N()\{\}\[\]\\\/]/gi, '');
    if (this.validateTemp(Temp)) {
      if (tag == 2) {
        var invitecodeArray = Object.assign({}, this.state.invitecodeArray, {
          vizTemp: Temp,
        });
        this.setState({invitecodeArray});
      } else {
        this.setState({Temperature: Temp});
      }
    }
  };
  validateTemp(s) {
    var rgx = /^[0-9]*\.?[0-9]*$/;
    return s.match(rgx);
  }
  employeeCheckInOrOutModal() {
    return (
      <Modal
        // backgroundColor={"black"}
        // backdropColor={"black"}
        animationType={'fade'}
        transparent={true}
        visible={this.state.employeeCheckInOrOutModal}
        onRequestClose={() => {
          this.setState({
            isArogyaSetu: false,
            Temperature: null,
            employeeCheckInOrOutModal: false,
          });
        }}>
        <TouchableWithoutFeedback
          style={styles.container}
          activeOpacity={1}
          onPressOut={() => {
            this.setState({
              isArogyaSetu: false,
              Temperature: null,
              employeeCheckInOrOutModal: false,
            });
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(52, 52, 52, 0.8)',
            }}>
            <View
              style={{
                width: '80%',
                height: null,
                backgroundColor: COLORS.white,
                borderRadius: 13,
                padding: 10,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  width: '100%',
                  textAlign: 'center',
                  fontSize: 23,
                  fontWeight: 'bold',
                }}>
                {!this.state.selectedEmployee?.isCheckIN
                  ? 'Employee Check In'
                  : 'Employee Check Out'}
              </Text>
              <View
                style={{
                  borderWidth: 0.5,
                  borderRadius: 5,
                  elevation: 3,
                  backgroundColor: COLORS.white,
                  marginVertical: 10,
                  width: '100%',
                  padding: 10,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    padding: 7,
                    color: COLORS.black,
                    fontWeight: 'bold',
                    textAlign: 'left',
                    fontSize: 15,
                    width: '100%',
                  }}>
                  {this.state.selectedEmployee?.fullName}
                </Text>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    padding: 10,
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: COLORS.graye00,
                      textAlign: 'left',
                      flexGrow: 1,
                    }}>
                    {'is vaccinated'}
                  </Text>
                  <Switch
                    style={{alignSelf: 'flex-end'}}
                    trackColor={{false: COLORS.graye00, true: COLORS.blue81}}
                    thumbColor={
                      this.state.isArogyaSetu ? COLORS.yellowf5 : COLORS.grayf4
                    }
                    ios_backgroundColor={COLORS.transparent3e}
                    onValueChange={() => {
                      this.setState({isArogyaSetu: !this.state.isArogyaSetu});
                    }}
                    value={this.state.isArogyaSetu}
                  />
                </View>
                <View
                  style={{
                    width: '100%',
                    padding: 10,
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 10,
                      color: COLORS.graye00,
                      textAlign: 'left',
                      flexGrow: 1,
                    }}>
                    {'Temperature'}
                  </Text>
                  <TextInput
                    style={{borderBottomWidth: 0.5, width: '100%'}}
                    placeholder={'Ex.:- 93' + '\u00b0'}
                    placeholderTextColor={COLORS.placeholderColor}
                    maxLength={6}
                    keyboardType={'phone-pad'}
                    onChangeText={Temperature =>
                      this.handleInputChange(Temperature)
                    }
                    value={this.state.Temperature}
                  />
                </View>
                <View
                  style={{
                    width: '100%',
                    padding: 10,
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: COLORS.secondary,
                      alignItems: 'center',
                      borderRadius: 5,
                    }}
                    onPress={() => {
                      this.state.selectedEmployee.isCheckIN
                        ? this.empCheckOut()
                        : this.empCheckIn();
                      // if (this.state.isArogyaSetu) {
                      //     if (this.state.Temperature != null && this.state.Temperature != '') {
                      //     } else {
                      //         Toast.show('Please enter Temperature')
                      //     }
                      // } else {
                      //     Toast.show('Please enable Arogya Setu')
                      // }
                    }}>
                    <Text
                      style={{
                        width: 150,
                        fontSize: 18,
                        color: COLORS.white,
                        textAlign: 'center',
                        padding: 10,
                        fontWeight: 'bold',
                      }}>
                      {!this.state.selectedEmployee?.isCheckIN
                        ? 'Check In'
                        : 'Check Out'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  async empCheckOut(inOutId, empId) {
    const param = {
      InOutId: inOutId,
      EmpID: empId,
      UserId: this.props.LoginDetails.userID,
      IsArogyaSetu: this.state.isArogyaSetu,
      EmpTemp: this.state.Temperature,
    };
    if (Platform.OS == 'ios') {
      let response = await axiosPost('Users/EmpCheckOut', param);
      console.log(response);
      if (response) {
        Toast.show(
          this.state.selectedEmployee.fullName + ' is Check Out successfully',
        );
        console.log(this.props.LoginDetails.userID);
        let re = await axiosAuthGet(
          'Users/GetEmpCheckInList/' + this.props.LoginDetails.userID,
        );
        console.log(re);
        this.onSuccessEmpCheckInList(re);
        // this.props.GetEmpCheckInList(this.props.LoginDetails.userID, this.getEmpCheckInListSuccess)
        this.setState({
          isArogyaSetu: false,
          Temperature: null,
          employeeCheckInOrOutModal: false,
        });
      } else {
        Toast.show(
          this.state.selectedEmployee.fullName +
            ' is Check In Unsuccessfull !!!',
        );
      }
    } else {
      this.props.EmpCheckOut(param, this.empCheckOutSuccess);
    }
    // this.props.EmpCheckOut(param, this.empCheckOutSuccess)
  }
  empCheckOutSuccess = res => this.afterempCheckOutSuccess(res);
  afterempCheckOutSuccess(Response) {
    if (Response) {
      Toast.show(
        this.state.selectedEmployee.fullName + ' is Check Out Successfully',
      );
      this.props.GetEmpCheckInList(
        this.props.LoginDetails.userID,
        this.onSuccessEmpCheckInList,
      );
      this.setState({
        isArogyaSetu: false,
        Temperature: null,
        employeeCheckInOrOutModal: false,
      });
    } else {
      Toast.show(
        this.state.selectedEmployee.fullName +
          ' is Check Out Unsuccessfull !!!',
      );
    }
  }
  async empCheckIn(empId) {
    const param = {
      EmpID: empId,
      UserId: this.props.LoginDetails.userID,
      IsArogyaSetu: this.state.isArogyaSetu,
      EmpTemp: this.state.Temperature,
    };
    console.log('', param);
    try {
      if (Platform.OS == 'ios') {
        let response = await axiosPost('Users/EmpCheckIn', param);
        console.log(response);
        if (response) {
          Toast.show(
            this.state.selectedEmployee.fullName + ' is Check In successfully',
          );
          console.log(this.props.LoginDetails.userID);
          let re = await axiosAuthGet(
            'Users/GetEmpCheckInList/' + this.props.LoginDetails.userID,
          );
          console.log(re);
          this.onSuccessEmpCheckInList(re);
          // this.props.GetEmpCheckInList(this.props.LoginDetails.userID, this.getEmpCheckInListSuccess)
          this.setState({
            isArogyaSetu: false,
            Temperature: null,
            employeeCheckInOrOutModal: false,
          });
        } else {
          Toast.show(
            this.state.selectedEmployee.fullName +
              ' is Check In Unsuccessfull !!!',
          );
        }
      } else {
        this.props.EmpCheckIn(param, this.empCheckInSuccess);
      }
    } catch (error) {}
    this.props.EmpCheckIn(param, this.empCheckInSuccess);
  }
  empCheckInSuccess = res => this.afterempCheckInSuccess(res);
  afterempCheckInSuccess(Response) {
    if (Response) {
      Toast.show(
        this.state.selectedEmployee.fullName + ' is Check In Successfully',
      );
      this.props.GetEmpCheckInList(
        this.props.LoginDetails.userID,
        this.onSuccessEmpCheckInList,
      );
      this.setState({
        isArogyaSetu: false,
        Temperature: null,
        employeeCheckInOrOutModal: false,
      });
    } else {
      Toast.show(
        this.state.selectedEmployee.fullName + ' is Check In Unsuccessfull !!!',
      );
    }
  }
  SearchFilterFunction(search) {
    if (search != '') {
      const newData = this.props.EmployeeList.filter(function (item) {
        var itemm =
          item.inviteCode + item.mobile + item.fullName + item.roleName;
        const itemData = itemm ? itemm.toUpperCase() : ''.toUpperCase();
        const textData = search.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      this.setState({
        EmployeeList: newData,
        search: search,
      });
    } else {
      this.setState({
        EmployeeList: this.props.EmployeeList,
        search: search,
      });
    }
    console.log('----- last process ---');
  }
  employeList() {
    return (
      <View
        style={{
          backgroundColor: COLORS.whitef4,
          flex: 1,
          marginBottom: 26,
          alignSelf: 'center',
        }}>
        <FlatList
          style={{flex: 1}}
          contentContainerStyle={{flexGrow: 1}}
          data={this.state.EmployeeList}
          ref={r => (this.refsEmp = r)}
          refreshing={this.state.isRefreshing}
          onRefresh={() => this.onRefresh()}
          stickyHeaderIndices={[0]}
          ListHeaderComponent={
            <View
              style={{
                marginLeft: '1%',
                marginRight: '1%',
                width: '98%',
                backgroundColor: COLORS.whitef4,
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  width: '98%',
                  paddingLeft: 5,
                  color: COLORS.black,
                }}>
                Employee List
              </Text>
              <View
                style={{
                  alignSelf: 'center',
                  backgroundColor: COLORS.white,
                  flexDirection: 'row',
                  borderRadius: 10,
                  height: 35,
                  width: '98%',
                  padding: 5,
                  marginVertical: 3,
                }}>
                <Image
                  style={{
                    height: 20,
                    width: 25,
                    resizeMode: 'contain',
                    alignSelf: 'flex-start',
                  }}
                  source={IMAGES.search_a}
                />
                <View style={{height: 25, flexGrow: 1, marginLeft: 5}}>
                  <TextInput
                    placeholderTextColor={COLORS.placeholderColor}
                    maxLength={this.props.LoginDetails.userRoleId != 2 ? 70 : 6}
                    style={{color: COLORS.black, padding: 0}}
                    ref={el => {
                      this.search = el;
                    }}
                    onChangeText={search => this.SearchFilterFunction(search)}
                    value={this.state.search}
                    placeholder={'Search'}
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: COLORS.placeholderColor,
                  borderRadius: 10,
                  paddingVertical: 5,
                  justifyContent: 'center',
                  width: '100%',
                  borderColor: 'black',
                  borderWidth: 0.5,
                  marginTop: 5,
                  elevation: 0.5,
                  alignSelf: 'center',
                }}>
                <View style={{paddingLeft: 5, paddingRight: 2, width: '25%'}}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      flex: 1,
                      textAlign: 'left',
                      paddingLeft: 10,
                    }}>
                    Name
                  </Text>
                </View>
                <View style={{paddingLeft: 2, width: '25%'}}>
                  <Text style={{fontWeight: 'bold', flex: 1}}>Mobile No.</Text>
                </View>
                <View style={{paddingLeft: 2, width: '25%'}}>
                  <Text style={{fontWeight: 'bold', flex: 1}}>User Role</Text>
                </View>
                <View style={{paddingLeft: 2, width: '25%'}}>
                  <Text
                    style={{fontWeight: 'bold', flex: 1, textAlign: 'center'}}>
                    Status
                  </Text>
                </View>
              </View>
            </View>
          }
          // onRefresh={() => this.onRefresh.bind(this)}
          renderItem={({item, key}) => {
            return (
              <EmployListRenderItem
                item={item}
                onPress={() => {
                  this.setState({selectedEmployee: item}),
                    item.isCheckIN
                      ? this.empCheckOut(item.inOutId, item.empId)
                      : this.empCheckIn(item.empId);
                }}
              />

              // <TouchableOpacity style={{ paddingVertical: 10, marginLeft: "1%", marginRight: "1%", width: '98%', borderRadius: 10, marginTop: 5, backgroundColor:COLORS.white}}
              //     onPress={() => { }} disabled={true}>

              //     <View style={{ flexDirection: "row", backgroundColor: COLORS.white, borderRadius: 10 }}>
              //         <View style={{ paddingLeft: 5, paddingRight: 2, width: '25%', }} >
              //             <Text numberOfLines={1} style={{width:"100%", paddingLeft: 10,color: '#6a7989',fontWeight: 'bold', }}>
              //                 {item.fullName}
              //             </Text>
              //         </View>
              //         <View style={{ paddingLeft: 2, alignItems: "center", paddingRight: 2, width: '25%' }}>
              //             <Text numberOfLines={1} style={{color: '#6a7989',fontWeight: 'bold',}} >
              //                 {item.mobile}
              //             </Text>
              //         </View>
              //         <View style={{ paddingLeft: 2, alignItems: "center", paddingRight: 2, width: '25%' }}>

              //             <Text numberOfLines={1} style={{color: '#6a7989',fontWeight: 'bold',}}> {item.roleName}  </Text>
              //         </View>
              //         <View style={{ paddingLeft: 2, alignItems: "center", paddingRight: 2, width: '25%' }}>
              //             <TouchableOpacity onPress={() => { this.setState({ employeeCheckInOrOutModal: true, selectedEmployee: item }) }} style={{ padding: 2, borderRadius: 5, backgroundColor: !item.isCheckIN ? COLORS.skyBlue: COLORS.tempYellow }}>
              //                 <Text numberOfLines={1} style={{ textAlign: 'center', color: COLORS.white }}>{!item.isCheckIN ? 'Check In' : 'Check Out'}</Text>
              //             </TouchableOpacity>

              //         </View>
              //     </View>
              // </TouchableOpacity>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
          // onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{color: COLORS.placeholderColor, fontSize: 20}}>
                No Employee List Record
              </Text>
            </View>
          }
          // onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
        />
        {Platform.OS === 'android' && this.props.EmployeeList?.length > 0 ? (
          <Pagination
            dotThemeLight //<--use with backgroundColor:"grey"
            listRef={this.refsEmp} //to allow React Native Pagination to scroll to item when clicked  (so add "ref={r=>this.refs=r}" to your list)
            // paginationVisibleItems={this.state.viewableItems}//needs to track what the user sees
            paginationItems={this.props.EmployeeList} //pass the same list as data
            paginationItemPadSize={0} //num of items to pad above and below your visable items
          />
        ) : null}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInputStyle: {
    color: COLORS.black,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.black,
    height: Platform.OS === 'ios' ? 40 : null,
  },
  textInputDisableStyle: {
    color: COLORS.black,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.black,
    height: Platform.OS === 'ios' ? 40 : null,
    backgroundColor: COLORS.whiteE0,
  },
  error: {color: 'red', fontSize: 10, padding: 2},
  switchLable: {
    paddingLeft: 15,
    paddingTop: 15,
    textAlign: 'left',
    alignSelf: 'center',
    width: '49%',
  },
  switch: {alignSelf: 'flex-end', width: '50%', padding: 5},
  switchContainer: {
    width: '100%',
    height: 55,
    flexDirection: 'row',
    borderBottomWidth: 1.5,
    borderColor: 'green',
  },
});

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

export default connect(mapStateToProps, mapDispatchToProps)(Gatekeepar);
