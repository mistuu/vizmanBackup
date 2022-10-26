import React from 'react';
import {
  Image,
  Linking,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import { BASEURL,IMAGEURL } from "../../utility/util";
import {COLORS, IMAGES} from '../../Assets';
import {
  adminSwitch,
  mobileNo,
  serviceActionNotificationsListByuser,
} from '../../Reducers/Actions/index.js';
import Fetch, {axiosAuthGet, axPost} from '../../utility/apiConnection.js';
import Modal from 'react-native-modal';
import QRCode from 'react-native-qrcode-svg';
import Colors from '../../Assets/Colors';
import ToggleSwitch from 'toggle-switch-react-native';
import Toast from 'react-native-simple-toast'
import RNFetchBlob from 'rn-fetch-blob';
// var PushNotification = require("react-native-push-notification");

const colors1 = [COLORS.primary, COLORS.primary];

class Header extends React.Component {
  constructor(props) {
    super(props);
    global.this = this;
    this.state = {
      unReadNotification: '',
      NotificationList: null,
      modalVisible: false,
      adminSwitch: false,
    };

    this.props.NotificationsListByuser(
      this.props.LoginDetails.empID + '/' + this.props.LoginDetails.userRoleId,
    );
    this.didFocusListener = this.props.navigation.addListener(
      'didFocus',
      obj => {
        //     this.setState({unReadNotification: global.unReadNotification})
      },
    );
  }
  setModalVisible = async(visible) => {
    this.setState({modalVisible: visible});
    console.log(this.props.LoginDetails);
    // let FILE_URL = await axiosAuthGet("VizOrganization/QrCode/"+this.props.LoginDetails.userID)
    // console.log(FILE_URL);
    // Linking.openURL(BASEURL+"VizOrganization/QrCode/"+this.props.LoginDetails.userID);
   
// this.downloadFile()
  };
  downloadFile = async () => {

    // Get today's date to add the time suffix in filename
    let date = new Date();
    // File URL which we want to download
    let FILE_URL = BASEURL+"VizOrganization/QrCode/"+this.props.LoginDetails.userID
    // console.log(FILE_URL);
    // Function to get extention of the file url
    let file_ext = this.getFileExtention(FILE_URL);

    // file_ext = '.' + file_ext[0];
    file_ext='.png'
    console.log(file_ext);
    // config: To get response by passing the downloading related options
    // fs: Root directory path to download
    if (Platform.OS == 'ios') {
        const { dirs: { DownloadDir, DocumentDir } } = RNFetchBlob.fs;
        const { config } = RNFetchBlob;
        const isIOS = Platform.OS == "ios";
        const aPath = Platform.select({ ios: DocumentDir, android: DownloadDir });
        const fPath = aPath + '/' + Math.floor(date.getTime() + date.getSeconds() / 2) + file_ext;
        const configOptions = Platform.select({
            ios: {
                fileCache: true,
                path: fPath,
                // mime: 'application/xlsx',
                // appendExt: 'xlsx',
                //path: filePath,
                //appendExt: fileExt,
                notification: true,
            },

            android: {
                fileCache: false,
                addAndroidDownloads: {
                    useDownloadManager: true,
                    notification: true,
                    path: fPath,
                    description: 'Downloading ...',
                }
            },
        }); config(configOptions)
            .fetch('GET', FILE_URL)
            .then(res => {

                //  this.setState({overLoader: false});
                //  this.onResumeCall();
                //  //this.refs.toast.show('File download successfully');
                setTimeout(() => {
                    // RNFetchBlob.ios.previewDocument('file://' + res.path());   //<---Property to display iOS option to save file
                    RNFetchBlob.ios.openDocument(res.data);                      //<---Property to display downloaded file on documaent viewer
                    // Alert.alert(CONSTANTS.APP_NAME, 'File download successfully');
                }, 300);

            })
            .catch(errorMessage => {
                //  this.setState({overLoader: false});
                //  this.refs.toast.show(errorMessage,2000);
            });
    } else {
        const { config, fs } = RNFetchBlob;
        let RootDir = fs.dirs.PictureDir;
        let options = {
            fileCache: true,
            addAndroidDownloads: {
                path:
                    RootDir +
                    '/file_' +
                    Math.floor(date.getTime() + date.getSeconds() / 2) +
                    file_ext,
                description: 'downloading file...',
                notification: true,
                // useDownloadManager works with Android only
                useDownloadManager: true,
            },
        };
        config(options)
            .fetch('GET', FILE_URL)
            .then(res => {
                // Alert after successful downloading
                console.log('res -> ', JSON.stringify(res));
                alert('File Downloaded Successfully.');
            });
    }

}
getFileExtention = fileUrl => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ?
        /[^.]+$/.exec(fileUrl) : undefined;
}
  componentDidMount() {
    // this.setState({NotificationList:this.props.NotificationList})
    // if( this.props.LoginDetails.userRoleId == 4 ){

    // this.props.NotificationsListByuser(this.props.LoginDetails.empID, this.props.LoginDetails.userRoleId)

    // }
    this.getDataNotification();
    this.willFocusSubscription = this.props.navigation.addListener(
      'focus',
      () => {
        this.getDataNotification();
      },
    );
  }
  componentDidUpdate(prevProps) {
    const {NotificationList, AdminSwitch} = this.props;
    if (NotificationList != prevProps.NotificationList) {
      this.getDataNotification();
    }
    if (this.props.AdminSwitch !== prevProps.AdminSwitch) {
      console.log('hthis.props.AdminSwitc', this.props.AdminSwitch);

      this.setState({adminSwitch: this.props.AdminSwitch});
    }
  }
  getDataNotification() {
    var x = 0;
    var a = null;
    a = this.props.NotificationList.filter(element => {
      return element.isRead == false;
    });
    console.log('===Notification Length+++++===========', a);
    this.setState({NotificationList: a});
  }
  // componentDidMount() {
  //   this.props.NotificationsListByuser(this.props.LoginDetails.empID + "/" + this.props.LoginDetails.userRoleId)

  // }
  // notificationListSuccess=(res)=>(this.afternotificationListSuccess(res))
  // afternotificationListSuccess(respp){
  //   if (respp != null) {
  //     var unReadNotification = respp.filter(e => !e.isRead)
  //     this.setState({ unReadNotification: unReadNotification.length })
  //     //  BadgeAndroid.setBadge(unReadNotification.length );
  //     PushNotification.setApplicationIconBadgeNumber(unReadNotification.length)
  //   }
  // }
  switchToggle(toggle) {
    console.log(toggle);
    this.setState({adminSwitch: toggle});
    this.props.adminSwitch(toggle);

    if (toggle == true) {

      Toast.show("Switch To Employee")
    } else {
      // this.props.adminSwitch(toggle);

      Toast.show("Switch To Admin")
    }
  }
  render() {
    const {navigation, title} = this.props;
    return (
      <LinearGradient
        style={{
          height: Platform.OS === 'android' ? 80 : 65,
          paddingTop: Platform.OS === 'android' ? 25 : 18,
          width: '100%',
          justifyContent: 'center',
          // borderBottomLeftRadius: this.props.LoginDetails.userRoleId == 4 ? 0 : 15,
          // borderBottomRightRadius: this.props.LoginDetails.userRoleId == 4 ? 0 : 15,
        }}
        colors={colors1}>
        {/* {
          Platform.OS === 'android' ?
            <StatusBar backgroundColor={COLORS.primary} />
            : null
        } */}

        <StatusBar
          barStyle={'dark-content'}
          backgroundColor="transparent"
          translucent={true}
        />
        <View style={{height: '100%', width: '100%', justifyContent: 'center'}}>
          <View style={{height: '100%', flexDirection: 'row'}}>
            <TouchableOpacity
              style={{
                padding: 10,
                width: 50,
                height: 50,
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => navigation.openDrawer()}>
              <Image
                source={IMAGES.menuopen}
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: 'contain',
                  alignSelf: 'center',
                }}
              />
              {/* width: '100%', height: "100%",  */}
            </TouchableOpacity>
            {/* { this.props.LoginDetails.photoURL != null &&  <View style={{  width: 50,height:50,borderRadius:50/2,alignItems:'center',justifyContent:'center'}}> */}
            {/* {
              this.props.UserDetails.photoUrl == null ?
                <Image source={IMAGES.logo} style={{ resizeMode: 'contain', height: 50, width: 60, bottom: 2 }} />
                : */}
            {/* <Image source={{ uri: IMAGEURL + this.props.LoginDetails.photoURL }} style={{ resizeMode: 'center', height: 40, width: 40,borderRadius:40/2, bottom: 2 }} /> */}
            {/* } */}

            {/* </View>} */}
            <View style={{flexGrow: 1, justifyContent: 'center'}}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'left',
                  padding: 5,
                  fontSize: 20,
                  fontWeight: 'bold',
                }}>
                {title}
              </Text>
            </View>

            {this.props.LoginDetails.userRoleId !== 4 && (
              <TouchableOpacity
                style={{
                  padding: 10,
                  width: 40,
                  height: 55,
                  // alignItems: 'flex-end',
                  // justifyContent: 'center',
                }}
                onPress={() => this.setModalVisible(true)}>
                <Image
                  source={IMAGES.qrcode}
                  style={{height: 28, width: 28, resizeMode: 'contain'}}
                />
              </TouchableOpacity>
            ) }
            {/* {this.props.LoginDetails.userRoleId == 1 && (
              <View style={{justifyContent: 'center', marginRight: 5}}>
                <ToggleSwitch
                  isOn={this.state.adminSwitch}
                  onColor="green"
                  offColor={Colors.grayCCC}
                  label=""
                  labelStyle={{fontSize: 18, color: Colors.white}}
                  size="medium"
                  onToggle={isOn => this.switchToggle(isOn)}
                />
              </View>
            )} */}
            {title != 'Courier' &&
            title != 'Report' &&
            title != 'Change Password' &&
            (this.props.LoginDetails.userRoleId == 4 ||
              this.props.LoginDetails.userRoleId == 1) ? (
                title == "Employee List"?
              <TouchableOpacity
                style={{
                  padding: 10,
                  width: 40,
                  height: 55,
                  // alignItems: 'flex-end',
                  // justifyContent: 'center',
                }}
                onPress={() => {
                  this.props.navigation.navigate("AdminNewEmploy", {tag: "Add New Employee" })
                 
                }}>
                <Image
                  source={IMAGES.plus}
                  style={{
                    height: 28,
                    width: 28,
                    resizeMode: 'contain',
                    tintColor: Colors.white,
                  }}
                />
              </TouchableOpacity>:
              <TouchableOpacity
              style={{
                padding: 10,
                width: 40,
                height: 55,
                // alignItems: 'flex-end',
                // justifyContent: 'center',
              }}
              onPress={() => {
                this.props.mobileNo({mobStatus: 0}),
                  this.props.navigation.navigate('VisitorForm', {tag: 0})
              }}>
              <Image
                source={IMAGES.plus}
                style={{
                  height: 28,
                  width: 28,
                  resizeMode: 'contain',
                  tintColor: Colors.white,
                }}
              />
            </TouchableOpacity>
            ) : null}

            {this.props.LoginDetails.userRoleId == 3 ||
            this.props.LoginDetails.userRoleId == 4 ||
            this.props.LoginDetails.userRoleId == 1 ? (
              <View style={{justifyContent: 'center', marginHorizontal: 10}}>
                {this.state.NotificationList?.length > 0 ? (
                  Platform.OS === 'ios' ? (
                    <View
                      style={{
                        left: 20,
                        zIndex: 99,
                        top: -4,
                        position: 'absolute',
                        borderRadius: 17 / 2,
                        overflow: 'hidden',
                      }}>
                      <Text
                        style={{
                          paddingTop: 1.5,
                          fontWeight: 'bold',
                          height: 17,
                          width: 17,
                          borderRadius: 17 / 2,
                          backgroundColor: 'red',
                          color: COLORS.white,
                          fontSize: 10,
                          textAlign: 'center',
                          alignSelf: 'center',
                        }}>
                        {this.state.NotificationList?.length}
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={{
                        marginTop: 4,
                        left: 20,
                        zIndex: 99,
                        top: -1,
                        position: 'absolute',
                        borderWidth: 1,
                        borderColor: COLORS.white,
                        borderRadius: 17 / 2,
                      }}>
                      <Text
                        style={{
                          paddingTop: 1.5,
                          fontWeight: 'bold',
                          height: 15,
                          width: 15,
                          borderRadius: 17 / 2,
                          backgroundColor: 'red',
                          color: COLORS.white,
                          fontSize: 10,
                          textAlign: 'center',
                          alignSelf: 'center',
                        }}>
                        {this.state.NotificationList?.length}
                      </Text>
                    </View>
                  )
                ) : null}
                <TouchableOpacity
                  style={{
                    padding: 10,
                    width: 40,
                    height: 55,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() =>
                    this.props.navigation.navigate('NotificationScreen')
                  }>
                  <Image
                    source={IMAGES.noti}
                    style={{height: 28, width: 28, resizeMode: 'contain'}}
                  />
                </TouchableOpacity>
              </View>
            ) : null}
            {/* {
             this.props.LoginDetails.userRoleId == 1 &&
             <TouchableOpacity
                style={{
                  padding: 10,
                  width: 40,
                  height: 55,
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                }}
                onPress={() => {
                    this.props.navigation.navigate('SettingScreen');
                }}>
                <Image
                  source={IMAGES.Setting}
                  style={{
                    height: 28,
                    width: 28,
                    resizeMode: 'contain',
                    tintColor: Colors.white,
                  }}
                />
              </TouchableOpacity>
            } */}
          </View>

          {/* <View style={{width:'100%', borderBottomWidth:0.2, borderBottomColor:'white'}}/> */}
          <Modal
            isVisible={this.state.modalVisible}
            onBackdropPress={() => this.setModalVisible(false)}
            onSwipeComplete={() => this.setModalVisible(false)}
            swipeDirection="left"
            onBackButtonPress={() => this.setModalVisible(false)}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Image
                source={{uri:IMAGEURL+this.props.LoginDetails.qrcode}}
                style={{height:"100%",width:"100%",resizeMode:'contain'}}
              />
            </View>
          </Modal>
        </View>
        {/* <View style={{width:'100%', borderBottomWidth:0.2, borderBottomColor:'white'}}/> */}
        {/* </SafeAreaView> */}
      </LinearGradient>
    );
  }
}
const mapStateToProps = state => ({
  // network: state.NetworkReducer.network,
  // error: state.CommanReducer.error,
  UserDetails: state.CommanReducer.UserDetails,
  LoginDetails: state.CommanReducer?.LoginDetails,
  NotificationList: state.CommanReducer.NotificationList,
});
const mapDispatchToProps = dispatch => ({
  NotificationsListByuser: (params, onSuccess) =>
    dispatch(
      Fetch(
        'Notification/NotificationsListByuser',
        'GET',
        params,
        serviceActionNotificationsListByuser,
        onSuccess,
        false,
      ),
    ),
  mobileNo: payload => dispatch(mobileNo(payload)),
  adminSwitch: payload => dispatch(adminSwitch(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
