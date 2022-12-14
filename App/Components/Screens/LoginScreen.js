import AsyncStorage from "@react-native-async-storage/async-storage";
import { Buffer } from "buffer";
import { addDays } from "date-fns";
import moment from "moment";
import React from "react";
import {
  BackHandler,
  Image,
  ImageBackground,
  Keyboard,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-simple-toast";
import { connect } from "react-redux";
import { COLORS, IMAGES } from "../../Assets";
import {
  mapDispatchToProps,
  mapStateToProps,
} from "../../Reducers/ApiClass.js";
import { axiosPost } from "../../utility/apiConnection";
import { getItem, storeItem } from "../../utility/AsyncConfig.js";
import { CusAlert } from "../CusComponent";

var PushNotification = require("react-native-push-notification");

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      Password: "",
      OhidePassword: true,
      Username: "",
      userRoleId: "",
    };
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }
  componentDidMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
    AsyncStorage.clear();
  }
  handleBackButtonClick() {
    BackHandler.exitApp();
    return true;
  }
  addZero(no) {
    if (no.toString().length == 1) {
      return "0" + no;
    } else {
      return no;
    }
  }
  getParsedDate(date) {
    date = String(date).split("-");
    return [
      this.addZero(parseInt(date[2])) +
        "-" +
        this.addZero(parseInt(date[1])) +
        "-" +
        this.addZero(parseInt(date[0])),
    ];
  }
  login(userName, pwd) {
    Keyboard.dismiss();
    if (userName != "") {
      if (pwd != "") {
        var Password = this.encriptPass(pwd);
        var keyRes = "";
        var chars =
          "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (var i = 24; i > 0; --i)
          keyRes += chars[Math.floor(Math.random() * chars.length)];
        var params = {
          email: userName,
          password: Password,
          sssionKey: keyRes,
        };
        console.log("param", params);
        this.props.accountLogin(params, this.accountLoginSucceess);
      } else {
        Toast.show("Please enter Password");
      }
    } else {
      Toast.show("Please enter Mobile No.");
    }
  }

  receiveNotification() {
    PushNotification.localNotification({
      /* Android Only Properties */
      // ticker: "My Notification Ticker", // (optional)
      // showWhen: true, // (optional) default: true
      // autoCancel: true, // (optional) default: true
      largeIcon: "ic_launcher", // (optional) default: "ic_launcher". Use "" for no large icon.
      // largeIconUrl: logo, // (optional) default: undefined
      smallIcon: "ic_nt", // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
      // bigText: "My big text that will be shown when notification is expanded", // (optional) default: "message" prop
      // subText: "This is a subText", // (optional) default: none
      // bigPictureUrl: notification.data.image, // (optional) default: undefined
      // color: "red", // (optional) default: system default
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      // tag: "some_tag", // (optional) add tag to message
      group: "group", // (optional) add group to message
      groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
      ongoing: false, // (optional) set whether this is an "ongoing" notification
      priority: "notification.priority", // (optional) set notification priority, default: high
      // visibility: "private", // (optional) set notification visibility, default: private
      importance: "high", // (optional) set notification importance, default: high
      allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
      ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear)
      // shortcutId: "shortcut-id", // (optional) If this notification is duplicative of a Launcher shortcut, sets the id of the shortcut, in case the Launcher wants to hide the shortcut, default undefined
      channelId: "rn-push-notification-channel-id-4-default-300", // (optional) custom channelId, if the channel doesn't exist, it will be created with options passed above (importance, vibration, sound). Once the channel is created, the channel will not be update. Make sure your channelId is different if you change these options. If you have created a custom channel, it will apply options of the channel.
      onlyAlertOnce: true, //(optional) alert will open only once with sound and notify, default: false
      messageId: "notification.id", // (optional) added as `message_id` to intent extras so opening push notification can find data stored by @react-native-firebase/messaging module.
      // actions: '["Yes", "No"]', // (Android only) See the doc for notification actions to know more
      invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true
      /* iOS only properties */
      // alertAction: "view", // (optional) default: view
      // category: "", // (optional) default: empty string
      /* iOS and Android properties */
      // id: notification.id, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
      title: "test title", // (optional)
      message: "test message", // (required)
      // userInfo: notification.data, // (optional) default: {} (using null throws a JSON value '<null>' error)
      playSound: true, // (optional) default: true
      // soundName: "notisound.mp3", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
      // repeatType: "day", // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
    });
  }
  accountLoginSucceess = (respp) => this.afterAccoutLogin(respp);
  naviagte = () => {
    this.setState({ Password: null, Username: null });
    this.props.navigation.replace("DrawerScreen");
  };
  addDays(n) {
    var t = new Date();
    t.setDate(t.getDate() + n);
    var month = "0" + (t.getMonth() + 1);
    var date = "0" + t.getDate();
    month = month.slice(-2);
    date = date.slice(-2);
    var date = date + "/" + month + "/" + t.getFullYear();
    return date;
  }
  async afterAccoutLogin(respp) {
    console.log("respo====", respp);
    if (respp != null) {
      var resDate = this.getParsedDate(respp.validity);
      var sp = String(respp.validity).split(" ");
      var finalDat = resDate + "T" + sp[1];
      var msDiff = new Date().getTime() - new Date(finalDat).getTime();
      var daysTill = Math.floor(msDiff / (1000 * 60 * 60 * 24));
      if (
        respp.userID != 0 &&
        (respp.userRoleId === 1 ||
          respp.userRoleId === 2 ||
          respp.userRoleId === 3 ||
          respp.userRoleId === 4 ||
          respp.userRoleId === 6)
      ) {
        if (respp.userRoleId === 6) {
          await storeItem("LoginDetails", JSON.stringify(respp));
          this.props.GetUsersDetails(respp.empID, this.afterGetUserDetails);
        } else {
          // console.log("daysTill====", daysTill);
          if (daysTill < 0) {
            if(respp.orgID!=0){
              try {
                await storeItem("LoginDetails", JSON.stringify(respp));
                this.props.GetUsersDetails(respp.empID, this.afterGetUserDetails);
              } catch (error) {
                this.setState({ Password: null, Username: null });
              }
            }
            else{
              this.props.navigation.navigate("OrgDetails")
            }
          } else {
            if (
              respp.userRoleId == 1 &&
              (respp.validity == "" || respp.validity == null)
            ) {
              var date = moment()
                .add(15, "d") //replace 2 with number of days you want to add
                
                var renew=moment().add(16, "d").toDate()
              var params = {
                userId: respp.userID,
                subscriptionId: 1,
                payMode: 0,
                payAmount: 0,
                transRefNo: "",
                startDate:moment().format("MM-DD-YYYY hh:mm:ss"),
                endDate: moment(new Date(date)).format("MM-DD-YYYY hh:mm:ss"),
                planType: "Trial",
                planName:null,
                sendSMS:false,
                sendEmail:false,
                planLimit:0,
                renewalDate:moment(new Date(renew)).format("MM-DD-YYYY hh:mm:ss"),
              };
              console.log("params",params);

              let response=await axiosPost("Account/Subscription",params)
              // console.log("response",response);
              if(response==true){
                this.props.navigation.navigate("OrgDetails")
              }
            } else {
              this.setState({ Password: null, Username: null });
              Toast.show("Subscription expired. Please contact to Admin");
            }
          }
        }
      } else {
        Toast.show("Incorrect username or password");
      }
    } else {
      Toast.show("Server Error");
    }
  }
  afterGetUserDetails = (res) => {
    getItem("LoginDetails").then((data) => {
      var LoginDetails = JSON.parse(data);
      if (LoginDetails != false) {
        if (LoginDetails.userID != 0 || LoginDetails.userID != false) {
          this.props.saveToken(LoginDetails.empID, this.naviagte);
        } else {
          this.setState({ Password: null, Username: null });
          Toast.show("some thing went wrong please try again");
        }
      } else {
        this.setState({ Password: null, Username: null });
        Toast.show("some thing went wrong please try again");
      }
    });
  };

  encriptPass(Password) {
    var saltString = "VizNBPL2020";
    const encoder = new TextEncoder();
    var saltBytes = encoder.encode(saltString);
    var plainTextBytes = encoder.encode(Password);
    var plainTextWithSaltBytes = [
      saltBytes.byteLength + plainTextBytes.byteLength,
    ];
    for (let i = 0; i < plainTextBytes.byteLength; i++) {
      plainTextWithSaltBytes[i] = plainTextBytes[i];
    }
    for (var i = 0; i < saltBytes.byteLength; i++) {
      plainTextWithSaltBytes[plainTextBytes.byteLength + i] = saltBytes[i];
    }
    var sha512 = require("js-sha512");
    var hashByte = sha512.update(plainTextWithSaltBytes).digest("byte");
    var hashWithSaltByte = [hashByte.Length + saltBytes.byteLength];
    for (let i = 0; i < hashByte.length; i++) {
      hashWithSaltByte[i] = hashByte[i];
    }
    for (var i = 0; i < saltBytes.byteLength; i++) {
      hashWithSaltByte[hashByte.length + i] = saltBytes[i];
    }
    var buff = new Buffer(hashWithSaltByte);
    var base64data = buff.toString("base64");
    return base64data;
  }
  handleInputChange = (Username) => {
    this.setState({
      Username: Username.replace(/[- #*;,.+<>N()\{\}\[\]\\\/]/gi, ""),
    });
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        {/* <StatusBar backgroundColor={COLORS.primary} /> */}
        <StatusBar
          barStyle={"dark-content"}
          backgroundColor="transparent"
          translucent={true}
        />

        <ImageBackground
          style={{ flex: 1, paddingTop: 25, justifyContent: "center" }}
          source={IMAGES.finalS}
          imageStyle={{ resizeMode: "stretch" }}
        >
          {/* <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => Keyboard.dismiss()} > */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                padding: 15,
                width: "80%",
                alignSelf: "center",
                top: 15,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  borderBottomColor: COLORS.white,
                  borderBottomWidth: 1,
                  width: "100%",
                  height: 50,
                }}
              >
                <Image
                  source={IMAGES.username}
                  style={{ resizeMode: "cover", height: 20, width: 17 }}
                />
                <TextInput
                  style={{
                    flexGrow: 1,
                    paddingLeft: 15,
                    fontSize: 20,
                    color: COLORS.white,
                  }}
                  ref={(el) => {
                    this.Username = el;
                  }}
                  selectionColor={COLORS.white}
                  onChangeText={(Username) => this.handleInputChange(Username)}
                  returnKeyType={"next"}
                  maxLength={15}
                  keyboardType={"phone-pad"}
                  onSubmitEditing={() => {
                    this.Password.focus();
                  }}
                  value={this.state.Username}
                  placeholder="Mobile No *"
                  placeholderTextColor={COLORS.white}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderBottomColor: COLORS.white,
                  borderBottomWidth: 1,
                  top: 15,
                  width: "100%",
                  height: 50,
                }}
              >
                <Image
                  source={IMAGES.password}
                  style={{ resizeMode: "cover", height: 20, width: 17 }}
                />
                <TextInput
                  style={{
                    flexGrow: 1,
                    paddingLeft: 15,
                    fontSize: 20,
                    color: COLORS.white,
                  }}
                  ref={(el) => {
                    this.Password = el;
                  }}
                  selectionColor={COLORS.white}
                  secureTextEntry={true}
                  maxLength={20}
                  secureTextEntry={this.state.OhidePassword}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    this.login(this.state.Username, this.state.Password);
                  }}
                  onChangeText={(Password) => this.setState({ Password })}
                  value={this.state.Password}
                  placeholder="Password *"
                  placeholderTextColor={COLORS.white}
                />
                <TouchableOpacity
                  style={{
                    height: 50,
                    width: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                    right: "0%",
                  }}
                  onPress={() =>
                    this.setState({ OhidePassword: !this.state.OhidePassword })
                  }
                >
                  <Image
                    style={{
                      height: 20,
                      tintColor: COLORS.white,
                      width: 20,
                      resizeMode: "contain",
                    }}
                    source={
                      this.state.OhidePassword ? IMAGES.hidden : IMAGES.eye
                    }
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  marginTop: 18,
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("ResetPassword")
                  }
                  style={{ justifyContent: "flex-end" }}
                >
                  <Text
                    style={{
                      textAlign: "right",
                      color: "white",
                      fontSize: 15,
                      fontWeight: "bold",
                    }}
                  >
                    {"Forgot Password?"}
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => {
                  // this.receiveNotification()
                  this.login(this.state.Username, this.state.Password);
                }}
                style={{
                  //   top: 30,
                  justifyContent: "center",
                  marginTop: 22,
                  height: 40,
                  width: "85%",
                  backgroundColor: COLORS.white,
                  alignSelf: "center",
                  borderRadius: 30,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: COLORS.black,
                    fontSize: 22,
                    fontWeight: "bold",
                  }}
                >
                  LOGIN
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 18,
                }}
              >
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("Registration")}
                  style={{ justifyContent: "center", width: "85%" }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "white",
                      fontSize: 15,
                      fontWeight: "bold",
                    }}
                  >
                    {"Don’t have an account? Sign Up Now"}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ width: "94%", alignSelf: "center" }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignSelf: "center",
                    paddingVertical: 5,
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      textAlign: "right",
                      flex: 0.5,
                      fontSize: 16,
                      color: COLORS.white,
                    }}
                  >
                    {"Email :-"}
                  </Text>
                  <TouchableOpacity
                    onPress={() => Linking.openURL("mailto:support@vizman.app")}
                    style={{ flex: 1 }}
                  >
                    <Text
                      style={{
                        textAlign: "left",
                        color: COLORS.white,
                        fontSize: 15,
                        fontWeight: "bold",
                      }}
                    >
                      support@vizman.app
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    paddingVertical: 5,
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  {/* <Text style={{ textAlign: 'right',flex:0.75, fontSize: 16,color:COLORS.white }}>
                                        {"Phone :-"}
                                    </Text> */}
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL(
                        `https://api.whatsapp.com/send?phone=+919016323171&text=help?`
                      )
                    }
                    style={{ flex: 1 }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        color: COLORS.white,
                        fontSize: 15,
                        fontWeight: "bold",
                      }}
                    >
                      Hello, I need help on VizMan
                    </Text>
                  </TouchableOpacity>
                </View>
                {/* <View style={{ flexDirection: 'row', alignSelf: "center",paddingVertical:5,width:'100%',justifyContent:'center'  }}>
                                    <Text style={{  textAlign: 'right',flex:1,fontSize: 16,color:COLORS.white }}>
                                    Don't have an account?
                                    </Text>
                                <TouchableOpacity
                                    onPress={() => Linking.openURL(`https://dashboard.vizman.app/Account/Register`)}
                                    style={{flex:0.40}}>
                                    <Text  style={{ textAlign: 'left', color: COLORS.white, fontSize: 15,fontWeight: 'bold'  }} >{" "}Sign Up</Text>
                                </TouchableOpacity>
                                </View> */}
              </View>
            </View>
          </ScrollView>
          {/* </TouchableWithoutFeedback> */}
          <CusAlert
            displayAlert={
              this.props.network.isConnected
                ? this.props.error != null && this.props.error != ""
                  ? true
                  : !this.props.network.isConnected
                : !this.props.network.isConnected
            }
            iconInternet={true}
            alertMessageText={"NO INTERNET CONNECTION"}
          />
        </ImageBackground>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

// const mapStateToProps = (state) => ({
//     network: state.NetworkReducer.network,
// });
// const mapDispatchToProps = (dispatch) => ({
//     accountLogin: (params, onSuccess) => dispatch(Fetch('Account/AccountLogin', 'POST', params, serviceActionLoginDetail, onSuccess)),
//     GetUsersDetails: (empId, onSuccess) => dispatch(Fetch('Users/GetUsersDetails', 'GET', empId, serviceActionUserDetail, onSuccess)),
//     saveToken: (empId, onSuccess) => dispatch(Fetch('Notification/SaveNotifyToken', 'GET', empId + "/" + global.token, undefined, onSuccess)),

// })

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
