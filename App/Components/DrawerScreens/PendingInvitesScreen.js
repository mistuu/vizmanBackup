import NetInfo from "@react-native-community/netinfo";
import { Picker } from "@react-native-community/picker";
import Moment from "moment";
import React from "react";
import {
  Alert,
  Animated,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  FlatList,
  Linking,
} from "react-native";
import TextAvatar from "react-native-text-avatar";
import DropDownPicker from "react-native-dropdown-picker";
import { Switch } from "react-native-gesture-handler";
import LinearGradient from "react-native-linear-gradient";
import Pagination from "react-native-pagination";
// import ModalPicker from 'react-native-modal-picker'
import { RFPercentage } from "react-native-responsive-fontsize";
import Toast from "react-native-simple-toast";
import { connect } from "react-redux";
import { COLORS, IMAGES } from "../../Assets/index.js";
import { IMAGEURL } from "../../utility/util.js";

import {
  mapDispatchToProps,
  mapStateToProps,
} from "../../Reducers/ApiClass.js";
import { visitorDetailEmpty } from "../../utility/emptyClass.js";
import { Header } from "../CusComponent";
import { EmployListRenderItem } from "../CusComponent/EmployListRenderItem.js";
import CheckIn from "../Screens/CheckIn.js";
import VisitorDetails from "../Screens/VisitorDetails.js";
import { axiosAuthGet, axiosPost, axPost } from "../../utility/apiConnection";
import Colors from "../../Assets/Colors/index.js";
import moment from "moment";
import Images from "../../Assets/Images/index.js";
const placeholderTextColor = COLORS.placeholderColor;
const { width, height } = Dimensions.get("window");

class PendingInvitesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.drRef = null;
    this.state = {
      approveItem:null,
      search: "",
      status: "",
      VisitorList: [],
      EmployeeList: [],
      VisitorListforSearch: [],
      sortingArray: [],
      inOutId: "",
      isRefreshing: false,
      modalVisible: false,
      DescOpen: false,
      AscOpen: false,
      AllOpen: false,
      show: false,
      statusList: [
        { text: "All Visitors", value: 0 },
        { text: "Upcoming Visitors", value: 1 },
        { text: "Completed Visitors", value: 2 },
        { text: "Waiting Visitors", value: 3 },
        // {text: 'Today Visitors', value: 4},
      ],
      statusListIOS: [
        { label: "All Visitors", value: 0 },
        { label: "Upcoming Visitors", value: 1 },
        { label: "Completed Visitors", value: 2 },
        { label: "Waiting Visitors", value: 3 },
        { label: "Today Visitors", value: 4 },
      ],
      imageBase64StringPhotoProof: { fileName: null, data: null },
      imageBase64StringIdProof: { fileName: null, data: null },
      VisitorDetails: visitorDetailEmpty,
      selectedList: 4,
      visitors: true,
      employeeCheckInOrOutModal: false,
      selectedEmployee: null,
      isArogyaSetu: false,
      Temperature: null,
      skipModalCheckIn: false,
      paddingBottom: 15,
      curY: new Animated.Value(0),
      height: 0,
      SubscriptionLimit: 0,
      placeholdText: "Mobile / Name / Date",
    };
  }

  toggleModal(visible) {
    this.setState({ modalVisible: visible });
  }
  componentWillUnmount() {
    // Unsubscribe
    // BackHandler.removeEventListener('hardwareBackPress', this.backButtonClick);
  }
  backButtonClick() {
    //   if(global.userRoleId === 4){
    //     return this.props.navigation.navigate("EmployDashboard");
    // }else if(global.userRoleId === 3){
    //     return this.props.navigation.navigate("ReceptionDashboard");
    // }else if(global.userRoleId === 2){
    //     return this.props.navigation.navigate("Gatekeepar");
    // }
  }
  
  call = (res) => alert(res);
  componentDidMount() {
    console.log(
      this.props.LoginDetails.userID + "/" + this.props.LoginDetails.empID
    );
    // BackHandler.removeEventListener('hardwareBackPress', this.backButtonClick);
    this.getData();
  }
  componentDidUpdate(prevState) {
    // this.getData()
  }
  getData() {
    this.focusListener = this.props.navigation.addListener("focus", () => {
      // global.this.getNotification()
      if (this.props.Update) {
        this.props.Update(false);
        this.props.GetPendingInvitesVisitor(
          this.props.LoginDetails.userID + "/" + this.props.LoginDetails.empID,
          this.visitorListSuccess
        );      }
      this.drRef?.close();
    });
    this.props.GetPendingInvitesVisitor(
      this.props.LoginDetails.userID + "/" + this.props.LoginDetails.empID,
      this.visitorListSuccess
    );
      
  }
  
  visitorListSuccess = (res) => this.afterVisitorListSuccess(res);
  afterVisitorListSuccess(VisitorList) {
   

    var statusName = [];
    VisitorList.forEach((item) => {
      var temp;
      if (item.status === 0)
        temp = Object.assign({}, item, { statusNName: "" });
      else if (item.status === 1)
        temp = Object.assign({}, item, { statusNName: "Approve" });
      else if (item.status === 2)
        temp = Object.assign({}, item, { statusNName: "Cancelled" });
      else if (item.status === 3)
        temp = Object.assign({}, item, { statusNName: "Rescheduled" });
      else if (item.status === 4) {
        if (item.checkInTime !== null && item.checkOutTime !== null) {
          temp = Object.assign({}, item, { statusNName: "AlreadyCheckOut" });
        } else {
          temp = Object.assign({}, item, { statusNName: "Check In" });
        }
      } else if (item.status === 5)
        temp = Object.assign({}, item, { statusNName: "Pending" });
      else if (item.status === 6)
        temp = Object.assign({}, item, { statusNName: "Meeting In" });
      else if (item.status === 7)
        temp = Object.assign({}, item, { statusNName: "Meeting Out" });
      else if (item.status === 8)
        temp = Object.assign({}, item, { statusNName: "Check Out" });
      statusName.push(temp);
    });
    var details = [];

    // this gives an object with dates as keys
    var groups = statusName.reduce((groups, game) => {
      const date = game?.date?.split("T")[0];
      console.log("===", date);

      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(game);
      return groups;
    }, {});

    var groupArrays = Object.keys(groups).map((date) => {
      return {
        date,
        allData: groups[date],
      };
    });
    groupArrays = groupArrays.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });
    console.log('group array:=', groupArrays);
    this.setState({
      VisitorList: groupArrays,
      VisitorListforSearch: groupArrays,
      sortingArray: groupArrays,
      paddingBottom: this.props.LoginDetails.userRoleId === 2 ? 30 : 15,
    });
    // if (this.props.LoginDetails.userRoleId == 2) {
      
    // } else if (
    //   this.props.LoginDetails.userRoleId != 4 &&
    //   this.props.LoginDetails.userRoleId != 1 &&
    //   this.state.selectedList === 4
    // ) {
    //   console.log("Hello");

    //   var d = Moment(moment.utc()).format("YYYY-MM-DD");
    //   // "date": "2022-04-21"console.log(groupArrays[0]);
    //   groupArrays = groupArrays.filter((date) => {
    //     return d == date.date;
    //   });
    //   this.setState({
    //     VisitorList: groupArrays,
    //     VisitorListforSearch: groupArrays,
    //     sortingArray: groupArrays,
    //     paddingBottom: this.props.LoginDetails.userRoleId === 2 ? 30 : 15,
    //   });

    //   // this.setState({ VisitorList, VisitorListforSearch: VisitorList })
    //   if (this.state.visitors && this.state.search !== "") {
    //     this.SearchFilterFunction(this.state.search);
    //   }
    // } else {
    //   this.setState({
    //     VisitorList: groupArrays,
    //     VisitorListforSearch: groupArrays,
    //     sortingArray: groupArrays,
    //     paddingBottom: this.props.LoginDetails.userRoleId === 2 ? 30 : 15,
    //   });
    //   console.log("=========",groupArrays);
    //   // this.setState({ VisitorList, VisitorListforSearch: VisitorList })
    //   if (this.state.visitors && this.state.search !== "") {
    //     this.SearchFilterFunction(this.state.search);
    //   }
    // }
    console.log("this.state.selectedList", groupArrays);
    
  }
  callApi() {
    // const {LoginDetails} = this.props;
    // let this.props.LoginDetails.userRoleId = LoginDetails.userRoleId;
    this.setState({
      placeholdText: "Mobile / Name / Date",
    });
    
    console.log(":::::: call api ::::::");
    this.getData();
  }

  getParsedDate(date) {
    date = String(date).split("-");
    return [
      parseInt(date[2]) + "-" + parseInt(date[1]) + "-" + parseInt(date[0]),
    ];
  }

  addZero(no) {
    if (no.toString().length === 1) {
      return "0" + no;
    } else {
      return no;
    }
  }
  // listgetParsedDate(date) {
  //     date = String(date).split('T');
  //     var fDate = date[1].split(':')
  //     return [this.addZero(parseInt(fDate[0])) + ":" + this.addZero(parseInt(fDate[1]))];
  // }
  onRefresh = () => {
    this.setState({ isRefreshing: true, search: "" });
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        if (this.state.visitors) {
          this.getData()
          this.props.GetAllSettings(this.props.LoginDetails.userID);
          this.callApi(this.state.selectedList);
        } else {
          this.getData()
          this.props.GetEmpCheckInList(
            this.props.LoginDetails.userID,
            this.getEmpCheckInListSuccess
          );
        }
      } else {
        alert("Please check Network");
      }
    });
    setTimeout(() => {
      this.setState({ isRefreshing: false });
    }, 3000);
  };
  getEmpCheckInListSuccess = (res) => this.afterGetEmpCheckInListSuccess(res);
  afterGetEmpCheckInListSuccess(EmployeeList) {
    this.setState({ EmployeeList });
    this.setState({ placeholdText: "Name" });
    if (!this.state.visitors && this.state.search !== "")
      this.SearchFilterFunction(this.state.search);
  }
  employeeCheckInOrOutModal() {
    return (
      <Modal
        // backgroundColor={"black"}
        // backdropColor={"black"}
        animationType={"fade"}
        transparent={true}
        visible={this.state.employeeCheckInOrOutModal}
        onRequestClose={() => {
          this.setState({
            isArogyaSetu: false,
            Temperature: null,
            employeeCheckInOrOutModal: false,
          });
        }}
      >
        <TouchableWithoutFeedback
          style={styles.container}
          activeOpacity={1}
          onPressOut={() => {
            this.setState({
              isArogyaSetu: false,
              Temperature: null,
              employeeCheckInOrOutModal: false,
            });
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(52, 52, 52, 0.8)",
            }}
          >
            <View
              style={{
                width: "80%",
                height: null,
                backgroundColor: COLORS.white,
                borderRadius: 13,
                padding: 10,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontSize: 23,
                  fontWeight: "bold",
                }}
              >
                {!this.state.selectedEmployee?.isCheckIN
                  ? "Employee Check In"
                  : "Employee Check Out"}
              </Text>
              <View
                style={{
                  borderWidth: 0.5,
                  borderRadius: 5,
                  elevation: 3,
                  backgroundColor: COLORS.white,
                  marginVertical: 10,
                  width: "100%",
                  padding: 10,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    padding: 7,
                    color: COLORS.black,
                    fontWeight: "bold",
                    textAlign: "left",
                    fontSize: 15,
                    width: "100%",
                  }}
                >
                  {this.state.selectedEmployee?.fullName}
                </Text>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    padding: 10,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      color: COLORS.graye00,
                      textAlign: "left",
                      flexGrow: 1,
                    }}
                  >
                    {"is vaccinated"}
                  </Text>
                  <Switch
                    style={{ alignSelf: "flex-end" }}
                    trackColor={{ false: COLORS.graye00, true: COLORS.blue81 }}
                    thumbColor={
                      this.state.isArogyaSetu ? COLORS.yellowf5 : COLORS.grayf4
                    }
                    ios_backgroundColor={COLORS.transparent3e}
                    onValueChange={() => {
                      this.setState({ isArogyaSetu: !this.state.isArogyaSetu });
                    }}
                    value={this.state.isArogyaSetu}
                  />
                </View>
                <View
                  style={{
                    width: "100%",
                    padding: 10,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      color: COLORS.graye00,
                      textAlign: "left",
                      flexGrow: 1,
                    }}
                  >
                    {"Temperature"}
                  </Text>
                  <TextInput
                    style={{
                      borderBottomWidth: 0.5,
                      width: "100%",
                      height: 45,
                    }}
                    placeholder={"Ex.:- 93" + "\u00b0"}
                    placeholderTextColor={COLORS.placeholderColor}
                    maxLength={6}
                    keyboardType={"phone-pad"}
                    onChangeText={(Temperature) =>
                      this.handleInputChange(Temperature)
                    }
                    value={this.state.Temperature}
                  />
                </View>
                <View
                  style={{
                    width: "100%",
                    padding: 10,
                    justifyContent: "center",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      backgroundColor: COLORS.secondary,
                      alignItems: "center",
                      borderRadius: 5,
                    }}
                    onPress={() => {
                      this.state.selectedEmployee.isCheckIN
                        ? this.empCheckOut()
                        : this.empCheckIn();
                      // if (this.state.isArogyaSetu) {
                      //     if (this.state.Temperature !== null && this.state.Temperature !== '') {
                      //     } else {
                      //         Toast.show('Please enter Temperature')
                      //     }
                      // } else {
                      //     Toast.show('Please enable Arogya Setu')
                      // }
                    }}
                  >
                    <Text
                      style={{
                        width: "100%",
                        fontSize: 18,
                        color: COLORS.white,
                        textAlign: "center",
                        padding: 10,
                        fontWeight: "bold",
                      }}
                    >
                      {!this.state.selectedEmployee?.isCheckIN
                        ? "Check In"
                        : "Check Out"}
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
  whatsappSharing = (details, status) => {
    // console.log(details);
    if (
      this.props.LoginDetails.empID == details.whomToMeet &&
      status == "Pending"
    ) {
      Linking.openURL(
        `whatsapp://send?phone=+91` +
          details.mobile +
          "&text=" +
          details.fullName +
          "\n\n" +
          "You have a meeting with " +
          details.whomToMeetName +
          ", " +
          details.company +
          " on " +
          Moment(moment.utc(details.inTime)).format("DD/MM/YYYY") +
          " at " +
          Moment(moment.utc(details.inTime)).format("h:mm a") +
          ". Your Invite code is " +
          details.inviteCode.trim() +
          " ." +
          "\n\n" +
          "Thanks " +
          encodeURI("vizman.app")
      );
    }
    // else{
    //   Toast.show("You Can't ")
    // }
  };
  handleInputChange = (Temperature, tag) => {
    var Temp = Temperature.replace(/[- #*;,+<>N()\{\}\[\]\\\/]/gi, "");
    if (this.validateTemp(Temp)) {
      if (tag === 2) {
        var VisitorDetails = Object.assign({}, this.state.VisitorDetails, {
          vizTemp: Temp,
        });
        this.setState({ VisitorDetails });
      } else {
        this.setState({ Temperature: Temp });
      }
    }
  };
  validateTemp(s) {
    var rgx = /^[0-9]*\.?[0-9]*$/;
    return s.match(rgx);
  }

  async SearchFilterFunction(search) {
    var masterSearchList = this.state.visitors
      ? this.state.VisitorListforSearch
      : this.props.EmployeeList;
    var x;
    await masterSearchList.filter((item) => {
      x = item.allData;
    });
    // console.log('Search==', x);
    // masterSearchList = x
    if (search !== "") {
      // const newData = masterSearchList.filter(function (item) {
      //     console.log("Item==", item);
      //     var itemm = item.inviteCode + item.mobile + item.fullName
      //     const itemData = itemm ? itemm.toUpperCase() : "".toUpperCase();
      //     const textData = search.toUpperCase();
      //     return itemData.indexOf(textData) > -1;
      // });

      var newData = [];
      await masterSearchList.filter(async (e) => {
        // var d = Moment(moment.utc()e.date).format("DD-MM-YYYY").includes(search)
        var n = await e.allData.filter((item) => {
          const name = item.fullName.toUpperCase();
          const status = item.statusNName.toUpperCase();

          const s = search.toUpperCase();

          return (
            item.mobile.includes(search) ||
            status.includes(s) ||
            name.includes(s) ||
            item.inviteCode.includes(search) ||
            Moment(moment.utc(item.date)).format("DD-MM-YYYY").includes(search)
          );
        });
        if (n.length !== 0) {
          newData.push({ date: e.date, allData: n });
        }
      });
      // masterSearchList.filter(e =>
      //     Moment(moment.utc()e.date).format("DD-MM-YYYY").includes(search))
      //    var newData=await masterSearchList.filter(item=>
      //         item.allData.filter(item1=>item1.mobile.includes(search))
      //     )
      // console.log('New Data:==', newData);

      console.log("login 1");
      this.state.visitors
        ? this.setState({
            VisitorList: newData,
            search: search,
          })
        : (newData = this.props.EmployeeList.filter((item) => {
            const name = item.fullName.toUpperCase();

            const s = search.toUpperCase();

            return name.includes(s);
          }));
      console.log("login 2");
      this.setState({
        EmployeeList: newData,
        search: search,
      });
    } else {
      console.log("login 3");

      this.state.visitors
        ? this.setState({
            VisitorList: masterSearchList,
            search: search,
          })
        : this.setState({
            EmployeeList: this.props.EmployeeList,
            search: search,
          });
    }
    console.log("----- last process ---");
  }
  ListofData() {
    // const {LoginDetails} = this.props;
    // let this.props.LoginDetails.userRoleId = LoginDetails.userRoleId;
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
    var inTime;
    var outTime;
    const headerDistance = Animated.diffClamp(
      this.state.curY,
      0,
      this.state.height + 70
    ).interpolate({
      inputRange: [0, 1],
      outputRange: [0, -1],
      extrapolate: "clamp",
    });

    return (
      <View style={{ flex: 1, paddingBottom: 10 }}>
          
        <Animated.FlatList
          style={{ flex: 1 }}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.curY } } }],
            { useNativeDriver: true }
          )}
          stickyHeaderIndices={[0]}
          contentContainerStyle={{
            flexGrow: 1,
            width: "100%",
            paddingTop: 5,
          }}
          data={
               this.state.VisitorList
          }
          ref={(r) => (this.refs = r)}
          refreshing={this.state.isRefreshing}
          onRefresh={() => this.onRefresh()}
          ListHeaderComponent={
            <View
              style={{
                zIndex: 9,
                alignSelf: "center",
                backgroundColor: COLORS.whitef4,
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  alignSelf: "center",
                  backgroundColor: COLORS.white,
                  flexDirection: "row",
                  borderRadius: 10,
                  height: 35,
                  width: "98%",
                  padding: 5,
                  marginVertical: 3,
                }}
              >
                <Image
                  style={{
                    height: 20,
                    width: 25,
                    resizeMode: "contain",
                    alignSelf: "flex-start",
                  }}
                  source={IMAGES.search_a}
                />
                <View style={{ height: 25, flexGrow: 1, marginLeft: 5 }}>
                  <TextInput
                    placeholderTextColor={COLORS.placeholderColor}
                    maxLength={
                      this.props.LoginDetails.userRoleId !== 2 ? 70 : 6
                    }
                    style={{ color: COLORS.black, padding: 0 }}
                    ref={(el) => {
                      this.search = el;
                    }}
                    onChangeText={(search) => this.SearchFilterFunction(search)}
                    value={this.state.search}
                    placeholder={this.state.placeholdText}
                  />
                </View>
              </View>
            </View>
          }
          onRefresh={() => this.onRefresh()}
          renderItem={({ item, key }) => {
            // console.log(item?.date);
            // const {LoginDetails} = this.props;
            // let this.props.LoginDetails.userRoleId = LoginDetails.userRoleId;
            
              return (
                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <LinearGradient
                    style={{
                      padding: 7,
                      alignItems: "center",
                      width: "32%",
                      borderRadius: 8,
                      marginTop: 7,
                      marginBottom: 10,
                    }}
                    colors={[COLORS.primary, COLORS.third]}
                  >
                    <Text style={{ color: COLORS.white, alignItems: "center" }}>
                      {Moment(moment.utc(item?.date)).format("DD-MM-YYYY")}
                    </Text>
                  </LinearGradient>
                  <FlatList
                    data={item.allData}
                    style={{ margin: 5,width:"90%" }}
                    //   refreshing={this.state.setRefreshing}
                    //   onRefresh={() => this.handleRefresh()}
                    // inverted={true}
                    renderItem={({ item }) =>
                      // <View />
                      {
                    

                        // var cuTime=moment().format('h:mma')
                        // var otime=moment(item.outTime).format('h:mma')

                        // console.log("Out Time==",item.outTime);
                        // if(item.outTime==null){
                        //   item.outTime=moment().endOf('day').format("yyyy-MM-DDThh:mm:ss")+"Z"
                        //   console.log("after===",item.outTime+"====="+moment().endOf('day').format("yyyy-MM-DDThh:mm:ssz"));
                        // }
                        if (item.inTime != null) {
                          var b = item.inTime.split("T");
                          var a = b[1].split("Z");
                          var itime = b[0] + " " + a[0];
                        }

                        if (item.outTime != null) {
                          var x = item.outTime.split("T");
                          var y = x[1].split("Z");
                          var otime = x[0] + " " + y[0];
                        }
                        //var dtf = new Date(frmdt);
                        //var outf = new Date(outdt);
                        var today = new Date();
                        var date =
                          today.getFullYear() +
                          "-" +
                          ("0" + (today.getMonth() + 1)).slice(-2) +
                          "-" +
                          ("0" + today.getDate()).slice(-2);
                        var time =
                          today.getHours() +
                          ":" +
                          ("0" + (today.getMinutes() + 1)).slice(-2) +
                          ":" +
                          today.getSeconds();
                        var dateTime = date + " " + time;

                        {
                          this.props.LoginDetails.userRoleId === 2
                            ? (inTime =
                                item.status === 3 ||
                                item.status === 4 ||
                                item.status === 1 ||
                                item.status === 2
                                  ? item.checkInTime === null
                                    ? ""
                                    : Moment(
                                        moment.utc(item.checkInTime)
                                      ).format("hh:mm A")
                                  : item.inTime === null
                                  ? null
                                  : Moment(moment.utc(item.inTime)).format(
                                      "hh:mm A"
                                    ))
                            : this.props.LoginDetails.userRoleId === 4 ||
                              this.props.LoginDetails.userRoleId === 1
                            ? (inTime =
                                item.status === 3 ||
                                item.status === 4 ||
                                item.status === 1 ||
                                item.status === 2
                                  ? item.checkInTime === null
                                    ? ""
                                    : Moment(
                                        moment.utc(item.checkInTime)
                                      ).format("hh:mm A")
                                  : item.inTime === null
                                  ? null
                                  : Moment(moment.utc(item.inTime)).format(
                                      "hh:mm A"
                                    ))
                            : this.props.LoginDetails.userRoleId === 3
                            ? (inTime =
                                item.status === 3 ||
                                item.status === 4 ||
                                item.status === 1 ||
                                item.status === 2
                                  ? item.checkInTime === null
                                    ? ""
                                    : Moment(
                                        moment.utc(item.checkInTime)
                                      ).format("hh:mm A")
                                  : item.inTime === null
                                  ? null
                                  : Moment(moment.utc(item.inTime)).format(
                                      "hh:mm A"
                                    ))
                            : (inTime =
                                item.inTime === null
                                  ? null
                                  : Moment(moment.utc(item.inTime)).format(
                                      "hh:mm A"
                                    ));
                        }

                        {
                          this.props.LoginDetails.userRoleId === 2
                            ? (outTime =
                                item.status === 3 ||
                                item.status === 4 ||
                                item.status === 1 ||
                                item.status === 2
                                  ? item.checkOutTime === null
                                    ? ""
                                    : Moment(
                                        moment.utc(item.checkOutTime)
                                      ).format("hh:mm A")
                                  : item.outTime === null
                                  ? null
                                  : Moment(moment.utc(item.outTime)).format(
                                      "hh:mm A"
                                    ))
                            : this.props.LoginDetails.userRoleId === 4 ||
                              this.props.LoginDetails.userRoleId === 1 ||
                              this.props.LoginDetails.userRoleId === 3
                            ? (outTime =
                                item.status === 3 ||
                                item.status === 4 ||
                                item.status === 1 ||
                                item.status === 2
                                  ? item.checkOutTime === null
                                    ? ""
                                    : Moment(
                                        moment.utc(item.checkOutTime)
                                      ).format("hh:mm A")
                                  : item.outTime === null
                                  ? null
                                  : Moment(moment.utc(item.outTime)).format(
                                      "hh:mm A"
                                    ))
                            : (outTime =
                                item.outTime === null
                                  ? null
                                  : Moment(moment.utc(item.outTime)).format(
                                      "hh:mm A"
                                    ));
                        }
                        var backgroundColor = COLORS.white;
                        var status = "";
                        if (
                          this.props.LoginDetails.userRoleId !== 2 ||
                          this.props.LoginDetails.userRoleId !== 3
                        ) {
                          if (item.status === 3) {
                            backgroundColor = COLORS.tempYellow;
                            status = "RESCHEDULED";
                          } else if (item.status === 4) {
                            if (
                              item.checkInTime !== null &&
                              item.checkOutTime !== null
                            ) {
                              backgroundColor = "#961448";
                              status = "ALREADY CHECKOUT";
                            } else {
                              backgroundColor = COLORS.skyBlue;
                              status = "Check In";
                            }
                          } else if (item.status === 5) {
                            backgroundColor = "#4667cc";
                            status = "Pending";
                          } else if (item.status === 2) {
                            backgroundColor = COLORS.tempRed;
                            status = "Cancelled";
                          } else if (item.status === 1) {
                            backgroundColor = COLORS.tempGreen;
                            status = "APPROVED";
                          } else if (item.status === 6) {
                            backgroundColor = COLORS.tempGreen;
                            status = "Meeting In";
                          } else if (item.status === 7) {
                            backgroundColor = COLORS.tempGreen;
                            status = "Meeting Out";
                          } else if (item.status === 8) {
                            backgroundColor = COLORS.tempGreen;
                            status = "Check Out";
                          } else if (item.status === 0) {
                            backgroundColor = COLORS.white;
                            status = "";
                          }
                        }
                        return (
                          <View
                            style={{
                              width: "100%",
                              justifyContent: "center",
                              alignItems: "center",
                              
                            }}
                          >
                            <TouchableOpacity
                              style={{
                                height: null,
                                marginLeft: "1%",
                                marginRight: "1%",
                                width: "100%",
                                borderRadius: 13,
                                marginTop: 5,
                                backgroundColor: COLORS.white,
                                elevation: 0.5,
                                borderWidth:0.5
                              }}
                              // onLongPress={()=>this.whatsappSharing(item,status)}
                              onPress={() => {
                                this.props.VisitorDetails(item),
                                  this.setState({
                                    VisitorDetails: item,
                                    // modalVisible: true,
                                  }),
                                  this.props.navigation.navigate("VizDetails",{id:2});
                              }}
                              style={{
                                marginTop: 5,
                                marginBottom: 5,
                                width: "100%",
                                borderWidth:0.5,
                                borderRadius:13,
                                backgroundColor: Colors.white,
                              }}
                            >
                              <View
                                style={{
                                  width: "100%",
                                  borderRadius: 13,
                                  backgroundColor: Colors.white,
                                  padding: 10,
                                  flexDirection: "row",
                                }}
                              >
                                <View style={{ alignItems: "center" }}>
                                  {item.photoProof != null ? (
                                    <Image
                                      source={{
                                        uri: IMAGEURL + item.photoProof,
                                      }}
                                      style={{
                                        resizeMode: "cover",
                                        borderRadius: 80 / 2,
                                        height: 80,
                                        width: 80,
                                        margin: 5,
                                        alignSelf: "center",
                                      }}
                                    />
                                  ) : (
                                    <TextAvatar
                                      backgroundColor={Colors.primary}
                                      textColor={Colors.white}
                                      size={80}
                                      type={"circle"} // optional
                                    >
                                      {item.fullName}
                                    </TextAvatar>
                                  )}
                                  {/* <Text style={{ fontWeight: "bold" }}>
                                    {item.designation}
                                  </Text> */}
                                </View>
                                <View style={{marginLeft:10,width:"45%", }}>
                                  <Text
                                    style={{ fontWeight: "bold", fontSize: 16 }}
                                  >
                                    {item.fullName}
                                  </Text>
                                  {item.department !=null &&<Text>{item.department}</Text>}
                                  <Text style={{marginTop:5}}>{item.mobile}</Text>
                                  <Text style={{marginTop:5}}>{item.company}</Text>
                                </View>
                                <View style={{left:-6}}>
                                
                                <Text style={{fontSize:15,color:Colors.primary, fontWeight:'bold'}}>{item.inviteCode}</Text>
                                
                                </View>
                              </View>

                              <View style={{margin:10, height: 1, backgroundColor: Colors.graye8,}} />
                              <View style={{flexDirection: 'row',alignItems:'center',alignSelf:'center'}}>
                        
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({approveItem:item}),
                                    this.afterVizApproveSuccess(item?.inOutId,this.props.LoginDetails.userID,this.props.LoginDetails.empID,item?.fullName)
                              }}
                              style={{
                                backgroundColor: COLORS.tempGreen,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 10,
                                height: 30,
                                width: '30%',
                                margin: '1%',
                              }}>
                              <Text style={{color: 'white', fontSize: 12}}>
                                Approve
                              </Text>
                            </TouchableOpacity>
                          
                          
                            <TouchableOpacity
                              onPress={() => { this.props.VisitorDetails(item),
                               this.props.navigation.navigate('VizDetails',{id:1})
                              }}
                              style={{
                                backgroundColor: COLORS.tempRed,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 10,
                                height: 30,
                                width: '30%',
                                margin: '1%',
                              }}>
                              <Text style={{color: 'white', fontSize: 12}}>
                                Reject
                              </Text>
                            </TouchableOpacity>
                          
                        </View>
                              
                            </TouchableOpacity>

                          </View>
                        );
                      }
                    }
                    numColumns={1}
                    keyExtractor={(item) => item.courierId}
                  />
                </View>
              );
           
            // if (this.state.visitors) {
            //     {
            //         this.props.LoginDetails.userRoleId === 2 ?
            //             inTime = item.status === 5 ? '' :
            //                 item.checkInTime === null ? '' :
            //                     Moment(moment.utc()item.checkInTime).format("hh:mm A")
            //             :
            //             this.props.LoginDetails.userRoleId === 4 ?
            //                 inTime = item.status === 3 || item.status === 4 || item.status === 1 || item.status === 2 ? item.checkInTime === null ? '' :
            //                     Moment(moment.utc()item.checkInTime).format("hh:mm A")
            //                     :
            //                     item.inTime === null ? null :
            //                         Moment(moment.utc()item.inTime).format("hh:mm A")
            //                 : this.props.LoginDetails.userRoleId === 3 ?
            //                     inTime = item.status === 3 || item.status === 4 || item.status === 1 || item.status === 2 ? item.checkInTime === null ? '' :
            //                         Moment(moment.utc()item.checkInTime).format("hh:mm A")
            //                         :
            //                         item.inTime === null ? null :
            //                             Moment(moment.utc()item.inTime).format("hh:mm A")
            //                     :
            //                     inTime = item.inTime === null ? null :
            //                         Moment(moment.utc()item.inTime).format("hh:mm A")

            //     }
            //     {
            //         this.props.LoginDetails.userRoleId === 2 ?
            //             outTime = item.status === 4 || item.checkInTime !== null ? // item.status === 4 || item.status === 3 ?
            //                 item.checkOutTime === null ? '' :
            //                     Moment(moment.utc()item.checkOutTime).format("hh:mm A")
            //                 :
            //                 item.checkOutTime === null ? null :
            //                     Moment(moment.utc()item.checkOutTime).format("hh:mm A")
            //             :
            //             this.props.LoginDetails.userRoleId === 4 || this.props.LoginDetails.userRoleId === 3 ?
            //                 outTime = item.status === 3 || item.status === 4 || item.status === 1 || item.status === 2 ? item.checkOutTime === null ? '' :
            //                     Moment(moment.utc()item.checkOutTime).format("hh:mm A")
            //                     :
            //                     item.outTime === null ? null :
            //                         Moment(moment.utc()item.outTime).format("hh:mm A")
            //                 :
            //                 outTime = item.outTime === null ? null :
            //                     Moment(moment.utc()item.outTime).format("hh:mm A")
            //     }
            //     var backgroundColor = COLORS.white
            //     var status = ''
            //     if (this.props.LoginDetails.userRoleId !== 2 || this.props.LoginDetails.userRoleId !== 3) {
            //         if (item.status === 3) {
            //             backgroundColor = COLORS.tempYellow
            //             status = "RESCHEDULED"
            //         } else if (item.status === 4) {
            //             if (item.checkInTime !== null && item.checkOutTime !== null) {
            //                 backgroundColor = "#961448"
            //                 status = "ALREADY CHECKOUT"
            //             } else {
            //                 backgroundColor = COLORS.skyBlue
            //                 status = "WAITING"
            //             }
            //         } else if (item.status === 5) {
            //             backgroundColor = "#4667cc"
            //             status = "INVITED"
            //         } else if (item.status === 2) {
            //             backgroundColor = COLORS.tempRed
            //             status = "REJECTED"
            //         } else if (item.status === 1) {
            //             backgroundColor = COLORS.tempGreen
            //             status = "APPROVED"
            //         } else if (item.status === 0) {
            //             backgroundColor = COLORS.white
            //             status = ""
            //         }
            //     }
            //     return (
            //         <TouchableOpacity style={{ height: null, paddingTop: 5, marginLeft: "1%", marginRight: "1%", width: '98%', borderRadius: 10, marginTop: 5, backgroundColor: COLORS.white, elevation: 0.5 }}
            //             onPress={() => this.setState({ VisitorDetails: item, modalVisible: true })}>
            //             <View style={{ flexDirection: "row", justifyContent: "center", paddingBottom: 5, width: "100%" }}>
            //                 <Text numberOfLines={1} style={{ paddingLeft: 10, textAlign: 'left', flex: 1, color: '#6a7989', fontWeight: 'bold', fontSize: RFPercentage(1.7) }} numberOfLines={1} >
            //                     {/* {new Date(item.date).getDate() + "-" + new Date(item.date).getUTCMonth() + "-" + new Date(item.date).getFullYear()} */}
            //                     {Moment(moment.utc()item.date).format('DD-MMM-yyyy')}
            //                 </Text>
            //                 <Text numberOfLines={1} style={{ flex: 1.5, textAlign: 'center', color: '#6a7989', fontWeight: 'bold', fontSize: RFPercentage(1.7) }} numberOfLines={1} >
            //                     {"Invite Code: " + item.inviteCode.trim()}
            //                 </Text>
            //                 {status !== "" ? <Text style={{ marginHorizontal: 10, fontSize: RFPercentage(1.5), flex: 1.2, paddingTop: 2, height: 20, alignSelf: 'center', textAlign: 'center', color: "white", borderRadius: 10, paddingHorizontal: 5, backgroundColor: backgroundColor, overflow: 'hidden' }} numberOfLines={1} >
            //                     {status}
            //                 </Text> : null}
            //             </View>
            //             <View style={{ borderColor: '#6a7989', borderTopWidth: 0.5, borderRadius: 10, paddingTop: 5, paddingBottom: 5, flexDirection: "row", backgroundColor: COLORS.white }}>
            //                 <View style={{ paddingLeft: 5, paddingRight: 2, width: '25%', marginLeft: 1 }} >
            //                     <Text numberOfLines={1} style={{ width: '100%', paddingLeft: 5, textAlign: 'left', color: '#6a7989', fontWeight: 'bold', fontSize: RFPercentage(1.7) }}>
            //                         {item.isVip === true ? item.fullName?.replace(/.(?=.{2,}$)/g, '*') : item.fullName}
            //                     </Text>
            //                 </View>
            //                 {this.props.LoginDetails.userRoleId === 3 && this.props.LoginDetails.userRoleId === 4 &&
            //                     <View style={{ paddingLeft: 2, alignItems: "center", paddingRight: 2, width: '25%', color: '#6a7989', fontWeight: 'bold', }}>
            //                         <Text numberOfLines={1} style={{ width: '100%', color: '#6a7989', fontWeight: 'bold', fontSize: RFPercentage(1.7) }}>
            //                             {item.mobile}
            //                         </Text>
            //                     </View>
            //                 }
            //                 <View style={{ paddingLeft: 2, alignItems: "center", paddingRight: 2, width: '25%' }}>
            //                     {this.props.LoginDetails.userRoleId !== 4 && item.checkInTime === null && (Moment(moment.utc()item.date).format('DD-MMM-yyyy') === Moment(moment.utc()new Date()).format('DD-MMM-yyyy')) ?
            //                         item.status !== 2 && item.status !== 3 ? <TouchableOpacity
            //                             onPress={() => {
            //                                 var imgTemp = { fileName: item.imageBase64StringIdProof, data: null }
            //                                 var picTemp = { fileName: item.imageBase64StringPhotoProof, data: null }
            //                                 this.setState({
            //                                     skipModalCheckIn: true, VisitorDetails: item,
            //                                     imageBase64StringIdProof: imgTemp, imageBase64StringPhotoProof: picTemp
            //                                 })
            //                             }
            //                             }
            //                             style={{ backgroundColor: COLORS.skyBlue, fontSize: 9, padding: 0.5, borderRadius: 5, }}>
            //                             <Text numberOfLines={1} style={{ color: 'white', marginHorizontal: 2, fontSize: RFPercentage(1.7) }}>Check In</Text>
            //                         </TouchableOpacity> : null
            //                         : inTime === null ? <Text numberOfLines={1}>   </Text> :
            //                             <Text numberOfLines={1} style={{ width: '100%', textAlign: 'center', color: '#6a7989', fontWeight: 'bold', fontSize: RFPercentage(1.7) }}> {inTime}  </Text>
            //                     }
            //                 </View>
            //                 <View style={{ paddingLeft: 2, alignItems: "center", paddingRight: 0.5, width: '25%' }}>
            //                     {this.props.LoginDetails.userRoleId !== 4 && item.checkOutTime === null && item.checkInTime !== null && (Moment(moment.utc()item.date).format('DD-MMM-yyyy') === Moment(moment.utc()new Date()).format('DD-MMM-yyyy')) ?
            //                         <TouchableOpacity onPress={() => {
            //                             this.setState({ VisitorDetails: item }),
            //                                 this.props.CheckOut(item.inOutId, this.checkoutSuccess)
            //                         }
            //                         }
            //                             style={{ backgroundColor: COLORS.tempYellow, fontSize: 9, padding: 2, borderRadius: 5 }}>
            //                             <Text numberOfLines={1} style={{ color: 'white', marginHorizontal: 2, fontSize: RFPercentage(1.7) }}>Check Out</Text>
            //                         </TouchableOpacity>
            //                         : outTime === null ? <Text numberOfLines={1}>   </Text> :
            //                             <Text numberOfLines={1} style={{ width: '100%', textAlign: 'center', color: '#6a7989', fontWeight: 'bold', fontSize: RFPercentage(1.7) }}> {outTime}  </Text>
            //                     }
            //                 </View>
            //             </View>
            //         </TouchableOpacity>
            //     )
            // }
            //
          }}
          keyExtractor={(item, index) => index.toString()}
          // onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: COLORS.placeholderColor, fontSize: 20 }}>
                No {this.state.visitors ? "Visitor" : "Employee"} List Record
              </Text>
            </View>
          }
          // onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
        />
        {Platform.OS === "android" && this.state.resVislist?.length > 0 ? (
          <Pagination
            dotThemeLight //<--use with backgroundColor:"grey"
            listRef={this.refs} //to allow React Native Pagination to scroll to item when clicked  (so add "ref={r=>this.refs=r}" to your list)
            // paginationVisibleItems={this.state.viewableItems}//needs to track what the user sees
            paginationItems={
              this.state.visitors ? this.state.resVislist : this.state.employee
            } //pass the same list as data
            paginationItemPadSize={0} //num of items to pad above and below your visable items
          />
        ) : null}
      </View>
    );
  }

  checkoutSuccess = (res) => this.afterCheckOutSuccess(res);
  afterCheckOutSuccess(respp) {
    if (respp) {
      console.log(respp);
      this.callApi(this.state.selectedList);
      this.sendNotification(this.state.VisitorDetails, 21);
      this.getAllReceptionst(this.state.VisitorDetails, 9);
      Alert.alert(
        "Success",
        this.state.VisitorDetails.fullName + " Check Out successfully"
      );
    } else {
      alert(this.state.VisitorDetails.fullName + " Check Out Unsuccessfull");
    }
  }

  // getParsedDate1(date) {
  //     date = String(date).split('-');
  //     return [this.addZero(parseInt(date[2])) + "-" + this.addZero(parseInt(date[1])) + "-" + this.addZero(parseInt(date[0]))];
  // }
  // getCurrentDate() {
  //     var today = new Date();
  //     var dd = today.getDate();
  //     var mm = today.getMonth() + 1;
  //     var yyyy = today.getFullYear();
  //     var d = this.addZero(dd) + '-' + this.addZero(mm) + '-' + this.addZero(yyyy)
  //     var temp = this.getParsedDate1(d)
  //     let date1 = new Date();
  //     let hours = date1.getHours();
  //     let minutes = date1.getMinutes();
  //     let seconds = date1.getSeconds();
  //     var t3 = temp + "T" + this.addZero(hours) + ":" + this.addZero(minutes) + ":" + this.addZero(seconds)
  //     console.log("t3",t3);
  //     return t3
  // }
  sendNotification(item, tag) {
    let by;
    // const {LoginDetails} = this.props;
    // let this.props.LoginDetails.userRoleId = LoginDetails.userRoleId;
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
    if (tag === 1) {
      // if (item.inviteCode !== null) {
      notifText1 =
        item.fullName +
        " ( " +
        item.inviteCode.toString().trim() +
        " ) Checked In by " +
        by;
      // } else {
      //     notifText1 = item.fullName + " Checked In "
      // }
    } else if (tag === 21) {
      // if (item.inviteCode !== null) {
      notifText1 =
        item.fullName +
        " ( " +
        item.inviteCode.toString().trim() +
        " ) Checked Out by " +
        by;
      // } else {
      //     notifText1 = item.fullName + " Checked Out "
      // }
    } else if (tag === 2) {
      notifText1 =
        item.fullName +
        " ( " +
        item.inviteCode.toString().trim() +
        " ) Approved by " +
        by;
    } else if (tag === 3) {
      notifText1 =
        item.fullName +
        " ( " +
        item.inviteCode.toString().trim() +
        " ) Cancelled by " +
        by;
    } else if (tag === 4) {
      notifText1 =
        item.fullName +
        " ( " +
        item.inviteCode.toString().trim() +
        " ) Rescheduled by " +
        by;
    }
    var param = {
      notifText: notifText1,
      notifDate: Moment(moment.utc()).format("YYYY-MM-DDTHH:mm:ss"),
      userId: item.whomToMeet,
    };
    // this.props.SaveNotification(param);
  }
  getAllReceptionst(params1, tag) {
    this.props.ReceptionList.forEach((element) => {
      // console.log('Element => ', element);
      this.sendNotificationRec(params1, element, tag); // 5 = Approve
    });
  }
  async sendNotificationRec(params1, item, tag) {
    // tag = 5 = approve, 6 = reject, 7 = reschedule 8 = check in
    let by;
    // const {LoginDetails} = this.props;
    // // let this.props.LoginDetails.userRoleId = LoginDetails.userRoleId;

    // if (
    //   this.props.LoginDetails.userRoleId === 4 ||
    //   this.props.LoginDetails.userRoleId === 1
    // ) {
    //   by = this.props.LoginDetails.fullName;
    // } else if (this.props.LoginDetails.userRoleId === 3) {
    //   by = this.props.LoginDetails.fullName;
    // } else {
    //   by = this.props.LoginDetails.fullName;
    // }
    by = this.props.LoginDetails.fullName;

    var notifText1;
    if (tag === 5) {
      notifText1 =
        params1.fullName +
        " ( " +
        params1.inviteCode.toString().trim() +
        " ) Approved by " +
        by; //by Employee "
      // notifText1 = item.fullName  + " Approved"// by Employee "
    } else if (tag === 6) {
      notifText1 =
        params1.fullName +
        " ( " +
        params1.inviteCode.toString().trim() +
        " )  Cancelled by " +
        by; // by Employee "
    } else if (tag === 7) {
      notifText1 =
        params1.fullName +
        " ( " +
        params1.inviteCode.toString().trim() +
        " ) Rescheduled by " +
        by; // by Employee "
    } else if (tag === 8) {
      if (params1 !== "") {
        notifText1 =
          params1.fullName +
          " ( " +
          params1.inviteCode.toString().trim() +
          " ) Checked In by " +
          by; // by Employee "
      } else {
        notifText1 =
          params1.fullName +
          " ( " +
          params1.inviteCode.toString().trim() +
          " ) Checked In by " +
          by; // by Employee "
      }
    } else if (tag === 9) {
      notifText1 =
        params1.fullName +
        " ( " +
        params1.inviteCode.toString().trim() +
        " ) Checked Out by " +
        by; // by Employee "
    }
    var param = {
      notifText: notifText1,
      notifDate: Moment(moment.utc()).format("YYYY-MM-DDTHH:mm:ss"),
      userId: item.usrId,
    };
    // this.props.SaveNotification(param);
  }
  async empCheckIn(empId) {
    console.log("Emp Id:=", empId);
    const param = {
      EmpID: empId,
      UserId: this.props.LoginDetails.userID,
      IsArogyaSetu: this.state.isArogyaSetu,
      EmpTemp: this.state.Temperature,
    };
    console.log("Check In params=", param);
    this.props.EmpCheckIn(param, this.empCheckInSuccess);
  }
  empCheckInSuccess = (Response) => {
    console.log(Response);
    if (Response) {
      Toast.show(
        this.state.selectedEmployee.fullName + " is Check In successfully"
      );
      this.props.GetEmpCheckInList(
        this.props.LoginDetails.userID,
        this.getEmpCheckInListSuccess
      );
      this.setState({
        isArogyaSetu: false,
        Temperature: null,
        employeeCheckInOrOutModal: false,
      });
    } else {
      Toast.show(
        this.state.selectedEmployee.fullName + " is Check In Unsuccessfull !!!"
      );
    }
  };
  async empCheckOut(inOutId, empId) {
    const param = {
      InOutId: inOutId,
      EmpID: empId,
      UserId: this.props.LoginDetails.userID,
      IsArogyaSetu: this.state.isArogyaSetu,
      EmpTemp: this.state.Temperature,
    };
    this.props.EmpCheckOut(param, this.empCheckOutSuccess);
  }
  empCheckOutSuccess = (Response) => {
    if (Response) {
      Toast.show(
        this.state.selectedEmployee.fullName + " is Check Out successfully"
      );
      this.props.GetEmpCheckInList(
        this.props.LoginDetails.userID,
        this.getEmpCheckInListSuccess
      );
      this.setState({
        isArogyaSetu: false,
        Temperature: null,
        employeeCheckInOrOutModal: false,
      });
    } else {
      Toast.show(
        this.state.selectedEmployee.fullName + " is Check Out Unsuccessfull !!!"
      );
    }
  };
  // showTimePicker(tag) {
  //     if (tag === 1) {
  //         this.setState({ isExpectedInVisible: true, isExpectedOutVisible: false, isReschedualVisible: false })
  //     } else if (tag === 2) {
  //         if (this.state.Intime !== null) {
  //             this.setState({ isExpectedInVisible: false, isExpectedOutVisible: true, isReschedualVisible: false })
  //         } else {
  //             Toast.show("Please First Select In Time")
  //         }
  //     } else if (tag === 3) {
  //         this.setState({ isExpectedInVisible: false, isExpectedOutVisible: false, isReschedualVisible: true })
  //     }
  // }
  navigateFormScreen = async () => {
    try {
      var meet = false;
      // const {LoginDetails} = this.props;
      // let this.props.LoginDetails.userRoleId = LoginDetails.userRoleId;
      // console.log('ID:=', this.props.LoginDetails.userRoleId);
      // console.log('Log:=', this.props.LoginDetails.empID);

      let response = await axiosAuthGet(
        "Users/GetWhoomToMEet/" + this.props.LoginDetails.userID
      );
      // console.log('=====Response=====', response);
      if (
        this.props.LoginDetails.userRoleId === 2 ||
        this.props.LoginDetails.userRoleId === 3
      ) {
        this.props.mobileNo({ mobStatus: 0 });
        this.props.navigation.navigate("VisitorForm", { tag: 0 });
      } else {
        response = await response.filter((element) => {
          if (this.props.LoginDetails.empID === element.whomToMeet) {
            return element;
          }
        });
        // console.log('Meet:=', response);
        await response.filter((e) => {
          if (e.isVisitorAllow === true) {
            console.log("Allowed...");
            this.props.mobileNo({ mobStatus: 0 });
            this.props.navigation.navigate("VisitorForm", { tag: 0 });
          } else {
            Toast.show("You are Not Allowed to Invite Visitor.");
          }
        });
      }
    } catch (error) {}
  };
 async afterVizApproveSuccess(id,userId,empId,name) {
    var item=this.state.approveItem
    let respp=await axPost("Visitor/VizApprove/"+id+"/"+userId+"/"+empId+"/"+name)
    console.log("++++++++",respp);
    if (respp == true) {
      // this.props.navigation.goBack();
      Alert.alert(
        'Success',
        name + ' Approve successfully',
      );
      this.getData()

      // send only reception to emply
      if (this.props.LoginDetails.userRoleId === 3) {
        // this.sendNotification(this.state.VisitorDetails, 2);
      } else if (
        this.props.LoginDetails.userRoleId === 4 ||
        this.props.LoginDetails.userRoleId === 1
      ) {
        this.sendNotification(item, 2);
        // send notification to all reception
        // this.getAllReceptionst(this.state.VisitorDetails, 5);
      }
      this.props.onUpdate();

      // this.callApi(this.state.selectedList)
    } else {
      alert(fullName + ' Approve Unsuccessfull');
    }
  }
  
  render() {
    const headerDistance = Animated.diffClamp(
      this.state.curY,
      0,
      this.state.height + 70
    ).interpolate({
      inputRange: [0, 1],
      outputRange: [0, -1],
      extrapolate: "clamp",
    });
    // const {LoginDetails} = this.props;
    // let this.props.LoginDetails.userRoleId = LoginDetails.userRoleId;
    return (
      <TouchableWithoutFeedback onPress={() => this.drRef?.close()}>
        <View style={{ flex: 1, backgroundColor: COLORS.whitef4 }}>
          <View style={{ width: "100%",marginTop:Platform.OS=="ios"?-20:0, zIndex: 99 }}>
            <Header
              title={
                "Pending Invites"
              }
              navigation={this.props.navigation}
            />
          </View>
          <View style={{ flex: 1, width: "100%" }}>
            {/* <ScrollView ref={(c) => { this.scroll = c }} contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }} > */}
            <View
              style={{
                flex: 1,
                width: "100%",
                marginTop: 5,
                justifyContent: "center",
                zIndex: 99,
              }}
            >
              {/* {this.state.visitors ? this.ListofData() : this.employeList()} */}
              {this.ListofData()}
              {this.state.visitors ? (
                <View
                  style={{ position: "absolute", bottom: "0%", right: "4%" }}
                >
                  {/* <LinearGradient
                                    style={{ marginBottom: 13, justifyContent: "center", backgroundColor: COLORS.primary, borderRadius: 55 / 2, height: 55, width: 55, }}
                                    colors={[
                                        COLORS.primary,
                                        COLORS.third
                                    ]}
                                >
                                    <TouchableOpacity style={{}} onPress={() => this.filterOpen()}>
                                        <Image
                                            source={IMAGES.filter}
                                            style={{ alignSelf: 'center', marginTop: 7, tintColor: COLORS.white, width: 28, height: 28 }}
                                        /></TouchableOpacity></LinearGradient> */}
                 
                </View>
              ) : null}
            </View>
            {/* </ScrollView> */}

            {/* {this.props.LoginDetails.userRoleId === 4 ? this.meetOutModal() : null} */}
            {/* {this.skipCheckIn()} */}
            {this.state.skipModalCheckIn &&
              (console.log("Visitor Details is ==", this.state.VisitorDetails),
              (
                <CheckIn
                  skipModalCheckIn={this.state.skipModalCheckIn}
                  VisitorDetails={this.state.VisitorDetails}
                  imageBase64StringIdProof={this.state.imageBase64StringIdProof}
                  imageBase64StringPhotoProof={
                    this.state.imageBase64StringPhotoProof
                  }
                  onClose={() => {
                    this.setState({
                      VisitorDetails: visitorDetailEmpty,
                      skipModalCheckIn: false,
                      imageBase64StringPhotoProof: {
                        fileName: null,
                        data: null,
                      },
                      imageBase64StringIdProof: { fileName: null, data: null },
                    });
                  }}
                  onUpdate={() => this.callApi(this.state.selectedList)}
                />
              ))}
            {/* {console.log('Visitor Modal===', this.state.modalVisible)} */}
            {this.state.modalVisible ? (
              <VisitorDetails
                modalVisible={this.state.modalVisible}
                VisitorDetails={this.state.VisitorDetails}
                onClose={() =>
                  this.setState({
                    modalVisible: false,
                    VisitorDetails: visitorDetailEmpty,
                  })
                }
                onUpdate={() => this.callApi(this.state.selectedList)}
              />
            ) : null}

            {/* {this.state.VisitorDetails !== null && this.state.modalVisible ? this.modalVisitor() : null} */}
            {/* {this.rescheduleVisitiMiting()} */}
            {this.employeeCheckInOrOutModal()}
          </View>
          {this.state.show === true ? (
            <View
              style={{
                height: "100%",
                width: "100%",
                position: "absolute",
                zIndex: 99,
                paddingTop: 28,
              }}
            >
              {this.filterData()}
            </View>
          ) : null}
        </View>
      </TouchableWithoutFeedback>
    );
  }
  filterOpen() {
    this.setState((prevState) => ({
      show: !prevState.show,
    }));
  }
  filterData() {
    return (
      <View style={{ width: "100%", height: "100%", flexDirection: "row" }}>
        <View
          style={{
            padding: 10,
            backgroundColor: COLORS.white,
            width: "55%",
            height: null,
            paddingTop: 35,
          }}
        >
          <Text
            style={{
              fontSize: 18.5,
              fontWeight: "bold",
              color: COLORS.primary,
            }}
          >
            Sort By Visitor List
          </Text>
          <View style={{ padding: 4 }}>
            <TouchableOpacity
              onPress={() => this.onChangeValue(0)}
              style={{ alignItems: "center", flexDirection: "row" }}
            >
              <Image
                source={IMAGES.circle}
                style={{
                  tintColor: this.state.AllOpen
                    ? COLORS.primary
                    : COLORS.placeholderColor,
                  width: 13,
                  height: 13,
                  resizeMode: "contain",
                }}
              />
              <Text
                style={{
                  color: this.state.AllOpen ? COLORS.primary : COLORS.black,
                  padding: 7,
                  marginLeft: 7,
                  fontSize: 16,
                  fontWeight: "bold",
                  width: 150,
                }}
              >
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (this.state.AscOpen) {
                  this.setState({ AscOpen: false });
                } else {
                  this.setState({ AscOpen: true });
                }
                this.setState({
                  AllOpen: false,
                  findColor: "",
                  DescOpen: false,
                });
              }}
              style={{ alignItems: "center", flexDirection: "row" }}
            >
              <Image
                source={IMAGES.circle}
                style={{
                  tintColor: this.state.AscOpen
                    ? COLORS.primary
                    : COLORS.placeholderColor,
                  width: 13,
                  height: 13,
                  resizeMode: "contain",
                }}
              />
              <Text
                style={{
                  color: this.state.AscOpen ? COLORS.primary : COLORS.black,
                  padding: 7,
                  marginLeft: 7,
                  fontSize: 16,
                  fontWeight: "bold",
                  width: 150,
                }}
              >
                Ascending
              </Text>
            </TouchableOpacity>
            {this.state.AscOpen ? (
              <View
                style={{
                  marginLeft: 15,
                  width: "100%",
                  borderWidth: 1,
                  borderColor: "transparent",
                  height: null,
                }}
              >
                <TouchableOpacity
                  onPress={() => this.onChangeValue(1)}
                  style={{ alignItems: "center", flexDirection: "row" }}
                >
                  <Image
                    source={IMAGES.next}
                    style={{
                      transform: [{ rotate: "270deg" }],
                      tintColor:
                        this.state.findColor === 1
                          ? COLORS.fourth
                          : COLORS.placeholderColor,
                      width: 13,
                      height: 13,
                      resizeMode: "contain",
                    }}
                  />
                  <Text
                    style={{
                      color:
                        this.state.findColor === 1
                          ? COLORS.fourth
                          : COLORS.black,
                      padding: 7,
                      marginLeft: 7,
                      fontSize: 16,
                      fontWeight: "bold",
                      width: 100,
                    }}
                  >
                    Name
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.onChangeValue(3)}
                  style={{ alignItems: "center", flexDirection: "row" }}
                >
                  <Image
                    source={IMAGES.next}
                    style={{
                      transform: [{ rotate: "270deg" }],
                      tintColor:
                        this.state.findColor === 3
                          ? COLORS.fourth
                          : COLORS.placeholderColor,
                      width: 13,
                      height: 13,
                      resizeMode: "contain",
                    }}
                  />
                  <Text
                    style={{
                      color:
                        this.state.findColor === 3
                          ? COLORS.fourth
                          : COLORS.black,
                      padding: 7,
                      marginLeft: 7,
                      fontSize: 16,
                      fontWeight: "bold",
                      width: 100,
                    }}
                  >
                    Date
                  </Text>
                </TouchableOpacity>
                {this.props.LoginDetails.userRoleId !== 4 ||
                this.props.LoginDetails.userRoleId !== 1 ? (
                  <TouchableOpacity
                    onPress={() => this.onChangeValue(5)}
                    style={{ alignItems: "center", flexDirection: "row" }}
                  >
                    <Image
                      source={IMAGES.next}
                      style={{
                        transform: [{ rotate: "270deg" }],
                        tintColor:
                          this.state.findColor === 5
                            ? COLORS.fourth
                            : COLORS.placeholderColor,
                        width: 13,
                        height: 13,
                        resizeMode: "contain",
                      }}
                    />
                    <Text
                      style={{
                        color:
                          this.state.findColor === 5
                            ? COLORS.fourth
                            : COLORS.black,
                        padding: 7,
                        marginLeft: 7,
                        fontSize: 16,
                        fontWeight: "bold",
                        width: 150,
                      }}
                    >
                      Whom To Meet
                    </Text>
                  </TouchableOpacity>
                ) : null}
                {this.props.LoginDetails.userRoleId !== 2 ? (
                  <TouchableOpacity
                    onPress={() => this.onChangeValue(7)}
                    style={{ alignItems: "center", flexDirection: "row" }}
                  >
                    <Image
                      source={IMAGES.next}
                      style={{
                        transform: [{ rotate: "270deg" }],
                        tintColor:
                          this.state.findColor === 7
                            ? COLORS.fourth
                            : COLORS.placeholderColor,
                        width: 13,
                        height: 13,
                        resizeMode: "contain",
                      }}
                    />
                    <Text
                      style={{
                        color:
                          this.state.findColor === 7
                            ? COLORS.fourth
                            : COLORS.black,
                        padding: 7,
                        marginLeft: 7,
                        fontSize: 16,
                        fontWeight: "bold",
                        width: 100,
                      }}
                    >
                      Status
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            ) : null}
            <TouchableOpacity
              onPress={() => {
                if (this.state.DescOpen) {
                  this.setState({ DescOpen: false });
                } else {
                  this.setState({ DescOpen: true });
                }
                this.setState({
                  findColor: "",
                  AllOpen: false,
                  AscOpen: false,
                });
              }}
              style={{ alignItems: "center", flexDirection: "row" }}
            >
              <Image
                source={IMAGES.circle}
                style={{
                  tintColor: this.state.DescOpen
                    ? COLORS.primary
                    : COLORS.placeholderColor,
                  width: 13,
                  height: 13,
                  resizeMode: "contain",
                }}
              />
              <Text
                style={{
                  color: this.state.DescOpen ? COLORS.primary : COLORS.black,
                  padding: 7,
                  marginLeft: 7,
                  fontSize: 16,
                  fontWeight: "bold",
                  width: 150,
                }}
              >
                Descending
              </Text>
            </TouchableOpacity>
            {this.state.DescOpen ? (
              <View
                style={{
                  marginLeft: 15,
                  borderWidth: 1,
                  borderColor: "transparent",
                  width: "100%",
                  height: null,
                }}
              >
                <TouchableOpacity
                  onPress={() => this.onChangeValue(2)}
                  style={{ alignItems: "center", flexDirection: "row" }}
                >
                  <Image
                    source={IMAGES.next}
                    style={{
                      transform: [{ rotate: "270deg" }],
                      tintColor:
                        this.state.findColor === 2
                          ? COLORS.fourth
                          : COLORS.placeholderColor,
                      width: 13,
                      height: 13,
                      resizeMode: "contain",
                    }}
                  />
                  <Text
                    style={{
                      color:
                        this.state.findColor === 2
                          ? COLORS.fourth
                          : COLORS.black,
                      padding: 7,
                      marginLeft: 7,
                      fontSize: 16,
                      fontWeight: "bold",
                      width: 100,
                    }}
                  >
                    Name
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.onChangeValue(4)}
                  style={{ alignItems: "center", flexDirection: "row" }}
                >
                  <Image
                    source={IMAGES.next}
                    style={{
                      transform: [{ rotate: "270deg" }],
                      tintColor:
                        this.state.findColor === 4
                          ? COLORS.fourth
                          : COLORS.placeholderColor,
                      width: 13,
                      height: 13,
                      resizeMode: "contain",
                    }}
                  />
                  <Text
                    style={{
                      color:
                        this.state.findColor === 4
                          ? COLORS.fourth
                          : COLORS.black,
                      padding: 7,
                      marginLeft: 7,
                      fontSize: 16,
                      fontWeight: "bold",
                      width: 100,
                    }}
                  >
                    Date
                  </Text>
                </TouchableOpacity>
                {this.props.LoginDetails.userRoleId !== 4 ||
                this.props.LoginDetails.userRoleId !== 1 ? (
                  <TouchableOpacity
                    onPress={() => this.onChangeValue(6)}
                    style={{ alignItems: "center", flexDirection: "row" }}
                  >
                    <Image
                      source={IMAGES.next}
                      style={{
                        transform: [{ rotate: "270deg" }],
                        tintColor:
                          this.state.findColor === 6
                            ? COLORS.fourth
                            : COLORS.placeholderColor,
                        width: 13,
                        height: 13,
                        resizeMode: "contain",
                      }}
                    />
                    <Text
                      style={{
                        color:
                          this.state.findColor === 6
                            ? COLORS.fourth
                            : COLORS.black,
                        padding: 7,
                        marginLeft: 7,
                        fontSize: 16,
                        fontWeight: "bold",
                        width: 150,
                      }}
                    >
                      Whom To Meet
                    </Text>
                  </TouchableOpacity>
                ) : null}
                {this.props.LoginDetails.userRoleId !== 2 ? (
                  <TouchableOpacity
                    onPress={() => this.onChangeValue(8)}
                    style={{ alignItems: "center", flexDirection: "row" }}
                  >
                    <Image
                      source={IMAGES.next}
                      style={{
                        transform: [{ rotate: "270deg" }],
                        tintColor:
                          this.state.findColor === 8
                            ? COLORS.fourth
                            : COLORS.placeholderColor,
                        width: 13,
                        height: 13,
                        resizeMode: "contain",
                      }}
                    />
                    <Text
                      style={{
                        color:
                          this.state.findColor === 8
                            ? COLORS.fourth
                            : COLORS.black,
                        padding: 7,
                        marginLeft: 7,
                        fontSize: 16,
                        fontWeight: "bold",
                        width: 100,
                      }}
                    >
                      Status
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            ) : null}
          </View>
        </View>
        <TouchableWithoutFeedback
          style={{ height: "100%", width: "100%" }}
          onPress={() => this.setState({ show: false })}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(52, 52, 52, 0.8)",
            }}
          ></View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
  async onChangeValue(itemPosition) {
    // var visList=this.state.VisitorList.filter(item=>{
    //     return item.allData
    // })
    // console.log(fdate);
    var temp;
    if (itemPosition === 0) {
      this.setState((prevState) => ({
        AllOpen: !prevState.AllOpen,
        DescOpen: false,
        findColor: "",
        AscOpen: false,
      }));
      this.setState({ show: false });
      this.callApi(this.state.selectedList);
    } else if (itemPosition === 1) {
      this.setState({ findColor: 1, show: false });
      temp = this.state.VisitorList.sort(function (a, b) {
        return a.fullName.localeCompare(b.fullName);
      });
    } else if (itemPosition === 2) {
      this.setState({ findColor: 2, show: false });
      temp = this.state.VisitorList.sort(function (a, b) {
        return b.fullName.localeCompare(a.fullName);
      });
    } else if (itemPosition === 3) {
      this.setState({ findColor: 3, show: false });
      temp = this.state.VisitorList.sort(function (a, b) {
        return new Date(a.date) - new Date(b.date);
      });
    } else if (itemPosition === 4) {
      this.setState({ findColor: 4, show: false });
      temp = this.state.VisitorList.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
      });
    } else if (itemPosition === 5) {
      this.setState({ findColor: 5, show: false });
      temp = this.state.VisitorList.sort(function (a, b) {
        return a.whomToMeetName.localeCompare(b.whomToMeetName);
      });
    } else if (itemPosition === 6) {
      this.setState({ findColor: 6, show: false });
      temp = this.state.VisitorList.sort(function (a, b) {
        return b.whomToMeetName.localeCompare(a.whomToMeetName);
      });
    } else if (itemPosition === 7) {
      this.setState({ findColor: 7, show: false });
      temp = this.state.VisitorList.sort(function (a, b) {
        return a.statusNName.localeCompare(b.statusNName);
      });
    } else if (itemPosition === 8) {
      this.setState({ findColor: 8, show: false });
      temp = this.state.VisitorList.sort(function (a, b) {
        return b.statusNName.localeCompare(a.statusNName);
      });
    }
    // show: false,
    // this.state.VisitorList.filter(item=>{
    //     this.setState({date:item.date,allData:temp})
    // })
    this.setState({
      VisitorList: temp,
    });

    // this.setState({

    // })
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    padding: 5,
    flex: 1,
    marginRight: 5,
  },
  headerWrapper: {
    borderBottomColor: COLORS.white,
    height: 32,
    borderBottomWidth: 1,
    alignItems: "center",
  },
  boxText: {
    color: COLORS.white,
    fontSize: 12,
    textAlign: "center",
    alignSelf: "center",
  },
});

// const mapStateToProps = (state) => ({
//     // network: state.NetworkReducer.network,
//     // error: state.CommanReducer.error,
//     Update: state.CommanReducer.Update,
//     SubscriptionLimit: state.CommanReducer.SubscriptionLimit,
//     isLoading: state.CommanReducer.isLoading,
//     UserDetails: state.CommanReducer?.UserDetails,
//     LoginDetails: state.CommanReducer?.LoginDetails,
//     ReceptionData: state.CommanReducer?.ReceptionData,
//     VisitorList: state.VisitorsReducer?.VisitorList,
//     EmployeeList: state.EmployeReducer?.EmployeeList,
//     ReceptionList: state.CommanReducer?.ReceptionList,
//     AllSettings: state.CommanReducer?.AllSettings,
// });
// const mapDispatchToProps = (dispatch) => ({
// GetRecpDashboard: (param) => dispatch(Fetch('Users/GetRecpDashboard', 'GET', param, serviceActionReceptionData)),
// EmpVisitorList: (userID, empID, onSuccess,) => dispatch(Fetch('Visitor/EmpVisitorList', 'GET', userID + "/" + empID, serviceActionVisitors, onSuccess)),
// GetVisitorForGateKeeper: (userID, onSuccess) => dispatch(Fetch('Visitor/GetVisitorForGateKeeper', 'GET', userID, serviceActionVisitors, onSuccess)),
// GetVisitorForReception: (userID, onSuccess) => dispatch(Fetch('Visitor/GetVisitorForReception', 'GET', userID, serviceActionVisitors, onSuccess)),
// GetVisitorForReceptionUPcomming: (userID, onSuccess) => dispatch(Fetch('Visitor/GetVisitorForReceptionUPcomming', 'GET', userID, serviceActionVisitors, onSuccess)),
// GetVisitorForReceptionCompleted: (userID, onSuccess) => dispatch(Fetch('Visitor/GetVisitorForReceptionCompleted', 'GET', userID, serviceActionVisitors, onSuccess)),
// GetVisitorForReceptionWaiting: (userID, onSuccess) => dispatch(Fetch('Visitor/GetVisitorForReceptionWaiting', 'GET', userID, serviceActionVisitors, onSuccess)),
// GetEmpCheckInList: (param, onSuccess) => dispatch(Fetch('Users/GetEmpCheckInList', 'GET', param, serviceActionEmployeeList, onSuccess)),
// GetAllSettings: (userID) => dispatch(Fetch('Settings/GetAllSettings', 'GET', userID, serviceActionGetAllSettings)),
// CheckOut: (inoutid, onSuccess) => dispatch(Fetch('Visitor/CheckOut/' + inoutid, 'POST', undefined, onSuccess)),
// Update: (Update) => dispatch(serviceActionUpdate(Update)),
// SaveNotification: (param) => dispatch(Fetch('Notification/SaveNotification', 'POST', param)),
// GetReceptionList: (userID) => dispatch(Fetch('Users/GetReceptionList', 'GET', userID, serviceActionReceptionList)),
// EmpCheckOut: (param, onSuccess) => dispatch(Fetch('Users/EmpCheckOut', 'POST', param,  undefined,onSuccess)),
// EmpCheckIn: (param, onSuccess) => dispatch(Fetch('Users/EmpCheckIn', 'POST', param, undefined, onSuccess)),
// ChkSubscriptionLimit: (userID) => dispatch(Fetch('Visitor/ChkSubscriptionLimit', 'GET', userID, serviceActionSubscriptionLimit)),
// })

export default connect(mapStateToProps, mapDispatchToProps)(PendingInvitesScreen);
