import { Picker } from "@react-native-community/picker";
import Moment from "moment";
import RadioButtonRN from "radio-buttons-react-native";
import React from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Contacts from "react-native-contacts";
import DatePicker from "react-native-datepicker";
import DateTimePicker from "@react-native-community/datetimepicker";

import DropDownPicker from "react-native-dropdown-picker";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import ImgToBase64 from "react-native-image-base64";
import LinearGradient from "react-native-linear-gradient";
// import DateTimePicker from 'react-native-modal-datetime-picker';
import SimpleToast from "react-native-simple-toast";
import Toast from "react-native-simple-toast";
import { Hoshi } from "react-native-textinput-effects";
import { connect } from "react-redux";
import { COLORS, IMAGES } from "../../Assets";
import {
  mapDispatchToProps,
  mapStateToProps,
} from "../../Reducers/ApiClass.js";
import { axiosAuthGet } from "../../utility/apiConnection";
import { randomColor, visitorDetailEmpty } from "../../utility/emptyClass";
import Images from "../../Assets/Images";
import ImageResizer from "react-native-image-resizer";
import moment from "moment";
// import DatePicker from 'react-native-date-picker'

const placeholderTextColor = COLORS.placeholderColor;
const data = [
  {
    label: "Invite",
  },
  {
    label: "Check In",
  },
];
const items = [
  // name key is must. It is to show the text in front
  { id: 1, name: "angellist" },
  { id: 2, name: "codepen" },
  { id: 3, name: "envelope" },
  { id: 4, name: "etsy" },
  { id: 5, name: "facebook" },
  { id: 6, name: "foursquare" },
  { id: 7, name: "github-alt" },
  { id: 8, name: "github" },
  { id: 9, name: "gitlab" },
  { id: 10, name: "instagram" },
];
class VisitorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      VisitorDetails:
        this.props.route.params.VisitorDetails != undefined
          ? this.props.route.params.VisitorDetails
          : visitorDetailEmpty,
      enable: this.props.route.params.tag == 2 ? false : true,
      imageBase64StringPhotoProof: { fileName: null, data: null },
      imageBase64StringIdProof: { fileName: null, data: null },
      invite: this.props.LoginDetails.userRoleId == 3 ? false : true,
      vAddlCol1Error: "",
      vAddlCol2Error: "",
      vAddlCol3Error: "",
      vAddlCol4Error: "",
      DisplyName: ["uk"],
      vAddlCol5Error: "",
      mobileError: "",
      emailError: "",
      contactNoModal: false,
      contactsList: [],
      masterContactList: [],
      whomToMeet: [],
      AllImages: [],
      AllImagesUrl: [],
      imagePath: "",
      idProofPath: "",
      nameList: [],
      date: Platform.OS == "android" ? null : new Date(),
      time: null,
      mode: "date",
      show: false,
      Outdate: Platform.OS == "android" ? null : new Date(),
      Outtime: null,
      Outmode: "date",
      Outshow: false,
    };
  }
  whomToMeetSuccess = (res) => this.afterwhomToMeetSuccess(res);
  afterwhomToMeetSuccess(res) {
    console.log("Without Filter===", res);
    res = res.filter((element) => {
      return element.isVisitorAllow == true;
    });
    const whomToMeet = res.map((v) => ({ label: v.name, value: v.whomToMeet }));
    console.log("whomToMeet", res);

    this.setState({ whomToMeet });
  }
  async componentDidMount() {
    this.props.ChkSubscriptionLimit(this.props.LoginDetails.userID);
    this.props.GetAllSettings(this.props.LoginDetails.userID);
    this.props.GetWhoomToMEet(
      this.props.LoginDetails.userID,
      this.whomToMeetSuccess
    );
    // this.props.GetReceptionList(this.props.LoginDetails.userID)
    // if (this.props.route.params.tag == 1) {
    //     this.props.GetVisitorDtls(this.state.VisitorDetails.inOutId, this.getVisitorDtlsSuccess)
    // }
    console.log(
      "this.props.route.params.tag == 2",
      this.props.route.params.VisitorDetails
    );
    var VisitorDetails;
    if (
      this.props.route.params.tag == 0 &&
      this.props.LoginDetails.userRoleId != 2
    ) {
      if (
        this.props.LoginDetails.userRoleId == 4 ||
        this.props.LoginDetails.userRoleId == 1
      ) {
        VisitorDetails = Object.assign({}, this.state.VisitorDetails, {
          department: this.props.UserDetails.department,
          date: null,
          inTime: null,
        });
      } else {
        VisitorDetails = Object.assign({}, this.state.VisitorDetails, {
          date: null,
          inTime: null,
        });
      }
      this.setState({ VisitorDetails });
    } 
    else if (this.props.route.params.tag == 2) {
      var VisitorDetails = Object.assign({}, this.state.VisitorDetails, {
        date: this.state.VisitorDetails.date
          ? Moment(this.state.VisitorDetails.date).format("DD-MM-YYYY")
          : null,
        inTime: this.state.VisitorDetails.inTime
          ? Moment(this.state.VisitorDetails.inTime).format("HH:mm:ss")
          : null,
        outTime: this.state.VisitorDetails.inTime
          ? Moment(this.state.VisitorDetails.outTime).format("HH:mm:ss")
          : null,
      });
      this.setState({ VisitorDetails });
    }
    console.log("Mobile Details===", this.props.LoginDetails);

    if (this.props.MobileNo?.mobStatus == 1) {
      // this.setState({invite:true})
      try {
        let res = await axiosAuthGet(
          "Visitor/GetVisitorByMobile/" + this.props.MobileNo.mob+"/"+this.props.LoginDetails.orgID
        );
        console.log("Mobile Details===", res.fullName);
        if (res.isBlock != true) {
          this.props.GetVisitorByMobile(
            this.props.MobileNo.mob+"/"+this.props.LoginDetails.orgID,
            this.getVisitorByMobileSuccess
          );
        } else {
          alert("This User is Blocked");
          Alert.alert(
            "Alert ",
            "This User is Blocked",
            [
              { text: "OK", onPress: () => this.props.navigation.goBack() }
            ]
          );
          // SimpleToast.show('This User is Blocked')
          this.clearRefresh();
          const VisitorDetailss = Object.assign({}, this.state.VisitorDetails, {
            mobile: "",
          });
          this.setState({ VisitorDetails: VisitorDetailss, });
          // mobile = '';
        }
      } catch (error) {}
    }
  }
  getVisitorDtlsSuccess = (VisitorDetails) => this.setState({ VisitorDetails });
  onChangeeee = (event, selectedValue) => {
    var VisitorDetails = Object.assign({}, this.state.VisitorDetails, {
      inTime: Moment(selectedValue).format("MM-DD-YYYY hh:mm:ss a"),
    });

    this.setState({
      VisitorDetails,
      date: selectedValue,
    });
    console.log(
      "Datetime==",
      Moment(selectedValue).format("MM-DD-YYYY hh:mm:ss a")
    );
  };

  onChange = (event, selectedValue) => {
    console.log(selectedValue);
    // this.setState({show: Platform.OS == 'ios'});
    if (this.state.mode == "date") {
      const currentDate = selectedValue || new Date();
      this.setState({
        date: currentDate,
        mode: "time",
        // show: Platform.OS != 'ios',
      });
      console.log(currentDate);
    } else {
      var inTime = selectedValue || new Date();
      // Toast.show('Please select valid In Time');
      var currentTime = new Date().getTime();

      if (inTime >= currentTime) {
        this.setState({
          time: inTime,
          mode: "date",
          show: false,
        });
      } else {
        this.setState({
          time: currentTime,
          mode: "date",
          show: false,
        });
      }
      // this.setState({ time: selectedTime, mode: 'date', show: Platform.OS == 'ios' })

      // this.state.getSelectedDate = outTime
    }
    var VisitorDetails = Object.assign({}, this.state.VisitorDetails, {
      inTime:
        Moment(this.state.date).format("MM-DD-YYYY") +
        " " +
        Moment(this.state.time).format("hh:mm:ss a"),
    });
    console.log("In Time=======", VisitorDetails);

    // Toast.show('Please select valid In Time');
    this.setState({ VisitorDetails });
  };

  showMode = (currentMode) => {
    this.setState({ show: true, mode: currentMode });
  };

  showDatepicker = () => {
    this.setState({ date: new Date(), time: new Date() });
    this.showMode("date");
  };

  onOutChangeeee = (event, selectedValue) => {
    var VisitorDetails = Object.assign({}, this.state.VisitorDetails, {
      outTime: Moment(selectedValue).format("MM-DD-YYYY hh:mm:ss a"),
    });
    this.setState({
      VisitorDetails,
      Outdate: selectedValue,
      // isExpectedOutVisible: false,
    });
  };
  OutonChange = (event, selectedValue) => {
    // console.log("out Date",selectedValue.getTime()+"===="+this.state.date.getTime());
    // this.setState({Outshow: Platform.OS == 'ios'});
    if (this.state.Outmode == "date") {
      var currentDate = selectedValue || new Date();
      var c = moment(currentDate).format("DD-MM-YYYY");
      var d = moment(this.state.date).format("DD-MM-YYYY");
      if (c.toString() >= d.toString()) {
        this.setState({
          Outdate: currentDate,
          Outmode: "time",
          // Outshow: Platform.OS != 'ios',
        });
      } else {
        this.setState({
          Outdate: this.state.date,
          Outmode: "time",
          // Outshow: Platform.OS != 'ios',
        });
        Toast.show("Please Select Valid Date.");
      }
      console.log(currentDate);
    } else {
      var outTime = selectedValue || new Date();
      if (outTime >= this.state.time) {
        this.setState({
          Outtime: outTime,
          Outmode: "date",
          Outshow: false,
        });
        var VisitorDetails = Object.assign({}, this.state.VisitorDetails, {
          outTime:
            Moment(this.state.Outdate).format("MM-DD-YYYY") +
            " " +
            Moment(outTime).format("hh:mm:ss a"),
        });
        this.setState({
          VisitorDetails,
          // isExpectedOutVisible: false,
        });
      } else {
        this.setState({
          Outtime: this.state.Outdate,
          Outmode: "date",
          Outshow: false,
        });
        var VisitorDetails = Object.assign({}, this.state.VisitorDetails, {
          outTime:
            Moment(this.state.Outdate).format("MM-DD-YYYY") +
            " " +
            moment(this.state.Outdate).format("hh:mm:ss a"),
        });
        this.setState({
          VisitorDetails,
          // isExpectedOutVisible: false,
        });
        Toast.show("Please select valid Out Time");
      }
    }
    // var VisitorDetails = Object.assign({}, this.state.VisitorDetails, {
    //   outTime:
    //     Moment(this.state.Outdate).format('MM-DD-YYYY') +
    //     ' ' +
    //     Moment(outTime).format('hh:mm:ss a'),
    // });
    // this.setState({
    //   VisitorDetails,
    //   // isExpectedOutVisible: false,
    // });
    // console.log('out time====', VisitorDetails);
  };

  OutshowMode = (currentMode) => {
    this.setState({ Outshow: true, Outmode: currentMode });
  };

  OutshowDatepicker = () => {
    this.setState({ Outdate: new Date(), Outtime: new Date() });

    this.OutshowMode("date");
  };
  render() {
    return (
      <View
        style={{ width: "100%", height: "100%", backgroundColor: COLORS.white }}
      >
        <StatusBar
          barStyle={"dark-content"}
          backgroundColor="transparent"
          translucent={true}
        />
        <LinearGradient
          style={{
            height: Platform.OS == "ios" ? "12%" : "10%",
            paddingTop: 25,
            width: "100%",
            justifyContent: "center",
          }}
          colors={[COLORS.primary, COLORS.third]}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: Platform.OS == "ios" ? 17 : 5,
            }}
          >
            <TouchableOpacity
              style={{
                marginLeft: 10,
                padding: 10,
                height: 50,
                width: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => this.props.navigation.goBack()}
            >
              <Image source={IMAGES.back} style={{ height: 22, width: 22 }} />
            </TouchableOpacity>
            <Text
              style={{
                color: "white",
                textAlign: "center",
                paddingLeft: 20,
                padding: 5,
                fontSize: 22,
              }}
            >
              {this.props.route.params.tag == 0 &&
              this.props.LoginDetails.userRoleId == 2
                ? "Check In Visitor"
                : "Invite Visitor"}
            </Text>
          </View>
        </LinearGradient>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ padding: 12 }}>
            {this.props.SubscriptionLimit > 0 ? (
              <Text style={styles.error}>{"Subsctription Limit cross"}</Text>
            ) : null}
            {this.props.LoginDetails.userRoleId == 3 &&
            this.props.route.params.tag != 3 ? (
              <RadioButtonRN
                style={{ flexDirection: "row", flex: 1 }}
                boxStyle={{ flex: 1, margin: 5 }}
                textStyle={{ paddingLeft: 5 }}
                data={data}
                initial={
                  this.props.MobileNo?.mobStatus == 1
                    ? 1
                    : this.props.LoginDetails.userRoleId == 3
                    ? 2
                    : 1
                }
                selectedBtn={(e) => {
                  if (e.label == "Invite") {
                    this.setState({ invite: true });
                  } else {
                    var VisitorDetails = Object.assign(
                      {},
                      this.state.VisitorDetails,
                      {
                        date: new Date(),
                        inTime: new Date(),
                      }
                    );
                    this.setState({ invite: false, VisitorDetails });
                  }
                }}
              />
            ) : null}
            {
              <View style={{ width: "100%" }}>
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    backgroundColor:
                      this.props.route.params.tag != 2
                        ? COLORS.white
                        : COLORS.whiteE0,
                  }}
                >
                  <Hoshi
                    editable={
                      this.props.route.params.tag == 2 ||
                      this.props.MobileNo?.mobStatus == 1
                        ? false
                        : true
                    }
                    ref={(mobile) => {
                      this.mobile = mobile;
                    }}
                    //
                    style={[styles.textInputStyle, { flexGrow: 1 }]}
                    ref={(el) => {
                      this.mobile = el;
                    }}
                    
                    onChange={(mob)=>console.log(mob.nativeEvent.text)}
                    onChangeText={(mobile) => this.onChangeNumber(mobile)}
                    onSubmitEditing={(mobile) => {
                      this.onChanged(mobile.nativeEvent.text);
                      // console.log(mobile.nativeEvent.text);
                    }}
                    keyboardType={"phone-pad"}
                    maxLength={15}
                    value={
                      this.props.MobileNo?.mobStatus == 1
                        ? this.props.MobileNo.mob
                        : this.state.VisitorDetails.mobile
                    }
                    label="Mobile*"
                  returnKeyType={Platform.OS=="android"?"next":"done"}
                  />

                  {/* {Platform.OS === 'android' && this.props.LoginDetails.userRoleId !== 2 ? <TouchableOpacity onPress={() => { */}
                  {this.props.LoginDetails.userRoleId !== 2 &&
                  this.props.MobileNo?.mobStatus != 1 ? (
                    <TouchableOpacity
                      onPress={() => {
                        this.getContactNo();
                      }}
                    >
                      <Image
                        source={IMAGES.phonebook}
                        style={{
                          left: 2,
                          top: 10,
                          height: 28,
                          width: 28,
                          tintColor: COLORS.primary,
                          resizeMode: "contain",
                        }}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
                {this.state.mobileError != "" ? (
                  <Text style={styles.error}>{this.state.mobileError}</Text>
                ) : null}
              </View>
            }

            {
              <View
                style={{
                  backgroundColor: this.state.enable
                    ? COLORS.white
                    : COLORS.whiteE0,
                }}
              >
                <Hoshi
                  editable={this.state.enable}
                  style={[styles.textInputStyle]}
                  ref={(el) => {
                    this.fullName = el;
                  }}
                  onChangeText={(fullName) => this.onChangedName(fullName)}
                  value={this.state.VisitorDetails.fullName}
                  label="Full Name*"
                  returnKeyType={"next"}
                />
              </View>
            }

            <FlatList
              data={this.state.nameList}
              style={{}}
              // refreshing={this.state.setRefreshing}
              // onRefresh={() => this.handleRefresh()}
              // inverted={true}
              contentContainerStyle={{}}
              // initialScrollIndex={this.state.courierDetails.length - 1}
              renderItem={({ item }) => (
                <View
                  style={{
                    marginTop: 5,
                    marginBottom: 5,
                    width: "100%",
                    // justifyContent: 'center',
                    // alignItems: 'center',
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      // console.log(item.mobile);
                      this.onChanged(item.mobile),
                        this.setState({ nameList: [] });
                    }}
                  >
                    <Text>{item.label}</Text>
                  </TouchableOpacity>
                </View>
              )}
            />

            {this.props.AllSettings.settingsVM.vCompany ? (
              <View style={{ backgroundColor: COLORS.white }}>
                <Hoshi
                  ref={(company) => {
                    this.company = company;
                  }}
                  style={[styles.textInputStyle]}
                  ref={(el) => {
                    this.company = el;
                  }}
                  onChangeText={(company) => {
                    const VisitorDetails = Object.assign(
                      {},
                      this.state.VisitorDetails,
                      { company: company }
                    );
                    this.setState({ VisitorDetails });
                  }}
                  editable={true}
                  value={this.state.VisitorDetails.company}
                  label="Company Name"
                  returnKeyType={"next"}
                />
              </View>
            ) : null}

            {this.props.AllSettings.settingsVM.vEmail ? (
              <View style={{ backgroundColor: COLORS.white }}>
                <Hoshi
                  editable={true}
                  ref={(email) => {
                    this.email = email;
                  }}
                  style={[styles.textInputStyle]}
                  ref={(el) => {
                    this.email = el;
                  }}
                  onChangeText={(email) => {
                    var emailError;
                    if (this.validate(email)) {
                      emailError = "";
                    } else {
                      emailError = "Enter Valid Email Ex:abc@gmail.com";
                    }
                    const VisitorDetails = Object.assign(
                      {},
                      this.state.VisitorDetails,
                      { email: email }
                    );
                    this.setState({ VisitorDetails, emailError });
                  }}
                  value={this.state.VisitorDetails.email}
                  label="E-Mail"
                  returnKeyType={"next"}
                />
                {this.state.emailError != "" ? (
                  <Text style={styles.error}>{this.state.emailError}</Text>
                ) : null}
              </View>
            ) : null}

            {this.props.AllSettings.settingsVM.vAddress ? (
              <View style={{ backgroundColor: COLORS.white }}>
                <Hoshi
                  editable={true}
                  ref={(address) => {
                    this.address = address;
                  }}
                  style={[styles.textInputStyle]}
                  ref={(el) => {
                    this.address = el;
                  }}
                  onChangeText={(address) => {
                    const VisitorDetails = Object.assign(
                      {},
                      this.state.VisitorDetails,
                      { address: address }
                    );
                    this.setState({ VisitorDetails });
                  }}
                  value={this.state.VisitorDetails.address}
                  label="Address"
                  returnKeyType={"next"}
                />
              </View>
            ) : null}
            <View
              style={{
                width: "100%",
                backgroundColor:
                  this.props.route.params.tag != 2
                    ? COLORS.white
                    : COLORS.whiteE0,
              }}
            >
              {(this.props.LoginDetails.userRoleId == 3 ||
                this.props.LoginDetails.userRoleId == 4 ||
                this.props.LoginDetails.userRoleId == 1 ||
                this.props.route.params.tag == 2) &&
              this.state.invite ? (
                <View style={{}}>
                  {Platform.OS == "android" ? (
                    <View>
                      <TouchableOpacity
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginRight: 5,
                        }}
                        onPress={() => this.showDatepicker()}
                      >
                        <Hoshi
                          editable={false}
                          disabled={
                            this.props.route.params.tag == 2 ? true : false
                          }
                          style={{
                            color: COLORS.black,
                            borderBottomWidth: 1,
                            borderBottomColor: COLORS.black,
                            flexGrow: 1,
                            marginRight: 10,
                          }}
                          label="Expected In Time*"
                          value={
                            this.state.date != null &&
                            Moment(this.state.date).format("DD-MM-YYYY") +
                              "  " +
                              moment(this.state.time).format("hh:mm:ss a")
                          }
                        />
                        {this.state.show && (
                          <DateTimePicker
                            testID="dateTimePicker"
                            style={{ width: "100%", backgroundColor: "white" }} //add this
                            // style={{ height: 55, paddingTop: 10 }}
                            timeZoneOffsetInMinutes={0}
                            value={this.state.date}
                            minimumDate={new Date()}
                            // maximumDate={Moment().add(2, 'month')}
                            mode={this.state.mode}
                            is24Hour={true}
                            display="default"
                            onChange={this.onChange}
                          />
                        )}
                        <Image
                          source={Images.clock}
                          style={{ height: 28, width: 32 }}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View
                      style={{
                        alignItems: "flex-start",
                        marginTop: 10,
                        borderBottomWidth: 1,
                        justifyContent: "flex-start",
                      }}
                    >
                      <Text>Expected In Time*:-</Text>
                      <DateTimePicker
                        // testID="dateTimePicker"
                        // style={{ backgroundColor: "white"}} //add this
                        style={{
                          height: 60,
                          alignSelf: "center",
                          marginRight: 50,
                          borderRadius: 50,
                          marginLeft: 12,
                          width: "80%",
                        }}
                        // timeZoneOffsetInMinutes={0}
                        value={this.state.date}
                        minimumDate={new Date()}
                        // maximumDate={Moment().add(2, 'month')}
                        mode="datetime"
                        // is24Hour={true}
                        display="default"
                        onChange={this.onChangeeee}
                      />
                    </View>
                  )}
                </View>
              ) : // <DatePicker
              //   disabled={this.props.route.params.tag == 2 ? true : false}
              //   style={styles.datepicker}
              //   date={this.state.VisitorDetails.date}
              //   mode="date"
              //   label="Select Date*"
              //   format="DD-MM-YYYY"
              //   minDate={Moment().format('DD-MM-YYYY')}
              //   maxDate={Moment().add(2, 'month').format('DD-MM-YYYY')}
              //   confirmBtnText="Confirm"
              //   cancelBtnText="Cancel"
              //   customStyles={{
              //     dateInput: styles.dateInput,
              //     dateIcon: {
              //       right: 0,
              //       top: 4,
              //     },
              //     dateText: {
              //       alignSelf: 'flex-start',
              //     },
              //     placeholderText: {
              //       alignSelf: 'flex-start',
              //       color: placeholderTextColor,
              //     },
              //     // ... You can check the source to find the other keys.
              //   }}
              //   onDateChange={date => {
              //     this.state.VisitorDetails.inTime = Moment();
              //     this.state.VisitorDetails.outTime = null;
              //     var VisitorDetails = Object.assign(
              //       {},
              //       this.state.VisitorDetails,
              //       {date},
              //     );
              //     this.setState({VisitorDetails});
              //   }}
              // />
              null}
              {/* {(this.props.LoginDetails.userRoleId == 3 ||
                this.props.LoginDetails.userRoleId == 4 ||
                this.props.LoginDetails.userRoleId == 1 ||
                this.props.LoginDetails.userRoleId == 1 ||
                this.props.route.params.tag == 2) &&
              this.state.invite ? (
               

                <View style={{flex: 1, flexDirection: 'column', width: '100%'}}>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={{flexDirection: 'row', width: '100%'}}
                    disabled={this.props.route.params.tag == 2 ? true : false}
                    onPress={() => this.showTimePicker(1)}>
                    <Hoshi
                      editable={false}
                      style={{
                        color: COLORS.black,
                        borderBottomWidth: 1,
                        borderBottomColor: COLORS.black,
                        flexGrow: 1,
                        marginRight: 10,
                      }}
                      ref={el => {
                        this.dateTime = el;
                      }}
                      label="Expected In Time*"
                      value={this.state.VisitorDetails.inTime}
                    />

                    <Image
                      source={Images.clock}
                      style={{right: 5, top: 10, height: 28, width: 32}}
                    />
                  </TouchableOpacity>
                  {/* {
                    this.state.isExpectedInVisible && (
                      <DateTimePicker
                        mode={'time'}
                        format="HH:mm:ss"
                        ref={el => {
                          this.inTime = el;
                        }}
                        isVisible={this.state.isExpectedInVisible}
                        value={this.state.VisitorDetails.inTime}
                        onConfirm={inTime => {
                          var resDate;
                          if (this.state.VisitorDetails.date != null) {
                            resDate = this.getParsedDate1(
                              this.state.VisitorDetails.date +
                                ' ' +
                                Moment(inTime).format('HH:mm:ss'),
                            );
                            var finalDat =
                              resDate + 'T' + Moment(inTime).format('HH:mm:ss');
                            var today = new Date();
                            var dd = today.getDate();
                            var mm = today.getMonth() + 1;
                            var yyyy = today.getFullYear();
                            var d =
                              this.addZero(dd) +
                              '-' +
                              this.addZero(mm) +
                              '-' +
                              this.addZero(yyyy);
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

                            if (
                              new Date(finalDat).getTime() >
                              new Date(t3).getTime()
                            ) {
                              if (this.state.VisitorDetails.outTime != null) {
                                var resDate1 = this.getParsedDate1(
                                  this.state.VisitorDetails.date +
                                    ' ' +
                                    this.state.VisitorDetails.outTime,
                                );

                                var finalIn =
                                  resDate1 +
                                  'T' +
                                  this.state.VisitorDetails.outTime;

                                if (
                                  new Date(finalDat).getTime() <
                                  new Date(finalIn).getTime()
                                ) {
                                  inTime = Moment(inTime).format('HH:mm:ss');
                                  var VisitorDetails = Object.assign(
                                    {},
                                    this.state.VisitorDetails,
                                    {inTime: inTime},
                                  );

                                  this.setState({
                                    VisitorDetails,
                                    isExpectedInVisible: false,
                                  });
                                } else {
                                  var VisitorDetails = Object.assign(
                                    {},
                                    this.state.VisitorDetails,
                                    {inTime: null},
                                  );

                                  this.setState({VisitorDetails});
                                  Toast.show('Please select valid In Time222');
                                }
                              } else {
                                inTime = Moment(inTime).format('HH:mm:ss');
                                var VisitorDetails = Object.assign(
                                  {},
                                  this.state.VisitorDetails,
                                  {inTime: inTime},
                                );
                                this.setState({
                                  VisitorDetails,
                                  isExpectedInVisible: false,
                                });
                                // this.state.getSelectedDate = outTime
                              }
                            } else {
                              this.state.VisitorDetails.inTime = null;
                              Toast.show('Please select valid In Time');
                            }
                          } else {
                            inTime = Moment(inTime).format('HH:mm:ss');
                            var VisitorDetails = Object.assign(
                              {},
                              this.state.VisitorDetails,
                              {inTime: inTime},
                            );
                            this.setState({
                              VisitorDetails,
                              isExpectedInVisible: false,
                            });
                            // this.state.getSelectedDate = outTime
                          }
                        }}
                        onCancel={() => {
                          this.setState({
                            isExpectedInVisible: false,
                          });
                        }}
                      />
                    )
                    // : null
                  } */}
              {/* </View>
              ) : null} */}

              {(this.props.LoginDetails.userRoleId == 3 ||
                this.props.LoginDetails.userRoleId == 4 ||
                this.props.LoginDetails.userRoleId == 1) &&
              this.state.invite ? (
                <View style={{}}>
                  {Platform.OS == "android" ? (
                    <View>
                      <TouchableOpacity
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginRight: 5,
                        }}
                        onPress={() => this.OutshowDatepicker()}
                      >
                        <Hoshi
                          editable={false}
                          style={{
                            color: COLORS.black,
                            borderBottomWidth: 1,
                            borderBottomColor: COLORS.black,
                            flexGrow: 1,
                            marginRight: 10,
                          }}
                          label="Expected Out Time"
                          value={
                            this.state.Outdate != null &&
                            Moment(this.state.Outdate).format("DD-MM-YYYY") +
                              "  " +
                              Moment(this.state.Outtime).format("hh:mm:ss a")
                          }
                        />
                        {this.state.Outshow && (
                          <DateTimePicker
                            testID="dateTimePicker"
                            // style={{ height: 55, paddingTop: 10 }}
                            timeZoneOffsetInMinutes={0}
                            value={this.state.Outdate}
                            minimumDate={this.state.date}
                            // maximumDate={Moment().add(2, 'month')}
                            mode={this.state.Outmode}
                            is24Hour={true}
                            display="default"
                            onChange={this.OutonChange}
                          />
                        )}

                        <Image
                          source={Images.clock}
                          style={{ height: 28, width: 32 }}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View
                      style={{
                        marginTop: 10,
                        alignItems: "flex-start",
                        borderBottomWidth: 1,
                        justifyContent: "flex-start",
                      }}
                    >
                      <Text>Expected Out Time*:</Text>
                      <DateTimePicker
                        // testID="dateTimePicker"
                        // style={{ backgroundColor: "white"}} //add this
                        style={{
                          height: 60,
                          alignSelf: "center",
                          marginRight: 50,
                          borderRadius: 50,
                          marginLeft: 12,
                          width: "80%",
                        }}
                        // timeZoneOffsetInMinutes={0}
                        value={this.state.Outdate}
                        minimumDate={this.state.date}
                        // maximumDate={Moment().add(2, 'month')}
                        mode="datetime"
                        // is24Hour={true}
                        display="default"
                        onChange={this.onOutChangeeee}
                      />
                    </View>
                  )}
                </View>
              ) : // <View style={{flex: 1, flexDirection: 'column', width: '100%'}}>
              //   <TouchableOpacity
              //     activeOpacity={1}
              //     style={{flexDirection: 'row', width: '100%'}}
              //     onPress={() => this.showTimePicker(2)}>
              //     <Hoshi
              //       editable={false}
              //       style={{
              //         color: COLORS.black,
              //         borderBottomWidth: 1,
              //         borderBottomColor: COLORS.black,
              //         flexGrow: 1,
              //         marginRight: 10,
              //       }}
              //       label="Expected Out Time"
              //       value={this.state.VisitorDetails.outTime}
              //     />

              //     <Image
              //       source={IMAGES.clock}
              //       style={{right: 5, top: 10, height: 28, width: 32}}
              //     />
              //   </TouchableOpacity>

              //   {this.state.isExpectedOutVisible && (
              //     <DateTimePicker
              //       mode={'time'}
              //       format="HH:mm:ss"
              //       ref={el => {
              //         this.outTime = el;
              //       }}
              //       isVisible={this.state.isExpectedOutVisible}
              //       value={this.state.VisitorDetails.outTime}
              //       onConfirm={outTime => {
              //         if (this.state.VisitorDetails.inTime != null) {
              //           var resDate1;
              //           var resDate = this.getParsedDate1(
              //             this.state.VisitorDetails.date +
              //               ' ' +
              //               Moment(outTime).format('HH:mm:ss'),
              //           );
              //           var finalDat =
              //             resDate + 'T' + Moment(outTime).format('HH:mm:ss');
              //           var today = new Date();
              //           var dd = today.getDate();
              //           var mm = today.getMonth() + 1;
              //           var yyyy = today.getFullYear();
              //           var d =
              //             this.addZero(dd) +
              //             '-' +
              //             this.addZero(mm) +
              //             '-' +
              //             this.addZero(yyyy);
              //           var temp = this.getParsedDate1(d);
              //           let date1 = new Date();
              //           let hours = date1.getHours();
              //           let minutes = date1.getMinutes();
              //           let seconds = date1.getSeconds();
              //           var t3 =
              //             temp +
              //             'T' +
              //             this.addZero(hours) +
              //             ':' +
              //             this.addZero(minutes) +
              //             ':' +
              //             this.addZero(seconds);
              //           if (
              //             new Date(finalDat).getTime() >
              //             new Date(t3).getTime()
              //           ) {
              //             if (this.state.VisitorDetails.inTime != null) {
              //               resDate1 = this.getParsedDate1(
              //                 this.state.VisitorDetails.date +
              //                   ' ' +
              //                   this.state.VisitorDetails.inTime,
              //               );

              //               var finalIn =
              //                 resDate1 +
              //                 'T' +
              //                 this.state.VisitorDetails.inTime;
              //               if (
              //                 new Date(finalDat).getTime() >
              //                 new Date(finalIn).getTime()
              //               ) {
              //                 outTime = Moment(outTime).format('HH:mm:ss');
              //                 var VisitorDetails = Object.assign(
              //                   {},
              //                   this.state.VisitorDetails,
              //                   {outTime: outTime},
              //                 );
              //                 this.setState({
              //                   VisitorDetails,
              //                   isExpectedOutVisible: false,
              //                 });
              //               } else {
              //                 var VisitorDetails = Object.assign(
              //                   {},
              //                   this.state.VisitorDetails,
              //                   {outTime: null},
              //                 );
              //                 this.setState({VisitorDetails});
              //                 Toast.show(
              //                   'Out time must be greater than In time ',
              //                 );
              //               }
              //             } else {
              //               outTime = Moment(outTime).format('HH:mm:ss');
              //               var VisitorDetails = Object.assign(
              //                 {},
              //                 this.state.VisitorDetails,
              //                 {outTime: outTime},
              //               );
              //               this.setState({
              //                 VisitorDetails,
              //                 isExpectedOutVisible: false,
              //               });
              //             }
              //           } else {
              //             var VisitorDetails = Object.assign(
              //               {},
              //               this.state.VisitorDetails,
              //               {outTime: null},
              //             );
              //             this.setState({VisitorDetails});
              //             Toast.show(
              //               'Out time must be greater than In time ',
              //             );
              //           }
              //         } else {
              //           outTime = Moment(outTime).format('HH:mm:ss');
              //           var VisitorDetails = Object.assign(
              //             {},
              //             this.state.VisitorDetails,
              //             {outTime: outTime},
              //           );
              //           this.setState({
              //             VisitorDetails,
              //             isExpectedOutVisible: false,
              //           });
              //         }
              //       }}
              //       onCancel={() =>
              //         this.setState({
              //           isExpectedOutVisible: false,
              //         })
              //       }
              //     />
              //   )}
              // </View>
              null}
            </View>
            {this.props.AllSettings.settingsVM.vDesignation ? (
              <View style={{ backgroundColor: COLORS.white }}>
                <Hoshi
                  ref={(designation) => {
                    this.designation = designation;
                  }}
                  style={[styles.textInputStyle]}
                  ref={(el) => {
                    this.designation = el;
                  }}
                  onChangeText={(designation) => {
                    const VisitorDetails = Object.assign(
                      {},
                      this.state.VisitorDetails,
                      { designation: designation }
                    );
                    this.setState({ VisitorDetails });
                  }}
                  editable={true}
                  value={this.state.VisitorDetails.designation}
                  label="Designation"
                  returnKeyType={"next"}
                />
              </View>
            ) : null}
            {this.props.LoginDetails.userRoleId !== 4 &&
            this.props.LoginDetails.userRoleId !== 1 ? (
              <View
                style={{
                  backgroundColor:
                    this.props.route.params.tag != 2
                      ? COLORS.white
                      : COLORS.whiteE0,
                  justifyContent: "space-around",
                  overflow: "hidden",
                  borderBottomColor:
                    this.state.VisitorDetails.whomToMeet == null ||
                    this.state.VisitorDetails.whomToMeet == 0
                      ? COLORS.black
                      : "green",
                  borderBottomWidth: 1,
                }}
              >
                {
                  <DropDownPicker
                    items={this.state.whomToMeet}
                    defaultValue={
                      this.state.whomToMeet.length > 0
                        ? this.state.VisitorDetails.whomToMeet
                        : undefined
                    }
                    disabled={this.props.route.params.tag == 2 ? true : false}
                    placeholder={"Whom to Meet*"}
                    placeholderStyle={{ color: "#6a7989", fontSize: 15 }}
                    searchable={true}
                    searchablePlaceholder="Search Whom to meet"
                    containerStyle={{ backgroundColor: "#fff" }}
                    dropDownStyle={{ position: "relative", maxHeight: 300 }}
                    style={{
                      right: this.props.route.params.tag == 2 ? 0 : 7,
                      backgroundColor:
                        this.props.route.params.tag == 2
                          ? COLORS.whiteE0
                          : "#fff",
                      height: 55,
                    }}
                    itemStyle={{
                      justifyContent: "flex-start",
                    }}
                    selectedLabelStyle={{
                      right: this.props.route.params.tag != 2 ? 0 : 7,
                      color: "#6a7989",
                      fontWeight:
                        this.props.route.params.tag == 2 ? "bold" : null,
                      fontSize: 18,
                    }}
                    onChangeItem={(item) => {
                      console.log("item: ", item);
                      if (item != undefined) {
                        const VisitorDetails = Object.assign(
                          {},
                          this.state.VisitorDetails,
                          {
                            whomToMeetName: item.label,
                            whomToMeet: item.value,
                          }
                        );
                        this.setState({ VisitorDetails });
                        this.props.GetUsersDetails1(
                          item.value,
                          this.getDepartmentSuccess
                        );
                      }
                    }}
                  />
                }
              </View>
            ) : (
              this.props.LoginDetails.isApprover == true &&
              this.props.LoginDetails.userRoleId !== 1 && (
                <View
                  style={{
                    backgroundColor:
                      this.props.route.params.tag != 2
                        ? COLORS.white
                        : COLORS.whiteE0,
                    justifyContent: "space-around",
                    overflow: "hidden",
                    borderBottomColor:
                      this.state.VisitorDetails.whomToMeet == null ||
                      this.state.VisitorDetails.whomToMeet == 0
                        ? COLORS.black
                        : "green",
                    borderBottomWidth: 1,
                  }}
                >
                  {
                    <DropDownPicker
                      items={this.state.whomToMeet}
                      defaultValue={
                        this.state.whomToMeet.length > 0
                          ? this.state.VisitorDetails.whomToMeet
                          : undefined
                      }
                      disabled={this.props.route.params.tag == 2 ? true : false}
                      placeholder={"Whom to Meet*"}
                      placeholderStyle={{ color: "#6a7989", fontSize: 15 }}
                      searchable={true}
                      searchablePlaceholder="Search Whom to meet"
                      containerStyle={{ backgroundColor: "#fff" }}
                      dropDownStyle={{ position: "relative", maxHeight: 300 }}
                      style={{
                        right: this.props.route.params.tag == 2 ? 0 : 7,
                        backgroundColor:
                          this.props.route.params.tag == 2
                            ? COLORS.whiteE0
                            : "#fff",
                        height: 55,
                      }}
                      itemStyle={{
                        justifyContent: "flex-start",
                      }}
                      selectedLabelStyle={{
                        right: this.props.route.params.tag != 2 ? 0 : 7,
                        color: "#6a7989",
                        fontWeight:
                          this.props.route.params.tag == 2 ? "bold" : null,
                        fontSize: 18,
                      }}
                      onChangeItem={(item) => {
                        console.log("item: ", item);
                        if (item != undefined) {
                          const VisitorDetails = Object.assign(
                            {},
                            this.state.VisitorDetails,
                            {
                              whomToMeetName: item.label,
                              whomToMeet: item.value,
                            }
                          );
                          this.setState({ VisitorDetails });
                          this.props.GetUsersDetails1(
                            item.value,
                            this.getDepartmentSuccess
                          );
                        }
                      }}
                    />
                  }
                </View>
              )
            )}

            {!this.props.AdminSwitch &&
            this.props.LoginDetails.userRoleId === 1 &&
            this.props.LoginDetails.isApprover == true ? (
              <View
                style={{
                  backgroundColor:
                    this.props.route.params.tag != 2
                      ? COLORS.white
                      : COLORS.whiteE0,
                  justifyContent: "space-around",
                  overflow: "hidden",
                  borderBottomColor:
                    this.state.VisitorDetails.whomToMeet == null ||
                    this.state.VisitorDetails.whomToMeet == 0
                      ? COLORS.black
                      : "green",
                  borderBottomWidth: 1,
                }}
              >
                {
                  <DropDownPicker
                    items={this.state.whomToMeet}
                    defaultValue={
                      this.state.whomToMeet.length > 0
                        ? this.state.VisitorDetails.whomToMeet
                        : undefined
                    }
                    disabled={this.props.route.params.tag == 2 ? true : false}
                    placeholder={"Whom to Meet*"}
                    placeholderStyle={{ color: "#6a7989", fontSize: 15 }}
                    searchable={true}
                    searchablePlaceholder="Search Whom to meet"
                    containerStyle={{ backgroundColor: "#fff" }}
                    dropDownStyle={{ position: "relative", maxHeight: 300 }}
                    style={{
                      right: this.props.route.params.tag == 2 ? 0 : 7,
                      backgroundColor:
                        this.props.route.params.tag == 2
                          ? COLORS.whiteE0
                          : "#fff",
                      height: 55,
                    }}
                    itemStyle={{
                      justifyContent: "flex-start",
                    }}
                    selectedLabelStyle={{
                      right: this.props.route.params.tag != 2 ? 0 : 7,
                      color: "#6a7989",
                      fontWeight:
                        this.props.route.params.tag == 2 ? "bold" : null,
                      fontSize: 18,
                    }}
                    onChangeItem={(item) => {
                      console.log("item: ", item);
                      if (item != undefined) {
                        const VisitorDetails = Object.assign(
                          {},
                          this.state.VisitorDetails,
                          {
                            whomToMeetName: item.label,
                            whomToMeet: item.value,
                          }
                        );
                        this.setState({ VisitorDetails });
                        this.props.GetUsersDetails1(
                          item.value,
                          this.getDepartmentSuccess
                        );
                      }
                    }}
                  />
                }
              </View>
            ) : this.props.AdminSwitch &&
              this.props.LoginDetails.userRoleId === 1 &&
              this.props.LoginDetails.isApprover == true ? (
              <View
                style={{
                  backgroundColor:
                    this.props.route.params.tag != 2
                      ? COLORS.white
                      : COLORS.whiteE0,
                  justifyContent: "space-around",
                  overflow: "hidden",
                  borderBottomColor:
                    this.state.VisitorDetails.whomToMeet == null ||
                    this.state.VisitorDetails.whomToMeet == 0
                      ? COLORS.black
                      : "green",
                  borderBottomWidth: 1,
                }}
              >
                {
                  <DropDownPicker
                    items={this.state.whomToMeet}
                    defaultValue={
                      this.state.whomToMeet.length > 0
                        ? this.state.VisitorDetails.whomToMeet
                        : undefined
                    }
                    disabled={this.props.route.params.tag == 2 ? true : false}
                    placeholder={"Whom to Meet*"}
                    placeholderStyle={{ color: "#6a7989", fontSize: 15 }}
                    searchable={true}
                    searchablePlaceholder="Search Whom to meet"
                    containerStyle={{ backgroundColor: "#fff" }}
                    dropDownStyle={{ position: "relative", maxHeight: 300 }}
                    style={{
                      right: this.props.route.params.tag == 2 ? 0 : 7,
                      backgroundColor:
                        this.props.route.params.tag == 2
                          ? COLORS.whiteE0
                          : "#fff",
                      height: 55,
                    }}
                    itemStyle={{
                      justifyContent: "flex-start",
                    }}
                    selectedLabelStyle={{
                      right: this.props.route.params.tag != 2 ? 0 : 7,
                      color: "#6a7989",
                      fontWeight:
                        this.props.route.params.tag == 2 ? "bold" : null,
                      fontSize: 18,
                    }}
                    onChangeItem={(item) => {
                      console.log("item: ", item);
                      if (item != undefined) {
                        const VisitorDetails = Object.assign(
                          {},
                          this.state.VisitorDetails,
                          {
                            whomToMeetName: item.label,
                            whomToMeet: item.value,
                          }
                        );
                        this.setState({ VisitorDetails });
                        this.props.GetUsersDetails1(
                          item.value,
                          this.getDepartmentSuccess
                        );
                      }
                    }}
                  />
                }
              </View>
            ) : (
              !this.props.AdminSwitch &&
              this.props.LoginDetails.userRoleId === 1 &&
               (
                <View
                  style={{
                    backgroundColor:
                      this.props.route.params.tag != 2
                        ? COLORS.white
                        : COLORS.whiteE0,
                    justifyContent: "space-around",
                    overflow: "hidden",
                    borderBottomColor:
                      this.state.VisitorDetails.whomToMeet == null ||
                      this.state.VisitorDetails.whomToMeet == 0
                        ? COLORS.black
                        : "green",
                    borderBottomWidth: 1,
                  }}
                >
                  {
                    <DropDownPicker
                      items={this.state.whomToMeet}
                      defaultValue={
                        this.state.whomToMeet.length > 0
                          ? this.state.VisitorDetails.whomToMeet
                          : undefined
                      }
                      disabled={this.props.route.params.tag == 2 ? true : false}
                      placeholder={"Whom to Meet*"}
                      placeholderStyle={{ color: "#6a7989", fontSize: 15 }}
                      searchable={true}
                      searchablePlaceholder="Search Whom to meet"
                      containerStyle={{ backgroundColor: "#fff" }}
                      dropDownStyle={{ position: "relative", maxHeight: 300 }}
                      style={{
                        right: this.props.route.params.tag == 2 ? 0 : 7,
                        backgroundColor:
                          this.props.route.params.tag == 2
                            ? COLORS.whiteE0
                            : "#fff",
                        height: 55,
                      }}
                      itemStyle={{
                        justifyContent: "flex-start",
                      }}
                      selectedLabelStyle={{
                        right: this.props.route.params.tag != 2 ? 0 : 7,
                        color: "#6a7989",
                        fontWeight:
                          this.props.route.params.tag == 2 ? "bold" : null,
                        fontSize: 18,
                      }}
                      onChangeItem={(item) => {
                        console.log("item: ", item);
                        if (item != undefined) {
                          const VisitorDetails = Object.assign(
                            {},
                            this.state.VisitorDetails,
                            {
                              whomToMeetName: item.label,
                              whomToMeet: item.value,
                            }
                          );
                          this.setState({ VisitorDetails });
                          this.props.GetUsersDetails1(
                            item.value,
                            this.getDepartmentSuccess
                          );
                        }
                      }}
                    />
                  }
                </View>
              )
            )}
            {this.props.AllSettings.settingsVM.vDepartment ? (
              <View
                style={{
                  backgroundColor:
                    this.props.route.params.tag != 2
                      ? COLORS.white
                      : COLORS.whiteE0,
                }}
              >
                <Hoshi
                  editable={false}
                  ref={(department) => {
                    this.department = department;
                  }}
                  style={
                    ([styles.textInputStyle],
                    {
                      backgroundColor:
                        this.props.route.params.tag != 2
                          ? COLORS.white
                          : COLORS.whiteE0,
                    })
                  }
                  ref={(el) => {
                    this.department = el;
                  }}
                  onChangeText={(department) => {
                    const VisitorDetails = Object.assign(
                      {},
                      this.state.VisitorDetails,
                      { department: department }
                    );
                    this.setState({ VisitorDetails });
                  }}
                  value={this.state.VisitorDetails.department}
                  label="Department To Visit"
                  returnKeyType={"next"}
                />
              </View>
            ) : null}
            {this.props.AllSettings.settingsVM.vPurpose ? (
              <View style={{ backgroundColor: COLORS.white }}>
                <Hoshi
                  ref={(purpose) => {
                    this.purpose = purpose;
                  }}
                  returnKeyType={"done"}
                  editable={true}
                  style={[styles.textInputStyle]}
                  ref={(el) => {
                    this.purpose = el;
                  }}
                  onChangeText={(purpose) => {
                    const VisitorDetails = Object.assign(
                      {},
                      this.state.VisitorDetails,
                      { purpose: purpose }
                    );
                    this.setState({ VisitorDetails });
                  }}
                  value={this.state.VisitorDetails.purpose}
                  label="Purpose*"
                />
              </View>
            ) : null}

            {this.props.AllSettings.settingsVM.vAddlCol1 &&
            this.props.AllSettings.mappingVM.col1 != null ? (
              this.props.AllSettings.mappingVM.valCol1 != 5 ? (
                <View style={{ backgroundColor: COLORS.white }}>
                  <Hoshi
                    editable={true}
                    returnKeyType={"done"}
                    keyboardType={
                      this.props.AllSettings.mappingVM.valCol1 == 2 ||
                      this.props.AllSettings.mappingVM.valCol1 == 4
                        ? "phone-pad"
                        : "default"
                    }
                    maxLength={
                      this.props.AllSettings.mappingVM.valCol1 == 4 ? 10 : 100
                    }
                    style={[styles.textInputStyle]}
                    ref={(el) => {
                      this.purpose = el;
                    }}
                    onChangeText={(text) => {
                      var VisitorDetails,
                        vAddlCol1Error = "",
                        value = text;
                      if (this.props.AllSettings.mappingVM.valCol1 == 3) {
                        if (this.validate(text)) {
                          vAddlCol1Error = "";
                        } else {
                          vAddlCol1Error = "Enter Valid Email Ex:abc@gmail.com";
                        }
                        value = text;
                      } else if (
                        this.props.AllSettings.mappingVM.valCol1 == 4 ||
                        this.props.AllSettings.mappingVM.valCol1 == 2
                      ) {
                        if (
                          this.props.AllSettings.mappingVM.valCol1 == 4 &&
                          this.state.VisitorDetails.addlCol1?.length !== 9
                        )
                          vAddlCol1Error = "Please enter valid mobile";
                        else vAddlCol1Error = "";
                        value = text.replace(
                          /[- #*;,.+<>N()\{\}\[\]\\\/]/gi,
                          ""
                        );
                      }

                      VisitorDetails = Object.assign(
                        {},
                        this.state.VisitorDetails,
                        { addlCol1: value }
                      );
                      this.setState({ VisitorDetails, vAddlCol1Error });
                    }}
                    value={this.state.VisitorDetails.addlCol1}
                    label={this.props.AllSettings.mappingVM.col1}
                  />
                  {this.state.vAddlCol1Error != "" ? (
                    <Text style={styles.error}>
                      {this.state.vAddlCol1Error}
                    </Text>
                  ) : null}
                </View>
              ) : (
                <View
                  style={[
                    styles.switchContainer,
                    {
                      // backgroundColor: this.state.enable
                      //   ? COLORS.white
                      //   : COLORS.whiteE0,
                    },
                  ]}
                >
                  <Text style={styles.switchLable}>
                    {this.props.AllSettings.mappingVM.col1}
                  </Text>
                  <View style={styles.switch}>
                    <Switch
                      // disabled={!this.state.enable}
                      onValueChange={(value) => {
                        var VisitorDetails = Object.assign(
                          {},
                          this.state.VisitorDetails,
                          { addlCol1: value }
                        );
                        this.setState({ VisitorDetails });
                      }}
                      value={
                        this.state.VisitorDetails.addlCol1 == "true"
                          ? true
                          : this.state.VisitorDetails.addlCol1
                      }
                    />
                  </View>
                </View>
              )
            ) : null}
            {this.props.AllSettings.settingsVM.vAddlCol2 &&
            this.props.AllSettings.mappingVM.col2 != null ? (
              this.props.AllSettings.mappingVM.valCol2 != 5 ? (
                <View style={{ backgroundColor: COLORS.white }}>
                  <Hoshi
                    editable={true}
                    returnKeyType={"done"}
                    keyboardType={
                      this.props.AllSettings.mappingVM.valCol2 == 2 ||
                      this.props.AllSettings.mappingVM.valCol2 == 4
                        ? "phone-pad"
                        : "default"
                    }
                    maxLength={
                      this.props.AllSettings.mappingVM.valCol2 == 4 ? 10 : 100
                    }
                    style={[styles.textInputStyle]}
                    ref={(el) => {
                      this.purpose = el;
                    }}
                    onChangeText={(text) => {
                      var VisitorDetails,
                        vAddlCol2Error = "",
                        value = text;
                      if (this.props.AllSettings.mappingVM.valCol2 == 3) {
                        if (this.validate(text)) {
                          vAddlCol2Error = "";
                        } else {
                          vAddlCol2Error = "Enter Valid Email Ex:abc@gmail.com";
                        }
                        value = text;
                      } else if (
                        this.props.AllSettings.mappingVM.valCol2 == 4 ||
                        this.props.AllSettings.mappingVM.valCol2 == 2
                      ) {
                        if (
                          this.props.AllSettings.mappingVM.valCol2 == 4 &&
                          this.state.VisitorDetails.addlCol2?.length !== 9
                        )
                          vAddlCol2Error = "Please enter valid mobile";
                        else vAddlCol2Error = "";
                        value = text.replace(
                          /[- #*;,.+<>N()\{\}\[\]\\\/]/gi,
                          ""
                        );
                      }

                      VisitorDetails = Object.assign(
                        {},
                        this.state.VisitorDetails,
                        { addlCol2: value }
                      );
                      this.setState({ VisitorDetails, vAddlCol2Error });
                    }}
                    value={this.state.VisitorDetails.addlCol2}
                    label={this.props.AllSettings.mappingVM.col2}
                  />
                  {this.state.vAddlCol2Error != "" ? (
                    <Text style={styles.error}>
                      {this.state.vAddlCol2Error}
                    </Text>
                  ) : null}
                </View>
              ) : (
                <View
                  style={[
                    styles.switchContainer,
                    {
                      // backgroundColor: this.state.enable
                      //   ? COLORS.white
                      //   : COLORS.whiteE0,
                    },
                  ]}
                >
                  <Text style={styles.switchLable}>
                    {this.props.AllSettings.mappingVM.col2}
                  </Text>
                  <View style={styles.switch}>
                    <Switch
                      // disabled={!this.state.enable}
                      onValueChange={(value) => {
                        var VisitorDetails = Object.assign(
                          {},
                          this.state.VisitorDetails,
                          { addlCol2: value }
                        );
                        this.setState({ VisitorDetails });
                      }}
                      value={
                        this.state.VisitorDetails.addlCol2 == "true"
                          ? true
                          : this.state.VisitorDetails.addlCol2
                      }
                    />
                  </View>
                </View>
              )
            ) : null}
            {this.props.AllSettings.settingsVM.vAddlCol3 &&
            this.props.AllSettings.mappingVM.col3 != null ? (
              this.props.AllSettings.mappingVM.valCol3 != 5 ? (
                <View style={{ backgroundColor: COLORS.white }}>
                  <Hoshi
                    editable={true}
                    returnKeyType={"done"}
                    keyboardType={
                      this.props.AllSettings.mappingVM.valCol3 == 2 ||
                      this.props.AllSettings.mappingVM.valCol3 == 4
                        ? "phone-pad"
                        : "default"
                    }
                    maxLength={
                      this.props.AllSettings.mappingVM.valCol3 == 4 ? 10 : 100
                    }
                    style={[styles.textInputStyle]}
                    ref={(el) => {
                      this.purpose = el;
                    }}
                    onChangeText={(text) => {
                      var VisitorDetails,
                        vAddlCol3Error = "",
                        value = text;
                      if (this.props.AllSettings.mappingVM.valCol3 == 3) {
                        if (this.validate(text)) {
                          vAddlCol3Error = "";
                        } else {
                          vAddlCol3Error = "Enter Valid Email Ex:abc@gmail.com";
                        }
                        value = text;
                      } else if (
                        this.props.AllSettings.mappingVM.valCol3 == 4 ||
                        this.props.AllSettings.mappingVM.valCol3 == 2
                      ) {
                        if (
                          this.props.AllSettings.mappingVM.valCol3 == 4 &&
                          this.state.VisitorDetails.addlCol3?.length !== 9
                        )
                          vAddlCol3Error = "Please enter valid mobile";
                        else vAddlCol3Error = "";
                        value = text.replace(
                          /[- #*;,.+<>N()\{\}\[\]\\\/]/gi,
                          ""
                        );
                      }

                      VisitorDetails = Object.assign(
                        {},
                        this.state.VisitorDetails,
                        { addlCol3: value }
                      );
                      this.setState({ VisitorDetails, vAddlCol3Error });
                    }}
                    value={this.state.VisitorDetails.addlCol3}
                    label={this.props.AllSettings.mappingVM.col3}
                  />
                  {this.state.vAddlCol3Error != "" ? (
                    <Text style={styles.error}>
                      {this.state.vAddlCol3Error}
                    </Text>
                  ) : null}
                </View>
              ) : (
                <View
                  style={[
                    styles.switchContainer,
                    {
                      // backgroundColor: this.state.enable
                      //   ? COLORS.white
                      //   : COLORS.whiteE0,
                    },
                  ]}
                >
                  <Text style={styles.switchLable}>
                    {this.props.AllSettings.mappingVM.col3}
                  </Text>
                  <View style={styles.switch}>
                    <Switch
                      // disabled={!this.state.enable}
                      onValueChange={(value) => {
                        var VisitorDetails = Object.assign(
                          {},
                          this.state.VisitorDetails,
                          { addlCol3: value }
                        );
                        this.setState({ VisitorDetails });
                      }}
                      value={
                        this.state.VisitorDetails.addlCol3 === "true"
                          ? true
                          : this.state.VisitorDetails.addlCol3
                      }
                    />
                  </View>
                </View>
              )
            ) : null}
            {this.props.AllSettings.settingsVM.vAddlCol4 &&
            this.props.AllSettings.mappingVM.col4 != null ? (
              this.props.AllSettings.mappingVM.valCol4 != 5 ? (
                <View style={{ backgroundColor: COLORS.white }}>
                  <Hoshi
                    editable={true}
                    returnKeyType={"done"}
                    keyboardType={
                      this.props.AllSettings.mappingVM.valCol4 == 2 ||
                      this.props.AllSettings.mappingVM.valCol4 == 4
                        ? "phone-pad"
                        : "default"
                    }
                    maxLength={
                      this.props.AllSettings.mappingVM.valCol4 == 4 ? 10 : 100
                    }
                    style={[styles.textInputStyle]}
                    ref={(el) => {
                      this.purpose = el;
                    }}
                    onChangeText={(text) => {
                      var VisitorDetails,
                        vAddlCol4Error = "",
                        value = text;
                      if (this.props.AllSettings.mappingVM.valCol4 == 3) {
                        if (this.validate(text)) {
                          vAddlCol4Error = "";
                        } else {
                          vAddlCol4Error = "Enter Valid Email Ex:abc@gmail.com";
                        }
                        value = text;
                      } else if (
                        this.props.AllSettings.mappingVM.valCol4 == 4 ||
                        this.props.AllSettings.mappingVM.valCol4 == 2
                      ) {
                        if (
                          this.props.AllSettings.mappingVM.valCol4 == 4 &&
                          this.state.VisitorDetails.addlCol4?.length !== 9
                        )
                          vAddlCol4Error = "Please enter valid mobile";
                        else vAddlCol4Error = "";
                        value = text.replace(
                          /[- #*;,.+<>N()\{\}\[\]\\\/]/gi,
                          ""
                        );
                      }

                      VisitorDetails = Object.assign(
                        {},
                        this.state.VisitorDetails,
                        { addlCol4: value }
                      );
                      this.setState({ VisitorDetails, vAddlCol4Error });
                    }}
                    value={this.state.VisitorDetails.addlCol4}
                    label={this.props.AllSettings.mappingVM.col4}
                  />
                  {this.state.vAddlCol4Error != "" ? (
                    <Text style={styles.error}>
                      {this.state.vAddlCol4Error}
                    </Text>
                  ) : null}
                </View>
              ) : (
                <View
                  style={[
                    styles.switchContainer,
                    {
                      // backgroundColor: this.state.enable
                      //   ? COLORS.white
                      //   : COLORS.whiteE0,
                    },
                  ]}
                >
                  <Text style={styles.switchLable}>
                    {this.props.AllSettings.mappingVM.col4}
                  </Text>
                  <View style={styles.switch}>
                    <Switch
                      // disabled={!this.state.enable}
                      onValueChange={(value) => {
                        var VisitorDetails = Object.assign(
                          {},
                          this.state.VisitorDetails,
                          { addlCol4: value }
                        );
                        this.setState({ VisitorDetails });
                      }}
                      value={
                        this.state.VisitorDetails.addlCol4 === "true"
                          ? true
                          : this.state.VisitorDetails.addlCol4
                      }
                    />
                  </View>
                </View>
              )
            ) : null}
            {this.props.AllSettings.settingsVM.vAddlCol5 &&
            this.props.AllSettings.mappingVM.col5 != null ? (
              this.props.AllSettings.mappingVM.valCol5 != 5 ? (
                <View style={{ backgroundColor: COLORS.white }}>
                  <Hoshi
                    editable={true}
                    returnKeyType={"done"}
                    keyboardType={
                      this.props.AllSettings.mappingVM.valCol5 == 2 ||
                      this.props.AllSettings.mappingVM.valCol5 == 4
                        ? "phone-pad"
                        : "default"
                    }
                    maxLength={
                      this.props.AllSettings.mappingVM.valCol5 == 4 ? 10 : 100
                    }
                    style={[styles.textInputStyle]}
                    ref={(el) => {
                      this.purpose = el;
                    }}
                    onChangeText={(text) => {
                      var VisitorDetails,
                        vAddlCol5Error = "",
                        value = text;
                      if (this.props.AllSettings.mappingVM.valCol5 == 3) {
                        if (this.validate(text)) {
                          vAddlCol5Error = "";
                        } else {
                          vAddlCol5Error = "Enter Valid Email Ex:abc@gmail.com";
                        }
                        value = text;
                      } else if (
                        this.props.AllSettings.mappingVM.valCol5 == 4 ||
                        this.props.AllSettings.mappingVM.valCol5 == 2
                      ) {
                        if (
                          this.props.AllSettings.mappingVM.valCol5 == 4 &&
                          this.state.VisitorDetails.addlCol5?.length !== 9
                        )
                          vAddlCol5Error = "Please enter valid mobile";
                        else vAddlCol5Error = "";
                        value = text.replace(
                          /[- #*;,.+<>N()\{\}\[\]\\\/]/gi,
                          ""
                        );
                      }

                      VisitorDetails = Object.assign(
                        {},
                        this.state.VisitorDetails,
                        { addlCol5: value }
                      );
                      this.setState({ VisitorDetails, vAddlCol5Error });
                    }}
                    value={this.state.VisitorDetails.addlCol5}
                    label={this.props.AllSettings.mappingVM.col5}
                  />
                  {this.state.vAddlCol5Error != "" ? (
                    <Text style={styles.error}>
                      {this.state.vAddlCol5Error}
                    </Text>
                  ) : null}
                </View>
              ) : (
                <View
                  style={[
                    styles.switchContainer,
                    { backgroundColor: COLORS.white },
                  ]}
                >
                  <Text style={styles.switchLable}>
                    {this.props.AllSettings.mappingVM.col5}
                  </Text>
                  <View style={styles.switch}>
                    <Switch
                      disabled={false}
                      onValueChange={(value) => {
                        var VisitorDetails = Object.assign(
                          {},
                          this.state.VisitorDetails,
                          { addlCol5: value }
                        );
                        this.setState({ VisitorDetails });
                      }}
                      value={
                        this.state.VisitorDetails.addlCol5 == "true"
                          ? true
                          : this.state.VisitorDetails.addlCol5
                      }
                    />
                  </View>
                </View>
              )
            ) : null}
            {this.props.LoginDetails.userRoleId == 3 ||
            this.props.LoginDetails.userRoleId == 4 ||
            this.props.LoginDetails.userRoleId == 1 ? (
              <View
                style={[
                  styles.switchContainer,
                  { backgroundColor: COLORS.white },
                ]}
              >
                <Text style={styles.switchLable}>{"VIP"}</Text>
                <View style={styles.switch}>
                  <Switch
                    disabled={false}
                    onValueChange={(isVip) => {
                      console.log("ISVip", isVip);
                      var VisitorDetails = Object.assign(
                        {},
                        this.state.VisitorDetails,
                        { isVip }
                      );
                      this.setState({ VisitorDetails });
                    }}
                    value={this.state.VisitorDetails.isVip}
                  />
                </View>
              </View>
            ) : null}

            {!this.state.invite &&
            this.props.AllSettings.settingsVM.vtemprature &&
            (this.props.LoginDetails.userRoleId != 4 ||
              this.props.LoginDetails.userRoleId != 1) &&
            (this.props.LoginDetails.userRoleId == 2 ||
              (this.props.LoginDetails.userRoleId == 3 &&
                !this.state.invite)) ? (
              <View
                style={{
                  width: "100%",
                  paddingVertical: 10,
                  justifyContent: "center",
                }}
              >
                <Hoshi
                  style={{ width: "100%" }}
                  label={"Temperature" + ""}
                  placeholderTextColor={COLORS.placeholderColor}
                  maxLength={6}
                  keyboardType={"phone-pad"}
                  onChangeText={(vizTemp) => this.handleInputChange(vizTemp)}
                  value={this.state.VisitorDetails.vizTemp}
                />
              </View>
            ) : (
              this.props.LoginDetails.userRoleId == 2 && (
                <View
                  style={{
                    width: "100%",
                    paddingVertical: 10,
                    justifyContent: "center",
                  }}
                >
                  <Hoshi
                    style={{ width: "100%" }}
                    label={"Temperature" + ""}
                    placeholderTextColor={COLORS.placeholderColor}
                    maxLength={6}
                    keyboardType={"phone-pad"}
                    onChangeText={(vizTemp) => this.handleInputChange(vizTemp)}
                    value={this.state.VisitorDetails.vizTemp}
                  />
                </View>
              )
            )}
            {!this.state.invite &&
            this.props.AllSettings.settingsVM.vArogya &&
            (this.props.LoginDetails.userRoleId != 4 ||
              this.props.LoginDetails.userRoleId != 1) &&
            (this.props.LoginDetails.userRoleId == 2 ||
              (this.props.LoginDetails.userRoleId == 3 &&
                !this.state.invite)) ? (
              <View style={[styles.switchContainer, { alignItems: "center" }]}>
                <Text style={styles.switchLable}>is vaccinated</Text>
                <View style={[styles.switchLable, { flexDirection: "row" }]}>
                  <TouchableOpacity
                    onPress={() => {
                      var VisitorDetails = Object.assign(
                        {},
                        this.state.VisitorDetails,
                        { isVizArogyaSetu: true }
                      );
                      this.setState({ VisitorDetails });
                    }}
                    style={{
                      width: "50%",
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        borderRadius: 15,
                        height: 15,
                        width: 15,
                        backgroundColor: COLORS.white,
                        borderWidth: 1,
                        backgroundColor:
                          this.state.VisitorDetails?.isVizArogyaSetu != null &&
                          this.state.VisitorDetails.isVizArogyaSetu
                            ? COLORS.primary
                            : COLORS.white,
                      }}
                    />
                    <Text style={{ paddingLeft: 2, alignSelf: "flex-start" }}>
                      Yes
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      var VisitorDetails = Object.assign(
                        {},
                        this.state.VisitorDetails,
                        { isVizArogyaSetu: false }
                      );
                      this.setState({ VisitorDetails });
                    }}
                    style={{
                      width: "50%",
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        borderRadius: 15,
                        height: 15,
                        width: 15,
                        backgroundColor: COLORS.white,
                        borderWidth: 1,
                        backgroundColor:
                          this.state.VisitorDetails?.isVizArogyaSetu != null &&
                          !this.state.VisitorDetails.isVizArogyaSetu
                            ? COLORS.primary
                            : COLORS.white,
                      }}
                    />
                    <Text style={{ paddingLeft: 2, alignSelf: "flex-start" }}>
                      No
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              this.props.LoginDetails.userRoleId == 2 && (
                <View
                  style={[styles.switchContainer, { alignItems: "center" }]}
                >
                  <Text style={styles.switchLable}>is vaccinated</Text>
                  <View style={[styles.switchLable, { flexDirection: "row" }]}>
                    <TouchableOpacity
                      onPress={() => {
                        var VisitorDetails = Object.assign(
                          {},
                          this.state.VisitorDetails,
                          { isVizArogyaSetu: true }
                        );
                        this.setState({ VisitorDetails });
                      }}
                      style={{
                        width: "50%",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          borderRadius: 15,
                          height: 15,
                          width: 15,
                          backgroundColor: COLORS.white,
                          borderWidth: 1,
                          backgroundColor:
                            this.state.VisitorDetails?.isVizArogyaSetu !=
                              null && this.state.VisitorDetails.isVizArogyaSetu
                              ? COLORS.primary
                              : COLORS.white,
                        }}
                      />
                      <Text style={{ paddingLeft: 2, alignSelf: "flex-start" }}>
                        Yes
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        var VisitorDetails = Object.assign(
                          {},
                          this.state.VisitorDetails,
                          { isVizArogyaSetu: false }
                        );
                        this.setState({ VisitorDetails });
                      }}
                      style={{
                        width: "50%",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          borderRadius: 15,
                          height: 15,
                          width: 15,
                          backgroundColor: COLORS.white,
                          borderWidth: 1,
                          backgroundColor:
                            this.state.VisitorDetails?.isVizArogyaSetu !=
                              null && !this.state.VisitorDetails.isVizArogyaSetu
                              ? COLORS.primary
                              : COLORS.white,
                        }}
                      />
                      <Text style={{ paddingLeft: 2, alignSelf: "flex-start" }}>
                        No
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )
            )}

            <View
              style={{ flexDirection: "row", marginTop: 10, marginBottom: 10 }}
            >
              {!this.state.invite || this.props.LoginDetails.userRoleId == 2 ? (
                this.props.LoginDetails.userRoleId != 4 ||
                this.props.LoginDetails.userRoleId != 1 ? (
                  this.props.AllSettings.settingsVM.vIdProof ? (
                    <View>
                      <Text>Id Proof</Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignContent: "center",
                          alignItems: "center",
                          // justifyContent: 'center',
                        }}
                      >
                        <TouchableOpacity
                          activeOpacity={1}
                          style={{ flexDirection: "row" }}
                          onPress={() => this.selectPhotoTapped("Id")}
                        >
                          {/* <Hoshi
                      editable={false}
                      style={{
                        color: COLORS.black,
                        borderBottomWidth: 1,
                        borderBottomColor: COLORS.black,
                        flexGrow: 1,
                        marginRight: 20,
                      }}
                      label="Id Proof"
                      value={this.state.imageBase64StringIdProof.fileName}
                    /> */}

                          <Image
                            source={IMAGES.camera}
                            style={{ right: 5, top: 10, height: 28, width: 32 }}
                          />
                        </TouchableOpacity>
                        {this.state.idProofPath != "" && (
                          <Image
                            source={{ uri: this.state.idProofPath }}
                            style={{
                              borderRadius: 7,
                              height: 50,
                              width: 50,
                              marginLeft: 10,
                              marginTop: 5,
                            }}
                          />
                        )}
                      </View>
                    </View>
                  ) : null
                ) : null
              ) : null}
              {!this.state.invite || this.props.LoginDetails.userRoleId == 2 ? (
                this.props.LoginDetails.userRoleId != 4 ||
                this.props.LoginDetails.userRoleId != 1 ? (
                  this.props.AllSettings.settingsVM.vPhotoProof ? (
                    <View style={{ marginLeft: "auto", marginRight: 50 }}>
                      <Text>Photo</Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignContent: "center",
                          alignItems: "center",
                          // justifyContent: 'center',
                        }}
                      >
                        {/* <Text>Photo</Text> */}
                        <TouchableOpacity
                          activeOpacity={1}
                          style={{}}
                          onPress={() => this.selectPhotoTapped("Photo")}
                        >
                          <Image
                            source={IMAGES.camera}
                            style={{ right: 5, top: 10, height: 28, width: 32 }}
                          />
                        </TouchableOpacity>
                        {this.state.imagePath != "" && (
                          <Image
                            source={{ uri: this.state.imagePath }}
                            style={{
                              borderRadius: 7,
                              height: 50,
                              width: 50,
                              marginLeft: 10,
                              marginTop: 5,
                            }}
                          />
                        )}
                        {/* <FlatList
                      data={this.state?.AllImages}
                      style={{margin: 5}}
                      //   refreshing={this.state.setRefreshing}
                      //   onRefresh={() => this.handleRefresh()}
                      // inverted={true}
                      horizontal={true}
                      renderItem={({item}) => (
                        <View style={{flexDirection: 'row'}}>
                          <Image
                            source={{uri: item?.img}}
                            style={{
                              borderRadius: 7,
                              height: 50,
                              width: 50,
                              marginLeft: 10,
                            }}
                          />
                        </View>
                      )}
                    /> */}
                      </View>
                    </View>
                  ) : null
                ) : null
              ) : null}
            </View>

            {/* {this.props.LoginDetails.userRoleId == 3 && this.props.route.params.tag != 3 ? <RadioButtonRN
                            data={data}
                            initial={1}
                            selectedBtn={(e) => {
                                if (e.label == 'Invite') {
                                    this.setState({ invite: true })
                                } else {
                                    var VisitorDetails = Object.assign({}, this.state.VisitorDetails, { date: Moment().format('DD-MM-YYYY'), inTime: Moment().format('HH:mm:ss') });
                                    this.setState({ invite: false, VisitorDetails })
                                }
                            }}
                        /> : null} */}

            {this.props.route.params.tag == 0 ? (
              <View
                style={{ flexDirection: "row", alignSelf: "flex-end", top: 10 }}
              >
                <TouchableOpacity
                  style={{
                    borderRadius: 10,
                    backgroundColor: COLORS.secondary,
                    padding: 11,
                    marginRight: 15,
                  }}
                  onPress={async() => {
                    console.log("All Details", this.state.VisitorDetails);
                    let res = await axiosAuthGet(
                      "Visitor/GetVisitorByMobile/" + this.state.VisitorDetails.mobile+"/"+this.props.LoginDetails.orgID
                    );
                    // console.log("Mobile Details===", res.fullName);
                
                  if (res?.isBlock != true) {
                      this.props.SubscriptionLimit !== 0
                      ? alert("Subscription Limit cross")
                      : this.props.LoginDetails.userRoleId == 2
                      ? this.checkForGate()
                      : this.props.LoginDetails.userRoleId == 4 ||
                        this.props.LoginDetails.userRoleId == 1
                      ? this.checkForEmp()
                      : this.checkForRec();
                    } else {
                      alert("This User is Blocked");
                      Alert.alert(
                        "Alert ",
                        "This User is Blocked",
                        [
                          { text: "OK", onPress: () =>  {this.clearRefresh()
                          const VisitorDetailss = Object.assign({}, this.state.VisitorDetails, {
                            mobile: "",
                          });
                          this.setState({ VisitorDetails: VisitorDetailss, }) }}
                        ]
                      );
                      // SimpleToast.show('This User is Blocked')
                     
                      // mobile = '';
                    }
                    
                  }}
                >
                  <Text style={{ color: COLORS.white, fontSize: 17 }}>
                    Submit
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    borderRadius: 10,
                    backgroundColor: COLORS.skyBlue,
                    padding: 11,
                  }}
                  onPress={() => this.clearRefresh()}
                >
                  <Text style={{ color: COLORS.white, fontSize: 17 }}>
                    Reset
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              this.props.LoginDetails.userRoleId == 1 && (
                <View
                  style={{
                    flexDirection: "row",
                    alignSelf: "flex-end",
                    top: 10,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      borderRadius: 10,
                      backgroundColor: COLORS.secondary,
                      padding: 11,
                      marginRight: 15,
                    }}
                    onPress={async() => {
                      let res = await axiosAuthGet(
                        "Visitor/GetVisitorByMobile/" + this.state.VisitorDetails.mobile+"/"+this.props.LoginDetails.orgID
                      );
                      // console.log("Mobile Details===", res.fullName);
                      if (res?.isBlock != true) {
                        this.props.SubscriptionLimit !== 0
                        ? alert("Subscription Limit cross")
                        : this.props.LoginDetails.userRoleId == 2
                        ? this.checkForGate()
                        : this.props.LoginDetails.userRoleId == 4 ||
                          this.props.LoginDetails.userRoleId == 1
                        ? this.checkForEmp()
                        : this.checkForRec();
                      } else {
                        alert("This User is Blocked");
                        Alert.alert(
                          "Alert ",
                          "This User is Blocked",
                          [
                            { text: "OK", onPress: () =>  {this.clearRefresh()
                            const VisitorDetailss = Object.assign({}, this.state.VisitorDetails, {
                              mobile: "",
                            });
                            this.setState({ VisitorDetails: VisitorDetailss, }) }}
                          ]
                        );
                        // SimpleToast.show('This User is Blocked')
                       
                        // mobile = '';
                      }
                      
                    }}>
                    <Text style={{ color: COLORS.white, fontSize: 17 }}>
                      Submit
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      borderRadius: 10,
                      backgroundColor: COLORS.skyBlue,
                      padding: 11,
                    }}
                    onPress={() => this.clearRefresh()}
                  >
                    <Text style={{ color: COLORS.white, fontSize: 17 }}>
                      Reset
                    </Text>
                  </TouchableOpacity>
                </View>
              )
            )}
            {this.props.route.params.tag == 2 ? (
              <View style={{ alignSelf: "center", top: 10 }}>
                <View
                  style={{
                    alignSelf: "flex-end",
                    flexDirection: "row",
                    padding: 10,
                    margin: 10,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      paddingRight: 10,
                      height: 37,
                      width: 200,
                      alignSelf: "center",
                      borderRadius: 6,
                    }}
                    onPress={() => {
                      this.checkArogyaSetu(this.state.VisitorDetails, 2);
                    }}
                  >
                    <LinearGradient
                      style={{
                        flex: 1,
                        borderRadius: 7,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      colors={[COLORS.secondary, COLORS.secondary]}
                    >
                      <Text
                        style={{
                          width: 200,
                          textAlign: "center",
                          color: COLORS.white,
                          fontSize: 17,
                          fontWeight: "bold",
                        }}
                      >
                        {this.props.AllSettings.settingsVM.vPhotoProof ||
                        this.props.AllSettings.settingsVM.vIdProof
                          ? "Skip And Check In"
                          : "Check In"}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  {this.props.AllSettings.settingsVM.vPhotoProof ||
                  this.props.AllSettings.settingsVM.vIdProof ? (
                    <TouchableOpacity
                      style={{
                        height: 37,
                        width: 90,
                        alignSelf: "center",
                        borderRadius: 6,
                      }}
                      onPress={() => {
                        if (
                          this.state.imageBase64StringPhotoProof?.data !=
                            null ||
                          this.state.imageBase64StringIdProof.data != null
                        ) {
                          this.checkArogyaSetu(this.state.VisitorDetails, 1);
                        } else {
                          alert("Please select Photo or Id Proof");
                        }
                      }}
                    >
                      <LinearGradient
                        style={{
                          flex: 1,
                          borderRadius: 7,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        colors={[COLORS.secondary, COLORS.secondary]}
                      >
                        <Text
                          style={{
                            width: 100,
                            textAlign: "center",
                            color: COLORS.white,
                            fontSize: 17,
                            fontWeight: "bold",
                          }}
                        >
                          Check In
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            ) : null}
          </View>
          {this.ContactNoModal()}
        </ScrollView>
      </View>
    );
  }
  clearRefresh() {
    var departVal = this.state.VisitorDetails.department;
    this.props.ChkSubscriptionLimit(this.props.LoginDetails.userID);
    this.props.GetAllSettings(this.props.LoginDetails.userID);
    this.props.GetWhoomToMEet(this.props.LoginDetails.userID);
    var VisitorDetails;
    if (
      this.props.LoginDetails.userRoleId == 4 ||
      this.props.LoginDetails.userRoleId == 1
    ) {
      VisitorDetails = Object.assign({}, visitorDetailEmpty, {
        department: departVal,
      });
    } else {
      VisitorDetails = visitorDetailEmpty;
    }

    this.setState({
      mobileError: "",
      vAddlCol1Error: "",
      vAddlCol2Error: "",
      vAddlCol3Error: "",
      vAddlCol4Error: "",
      vAddlCol5Error: "",
      emailError: "",
      VisitorDetails,
      enable: this.props.route.params.tag == 2 ? false : true,
      date: null,
      Intime: null,
      Outtime: null,
      imageBase64StringIdProof: { fileName: null, data: null },
      imageBase64StringPhotoProof: { fileName: null, data: null },
    });
  }
  onChangeNumber = (text) => {
    var VisitorDetails;
    if (text.length == 0) {
      VisitorDetails = visitorDetailEmpty;

      this.setState({
        mobileError: "",
        vAddlCol1Error: "",
        vAddlCol2Error: "",
        vAddlCol3Error: "",
        vAddlCol4Error: "",
        vAddlCol5Error: "",
        emailError: "",
        VisitorDetails,
        enable: this.props.route.params.tag == 2 ? false : true,
        date: Platform.OS == "android" ? null : new Date(),
        Intime: null,
        Outtime: Platform.OS == "android" ? null : new Date(),
        imageBase64StringIdProof: { fileName: null, data: null },
        imageBase64StringPhotoProof: { fileName: null, data: null },
      });
    } else {
      {
        const VisitorDetailss = Object.assign({}, this.state.VisitorDetails, {
          mobile: text,
        });
        this.setState({ VisitorDetails: VisitorDetailss });
      }
    }
  };
  async onChanged(text, FisrtName) {
    let mobile = "";
    let numbers = "0123456789";
    let mobileError = "";
    console.log("Firstname:", FisrtName);
    for (var i = 0; i < text.length; i++) {
      if (numbers.indexOf(text[i]) > -1) {
        mobile = mobile + text[i];
        if (mobile[0] >= 1) {
          console.log(mobile.length);
          if (mobile.length >= 8 && mobile.length <= 15) {
            try {
              let res = await axiosAuthGet(
                "Visitor/GetVisitorByMobile/" + text+"/"+this.props.LoginDetails.orgID
              );
              console.log("Final response ====", res);
              if (res == null || res == "") {
                var departVal = this.state.VisitorDetails.department;
                this.props.ChkSubscriptionLimit(this.props.LoginDetails.userID);
                this.props.GetAllSettings(this.props.LoginDetails.userID);
                this.props.GetWhoomToMEet(this.props.LoginDetails.userID);

                var VisitorDetails;

                // if (
                //   this.props.LoginDetails.userRoleId == 4 ||
                //   this.props.LoginDetails.userRoleId == 1
                // ) {

                //   VisitorDetails = Object.assign({}, visitorDetailEmpty, {
                //     department: departVal,
                //   });
                //    VisitorDetails = Object.assign({}, this.state.VisitorDetails, {
                //     mobile: mobile,
                //     fullName:FisrtName

                //   });
                // } else {
                // }

                VisitorDetails = visitorDetailEmpty;

                this.setState({
                  mobileError: "",
                  vAddlCol1Error: "",
                  vAddlCol2Error: "",
                  vAddlCol3Error: "",
                  vAddlCol4Error: "",
                  vAddlCol5Error: "",
                  emailError: "",
                  VisitorDetails,
                  enable: this.props.route.params.tag == 2 ? false : true,
                  date: Platform.OS=="android"? null:new Date(),
                  Intime: null,
                  Outtime:Platform.OS=="android"? null:new Date(),
                  imageBase64StringIdProof: { fileName: null, data: null },
                  imageBase64StringPhotoProof: { fileName: null, data: null },
                });
              } else {
                console.log("bye bye ");
                if (res.isBlock != true) {
                  this.props.GetVisitorByMobile(
                    text+"/"+this.props.LoginDetails.orgID,
                    this.getVisitorByMobileSuccess
                  );
                } else {
                  alert("This User is Blocked");
                  // SimpleToast.show('This User is Blocked')
                  this.clearRefresh();
                  mobile = "";

                  // this.setState({ VisitorDetails: visitorDetailEmpty })
                }
              }
              console.log("Mobile Details===", res);
            } catch (error) {}
            // this.getVisitorByMobile(mobile)
          } else {
            this.setState({ enable: true });
          }
        } else {
          mobile = "";
          mobileError = "Please Enter Valid Mobile Number";
          // alert('Please Enter Valid Mobile Number')
        }
      } else {
        // mobileError = 'Please Enter Numbers Only';
        // alert("Please Enter Numbers Only");
      }
    }

    const VisitorDetailss = Object.assign({}, this.state.VisitorDetails, {
      mobile: mobile,
      fullName: FisrtName,
    });
    this.setState({ VisitorDetails: VisitorDetailss, mobileError });
  }
  getVisitorByMobileSuccess = (response) =>
    this.afterGetVisitorByMobileSuccess(response);
  afterGetVisitorByMobileSuccess(Response) {
    var VisitorDetails = this.state.VisitorDetails,
      enable = true;
    if (Response != undefined) {
      var VisitorDetails;
      if (
        this.props.LoginDetails.userRoleId == 4 ||
        this.props.LoginDetails.userRoleId == 1
      ) {
        VisitorDetails = Object.assign({}, Response, {
          date: null,
          inTime: null,
          outTime: null,
          department: this.props.UserDetails.department,
        });
      } else {
        VisitorDetails = Object.assign({}, Response, {
          date: null,
          inTime: null,
          outTime: null,
        });
      }

      enable = false;
    }
    this.setState({ VisitorDetails, enable });
  }
  getContactNo() {
    if (Platform.OS === "android") {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: "Contacts",
        message: "This app would like to view your contacts.",
        buttonPositive: "Please accept bare mortal",
      }).then(async (contacts) => {
        if (contacts === "granted")
          await Contacts.getAll().then((data) => {
            const newArr1 = data.map((v) => ({
              ...v,
              color:
                randomColor[Math.floor(Math.random() * randomColor.length)],
            }));
            console.log("Hello", newArr1);
            newArr1.sort((a, b) =>
              a.displayName?.localeCompare(b?.displayName)
            );
            // console.log("All Data===",);
            this.setState({
              contactNoModal: true,
              masterContactList: newArr1,
              contactsList: newArr1,
            });
          });
      });
    } else {
      Contacts.checkPermission().then((permission) => {
        // Contacts.PERMISSION_AUTHORIZED || Contacts.PERMISSION_UNDEFINED || Contacts.PERMISSION_DENIED
        if (permission === "undefined") {
          Contacts.requestPermission().then((permission) => {
            if (permission === "granted")
              Contacts.getAll().then((data) => {
                const newArr1 = data.map((v) => ({
                  ...v,
                  color:
                    randomColor[Math.floor(Math.random() * randomColor.length)],
                }));
                newArr1.sort((a, b) =>
                  a?.givenName.localeCompare(b?.givenName)
                );

                this.setState({
                  contactNoModal: true,
                  masterContactList: newArr1,
                  contactsList: newArr1,
                });
              });
          });
        }
        if (permission === "authorized") {
          // yay!
          Contacts.getAll().then((data) => {
            console.log("data", data);

            const newArr1 = data.map((v) => ({
              ...v,
              color:
                randomColor[Math.floor(Math.random() * randomColor.length)],
            }));
            console.log("New Array:-", newArr1);
            newArr1.sort((a, b) => a?.givenName.localeCompare(b.givenName));

            this.setState({
              contactNoModal: true,
              masterContactList: newArr1,
              contactsList: newArr1,
            });
          });
        }
        if (permission === "denied") {
          // x.x
        }
      });
    }
  }
  selectMobileNo(item) {
    // var mobile = item.phoneNumbers[0]?.number?.replace('+91', '');
    var mobile = item.phoneNumbers[0]?.number;

    console.log("Moible No:-", mobile);
    // var VisitorDetails = Object.assign({}, this.state.VisitorDetails, {
    //   mobile: mobile.replace(/[^\d]/g, ''),
    //   email: item.emailAddresses[0]?.email,
    //   fullName: item.displayName,
    // });
    if (Platform.OS == "ios") {
      this.onChanged(mobile, item.givenName);
      this.setState({ contactNoModal: false });
    } else {
      this.onChanged(mobile, item.displayName);
      this.setState({ contactNoModal: false });
    }
    // this.props.GetVisitorByMobile(
    //   mobile,
    //   this.props.LoginDetails.userID,
    //   this.getVisitorByMobileSuccess,
    // );
  }
  searchContactNo(search) {
    if (search != "") {
      const newData = this.state.masterContactList.filter(function (item) {
        // var name = Platform.OS === 'android'?item?.displayName:item?.givenName
        var itemm =
          item?.emailAddresses[0]?.email +
          item?.phoneNumbers[0]?.number?.replace(/[^\d]/g, "") +
          item?.givenName;
        const itemData = itemm ? itemm.toUpperCase() : "".toUpperCase();
        const textData = search.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      this.setState({
        contactsList: newData,
      });
    } else {
      this.setState({
        contactsList: this.state.masterContactList,
      });
    }
  }
  ContactNoModal() {
    return (
      <Modal
        animationType={"fade"}
        transparent={true}
        visible={this.state.contactNoModal}
        onRequestClose={() => {
          this.setState({ contactNoModal: false });
        }}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: COLORS.white,
          }}
        >
          <LinearGradient
            style={{
              height: Platform.OS == "ios" ? 100 : 60,
              padding: 10,
              width: "100%",
              justifyContent: "center",
            }}
            colors={[COLORS.primary, COLORS.third]}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                borderWidth: 1,
                borderRadius: 20,
                backgroundColor: COLORS.white,
                alignItems: "center",
                marginTop: Platform.OS === "ios" ? 35 : 0,
              }}
            >
              <TouchableOpacity
                style={{
                  marginLeft: 10,
                  height: 50,
                  alignContent: "center",
                  justifyContent: "center",
                }}
                onPress={() =>
                  this.setState({
                    contactNoModal: false,
                    AddmodalVisible: true,
                  })
                }
              >
                <Image
                  source={IMAGES.back}
                  style={{ height: 22, width: 22, tintColor: COLORS.black }}
                />
              </TouchableOpacity>

              <TextInput
                style={{
                  color: COLORS.black,
                  textAlign: "left",
                  flexGrow: 1,
                  backgroundColor: COLORS.white,
                  paddingLeft: 20,
                  padding: 5,
                  fontSize: 22,
                }}
                placeholder={"Search Contact Number"}
                onChangeText={(text) => this.searchContactNo(text)}
              />
              <Image
                source={IMAGES.search_a}
                style={{
                  height: 22,
                  width: 22,
                  marginRight: 5,
                  tintColor: COLORS.placeholderColor,
                }}
              />
            </View>
          </LinearGradient>
          <FlatList
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            data={this.state.contactsList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(item, index) => {
              // console.log("All Mobile Contact Data",item);
              var item = item.item;
              return (
                <TouchableOpacity
                  onPress={() => {
                    this.selectMobileNo(item);
                  }}
                  style={{
                    flexDirection: "row",
                    marginBottom: 2,
                    backgroundColor: COLORS.white,
                    padding: 10,
                    elevation: 1,
                  }}
                >
                  <View
                    style={{
                      marginRight: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: item.color,
                      height: 35,
                      width: 35,
                      borderRadius: 17,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 20,
                        color: COLORS.white,
                        fontWeight: "bold",
                      }}
                    >
                      {Platform.OS == "android"
                        ? item?.displayName?.charAt(0)
                        : item?.givenName?.charAt(0)}
                    </Text>
                  </View>
                  <View style={{ flexGrow: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: "900" }}>
                      {Platform.OS === "android"
                        ? item?.displayName
                        : item?.givenName}
                    </Text>
                    <Text style={{ fontSize: 12, fontWeight: "500" }}>
                      {item?.phoneNumbers[0]?.number}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: COLORS.placeholderColor, fontSize: 20 }}>
                  No Contact Found
                </Text>
              </View>
            }
          />
        </View>
      </Modal>
    );
  }
  getCurrentDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    var d =
      this.addZero(dd) + "-" + this.addZero(mm) + "-" + this.addZero(yyyy);
    var temp = this.getParsedDate1(d);
    let date1 = new Date();
    let hours = date1.getHours();
    let minutes = date1.getMinutes();
    let seconds = date1.getSeconds();
    var t3 =
      temp +
      "T" +
      this.addZero(hours) +
      ":" +
      this.addZero(minutes) +
      ":" +
      this.addZero(seconds);

    return t3;
  }
  sendNotification(item, tag) {
    let by;
    console.log("Item and Log=====", item, tag);
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
      if (this.props.LoginDetails.userRoleId === 2) {
        notifText1 =
          item.fullName +
          " ( " +
          item.inviteCode.toString().trim() +
          " ) Checked In by " +
          by;
      } else {
        if (this.state.invite) {
          notifText1 =
            item.fullName +
            " ( " +
            item.inviteCode.toString().trim() +
            " ) Invited by " +
            by;
        } else {
          notifText1 =
            item.fullName +
            " ( " +
            item.inviteCode.toString().trim() +
            " ) Checked In by " +
            by;
        }
      }

      // } else {
      //     notifText1 = item.fullName + " Checked In "
      // }
    } else if (tag == 21) {
      // if (item.inviteCode != null) {
      notifText1 =
        item.fullName +
        " ( " +
        item.inviteCode.toString().trim() +
        " ) Checked Out by " +
        by;
      // } else {
      //     notifText1 = item.fullName + " Checked Out "
      // }
    } else if (tag == 2) {
      notifText1 =
        item.fullName +
        " ( " +
        item.inviteCode.toString().trim() +
        " ) Approved by " +
        by;
    } else if (tag == 3) {
      notifText1 =
        item.fullName +
        " ( " +
        item.inviteCode.toString().trim() +
        " ) Rejected by " +
        by;
    } else if (tag == 4) {
      notifText1 =
        item.fullName +
        " ( " +
        item.inviteCode.toString().trim() +
        " ) Rescheduled by " +
        by;
    }
    var param = {
      notifText: notifText1,
      notifDate: this.getCurrentDate(),
      userId: item.whomToMeet,
    };
    console.log("Notification:-SendNoti", param);
    // this.props.SaveNotification(param);
  }
  getAllReceptionst(params1, tag) {
    this.props.ReceptionList.forEach((element) => {
      this.sendNotificationRec(params1, element, tag); // 5 = Approve
    });
    // let Response = await apiConnection.fetchGetData('Users/GetReceptionList', global.LoginDetails.userID);
  }
  sendNotificationRec(params1, item, tag) {
    // tag = 5 = approve, 6 = reject, 7 = reschedule 8 = check in
    console.log("Notification List", params1, tag);

    let by;

    if (this.props.LoginDetails.userRoleId === 4) {
      by = this.props.LoginDetails.fullName;
    } else if (this.props.LoginDetails.userRoleId === 3) {
      by = this.props.LoginDetails.fullName;
    } else {
      by = this.props.LoginDetails.fullName;
    }
    var notifText1;
    if (tag == 5) {
      notifText1 =
        this.state.VisitorDetails.fullName +
        " ( " +
        this.state.VisitorDetails.inviteCode.toString().trim() +
        " ) Approved by " +
        by; //by Employee "
      // notifText1 = item.fullName  + " Approved"// by Employee "
    } else if (tag == 6) {
      notifText1 =
        this.state.VisitorDetails.fullName +
        " ( " +
        this.state.VisitorDetails.inviteCode.toString().trim() +
        " )  Rejected by " +
        by; // by Employee "
    } else if (tag == 7) {
      notifText1 =
        this.state.VisitorDetails.fullName +
        " ( " +
        this.state.VisitorDetails.inviteCode.toString().trim() +
        " ) Rescheduled by " +
        by; // by Employee "
    } else if (tag == 8) {
      if (this.props.LoginDetails.userRoleId === 2) {
        notifText1 =
          this.state.VisitorDetails.fullName +
          " ( " +
          this.state.VisitorDetails.inviteCode.toString().trim() +
          " ) Checked In by " +
          by;
      } else {
        if (this.state.invite) {
          notifText1 =
            this.state.VisitorDetails.fullName +
            " ( " +
            this.state.VisitorDetails.inviteCode.toString().trim() +
            " ) Invited by " +
            by; // by Employee "
          console.log("Empm====Notification2", notifText1);
        } else {
          notifText1 =
            this.state.VisitorDetails.fullName +
            " ( " +
            this.state.VisitorDetails.inviteCode.toString().trim() +
            " ) Checked In by " +
            by; // by Employee "
          console.log("Empm====Notification2", notifText1);
        }
      }

      // if (params1 != '') {
      //   notifText1 =
      //     params1.fullName +
      //     ' ( ' +
      //     params1.inviteCode.toString().trim() +
      //     ' ) Checked In by ' +
      //     by; // by Employee "
      //   console.log('Empm====Notification', notifText1);
      // } else {

      // }
    } else if (tag == 9) {
      notifText1 =
        params1.fullName +
        " ( " +
        params1.inviteCode.toString().trim() +
        " ) Checked Out by " +
        by; // by Employee "
    }
    var param = {
      notifText: notifText1,
      notifDate: this.getCurrentDate(),
      userId: item.usrId,
    };
    console.log("Notification:-SendNotiRecpt", param);

    // this.props.SaveNotification(param);
  }
  insertChekIn(item) {
    var isArogyaSetu =
      item.isVizArogyaSetu == null ? false : item.isVizArogyaSetu;
    var vizTemp = item.vizTemp == null ? false : item.vizTemp;
    var params1 =
      item.inOutId +
      "/" +
      isArogyaSetu +
      "/" +
      vizTemp +
      "/" +
      this.props.LoginDetails.empID;
    console.log("Data is ======", item);
    this.props.CheckIn(params1, this.insertChekInSuccess);
  }
  insertChekInSuccess = (res) => this.afterInsertChekInSuccess(res);

  afterInsertChekInSuccess(respp) {
    // let respp = await apiConnection.getData('Visitor/CheckIn/' + item.inOutId + "/" + item.isVizArogyaSetu + "/" + item.vizTemp);
    if (respp) {
      this.sendNotification(this.state.VisitorDetails, 1);
      this.getAllReceptionst(this.state.VisitorDetails, 8);
      Toast.show(
        this.state.VisitorDetails.fullName + " Check In successfully",
        Toast.LONG
      );
      this.props.mobileNo({
        mobStatus: 0,
        mob: "",
      });
      this.props.Update(true);
      this.props.navigation.goBack();
    } else {
      Toast.show(
        this.state.VisitorDetails.fullName + " Check In Unsuccessfull",
        Toast.LONG
      );
    }
  }
  checkinWithPhoto(item) {
    var isArogyaSetu =
      item.isVizArogyaSetu == null ? false : item.isVizArogyaSetu;
    var vizTemp = item.vizTemp == null ? false : item.vizTemp;
    var params1 = {
      inOutId: item.inOutId,
      visitorId: item.visitorId,
      imageBase64StringPhotoProofChkin:
        this.state.imageBase64StringPhotoProof.data, // pass file name
      imageBase64StringIdProofChkin: this.state.imageBase64StringIdProof.data,
      photoProofPath: null,
      idprfPath: null,
      isVizArogyaSetu: isArogyaSetu,
      vizTemp: vizTemp,
      userId: this.props.LoginDetails.userID,
      empId: this.props.LoginDetails.empID,
      // inviteCode: this.makeid(6)
    };
    // let respp = await apiConnection.getData('Visitor/CheckinWithPhoto', params1);
    this.props.CheckinWithPhoto(params1, this.checkinWithPhotoSuccess);
  }
  checkinWithPhotoSuccess = (res) => this.afterCheckinWithPhotoSuccess(res);
  afterCheckinWithPhotoSuccess(respp) {
    if (respp) {
      this.sendNotification(this.state.VisitorDetails, 1);
      this.getAllReceptionst(this.state.VisitorDetails, 8);
      Toast.show(
        this.state.VisitorDetails.fullName + " Check In successfully",
        Toast.LONG
      );

      this.props.Update(true);

      this.props.navigation.goBack();
    } else {
      Toast.show(
        this.state.VisitorDetails.fullName + " Check In Unsuccessfull",
        Toast.LONG
      );
    }
  }
  showTimePicker(tag) {
    if (tag == 1) {
      this.setState({
        isExpectedInVisible: true,
        isExpectedOutVisible: false,
        isReschedualVisible: false,
      });
    } else if (tag == 2) {
      if (this.state.VisitorDetails.inTime != null) {
        this.setState({
          isExpectedInVisible: false,
          isExpectedOutVisible: true,
          isReschedualVisible: false,
        });
      } else {
        Toast.show("Please First Select In Time");
      }
    } else if (tag == 3) {
      this.setState({
        isExpectedInVisible: false,
        isExpectedOutVisible: false,
        isReschedualVisible: true,
      });
    }
  }
  handleInputChange = (vizTemp, tag) => {
    var Temp = vizTemp.replace(/[- #*;,+<>N()\{\}\[\]\\\/]/gi, "");
    if (this.validateTemp(Temp)) {
      if (tag == 1) {
        var invitecodeArray = Object.assign({}, this.state.invitecodeArray, {
          vizTemp: Temp,
        });
        this.setState({ invitecodeArray });
      } else {
        var VisitorDetails = Object.assign({}, this.state.VisitorDetails, {
          vizTemp: Temp,
        });
        this.setState({ VisitorDetails });
      }
    }
  };

  validateTemp(s) {
    var rgx = /^[0-9]*\.?[0-9]*$/;
    return s.match(rgx);
  }
  getDepartmentSuccess = (res) => this.afterGetDepartmentSuccess(res);
  afterGetDepartmentSuccess(res) {
    if (res) {
      var VisitorDetails = Object.assign({}, this.state.VisitorDetails, {
        department: res.department,
      });
      this.setState({ VisitorDetails });
    }
  }
  validate = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (text != "" && reg.test(text) === false) {
      return false;
    } else {
      return true;
    }
  };
  dynamicFieldValidate() {
    return this.state.vAddlCol1Error !== "" ||
      this.state.vAddlCol2Error !== "" ||
      this.state.vAddlCol3Error !== "" ||
      this.state.vAddlCol4Error !== "" ||
      this.state.vAddlCol5Error !== ""
      ? alert(
          this.state.vAddlCol1Error +
            " \n" +
            this.state.vAddlCol2Error +
            " \n" +
            this.state.vAddlCol3Error +
            " \n" +
            this.state.vAddlCol4Error +
            " \n" +
            this.state.vAddlCol5Error
        )
      : true;
  }
  /** For Gate Keeper */
  checkForGate = () => {
    //Handler for the Submit onPress
    var temp = 0;
    // if (this.state.VisitorDetails.fullName != '') {
    //   if (this.props.AllSettings.settingsVM.vEmail) {
    //     if (
    //       this.state.VisitorDetails.email != null &&
    //       this.state.VisitorDetails.email?.trim() !== ''
    //     ) {
    //       if (!this.validate(this.state.VisitorDetails.email)) {
    //         temp = 1;
    //         alert('Please Enter Valid E-mail');
    //       }
    //     } else {
    //       temp = 0;
    //     }
    //   }
    // } else {
    //   temp = 1;
    //   alert('Please Enter Full Name');
    // }
    if (temp == 0) {
      if (this.state.VisitorDetails.mobile != "") {
        if (
          this.state.VisitorDetails.mobile.length >= 8 &&
          this.state.VisitorDetails.mobile.length <= 15
        ) {
          if (
            this.state.VisitorDetails?.fullName != "" &&
            this.state.VisitorDetails?.fullName != null
          ) {
            if (
              this.state.VisitorDetails?.email == null ||
              this.state.VisitorDetails.email == "" ||
              this.validate(this.state.VisitorDetails.email)
            ) {
              if (this.state.invite) {
                console.log(this.state.VisitorDetails.inTime);

                // if (this.state.VisitorDetails.outTime != null && this.state.VisitorDetails.outTime != '') {
                if (this.state.VisitorDetails.whomToMeetName != null) {
                  if (this.props.AllSettings.settingsVM.vPurpose) {
                    if (
                      this.state.VisitorDetails.purpose != null &&
                      this.state.VisitorDetails.purpose != ""
                    ) {
                      this.checkArogyaSetu(this.state.VisitorDetails, 3);
                    } else {
                      alert("Please Enter purpose");
                    }
                  } else {
                    this.checkArogyaSetu(this.state.VisitorDetails, 3);
                  }
                } else {
                  alert("Please Select whom to meet you want to meet");
                }
                // }
                // else {
                //     alert('Please Select Expected Out Time')
                // }
              }
            } else {
              temp = 1;
              alert("Please Enter Valid E-mail");
            }
          } else {
            temp = 1;
            alert("Please Enter Full Name");
          }
        } else {
          alert("Please Enter Valid Mobile No.");
        }
      } else {
        alert("Please Enter Mobile No.");
      }
    }
    // if (temp == 0) {
    //   if (
    //     this.state.VisitorDetails.mobile != ''
    //   ) {
    //     if(this.state.VisitorDetails.mobile.length >= 8 && this.state.VisitorDetails.mobile.length <= 15){
    //       if (this.state.VisitorDetails.whomToMeetName != null) {
    //         if (this.props.AllSettings.settingsVM.vPurpose) {
    //           if (
    //             this.state.VisitorDetails.purpose != null &&
    //             this.state.VisitorDetails.purpose != ''
    //           ) {
    //             this.checkArogyaSetu(this.state.VisitorDetails, 3);
    //           } else {
    //             alert('Please Enter Purpose');
    //           }
    //         } else {
    //           this.checkArogyaSetu(this.state.VisitorDetails, 3);
    //         }
    //       } else {
    //         alert('Please Select whom to meet you want to meet');
    //       }
    //     }else{
    //     alert('Please Enter Valid Mobile No');
    //     }
    //   } else {
    //     alert('Please Enter Mobile No');
    //   }
    // }
  };

  /** For Employee */
  checkForEmp = () => {
    var temp = 0;
    console.log(
      "this.state.VisitorDetails.email",
      this.state.VisitorDetails.date
    );
    //Handler for the Submit onPress
    // if (this.state.VisitorDetails.fullName != '') {
    //   if (this.props.AllSettings.settingsVM.vEmail) {
    //     if (
    //       this.state.VisitorDetails.email != null &&
    //       this.state.VisitorDetails.email?.trim() !== ''
    //     ) {
    //       if (this.validate(this.state.VisitorDetails.email)) {
    //         temp = 0;
    //       } else {
    //         temp = 1;
    //         alert('Please Enter Valid E-mail');
    //       }
    //     }
    //   }
    // } else {
    //   temp = 1;
    //   alert('Please Enter Full Name');
    // }

    if (temp == 0) {
      if (this.state.VisitorDetails.mobile != "") {
        if (
          this.state.VisitorDetails.mobile.length >= 8 &&
          this.state.VisitorDetails.mobile.length <= 15
        ) {
          if (
            this.state.VisitorDetails?.fullName != "" &&
            this.state.VisitorDetails?.fullName != null
          ) {
            if (
              this.state.VisitorDetails?.email == null ||
              this.state.VisitorDetails.email == "" ||
              this.validate(this.state.VisitorDetails.email)
            ) {
              if (this.state.invite) {
                if (
                  this.state.VisitorDetails.inTime != null &&
                  this.state.VisitorDetails.inTime != ""
                ) {
                  // if (this.state.VisitorDetails.outTime != null && this.state.VisitorDetails.outTime != '') {
                  if (this.props.LoginDetails.isApprover == true) {
                    console.log(this.state.VisitorDetails.inTime);

                    if (this.state.VisitorDetails.whomToMeetName != null) {
                      if (this.props.AllSettings.settingsVM.vPurpose) {
                        if (
                          this.state.VisitorDetails.purpose != null &&
                          this.state.VisitorDetails.purpose != ""
                        ) {
                          this.dynamicFieldValidate() && this.insertVisitor();
                        } else {
                          alert("Please Enter purpose");
                        }
                      } else {
                        this.dynamicFieldValidate() && this.insertVisitor();
                      }
                    } else {
                      alert("Please Select whom to meet you want to meet");
                    }
                  }
                  else if(this.props.LoginDetails.isApprover == false && this.props.LoginDetails.userRoleId==1 &&!this.props.AdminSwitch){
                    if (this.state.VisitorDetails.whomToMeetName != null) {
                      if (this.props.AllSettings.settingsVM.vPurpose) {
                        if (
                          this.state.VisitorDetails.purpose != null &&
                          this.state.VisitorDetails.purpose != ""
                        ) {
                          this.dynamicFieldValidate() && this.insertVisitor();
                        } else {
                          alert("Please Enter purpose");
                        }
                      } else {
                        this.dynamicFieldValidate() && this.insertVisitor();
                      }
                    } else {
                      alert("Please Select whom to meet you want to meet");
                    }
                  }
                  else if(this.props.LoginDetails.isApprover == false && this.props.LoginDetails.userRoleId==1 && this.props.AdminSwitch){
                    if (this.props.AllSettings.settingsVM.vPurpose) {
                      if (
                        this.state.VisitorDetails.purpose != null &&
                        this.state.VisitorDetails.purpose != ""
                      ) {
                        this.dynamicFieldValidate() && this.insertVisitor();
                      } else {
                        alert("Please Enter purpose");
                      }
                    } else {
                      this.dynamicFieldValidate() && this.insertVisitor();
                    }
                  }
                   else {
                    if (this.props.AllSettings.settingsVM.vPurpose) {
                      if (
                        this.state.VisitorDetails.purpose != null &&
                        this.state.VisitorDetails.purpose != ""
                      ) {
                        this.dynamicFieldValidate() && this.insertVisitor();
                      } else {
                        alert("Please Enter purpose");
                      }
                    } else {
                      this.dynamicFieldValidate() && this.insertVisitor();
                    }
                  }

                  // }
                  // else {
                  //     alert('Please Select Expected Out Time')
                  // }
                } else {
                  alert("Please Select Expected In Time");
                }
              }
            } else {
              temp = 1;
              alert("Please Enter Valid E-mail");
            }
          } else {
            temp = 1;
            alert("Please Enter Full Name");
          }
        } else {
          alert("Please Enter Valid Mobile No.");
        }
      } else {
        alert("Please Enter Mobile No.");
      }
    }
    // if (temp == 0) {
    //   if (
    //     this.state.VisitorDetails.mobile != '' &&
    //     this.state.VisitorDetails.mobile.length <= 15
    //   ) {
    //     // if (
    //     //   this.state.VisitorDetails.inTime != null &&
    //     //   this.state.VisitorDetails.inTime != ''
    //     // ) {
    //       // if (this.state.VisitorDetails.outTime != null && this.state.VisitorDetails.outTime != '') {
    //       if (this.props.AllSettings.settingsVM.vPurpose) {
    //         if (
    //           this.state.VisitorDetails.purpose != null &&
    //           this.state.VisitorDetails.purpose != ''
    //         ) {
    //           // console.log("this.state.VisitorDetails.inTime",this.state.VisitorDetails.inTime);
    //           this.dynamicFieldValidate() && this.insertVisitor();
    //         } else {
    //           alert('Please Enter purpose');
    //         }
    //       } else {
    //         this.dynamicFieldValidate() && this.insertVisitor();
    //       }
    //     // }
    //     //  else {
    //     //   alert('Please Select Expected In Time');
    //     // }
    //   } else {
    //     alert('Please Enter Valid Mobile No.');
    //   }
    // }
  };
  /** For Receptionst */
  checkForRec = () => {
    var temp = 0;
    console.log("temo:=", temp);
    //Handler for the Submit onPress
    // if (this.state.VisitorDetails.fullName != '') {
    //   if (this.props.AllSettings.settingsVM.vEmail) {
    //     if (
    //       this.state.VisitorDetails.email != null &&
    //       this.state.VisitorDetails.email?.trim() !== ''
    //     ) {
    //       if (this.validate(this.state.VisitorDetails.email)) {
    //         temp = 0;
    //       } else {
    //         temp = 1;
    //         alert('Please Enter Valid E-mail');
    //       }
    //     }
    //   }
    // } else {
    //   temp = 1;
    //   alert('Please Enter Full Name');
    // }
    if (temp == 0) {
      if (this.state.VisitorDetails.mobile != "") {
        if (
          this.state.VisitorDetails.mobile.length >= 8 &&
          this.state.VisitorDetails.mobile.length <= 15
        ) {
          if (
            this.state.VisitorDetails?.fullName != "" &&
            this.state.VisitorDetails?.fullName != null
          ) {
            if (
              this.state.VisitorDetails?.email == null ||
              this.state.VisitorDetails.email == "" ||
              this.validate(this.state.VisitorDetails.email)
            ) {
              if (this.state.invite) {
                console.log(this.state.VisitorDetails.inTime);

                if (
                  this.state.VisitorDetails.inTime != null &&
                  this.state.VisitorDetails.inTime != ""
                ) {
                  // if (this.state.VisitorDetails.outTime != null && this.state.VisitorDetails.outTime != '') {
                  if (this.state.VisitorDetails.whomToMeetName != null) {
                    if (this.props.AllSettings.settingsVM.vPurpose) {
                      if (
                        this.state.VisitorDetails.purpose != null &&
                        this.state.VisitorDetails.purpose != ""
                      ) {
                        this.checkArogyaSetu(this.state.VisitorDetails, 3);
                      } else {
                        alert("Please Enter purpose");
                      }
                    } else {
                      this.checkArogyaSetu(this.state.VisitorDetails, 3);
                    }
                  } else {
                    alert("Please Select whom to meet you want to meet");
                  }
                } else {
                  alert("Please Select Expected In Time");
                }
              } else {
                this.state.VisitorDetails.inTime = moment().format(
                  "MM-DD-YYYY hh:mm:ss a"
                );
                this.state.VisitorDetails.date = moment().format(
                  "MM-DD-YYYY hh:mm:ss a"
                );
                console.log(this.state.VisitorDetails);

                // this.state.VisitorDetails.inTime
                if (this.state.VisitorDetails.whomToMeetName != null) {
                  if (this.props.AllSettings.settingsVM.vPurpose) {
                    if (
                      this.state.VisitorDetails.purpose != null &&
                      this.state.VisitorDetails.purpose != ""
                    ) {
                      this.checkArogyaSetu(this.state.VisitorDetails, 3);
                    } else {
                      alert("Please Enter purpose");
                    }
                  } else {
                    this.checkArogyaSetu(this.state.VisitorDetails, 3);
                  }
                } else {
                  alert("Please Select whom to meet you want to meet");
                }
              }
            } else {
              temp = 1;
              alert("Please Enter Valid E-mail");
            }
          } else {
            temp = 1;
            alert("Please Enter Full Name");
          }
        } else {
          alert("Please Enter Valid Mobile No.");
        }
      } else {
        alert("Please Enter Mobile No.");
      }
    }
  };
  /** gate keeper */
  checkArogyaSetu(item, tag) {
    // if (this.props.AllSettings.settingsVM.vArogya && (this.props.LoginDetails.userRoleId == 2 || (this.props.LoginDetails.userRoleId == 3 && !this.state.invite))) {
    //     if (item.isVizArogyaSetu != null) {
    //         this.checkTemp(item, tag)
    //     } else {
    //         alert('Please choose Arogya Setu.')
    //     }
    // } else {
    //     this.checkTemp(item, tag)
    // }
    this.checkTemp(item, tag);
  }
  checkTemp(item, tag) {
    // if (this.props.AllSettings.settingsVM.vtemprature && (this.props.LoginDetails.userRoleId == 2 || (this.props.LoginDetails.userRoleId == 3 && !this.state.invite))) {
    //     if (item.vizTemp != null && item.vizTemp != "") {
    //     } else {
    //         alert('Please add visitor Temperature')
    //     }
    // } else {
    //     this.insetOrCheckin(tag)
    // }
    this.insetOrCheckin(tag);
  }
  insetOrCheckin(tag) {
    if (tag == 2) {
      this.insertChekIn(this.state.VisitorDetails, 2);
    } else if (tag == 1) {
      this.checkinWithPhoto(this.state.VisitorDetails);
    } else {
      this.dynamicFieldValidate() && this.insertVisitor();
    }
  }
  addZero(no) {
    if (no.toString().length == 1) {
      return "0" + no;
    } else {
      return no;
    }
  }
  async insertVisitor() {
    var params1;
    var date = this.addZero(new Date().getDate());
    var month = this.addZero(new Date().getMonth() + 1);
    var year = new Date().getFullYear();
    var hours = this.addZero(new Date().getHours()); //Current Hours
    var min = this.addZero(new Date().getMinutes()); //Current Minutes
    var sec = this.addZero(new Date().getSeconds()); //Current Seconds
    var mills = new Date().getMilliseconds();
    var inviteCode1 = this.makeid(6);

    if (this.props.LoginDetails.userRoleId == 2) {
      // Gatekeeper
      // 2020-02-19T10:36:26.958Z
      params1 = Object.assign({}, this.state.VisitorDetails, {
        userId: this.props.LoginDetails.userID,
        orgId: this.props.LoginDetails.orgID,
        company: this.state.VisitorDetails.company,
        status: 4,
        inTime: null,
        checkInTime:
          year +
          "-" +
          month +
          "-" +
          date +
          "T" +
          hours +
          ":" +
          min +
          ":" +
          sec +
          "." +
          mills +
          "Z",
        date:
          year +
          "-" +
          month +
          "-" +
          date +
          "T" +
          hours +
          ":" +
          min +
          ":" +
          sec +
          "." +
          mills +
          "Z",
        inviteCode: inviteCode1,
        empId: this.props.LoginDetails.empID,
      });
      this.setState({ VisitorDetails: params1 });
      this.props.SaveVisitor(params1, this.saveVisitorSuccess);
    } else if (this.props.LoginDetails.userRoleId == 4) {
      // Emp
      var meet = false;
      await this.state.whomToMeet.filter((element) => {
        if (this.props.LoginDetails.empID === element.value) {
          meet = true;
        }
      });
      if (meet == true) {
        // Toast.show("Allowed")
        var newDate = this.getParsedDate(this.state.VisitorDetails.date);
        var outTime;
        // this.state.VisitorDetails.outTime == null
        //   ? (outTime = null) // newDate + 'T00:00:00.000Z'
        //   : (outTime =
        //       newDate + 'T' + this.state.VisitorDetails.outTime + '.000Z');

        params1 = Object.assign({}, this.state.VisitorDetails, {
          userId: this.props.LoginDetails.userID,
          orgId: this.props.LoginDetails.orgID,
          company: this.state.VisitorDetails.company,
          whomToMeet:
            this.state.VisitorDetails.whomToMeet == null
              ? this.props.LoginDetails.empID
              : this.state.VisitorDetails.whomToMeet,
          whomToMeetName: this.props.LoginDetails.fullName,
          inTime: this.state.VisitorDetails.inTime,
          outTime: this.state.VisitorDetails.outTime,
          checkInTime: null,
          date: this.state.VisitorDetails.inTime,
          inviteCode: inviteCode1,
          status: 5,
          photoProof: null,
          idProof: null,
          empId: this.props.LoginDetails.empID,
        });
        this.setState({ VisitorDetails: params1 });
        console.log("List Data===", params1);
        this.props.SaveVisitor(params1, this.saveVisitorSuccess);
      } else {
        Toast.show("You are Not Allowed to Invite Visitor.");
      }
    } else if (
      this.props.AdminSwitch &&
      this.props.LoginDetails.userRoleId == 1
    ) {
      // Emp
      var meet = false;
      await this.state.whomToMeet.filter((element) => {
        if (this.props.LoginDetails.empID === element.value) {
          meet = true;
        }
      });
      if (meet == true) {
        // Toast.show("Allowed")
        var newDate = this.getParsedDate(this.state.VisitorDetails.date);
        var outTime;
        // this.state.VisitorDetails.outTime == null
        //   ? (outTime = null) // newDate + 'T00:00:00.000Z'
        //   : (outTime =
        //       newDate + 'T' + this.state.VisitorDetails.outTime + '.000Z');

        params1 = Object.assign({}, this.state.VisitorDetails, {
          userId: this.props.LoginDetails.userID,
          orgId: this.props.LoginDetails.orgID,
          company: this.state.VisitorDetails.company,
          whomToMeet: this.props.LoginDetails.empID,
          whomToMeetName: this.props.LoginDetails.fullName,
          inTime: this.state.VisitorDetails.inTime,
          outTime: this.state.VisitorDetails.outTime,
          checkInTime: null,
          date: this.state.VisitorDetails.inTime,
          inviteCode: inviteCode1,
          status: 5,
          photoProof: null,
          idProof: null,
          empId: this.props.LoginDetails.empID,
        });
        this.setState({ VisitorDetails: params1 });
        console.log("List Data===", params1);
        this.props.SaveVisitor(params1, this.saveVisitorSuccess);
      } else {
        Toast.show("You are Not Allowed to Invite Visitor.");
      }
    } else if (
      !this.props.AdminSwitch &&
      (this.props.LoginDetails.userRoleId == 1 ||
        this.props.LoginDetails.userRoleId == 3)
    ) {
      // Rec
      var newDate = this.getParsedDate(this.state.VisitorDetails.date);
      // this.state.VisitorDetails.outTime == null
      //   ? (outTime = null) //newDate + 'T00:00:00.000Z'
      //   : (outTime =
      //       newDate + 'T' + this.state.VisitorDetails.outTime + '.000Z');
      if (this.state.invite) {
        console.log("=====", this.props.LoginDetails);
        params1 = Object.assign({}, this.state.VisitorDetails, {
          userId: this.props.LoginDetails.userID,
          orgId: this.props.LoginDetails.orgID,
          company: this.state.VisitorDetails.company,
          inTime: this.state.VisitorDetails.inTime,
          whomToMeet:
            this.state.VisitorDetails.whomToMeet == null
              ? this.props.LoginDetails.empID
              : this.state.VisitorDetails.whomToMeet,
          outTime: this.state.VisitorDetails.outTime,
          checkInTime: null,
          date: this.state.VisitorDetails.inTime,
          inviteCode: inviteCode1,
          status: 5,
          photoProof: null,
          idProof: null,
          empId: this.props.LoginDetails.empID,
        });
        this.setState({ VisitorDetails: params1 });
        console.log("Last Data===", params1);
        this.props.SaveVisitor(params1, this.saveVisitorSuccess);
      } else {
        params1 = Object.assign({}, this.state.VisitorDetails, {
          userId: this.props.LoginDetails.userID,
          orgId: this.props.LoginDetails.orgID,
          company: this.state.VisitorDetails.company,
          status: 4,
          inTime: null,
          outTime: null,
          checkInTime:
            year +
            "-" +
            month +
            "-" +
            date +
            "T" +
            hours +
            ":" +
            min +
            ":" +
            sec +
            "." +
            mills +
            "Z",
          date:
            year +
            "-" +
            month +
            "-" +
            date +
            "T" +
            hours +
            ":" +
            min +
            ":" +
            sec +
            "." +
            mills +
            "Z",
          inviteCode: inviteCode1,
          empId: this.props.LoginDetails.empID,
        });
        this.setState({ VisitorDetails: params1 });
        this.props.SaveVisitor(params1, this.saveVisitorSuccess);
      }
    }
    // this.setState({ VisitorDetails: params1 })
    console.log("Param1", this.props.LoginDetails);
    console.log("Whom Meet", this.state.whomToMeet);
  }
  saveVisitorSuccess = (res) => this.afterSaveVisitorSuccess(res);
  afterSaveVisitorSuccess(respp) {
    // if (respp != null) {
    console.log(
      "this.state.Intime",
      this.state.invite,
      this.props.LoginDetails.userRoleId
    );

    if (
      this.props.LoginDetails.userRoleId == 2 ||
      (this.props.LoginDetails.userRoleId == 3 && !this.state.invite)
    ) {
      Toast.show("New Visitor Checked In", Toast.LONG);
      // alert("New Visitor Checked In.")
      this.sendNotification(this.state.VisitorDetails, 1);
      this.getAllReceptionst(this.state.VisitorDetails, 8);
    } else if (
      (this.props.LoginDetails.userRoleId == 4 ||
        this.props.LoginDetails.userRoleId == 1) &&
      this.state.invite
    ) {
      this.getAllReceptionst(this.state.VisitorDetails, 8);
      Toast.show("Visitor invited successfully", Toast.LONG);
    } else if (this.props.LoginDetails.userRoleId == 3 && this.state.invite) {
      // this.getAllReceptionst(this.state.VisitorDetails, 8);
      console.log(
        "==================================================",
        this.state.VisitorDetails?.whomToMeet
      );
      if (
        this.props.LoginDetails.empID == this.state.VisitorDetails?.whomToMeet
      ) {
        this.getAllReceptionst(this.state.VisitorDetails, 8);
      } else {
        this.sendNotification(this.state.VisitorDetails, 1);
      }
      Toast.show("Visitor invited successfully", Toast.LONG);
    } else {
      // Alert.alert("Success", "Visitor invited successfully");

      this.sendNotification(this.state.VisitorDetails, 1);
      this.getAllReceptionst(this.state.VisitorDetails, 8);
      Toast.show("Visitor invited successfully", Toast.LONG);
    }
    // if (this.state.switchValue) {
    //     this.sendNotificationforAllgetkeeper(params1)
    // }
    this.props.Update(true);

    this.props.navigation.goBack();
    // } else {
    //     alert("Unsuccessfull");
    //     // alert("Unsuccessfull")
    // }
  }
  getParsedDate1(date) {
    date = String(date).split("-");
    return [
      this.addZero(parseInt(date[2])) +
        "-" +
        this.addZero(parseInt(date[1])) +
        "-" +
        this.addZero(parseInt(date[0])),
    ];
  }
  getParsedDate(date) {
    date = String(date).split("-");
    return [
      parseInt(date[2]) + "-" + parseInt(date[1]) + "-" + parseInt(date[0]),
    ];
  }
  makeid(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  selectPhotoTapped = async (type) => {
    try {
      if (Platform.OS === "android") {
        console.log("Step:2");

        // Calling the permission function
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Step:3");
          const options = {
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
              skipBackup: true,
            },
          };
          launchCamera(options, async (response) => {
            if (response.didCancel) {
            } else {
              response = response.assets;
              response = Object.assign({}, ...response);
              var base64Url = null;
              var u;
              await ImageResizer.createResizedImage(
                response.uri,
                response.height,
                response.width,
                "JPEG",
                100,
                0,
                undefined,
                false
              )
                .then(async (res) => {
                  u = await res.uri;
                  console.log("Resize", res);
                })
                .catch((err) => {});
              await ImgToBase64.getBase64String(u)
                .then((base64String) => {
                  base64Url = base64String;
                  // var s={img:"data:"+res.type+";base64," + base64String}

                  // console.log("+++++++", response.fileName + "," + base64String);
                })
                .catch();
              var pic = [];
              // pic.push({img: 'data:' + response.type + ';base64,' + base64Url});

              // this.setState({AllImages: pic});
              // console.log(this.state.AllImages);
              if (Platform.OS == "ios") {
                var tempSplit = response.uri.split("/");
                response.fileName = tempSplit[tempSplit.length - 1];
              }
              let ImageResponse = {
                fileName: response.fileName,
                data: "," + base64Url,
              };

              if (type == "Photo") {
                this.setState({
                  imagePath: "data:" + response.type + ";base64," + base64Url,
                });
                var ImageResponseCopy = response.fileName + "," + base64Url;

                // if (this.state.AllImages.length < 1) {
                //   this.state.AllImagesUrl.push(
                //     response.fileName + ',' + base64Url + '$',
                //   );
                //   this.state.AllImages.push({
                //     img: 'data:' + response.type + ';base64,' + base64Url,
                //   });
                // } else {
                //   Toast.show('Maximum 1 photo can be add.');
                // }
                // let ImageResponseCopy =
                //   this.state?.AllImagesUrl[0] +
                //   this.state?.AllImagesUrl[1] +
                //   this.state?.AllImagesUrl[2] +
                //   this.state?.AllImagesUrl[3] +
                //   this.state?.AllImagesUrl[4];
                // // console.log("urls:",this.state.AllImagesUrl[0]+this.state.AllImagesUrl[1]);
                // console.log(response.fileName);
                // ImageResponseCopy = ImageResponseCopy.replace(/undefined/g, '');

                const VisitorDetails = Object.assign(
                  {},
                  this.state.VisitorDetails,
                  { imageBase64StringPhotoProof: ImageResponseCopy }
                );
                this.setState({
                  VisitorDetails,
                  imageBase64StringPhotoProof: ImageResponse,
                });
              } else if (type == "Id") {
                this.setState({
                  idProofPath: "data:" + response.type + ";base64," + base64Url,
                });
                let ImageResponseCopy = response.fileName + "," + base64Url;
                const VisitorDetails = Object.assign(
                  {},
                  this.state.VisitorDetails,
                  { imageBase64StringIdProof: ImageResponseCopy }
                );
                this.setState({
                  VisitorDetails,
                  imageBase64StringIdProof: ImageResponse,
                });
              }
            }
          });
        } else {
          // Permission Denied
          alert("CAMERA Permission Denied");
        }
      } else {
        const options = {
          quality: 1.0,
          maxWidth: 500,
          maxHeight: 500,
          storageOptions: {
            skipBackup: true,
          },
        };
        launchCamera(options, async (response) => {
          if (response.didCancel) {
          } else {
            response = response.assets;
            response = Object.assign({}, ...response);
            var base64Url = null;
            var u;
            await ImageResizer.createResizedImage(
              response.uri,
              response.height,
              response.width,
              "JPEG",
              100,
              0,
              undefined,
              false
            )
              .then(async (res) => {
                u = await res.uri;
                console.log("Resize", res);
              })
              .catch((err) => {});
            await ImgToBase64.getBase64String(u)
              .then((base64String) => {
                base64Url = base64String;

                console.log(
                  "+++++++",
                  "data:" + response.type + ";base64," + base64String
                );
              })
              .catch();
            var pic = "data:" + response.type + ";base64," + base64Url;
            // console.log(pic);
            if (Platform.OS == "ios") {
              var tempSplit = response.uri.split("/");
              response.fileName = tempSplit[tempSplit.length - 1];
            }
            let ImageResponse = {
              fileName: response.fileName,
              data: "," + base64Url,
            };
            let ImageResponseCopy = response.fileName + "," + base64Url;

            console.log(response.fileName);
            if (type == "Photo") {
              this.setState({
                imagePath: "data:" + response.type + ";base64," + base64Url,
              });
              const VisitorDetails = Object.assign(
                {},
                this.state.VisitorDetails,
                { imageBase64StringPhotoProof: ImageResponseCopy }
              );
              this.setState({
                VisitorDetails,
                imageBase64StringPhotoProof: ImageResponse,
              });
            } else if (type == "Id") {
              this.setState({
                idProofPath: "data:" + response.type + ";base64," + base64Url,
              });
              const VisitorDetails = Object.assign(
                {},
                this.state.VisitorDetails,
                { imageBase64StringIdProof: ImageResponseCopy }
              );
              this.setState({
                VisitorDetails,
                imageBase64StringIdProof: ImageResponse,
              });
            }
          }
        });
        // proceed();
      }
    } catch (error) {}
  };
  SearchFilterFunction(search) {
    if (search != "") {
      const newData = this.state.visitorDataforsearch.filter(function (item) {
        var itemm = item.inviteCode + item.mobile + item.fullName;
        // if (this.props.LoginDetails.userRoleId != 2) {
        //     itemm = item.inviteCode + item.mobile + item.fullName
        // } else {
        //     itemm = item.inviteCode
        // }
        const itemData = itemm ? itemm.toUpperCase() : "".toUpperCase();
        const textData = search.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      this.setState({
        visitorData: newData,
        search: search,
      });
    } else {
      this.setState({
        search: search,
      });
      // this.callApi()
    }
  }

  onChangedName = async (fullName) => {
    const VisitorDetails = Object.assign({}, this.state.VisitorDetails, {
      fullName,
    });
    this.setState({ VisitorDetails });
    try {
      let res = await axiosAuthGet(
        "Visitor/GetVisitorMobByName/" +
          fullName +
          "/" +
          this.props.LoginDetails.userID
      );
      // console.log("==============",fullName,this.props.LoginDetails.userID,res);
      this.setState({ nameList: res });
      console.log("All Name==", res);
    } catch (error) {}
  };
}

const styles = StyleSheet.create({
  textInputStyle: {
    color: COLORS.black,
    marginBottom: 1,
    borderBottomWidth: 1.2,
    borderBottomColor: COLORS.black,
    height: Platform.OS === "ios" ? 40 : null,
  },
  dateInput: {
    width: "100%",
    height: 45,
    padding: 10,
    fontSize: 18,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 1.5,
    borderBottomColor: "green",
  },
  datepicker: { width: "100%", height: 55, paddingTop: 10 },
  error: { color: "red", fontSize: 10, padding: 2 },
  switchLable: {
    paddingLeft: 10,
    paddingTop: 15,
    textAlign: "left",
    alignSelf: "center",
    width: "49%",
  },
  switch: { alignItems: "flex-end", width: "50%", padding: 5 },
  switchContainer: {
    width: "100%",
    alignItems: "flex-end",
    height: 55,
    flexDirection: "row",
    borderBottomWidth: 1.5,
    borderColor: "green",
  },
});
// const mapStateToProps = (state) => ({
//     // network: state.NetworkReducer.network,
//     // error: state.CommanReducer.error,
//     UserDetails: state.CommanReducer.UserDetails,
//     isLoading: state.CommanReducer.isLoading,
//     SubscriptionLimit: state.CommanReducer.SubscriptionLimit,
//     WhoomToMeet: state.CommanReducer?.WhoomToMeet,
//     LoginDetails: state.CommanReducer?.LoginDetails,
//     AllSettings: state.CommanReducer?.AllSettings,
//     ReceptionList: state.CommanReducer?.ReceptionList,
//     VisitorDetails: state.VisitorsReducer?.VisitorDetails,
// });
// const mapDispatchToProps = (dispatch) => ({
//     ChkSubscriptionLimit: (userID) => dispatch(Fetch('Visitor/ChkSubscriptionLimit', 'GET', userID, serviceActionSubscriptionLimit)),
//     GetWhoomToMEet: (userID,onSuccess) => dispatch(Fetch('Users/GetWhoomToMEet', 'GET', userID, serviceActionWhoomToMeet,onSuccess)),
//     GetAllSettings: (userID) => dispatch(Fetch('Settings/GetAllSettings', 'GET', userID, serviceActionGetAllSettings)),
//     GetVisitorDtls: (inOutId) => dispatch(Fetch('Visitor/GetVisitorDtls', 'GET', inOutId, serviceActionVisitorDtls)),
//     GetUsersDetails: (empID, onSuccess) => dispatch(Fetch('Users/GetUsersDetails', 'GET', empID, undefined, onSuccess)),
//     GetVisitorByMobile: (mobile, userID, onSuccess) => dispatch(Fetch('Visitor/GetVisitorByMobile', 'GET', mobile + "/" + userID, undefined, onSuccess)),
//     SaveVisitor: (param, onSuccess) => dispatch(Fetch('Visitor/SaveVisitor', 'POST', param, undefined, onSuccess)),
//     SaveNotification: (param) => dispatch(Fetch('Notification/SaveNotification', 'POST', param)),
//     // GetReceptionList: (userID) => dispatch(Fetch('Users/GetReceptionList', 'GET', userID, serviceActionReceptionList)),
//     CheckinWithPhoto: (param, onSuccess) => dispatch(Fetch('Visitor/CheckinWithPhoto', 'POST', param, undefined, onSuccess)),
//     CheckIn: (param, onSuccess) => dispatch(Fetch('Visitor/CheckIn/' + param, 'POST', undefined, undefined, onSuccess)),
//     Update: (Update) => dispatch(serviceActionUpdate(Update)),
// })

export default connect(mapStateToProps, mapDispatchToProps)(VisitorForm);
