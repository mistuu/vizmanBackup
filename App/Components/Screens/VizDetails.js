import React, {Component} from 'react';
import Moment from 'moment';
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  Text,
  TextInput,
  Linking,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  SafeAreaView,
  PermissionsAndroid,
} from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';
import DateTimePicker from '@react-native-community/datetimepicker';

import DatePicker from 'react-native-datepicker';
import LinearGradient from 'react-native-linear-gradient';
// import DateTimePicker from 'react-native-modal-datetime-picker';
import Toast from 'react-native-simple-toast';
import {Hoshi} from 'react-native-textinput-effects';
import {connect} from 'react-redux';
import {COLORS, IMAGES} from '../../Assets/index.js';
import {mapDispatchToProps, mapStateToProps} from '../../Reducers/ApiClass.js';
import {axiosAuthGet, axiosPost, axPost} from '../../utility/apiConnection.js';
import {visitorDetailEmpty} from '../../utility/emptyClass.js';
import {IMAGEURL} from '../../utility/util.js';
import CheckIn from './CheckIn.js';
import Modal from 'react-native-modal';
import Images from '../../Assets/Images/index.js';
import Colors from '../../Assets/Colors/index.js';
import {RFPercentage} from 'react-native-responsive-fontsize';
const {width, height} = Dimensions.get('window');

import ImgToBase64 from 'react-native-image-base64';
import ImagePicker from 'react-native-image-crop-picker';

import {actions, RichEditor, RichToolbar} from 'react-native-pell-rich-editor';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import {KeyboardAvoidingView} from 'react-native';
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';
import axios from 'axios';
import moment from 'moment';
const placeholderTextColor = COLORS.placeholderColor;
var s;
const richText = React.createRef();
class VizDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      VisitorDetails: null,
      picModalVisible: false,
      picImagePath: null,
      modalVisible: this.props.modalVisible,
      skipModalCheckIn: false,
      imageBase64StringPhotoProof: {fileName: null, data: null},
      imageBase64StringIdProof: {fileName: null, data: null},
      resmodalVisible: false,
      date: null,
      Intime: null,
      Outtime: null,
      remarks: '',
      meetOutModalVisible: false,
      newDetailsResponse: null,
      meetingoutSH: false,
      RejectMeeiting: false,
      PicModalVisible: false,
      remarkImage: null,
      Indate: new Date(),
      time: null,
      mode: 'date',
      show: false,
      Outdate: new Date(),
      Outtimee: null,
      Outmode: 'date',
      Outshow: false,
      resDate:null,
    };
  }
  async componentDidMount() {
    console.log('data is ==', this.props.visitorDetails);
    console.log("Emp ID:==",this.props.LoginDetails);
    try {
      let response = await axiosAuthGet(
        'Visitor/GetVisitorDtls/' + this.props.visitorDetails.inOutId+"/"+this.props.LoginDetails.empID,
      );
      this.setState({VisitorDetails: response});

      console.log('Response ====', this.state.VisitorDetails);
      console.log("Bloed==",this.props.Blockedviz);
    } catch (error) {}
  }
  onChangeeee = (event, selectedValue) => {
    var VisitorDetails = Object.assign({}, this.state.VisitorDetails, {
      inTime:
        Moment(selectedValue).format('MM-DD-YYYY hh:mm:ss a') 
    });
  
    this.setState({
      VisitorDetails, 
        Indate:selectedValue
    })
    console.log("Datetime==",Moment(selectedValue).format('MM-DD-YYYY hh:mm:ss a'));
    
  }
  onOutChangeeee=(event, selectedValue) => {
    
    var VisitorDetails = Object.assign({}, this.state.VisitorDetails, {
      outTime:
        Moment(selectedValue).format('MM-DD-YYYY hh:mm:ss a')
    });
    this.setState({
      VisitorDetails,
      Outdate:selectedValue
      // isExpectedOutVisible: false,
    });
  }
  onChange = (event, selectedValue) => {
    console.log(selectedValue);
    // this.setState({show: Platform.OS == 'ios'});
    if (this.state.mode == 'date') {
      const currentDate = selectedValue || new Date();
      this.setState({
        Indate: currentDate,
        mode: 'time',
        // show: Platform.OS != 'ios',
      });
      console.log(currentDate);
    } else {
      var inTime = selectedValue || new Date();
      // Toast.show('Please select valid In Time');
      var currentTime = new Date().getTime();

      if (inTime >= currentTime) {
       
        this.setState({
          time:inTime,
          mode: 'date',
          show: false,
        });
      } else {
        this.setState({
          time:currentTime,
          mode: 'date',
          show: false,
        });
        
      }  
      // this.setState({ time: selectedTime, mode: 'date', show: Platform.OS == 'ios' })

      // this.state.getSelectedDate = outTime
    }
    var VisitorDetails = Object.assign({}, this.state.VisitorDetails, {
      inTime:
        Moment(this.state.Indate).format('MM-DD-YYYY') +
        ' ' +
        Moment(this.state.time).format("hh:mm:ss a"),
    });
    console.log("In Time=======",VisitorDetails);

    // Toast.show('Please select valid In Time');
    this.setState({VisitorDetails})

  };

  showMode = currentMode => {
    this.setState({show: true, mode: currentMode});
  };
      
  showDatepicker = () => {
    this.setState({Indate: new Date(), time: new Date()});
    this.showMode('date');
  };


  OutonChange = (event, selectedValue) => {
    // console.log("out Date",selectedValue.getTime()+"===="+this.state.date.getTime());
    // this.setState({Outshow: Platform.OS == 'ios'});
    if (this.state.Outmode == 'date') {
      var currentDate = selectedValue || new Date();
      var c=moment(currentDate).format("DD-MM-YYYY")
      var d=moment(this.state.Indate).format("DD-MM-YYYY")
      if(c.toString()>=d.toString()){
        this.setState({
          Outdate: currentDate,
          Outmode: 'time',
          // Outshow: Platform.OS != 'ios',
        });
      }
      else{
        this.setState({Outdate: this.state.Indate,
          Outmode: 'time',
          // Outshow: Platform.OS != 'ios',
        })
        Toast.show("Please Select Valid Date.")
      }
      console.log(currentDate);
    } else {
      var outTime = selectedValue || new Date();
      if (outTime >= this.state.time) {
        this.setState({
          Outtime: outTime,
          Outmode: 'date',
          Outshow: false,
        });
        var VisitorDetails = Object.assign({}, this.state.VisitorDetails, {
          outTime:
            Moment(this.state.Outdate).format('MM-DD-YYYY') +
            ' ' +
            Moment(outTime).format("hh:mm a"),
        });
        this.setState({
          VisitorDetails,
          // isExpectedOutVisible: false,
        });
      } else {
        this.setState({
          Outtime: this.state.time,
          Outmode: 'date',
          Outshow: false,
        });
        var VisitorDetails = Object.assign({}, this.state.VisitorDetails, {
          outTime:
            Moment(this.state.Outdate).format('MM-DD-YYYY') +
            ' ' +
            moment(this.state.time).format("hh:mm a"),
        });
        this.setState({
          VisitorDetails,
          // isExpectedOutVisible: false,
        });
        Toast.show('Please select valid Out Time');
      }
    }
    var VisitorDetails = Object.assign({}, this.state.VisitorDetails, {
      outTime:
        Moment(this.state.Outdate).format('MM-DD-YYYY') +
        ' ' +
        Moment(outTime).format("hh:mm a"),
    });
    this.setState({
      VisitorDetails,
      // isExpectedOutVisible: false,
    });
    console.log("out time====",VisitorDetails);
  };

  OutshowMode = currentMode => {
    this.setState({Outshow: true, Outmode: currentMode});
  };

  OutshowDatepicker = () => {
    this.setState({Outdate: new Date(), Outtime: new Date()});

    this.OutshowMode('date');
  };
  setModalVisible(visible) {
    this.setState({PicModalVisible: visible});
  }
  selectPhotoTapped = async () => {
    // const options = {};
    console.log('Step:1');
    try {
      if (Platform.OS === 'android') {
        console.log('Step:2');

        // Calling the permission function
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Step:3');

          // Permission Granted
          // proceed();
          // alert('CAMERA Permission ');
          const options = {};
          ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
          }).then(async image => {
            var u;
            await ImageResizer.createResizedImage(
              image.path,
              image.height,
              image.width,
              'JPEG',
              100,
              0,
              undefined,
              false,
            )
              .then(async res => {
                console.log(res);
                u = res.uri;
                await ImgToBase64.getBase64String(u)
                  .then(base64String => {
                    var newPic =
                      'data:' + image.mime + ';base64,' + base64String;
                    // console.log(newPic);
                    this.setModalVisible(false);
                    this.onPressAddImage(newPic);
                    // console.log("+++++++", response.fileName + "," + base64String);
                  })
                  .catch();
              })
              .catch(err => {});
          });
        } else {
          // Permission Denied
          alert('CAMERA Permission Denied');
        }
      } else {
        // proceed();
        const options = {};

        ImagePicker.openCamera({
          width: 300,
          height: 400,
          cropping: true,
        }).then(async image => {
          var u;
          await ImageResizer.createResizedImage(
            image.path,
            image.height,
            image.width,
            'JPEG',
            100,
            0,
            undefined,
            false,
          )
            .then(async res => {
              console.log(res);
              u = res.uri;
              await ImgToBase64.getBase64String(u)
                .then(base64String => {
                  var newPic = 'data:' + res.type + ';base64,' + base64String;
                  // console.log(newPic);
                  this.setModalVisible(false);
                  this.onPressAddImage(newPic);
                  // console.log("+++++++", response.fileName + "," + base64String);
                })
                .catch();
            })
            .catch(err => {});
        });
      }
    } catch (error) {}
  };
  chooseFileGallary = () => {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(async image => {
      var u;
      await ImageResizer.createResizedImage(
        image.path,
        image.height,
        image.width,
        'JPEG',
        100,
        0,
        undefined,
        false,
      )
        .then(async res => {
          console.log(res);
          u = res.uri;
          await ImgToBase64.getBase64String(u)
            .then(base64String => {
              // this.setState({
              //   imagePath: response.fileName + ',' + base64String,
              // });
              var newPic = 'data:' + image.mime + ';base64,' + base64String;
              // console.log(newPic);
              this.setModalVisible(false);
              this.onPressAddImage(newPic);
              // console.log("+++++++", response.fileName + "," + base64String);
            })
            .catch();
        })
        .catch(err => {});
    });
  };
  onPressAddImage = img => {
    // insert URL

    richText.current?.insertImage(img);
    // insert base64
    // this.richText.current?.insertImage(`data:${image.mime};base64,${image.data}`);
  };

  renderNode(node, index, siblings, parent, defaultRenderer) {
    if (node.name == 'img') {
      const a = node.attribs;
      return (
        <Image
          style={{width: 300, height: 300, marginBottom: -50}}
          source={{uri: a.src}}
        />
      );
    }
  }
  setImageOpen = (visible, picImagePath) => {
    console.log('Image pic===', picImagePath);
    this.setState({picModalVisible: visible, picImagePath: picImagePath});
  };
  callShare = mobile => {
    // let phoneNumber = '8849632126'
    if (mobile != null) {
      Linking.openURL(`tel:${mobile}`);
    } else {
      Toast.show('Mobile number not exist');
    }
  };
  gmailShare = email => {
    if (email != null) {
      Linking.openURL('mailto:' + email);
    } else {
      Toast.show('Mail id not exist');
    }
  };
  whatsappShare = async (phone, details) => {
    console.log(details);
    //  this.props.LoginDetails.userID,
    //  this.props.LoginDetails.empID,
    // let response = await axiosAuthGet(
    //   'Visitor/EmpVisitorList/' +
    //     this.props.LoginDetails.userID +
    //     '/' +
    //     this.props.LoginDetails.empID,
    // );
    // console.log(response);
    var comp;

    // await response.filter(e => {
    //   comp = e.company;
    // });
    // console.log(comp);
    if (phone != null) {
      Linking.openURL(`whatsapp://send?phone=+91` + phone);
    } else {
      Toast.show('Whatsapp number not found');
    }
  };
  SMSSahre = mobile => {
    if (mobile != null) {
      Linking.openURL('sms:' + mobile);
    } else {
      Toast.show('Mobile number not exist');
    }
  };
  shareRemarks = async remarks => {
    remarks = remarks.replace(/<div>(\r\n|\n|\r)/g, '');
    console.log(remarks);
    if (remarks != null || remarks != '') {
      let shareImage = {
        title: 'Remark', //string
        message: remarks,
        // url: s,
        // social: Share.Social.WHATSAPP,
        // whatsAppNumber: "91" + mobile,
      };
      Share.open(shareImage);
    } else {
      Toast.show('Remarks is empty.');
    }
  };
  onInsertLink() {
    // this.richText.current?.insertLink('Google', 'http://google.com');
    this.linkModal.current?.setModalVisible(true);
  }

  onLinkDone({title, url}) {
    this.richText.current?.insertLink(title, url);
  }
  onRejectSubmit =async type => {
    console.log(type);
    if (type == 2) {
      this.setState({modalVisible: false});
      console.log(
        'inOutid',
        this.state.VisitorDetails?.inOutId,
        this.props.LoginDetails?.fullName,
        this.state.remarks,
      );
      try {
        const regex = /(<([^>]+)>)/ig;
const result = this.state.remarks.replace(regex, '');
    this.props.VizRejected(
        this.state.VisitorDetails?.inOutId +
          '/' +result+"/"+
          this.props.LoginDetails?.fullName,
        this.vizRejectedSuccess,
      );
        
      } catch (error) {
        console.log(error);
      }
      
    } else if (type == 1) {
      var param = {
        inOutId: this.state.VisitorDetails.inOutId,
        comment: this.state.remarks,
      };
      this.props.MeetingOut(param, this.meetinOutSuccess),
        this.setState({meetingoutSH: false});
    }
  };
  render() {
    var backgroundColor = COLORS.white;
    var status = '';
    if (
      this.props.LoginDetails.userRoleId != 2 ||
      this.props.LoginDetails.userRoleId != 3
    ) {
      if (this.state.VisitorDetails?.status == 3) {
        backgroundColor = COLORS.tempYellow;
        status = 'RESCHEDULED';
      } else if (this.state.VisitorDetails?.status == 4) {
        if (
          this.state.VisitorDetails?.checkInTime != null &&
          this.state.VisitorDetails?.checkOutTime != null
        ) {
          backgroundColor = '#961448';
          status = 'ALREADY CHECKOUT';
        } else {
          backgroundColor = COLORS.skyBlue;
          status = 'WAITING';
        }
      } else if (this.state.VisitorDetails?.status == 5) {
        backgroundColor = '#4667cc';
        status = 'INVITED';
      } else if (this.state.VisitorDetails?.status == 2) {
        backgroundColor = COLORS.tempRed;
        status = 'REJECTED';
      } else if (this.state.VisitorDetails?.status == 1) {
        backgroundColor = COLORS.tempGreen;
        status = 'APPROVED';
      } else if (this.state.VisitorDetails?.status == 0) {
        backgroundColor = COLORS.white;
        status = '';
      }
    }
    var photo;
    var idProofPhoto;
    if (this.state.VisitorDetails?.imagesPhoto.length != 0) {
      console.log('step1');
      this.state.VisitorDetails?.imagesPhoto.filter(e => {
        photo = e.photoproof;
      });
      // var photo = this.state.VisitorDetails?.photoProof.split('$');
      // var firstPic = photo[0];
    } else {
      photo = null;
    }
    if (this.state.VisitorDetails?.imagesId != null) {
      this.state.VisitorDetails?.imagesId.filter(e => {
        idProofPhoto = e.idproof;
      });
      // var photo = this.state.VisitorDetails?.photoProof.split('$');
      // var firstPic = photo[0];
    } else {
      idProofPhoto = null;
    }
    console.log('Photo', photo);
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0;

    return (
      <View style={{flex: 1, backgroundColor: Colors.whitef4}}>
        <LinearGradient
          style={{
            height: Platform.OS == 'ios' ? '12%' : '10%',
            paddingTop: 25,
            width: '100%',
            justifyContent: 'center',
          }}
          colors={[COLORS.primary, COLORS.third]}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: Platform.OS == 'ios' ? 17 : 5,
            }}>
            <TouchableOpacity
              style={{
                marginLeft: 10,
                padding: 10,
                height: 50,
                width: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => this.props.navigation.goBack()}>
              <Image source={IMAGES.back} style={{height: 22, width: 22}} />
            </TouchableOpacity>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                paddingLeft: 20,
                padding: 5,
                fontSize: 22,
              }}>
              Visitor Details
            </Text>
          </View>
        </LinearGradient>
        {this.props.LoginDetails.userRoleId == 4 ||
        this.props.LoginDetails.userRoleId == 1 ||
        this.props.LoginDetails.empID == this.state.VisitorDetails?.whomToMeet
          ? this.meetOutModal()
          : null}
        {this.state.skipModalCheckIn && (
          <CheckIn
            skipModalCheckIn={this.state.skipModalCheckIn}
            VisitorDetails={this.state.VisitorDetails}
            imageBase64StringIdProof={this.state.imageBase64StringIdProof}
            imageBase64StringPhotoProof={this.state.imageBase64StringPhotoProof}
            onClose={() => {
              this.setState({
                VisitorDetails: visitorDetailEmpty,
                skipModalCheckIn: false,
                imageBase64StringPhotoProof: {fileName: null, data: null},
                imageBase64StringIdProof: {fileName: null, data: null},
                resmodalVisible: false,
              });
            }}
            onUpdate={() => {
              this.props.onUpdate();
            }}
          />
        )}

        <ScrollView style={{}}>
          <View
            style={{
              flex: 1,
              marginTop: 90,
              padding: 10,
              borderRadius: 13,
              // alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                padding: 10,
                width: '95%',
                borderRadius: 13,
                alignSelf: 'center',
                backgroundColor: Colors.white,
              }}>
              <View
                style={{
                  marginTop: -80,
                  borderRadius: 130 / 2,
                  height: 130,
                  width: 130,
                  alignSelf: 'center',
                }}>
                <TouchableOpacity
                  onPress={() =>
                    this.setImageOpen(true, photo != null || '' ? photo : null)
                  }>
                  {this.state.VisitorDetails?.imagesPhoto.length != 0 ? (
                    <Image
                      source={{
                        uri: IMAGEURL + '/' + photo,
                      }}
                      style={{width: 130, height: 130, borderRadius: 130 / 2}}
                    />
                  ) : (
                    <Image
                      source={Images.def_visitor}
                      style={{width: 130, height: 130, borderRadius: 130 / 2}}
                    />
                  )}
                </TouchableOpacity>
                {this.state.VisitorDetails?.isVip == true ? (
                  <View style={{alignItems: 'center', marginTop: -10}}>
                    <Image
                      source={Images.star}
                      style={{height: 20, width: 20}}
                    />
                  </View>
                ) : null}
              </View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginTop: 5,
                }}>
                {this.state.VisitorDetails?.isVip == true &&
                this.props.LoginDetails.empID !=
                  this.state.VisitorDetails?.whomToMeet &&
                (this.props.LoginDetails.userRoleId != 4 ||
                  this.props.LoginDetails.userRoleId != 1)
                  ? this.state.VisitorDetails?.fullName?.replace(
                      /.(?=.{2,}$)/g,
                      '*',
                    )
                  : this.state.VisitorDetails?.fullName}
              </Text>

              <Text
                style={{textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>
                {this.props.LoginDetails.empID !=
                this.state.VisitorDetails?.whomToMeet
                  ? this.state.VisitorDetails?.mobile?.replace(
                      /.(?=.{2,}$)/g,
                      '*',
                    )
                  : this.state.VisitorDetails?.mobile}
              </Text>
            </View>
            <ScrollView horizontal={true}>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  width: '95%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: 10,
                }}>
                {this.props.LoginDetails.userRoleId != 2 && (
                  <TouchableOpacity
                    style={{
                      height: 70,
                      width: 92,
                      marginLeft: 10,
                      backgroundColor: Colors.white,
                      padding: 10,
                      borderRadius: 10,
                      alignItems: 'center',
                    }}
                    onPress={
                      () => {
                        this.props.mobileNo({
                          mobStatus: 1,
                          mob: this.state.VisitorDetails?.mobile,
                        }),
                          this.props.navigation.navigate('VisitorForm', {
                            tag: 0,
                          });
                      }
                      // this.whatsappShare(this.state.VisitorDetails?.mobile)
                    }>
                    <Image
                      source={Images.reInvite}
                      style={{height: 25, width: 25,marginTop:-4, alignSelf: 'center'}}
                    />
                    <Text style={{}}>Re-Invite</Text>
                  </TouchableOpacity>
                )}

                {this.props.LoginDetails.empID !=
                this.state.VisitorDetails?.whomToMeet ? null : (
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      style={{
                        height: 70,
                        width: 90,
                        backgroundColor: Colors.white,
                        padding: 10,
                        marginLeft: 10,
                        borderRadius: 10,
                        alignItems: 'center',
                      }}
                      onPress={() =>
                        this.whatsappShare(
                          this.state.VisitorDetails?.mobile,
                          this.state.VisitorDetails,
                        )
                      }>
                      <Image
                        source={Images.whatsapp}
                        style={{height: 20, width: 20, alignSelf: 'center'}}
                      />
                      <Text style={{marginTop: 3}}>Whatsapp</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        backgroundColor: Colors.white,
                        padding: 10,
                        height: 70,
                        width: 90,
                        marginLeft: 10,
                        borderRadius: 10,
                        alignItems: 'center',
                      }}
                      onPress={() =>
                        this.callShare(this.state.VisitorDetails?.mobile)
                      }>
                      <Image
                        source={Images.call}
                        style={{height: 20, width: 20}}
                      />
                      <Text style={{marginTop: 3}}>Call</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        backgroundColor: Colors.white,
                        padding: 10,
                        height: 70,
                        marginLeft: 10,
                        width: 90,
                        borderRadius: 10,
                        alignItems: 'center',
                      }}
                      onPress={() =>
                        this.SMSSahre(this.state.VisitorDetails?.mobile)
                      }>
                      <Image
                        source={Images.SMS}
                        style={{height: 20, width: 20}}
                      />
                      <Text style={{marginTop: 3}}>Message</Text>
                    </TouchableOpacity>
                    {(this.state.VisitorDetails?.email != null ||
                      this.state.VisitorDetails?.email != '') && (
                      <TouchableOpacity
                        style={{
                          backgroundColor: Colors.white,
                          padding: 10,
                          height: 70,
                          marginLeft: 10,
                          width: 90,
                          borderRadius: 10,
                          alignItems: 'center',
                        }}
                        onPress={() =>
                          this.gmailShare(this.state.VisitorDetails?.email)
                        }>
                        <Image
                          source={Images.gmail}
                          style={{
                            height: 20,
                            width: 20,
                          }}
                        />
                        <Text style={{marginTop: 3}}>E-mail</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
                {!idProofPhoto == null ||
                  (!idProofPhoto == '' && (
                    <TouchableOpacity
                      style={{
                        backgroundColor: Colors.white,
                        padding: 10,
                        height: 70,
                        marginLeft: 10,
                        width: 90,
                        borderRadius: 10,
                        alignItems: 'center',
                      }}
                      onPress={() => this.setImageOpen(true, idProofPhoto)}>
                      <Image
                        source={Images.idProof}
                        style={{height: 20, width: 20}}
                      />
                      <Text style={{marginTop: 3}}>ID</Text>
                    </TouchableOpacity>
                  ))}
              </View>
            </ScrollView>

            {/* Recp and Gatekeeper */}
            {this.props.LoginDetails.userRoleId == 2 ||
            this.props.LoginDetails.userRoleId == 3 ? (
              <ScrollView
                style={{}}
                contentContainerStyle={{alignItems: 'center'}}>
                <View
                  style={{
                    padding: 10,
                    width: '95%',
                    marginTop: 10,

                    borderRadius: 13,
                    backgroundColor: Colors.white,
                  }}>
                  <View>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: Colors.black,
                        padding: 7,
                      }}>
                      BASIC DETAILS
                    </Text>
                    <View
                      style={{borderWidth: 1, borderColor: Colors.primary}}
                    />
                    <View>
                      <View style={{marginLeft: 5, width: '100%'}}>
                        <View style={{flexDirection: 'row', marginTop: 10}}>
                          <View style={{width: width / 2.3}}>
                            {!this.state.VisitorDetails?.company == null ||
                              (!this.state.VisitorDetails?.company == '' && (
                                <View>
                                  <Text>Company</Text>
                                  <Text
                                    style={{
                                      fontWeight: 'bold',
                                      textAlign: 'left',
                                    }}>
                                    {this.state.VisitorDetails?.isVip == true &&
                                    this.props.LoginDetails.empID !=
                                      this.state.VisitorDetails?.whomToMeet
                                      ? this.state.VisitorDetails?.company?.replace(
                                          /.(?=.{2,}$)/g,
                                          '*',
                                        )
                                      : this.state.VisitorDetails?.company}
                                  </Text>
                                </View>
                              ))}
                            {!this.state.VisitorDetails?.email == null ||
                              (!this.state.VisitorDetails?.email == '' && (
                                <View style={{marginTop: 5}}>
                                  <Text>Email id:</Text>
                                  <Text style={{fontWeight: 'bold'}}>
                                    {this.props.LoginDetails.empID !=
                                    this.state.VisitorDetails?.whomToMeet
                                      ? this.state.VisitorDetails?.email?.replace(
                                          /(\w{0})[\w.-]+@([\w.]+\w)/,
                                          '$1***@$2',
                                        )
                                      : this.state.VisitorDetails?.email}
                                  </Text>
                                </View>
                              ))}

                            {this.props.AllSettings.settingsVM.vAddlCol1
                              ? !this.state.VisitorDetails?.addlCol1 == null ||
                                (!this.state.VisitorDetails?.addlCol1 == '' && (
                                  <View style={{}}>
                                    <Text style={{}}>
                                      {this.state.VisitorDetails?.colName1}
                                    </Text>
                                    <Text style={{fontWeight: 'bold'}}>
                                      {this.state.VisitorDetails?.isVip ==
                                        true &&
                                      this.props.LoginDetails.empID !=
                                        this.state.VisitorDetails?.whomToMeet
                                        ? this.state.VisitorDetails?.addlCol1?.replace(
                                            /.(?=.{2,}$)/g,
                                            '*',
                                          )
                                        : this.state.VisitorDetails?.addlCol1 ==
                                          'true'
                                        ? 'Yes'
                                        : this.state.VisitorDetails?.addlCol1 ==
                                          'false'
                                        ? 'No'
                                        : this.state.VisitorDetails?.addlCol1}
                                    </Text>
                                  </View>
                                ))
                              : null}
                            {this.props.AllSettings.settingsVM.vAddlCol3
                              ? !this.state.VisitorDetails?.addlCol3 == null ||
                                (!this.state.VisitorDetails?.addlCol3 == '' && (
                                  <View style={{}}>
                                    <Text style={{}}>
                                      {this.state.VisitorDetails?.colName3}
                                    </Text>
                                    <Text style={{fontWeight: 'bold'}}>
                                      {this.state.VisitorDetails?.isVip ==
                                        true &&
                                      this.props.LoginDetails.empID !=
                                        this.state.VisitorDetails?.whomToMeet
                                        ? this.state.VisitorDetails?.addlCol3?.replace(
                                            /.(?=.{2,}$)/g,
                                            '*',
                                          )
                                        : this.state.VisitorDetails?.addlCol3 ==
                                          'true'
                                        ? 'Yes'
                                        : this.state.VisitorDetails?.addlCol3 ==
                                          'false'
                                        ? 'No'
                                        : this.state.VisitorDetails?.addlCol3}
                                    </Text>
                                  </View>
                                ))
                              : null}
                            {this.props.AllSettings.settingsVM.vAddlCol5
                              ? !this.state.VisitorDetails?.addlCol5 == null ||
                                (!this.state.VisitorDetails?.addlCol5 == '' && (
                                  <View style={{}}>
                                    <Text style={{}}>
                                      {this.state.VisitorDetails?.colName5}
                                    </Text>
                                    <Text style={{fontWeight: 'bold'}}>
                                      {this.state.VisitorDetails?.isVip ==
                                        true &&
                                      this.props.LoginDetails.empID !=
                                        this.state.VisitorDetails?.whomToMeet
                                        ? this.state.VisitorDetails?.addlCol5?.replace(
                                            /.(?=.{2,}$)/g,
                                            '*',
                                          )
                                        : this.state.VisitorDetails?.addlCol5 ==
                                          'true'
                                        ? 'Yes'
                                        : this.state.VisitorDetails?.addlCol5 ==
                                          'false'
                                        ? 'No'
                                        : this.state.VisitorDetails?.addlCol5}
                                    </Text>
                                  </View>
                                ))
                              : null}
                          </View>

                          <View style={{width: width / 3}}>
                            {!this.state.VisitorDetails?.designation == null ||
                              (!this.state.VisitorDetails?.designation ==
                                '' && (
                                <View style={{marginTop: 5}}>
                                  <Text>Designation</Text>
                                  <Text
                                    style={{
                                      fontWeight: 'bold',
                                      textAlign: 'left',
                                    }}>
                                    {this.state.VisitorDetails?.isVip == true &&
                                    this.props.LoginDetails.empID !=
                                      this.state.VisitorDetails?.whomToMeet
                                      ? this.state.VisitorDetails?.designation?.replace(
                                          /.(?=.{2,}$)/g,
                                          '*',
                                        )
                                      : this.state.VisitorDetails?.designation}
                                  </Text>
                                </View>
                              ))}
                            {this.props.AllSettings.settingsVM.vAddlCol2
                              ? !this.state.VisitorDetails?.addlCol2 == null ||
                                (!this.state.VisitorDetails?.addlCol2 == '' && (
                                  <View style={{marginTop: 5}}>
                                    <Text style={{}}>
                                      {this.state.VisitorDetails?.colName2}
                                    </Text>
                                    <Text style={{fontWeight: 'bold'}}>
                                      {this.state.VisitorDetails?.isVip ==
                                        true &&
                                      this.props.LoginDetails.empID !=
                                        this.state.VisitorDetails?.whomToMeet
                                        ? this.state.VisitorDetails?.addlCol2?.replace(
                                            /.(?=.{2,}$)/g,
                                            '*',
                                          )
                                        : this.state.VisitorDetails?.addlCol2 ==
                                          'true'
                                        ? 'Yes'
                                        : this.state.VisitorDetails?.addlCol2 ==
                                          'false'
                                        ? 'No'
                                        : this.state.VisitorDetails?.addlCol2}
                                    </Text>
                                  </View>
                                ))
                              : null}
                            {this.props.AllSettings.settingsVM.vAddlCol4
                              ? !this.state.VisitorDetails?.addlCol4 == null ||
                                (!this.state.VisitorDetails?.addlCol4 == '' && (
                                  <View style={{marginTop: 5}}>
                                    <Text style={{}}>
                                      {this.state.VisitorDetails?.colName4}
                                    </Text>
                                    <Text style={{fontWeight: 'bold'}}>
                                      {this.state.VisitorDetails?.isVip ==
                                        true &&
                                      this.props.LoginDetails.empID !=
                                        this.state.VisitorDetails?.whomToMeet
                                        ? this.state.VisitorDetails?.addlCol4?.replace(
                                            /.(?=.{2,}$)/g,
                                            '*',
                                          )
                                        : this.state.VisitorDetails?.addlCol4 ==
                                          'true'
                                        ? 'Yes'
                                        : this.state.VisitorDetails?.addlCol4 ==
                                          'false'
                                        ? 'No'
                                        : this.state.VisitorDetails?.addlCol4}
                                    </Text>
                                  </View>
                                ))
                              : null}
                          </View>
                        </View>
                        {!this.state.VisitorDetails?.address == null ||
                          (!this.state.VisitorDetails?.address == '' && (
                            <View style={{marginTop: 5}}>
                              <Text style={{textAlign: 'left'}}>Address</Text>
                              <Text
                                style={{
                                  fontWeight: 'bold',
                                  textAlign: 'left',
                                  marginLeft: 0,
                                }}>
                                {this.state.VisitorDetails?.isVip == true &&
                                this.props.LoginDetails.empID !=
                                  this.state.VisitorDetails?.whomToMeet
                                  ? this.state.VisitorDetails?.address?.replace(
                                      /.(?=.{2,}$)/g,
                                      '*',
                                    )
                                  : this.state.VisitorDetails?.address}
                              </Text>
                            </View>
                          ))}
                      </View>

                      {/* <View style={{ marginTop: 50, width: "90%", alignSelf: 'center', borderWidth: 1, borderColor: Colors.primary }} /> */}
                    </View>
                  </View>
                </View>
                {/* {photo != null && (
                  <View
                    style={{
                      padding: 10,
                      width: '95%',
                      marginTop: 10,
                      borderRadius: 13,
                      backgroundColor: Colors.white,
                    }}>
                    <ScrollView horizontal={true}>
                      <TouchableOpacity
                        style={{}}
                        onPress={() => this.setImageOpen(true, photo)}>
                        <Image
                          source={{
                            uri: IMAGEURL + '/' + photo,
                          }}
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: 7,
                          }}
                        />
                      </TouchableOpacity>
                     <TouchableOpacity
                        style={{marginLeft: 20}}
                        onPress={() => this.setImageOpen(true, photo[1])}>
                        <Image
                          source={{
                            uri: IMAGEURL + '/' + photo[1],
                          }}
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: 7,
                          }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{marginLeft: 20}}
                        onPress={() => this.setImageOpen(true, photo[2])}>
                        <Image
                          source={{
                            uri: IMAGEURL + '/' + photo[2],
                          }}
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: 7,
                          }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{marginLeft: 20}}
                        onPress={() => this.setImageOpen(true, photo[3])}>
                        <Image
                          source={{
                            uri: IMAGEURL + '/' + photo[3],
                          }}
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: 7,
                          }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{marginLeft: 20}}
                        onPress={() => this.setImageOpen(true, photo[4])}>
                        <Image
                          source={{
                            uri: IMAGEURL + '/' + photo[4],
                          }}
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: 7,
                          }}
                        />
                      </TouchableOpacity>
                    </ScrollView>
                  </View>
                )} */}
                {(this.state.meetingoutSH || this.state.RejectMeeiting) && (
                  <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                    style={{
                      // paddingLeft: 10,
                      marginTop: 10,
                      // borderRadius: 2,
                      // borderWidth: 1,
                      backgroundColor: COLORS.white,
                      width: '100%',
                      fontSize: 18,
                      color: COLORS.black,
                      // borderColor: COLORS.primary,
                    }}>
                    <View
                      style={{
                        padding: 10,
                        width: '100%',
                        marginTop: 10,
                        borderRadius: 13,
                        backgroundColor: Colors.white,
                      }}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          textAlign: 'center',
                          color: Colors.black,
                          padding: 7,
                        }}>
                        {this.state.meetingoutSH
                          ? 'Meeting Out'
                          : 'Reject Reason'}
                      </Text>
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: Colors.primary,
                          marginBottom: 20,
                          width: '100%',
                          alignSelf: 'center',
                        }}
                      />

                      <RichEditor
                        ref={richText}
                        placeholder="Remarks"
                        initialHeight={70}
                        keyboardDisplayRequiresUserAction={true}
                        hideKeyboardAccessoryView={true}
                        style={{backgroundColor: Colors.whitef4}}
                        editorStyle={{backgroundColor: Colors.grayf4}}
                        onChange={descriptionText => {
                          this.setState({remarks: descriptionText});
                        }}
                      />

                      <RichToolbar
                        editor={richText}
                        actions={[
                          actions.setBold,
                          actions.setItalic,
                          actions.setUnderline,
                          actions.insertImage,
                          actions.insertBulletsList,
                          // actions.insertOrderedList,
                          // actions.insertLink,
                          actions.alignLeft,
                          actions.alignCenter,
                          actions.alignRight,
                          actions.code,
                          // actions.line,                          // actions.setStrikethrough,
                          actions.undo,
                          actions.redo,
                          actions.checkboxList,
                        ]}
                        selectedIconTint={Colors.primary}
                        style={{
                          backgroundColor: Colors.white,
                          alignSelf: 'flex-start',
                        }}
                        onPressAddImage={() => this.setModalVisible(true)}
                      />
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            this.state.meetingoutSH
                              ? this.onRejectSubmit(1)
                              : this.onRejectSubmit(2);
                          }}
                          style={{
                            margin: 10,
                            marginTop: 20,
                            backgroundColor: COLORS.secondary,
                            padding: 7,
                            borderRadius: 10,
                            paddingHorizontal: 20,
                            paddingVertical: 7,
                            alignSelf: 'center',
                            fontSize: 15,
                          }}>
                          <Text style={{color: COLORS.white}}>Submit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({
                              meetingoutSH: false,
                              RejectMeeiting: false,
                            });
                          }}
                          style={{
                            margin: 10,
                            marginTop: 20,
                            backgroundColor: COLORS.third,
                            padding: 7,
                            borderRadius: 10,
                            paddingHorizontal: 20,
                            paddingVertical: 7,
                            alignSelf: 'center',
                            fontSize: 15,
                          }}>
                          <Text style={{color: COLORS.white}}>Cacnel</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </KeyboardAvoidingView>
                )}
                <View
                  style={{
                    padding: 10,
                    width: '95%',
                    marginTop: 10,
                    borderRadius: 13,
                    backgroundColor: Colors.white,
                  }}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      textAlign: 'center',
                      color: Colors.black,
                      padding: 7,
                    }}>
                    MEETING DETAILS
                  </Text>
                  <View style={{borderWidth: 1, borderColor: Colors.primary}} />
                  <View
                    style={{
                      marginTop: 5,
                      flexDirection: 'row',
                      marginLeft: 5,
                    }}>
                    <View style={{width: width / 2.3}}>
                      {/* {!this.state.VisitorDetails?.date == null ||
                        (!this.state.VisitorDetails?.date == '' && (
                          <View style={{marginTop: 5}}>
                            <Text>Date</Text>
                            <Text style={{fontWeight: 'bold'}}>
                              {Moment(moment.utc(this.state.VisitorDetails?.date)).format(
                                'DD-MMM-yyyy',
                              )}
                            </Text>
                          </View>
                        ))} */}
                      {!this.state.VisitorDetails?.inTime == null ||
                        (!this.state.VisitorDetails?.inTime == '' && (
                          <View style={{marginTop: 5}}>
                            <Text>Exp. In Time :</Text>
                            <Text style={{fontWeight: 'bold'}}>
                              {this.state.VisitorDetails?.inTime == null &&
                              this.props.LoginDetails.empID !=
                                this.state.VisitorDetails?.whomToMeet
                                ? ''
                                : Moment(
                                    moment.utc(this.state.VisitorDetails?.inTime)
                                  ).format('YYYY-MM-DD HH:mm:ss')}
                            </Text>
                          </View>
                        ))}
                      {!this.state.VisitorDetails?.checkInTime == null ||
                        (!this.state.VisitorDetails?.checkInTime == '' && (
                          <View style={{marginTop: 5}}>
                            <Text>Check In Time :</Text>
                            <Text style={{fontWeight: 'bold'}}>
                              {this.state.VisitorDetails?.checkInTime == null &&
                              this.props.LoginDetails.empID !=
                                this.state.VisitorDetails?.whomToMeet
                                ? ''
                                : Moment(
                                   moment.utc(this.state.VisitorDetails?.checkInTime)
                                  ).format('YYYY-MM-DD HH:mm:ss')}
                            </Text>
                          </View>
                        ))}
                      {!this.state.VisitorDetails?.whomToMeetName == null ||
                        (!this.state.VisitorDetails?.whomToMeetName == '' && (
                          <View style={{marginTop: 5}}>
                            <Text>Whom to Meet:</Text>
                            <Text style={{fontWeight: 'bold'}}>
                              {this.state.VisitorDetails?.whomToMeetName}
                            </Text>
                          </View>
                        ))}
                      {!this.state.VisitorDetails?.department == null ||
                        (!this.state.VisitorDetails?.department == '' && (
                          <View style={{marginTop: 5}}>
                            <Text>Department:</Text>
                            <Text style={{fontWeight: 'bold'}}>
                              {' '}
                              {this.state.VisitorDetails?.isVip == true &&
                              this.props.LoginDetails.empID !=
                                this.state.VisitorDetails?.whomToMeet
                                ? this.state.VisitorDetails?.department?.replace(
                                    /.(?=.{2,}$)/g,
                                    '*',
                                  )
                                : this.state.VisitorDetails?.department}
                            </Text>
                          </View>
                        ))}
                    </View>
                    <View style={{width: width / 3}}>
                      {!this.state.VisitorDetails?.purpose == null ||
                        (!this.state.VisitorDetails?.purpose == '' && (
                          <View style={{marginTop: 5}}>
                            <Text>Purpose</Text>
                            <Text style={{fontWeight: 'bold'}}>
                              {this.state.VisitorDetails?.isVip == true &&
                              this.props.LoginDetails.empID !=
                                this.state.VisitorDetails?.whomToMeet
                                ? this.state.VisitorDetails?.purpose?.replace(
                                    /.(?=.{2,}$)/g,
                                    '*',
                                  )
                                : this.state.VisitorDetails?.purpose}
                            </Text>
                          </View>
                        ))}
                      {!this.state.VisitorDetails?.outTime == null ||
                        (!this.state.VisitorDetails?.outTime == '' && (
                          <View style={{marginTop: 5}}>
                            <Text>Exp. Out Time :</Text>
                            <Text style={{fontWeight: 'bold'}}>
                              {this.state.VisitorDetails?.outTime == null &&
                              this.props.LoginDetails.empID !=
                                this.state.VisitorDetails?.whomToMeet
                                ? ''
                                : Moment(
                                  moment.utc(this.state.VisitorDetails?.outTime)
                                  ).format('YYYY-MM-DD HH:mm:ss')}
                            </Text>
                          </View>
                        ))}
                      {!this.state.VisitorDetails?.checkOutTime == null ||
                        (!this.state.VisitorDetails?.checkOutTime == '' && (
                          <View style={{marginTop: 5}}>
                            <Text>Check Out Time:</Text>
                            <Text style={{fontWeight: 'bold'}}>
                              {this.state.VisitorDetails?.checkOutTime == null
                                ? ''
                                : Moment(
                                    moment.utc(this.state.VisitorDetails?.checkOutTime)
                                  ).format('YYYY-MM-DD HH:mm:ss')}
                            </Text>
                          </View>
                        ))}

                      {
                        (console.log(status),
                        !status == null ||
                          (!status == '' && (
                            <View style={{marginTop: 5}}>
                              <Text>Status:</Text>
                              <Text
                                style={{
                                  color: backgroundColor,
                                  fontWeight: 'bold',
                                }}>
                                {status}
                              </Text>
                            </View>
                          )))
                      }
                    </View>
                  </View>
                  {(!this.state.VisitorDetails?.remarks == null ||
                    !this.state.VisitorDetails?.remarks == '') &&
                    this.props.LoginDetails.empID ==
                      this.state.VisitorDetails?.whomToMeet && (
                      <View style={{marginTop: 5, marginLeft: 5}}>
                        <Text style={{}}>Remarks:</Text>

                        <AutoHeightWebView
                          // originWhitelist={['*']}
                          source={{html: this.state.VisitorDetails?.remarks}}
                        />
                      </View>
                    )}

                  {
                  
                  this.props.LoginDetails.isApprover==true &&(this.props.LoginDetails.userRoleId == 3 ||
                  this.props.LoginDetails.userRoleId == 4 ||
                  this.props.LoginDetails.userRoleId == 1) ? (
                    <View style={{alignItems: 'center', padding: 10}}>
                      {
                      this.state.VisitorDetails?.status == 5 &&
                      this.state.VisitorDetails?.checkInTime != null &&
                      this.state.VisitorDetails?.checkOutTime != null ? null : (
                        <View style={{flexDirection: 'row'}}>
                          {this.state.VisitorDetails?.checkOutTime == null &&
                          this.state.VisitorDetails?.status == 5 ? (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({modalVisible: false});
                                console.log(
                                  'Parameter ++=,',
                                  this.state.VisitorDetails,
                                );
                                this.props.VizApprove(                                    
                                    this.state.VisitorDetails?.inOutId +'/'+
                                    this.props.LoginDetails.userID +
                                    '/' +
                                    this.props.LoginDetails.empID +
                                    '/' +
                                    this.state.VisitorDetails?.fullName,
                                  this.vizApproveSuccess,
                                );
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
                          ) : null}
                          {this.state.VisitorDetails?.status == 4 ||
                          this.state.VisitorDetails?.status == 5 ? (
                            <TouchableOpacity
                              onPress={() => {
                                console.log("first"),
                                this.setState({RejectMeeiting: true,});
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
                          ) : null}

                          {this.state.VisitorDetails?.status == 4 ||
                          this.state.VisitorDetails?.status == 5 ? (
                            <TouchableOpacity
                              onPress={() => {
                                this.rescheduledVisit();
                              }}
                              style={{
                                backgroundColor: COLORS.tempYellow,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 10,
                                height: 30,
                                width: '28%',
                                margin: '1%',
                              }}>
                              <Text style={{color: 'white', fontSize: 12}}>
                                Reschedule
                              </Text>
                            </TouchableOpacity>
                          ) : null}
                          {(this.props.LoginDetails.userRoleId == 4 ||
                            this.props.LoginDetails.empID ==
                              this.state.VisitorDetails?.whomToMeet) &&
                          this.props.isReport != 1 &&
                          this.state.VisitorDetails?.status == 6 &&
                          this.state.VisitorDetails?.meetOutTime == null ? (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({
                                  modalVisible: false,
                                  remarks: '',
                                  meetingoutSH: true,
                                });
                              }}
                              style={{
                                backgroundColor: COLORS.skyBlue,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 10,
                                height: 30,
                                width: '29%',
                                margin: '0.5%',
                              }}>
                              <Text style={{color: 'white', fontSize: 12}}>
                                Meeting Out
                              </Text>
                            </TouchableOpacity>
                          ) : this.props.LoginDetails.userRoleId == 1 &&
                            this.props.isReport != 1 &&
                            this.state.VisitorDetails?.status == 1 &&
                            this.state.VisitorDetails?.meetOutTime == null ? (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({
                                  modalVisible: false,
                                  remarks: '',
                                  meetingoutSH: true,
                                });
                              }}
                              style={{
                                backgroundColor: COLORS.skyBlue,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 10,
                                height: 30,
                                width: '29%',
                                margin: '0.5%',
                              }}>
                              <Text style={{color: 'white', fontSize: 12}}>
                                Meeting Out
                              </Text>
                            </TouchableOpacity>
                          ) : null}
                          {
                            this.state.VisitorDetails?.status==4 &&
                            <TouchableOpacity
                              onPress={() => {
                                this.props.MeetingIn(this.state.VisitorDetails.inOutId,this.vizMeetingIn())
                              }}
                              style={{
                                backgroundColor: COLORS.skyBlue,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 10,
                                height: 30,
                                width: '29%',
                                margin: '0.5%',
                              }}>
                              <Text style={{color: 'white', fontSize: 12}}>
                                Meeting In
                              </Text>
                            </TouchableOpacity>
                          }
                        </View>
                      )}
                    </View>
                  ) :
                  this.props.LoginDetails.isApprover==false && this.props.LoginDetails.userId == this.state.VisitorDetails?.whomToMeet &&
                  <View style={{alignItems: 'center', padding: 10}}>
                      {this.state.VisitorDetails?.status == 5 &&
                      this.state.VisitorDetails?.checkInTime != null &&
                      this.state.VisitorDetails?.checkOutTime != null ? null : (
                        <View style={{flexDirection: 'row'}}>
                          {this.state.VisitorDetails?.checkOutTime == null &&
                          this.state.VisitorDetails?.status == 5 ? (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({modalVisible: false});
                                console.log(
                                  'Parameter ++=,',
                                  this.state.VisitorDetails,
                                );
                                this.props.VizApprove(
                                    this.state.VisitorDetails?.inOutId +'/'+
                                    this.props.LoginDetails.userID +
                                    '/' +
                                    this.props.LoginDetails.empID +
                                    '/' +
                                    this.state.VisitorDetails?.fullName,
                                  this.vizApproveSuccess,
                                );
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
                          ) : null}
                          {this.state.VisitorDetails?.status == 4 ||
                          this.state.VisitorDetails?.status == 5 ? (
                            <TouchableOpacity
                              onPress={() => {
                                console.log("first"),
                                this.setState({RejectMeeiting: true,});
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
                          ) : null}

                          {this.state.VisitorDetails?.status == 4 ||
                          this.state.VisitorDetails?.status == 5 ? (
                            <TouchableOpacity
                              onPress={() => {
                                this.rescheduledVisit();
                              }}
                              style={{
                                backgroundColor: COLORS.tempYellow,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 10,
                                height: 30,
                                width: '28%',
                                margin: '1%',
                              }}>
                              <Text style={{color: 'white', fontSize: 12}}>
                                Reschedule
                              </Text>
                            </TouchableOpacity>
                          ) : null}
                          {!this.state.meetingoutSH &&
                          this.props.LoginDetails.userRoleId == 4 &&
                          this.props.isReport != 1 &&
                          this.state.VisitorDetails?.status == 1 &&
                          this.state.VisitorDetails?.meetOutTime == null ? (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({
                                  modalVisible: false,
                                  remarks: '',
                                  meetingoutSH: true,
                                }),
                                  Toast.show('Scroll Down');
                              }}
                              style={{
                                backgroundColor: COLORS.skyBlue,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 10,
                                height: 30,
                                width: '29%',
                                margin: '0.5%',
                              }}>
                              <Text style={{color: 'white', fontSize: 12}}>
                                Meeting Out
                              </Text>
                            </TouchableOpacity>
                          ) : this.props.LoginDetails.userRoleId == 1 &&
                            this.props.isReport != 1 &&
                            this.state.VisitorDetails?.status == 1 &&
                            this.state.VisitorDetails?.meetOutTime == null ? (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({
                                  modalVisible: false,
                                  remarks: '',
                                  meetingoutSH: true,
                                }),
                                  Toast.show('Scroll Down');
                              }}
                              style={{
                                backgroundColor: COLORS.skyBlue,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 10,
                                height: 30,
                                width: '29%',
                                margin: '0.5%',
                              }}>
                              <Text style={{color: 'white', fontSize: 12}}>
                                Meeting Out
                              </Text>
                            </TouchableOpacity>
                          ) : null}
                          {
                            this.state.VisitorDetails?.status==4 &&
                            <TouchableOpacity
                              onPress={() => {
                                this.props.MeetingIn(this.state.VisitorDetails.inOutId,this.vizMeetingIn())
                              }}
                              style={{
                                backgroundColor: COLORS.skyBlue,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 10,
                                height: 30,
                                width: '29%',
                                margin: '0.5%',
                              }}>
                              <Text style={{color: 'white', fontSize: 12}}>
                                Meeting In
                              </Text>
                            </TouchableOpacity>
                          }
                        </View>
                      )}
                    </View>}
                </View>
              </ScrollView>
            ) : (
              //   Emp and Admin Emp
              <ScrollView style={{}}>
                <View
                  style={{
                    padding: 10,
                    width: '100%',
                    marginTop: 10,
                    borderRadius: 13,
                    backgroundColor: Colors.white,
                  }}>
                  <View>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: Colors.black,
                        padding: 7,
                      }}>
                      BASIC DETAILS
                    </Text>
                    <View
                      style={{borderWidth: 1, borderColor: Colors.primary}}
                    />
                    <View>
                      <View style={{marginLeft: 5, width: '100%'}}>
                        <View style={{flexDirection: 'row', marginTop: 10}}>
                          <View style={{width: width / 2.3}}>
                            {!this.state.VisitorDetails?.company == null ||
                              (!this.state.VisitorDetails?.company == '' && (
                                <View style={{marginTop: 5}}>
                                  <Text>Company</Text>
                                  <Text
                                    style={{
                                      fontWeight: 'bold',
                                      textAlign: 'left',
                                    }}>
                                    {this.state.VisitorDetails?.company}
                                  </Text>
                                </View>
                              ))}
                            {!this.state.VisitorDetails?.email == null ||
                              (!this.state.VisitorDetails?.email == '' && (
                                <View style={{marginTop: 5}}>
                                  <Text>Email id:</Text>
                                  <Text style={{fontWeight: 'bold'}}>
                                    {this.props.LoginDetails.userRoleId == 4 ||
                                    this.props.LoginDetails.userRoleId == 1
                                      ? this.state.VisitorDetails?.email
                                      : this.state.VisitorDetails?.email?.replace(
                                          /(\w{0})[\w.-]+@([\w.]+\w)/,
                                          '$1***@$2',
                                        )}
                                  </Text>
                                </View>
                              ))}
                            {this.props.AllSettings.settingsVM.vAddlCol1
                              ? !this.state.VisitorDetails?.addlCol1 == null ||
                                (!this.state.VisitorDetails?.addlCol1 == '' && (
                                  <View style={{marginTop: 5}}>
                                    <Text style={{}}>
                                      {this.state.VisitorDetails?.colName1}
                                    </Text>
                                    <Text style={{fontWeight: 'bold'}}>
                                      {this.state.VisitorDetails?.addlCol1 ==
                                      'true'
                                        ? 'Yes'
                                        : this.state.VisitorDetails?.addlCol1 ==
                                          'false'
                                        ? 'No'
                                        : this.state.VisitorDetails?.addlCol1}
                                    </Text>
                                  </View>
                                ))
                              : null}
                            {this.props.AllSettings.settingsVM.vAddlCol3
                              ? !this.state.VisitorDetails?.addlCol3 == null ||
                                (!this.state.VisitorDetails?.addlCol3 == '' && (
                                  <View style={{marginTop: 5}}>
                                    <Text style={{}}>
                                      {this.state.VisitorDetails?.colName3}
                                    </Text>
                                    <Text style={{fontWeight: 'bold'}}>
                                      {this.state.VisitorDetails?.addlCol3 ==
                                      'true'
                                        ? 'Yes'
                                        : this.state.VisitorDetails?.addlCol3 ==
                                          'false'
                                        ? 'No'
                                        : this.state.VisitorDetails?.addlCol3}
                                    </Text>
                                  </View>
                                ))
                              : null}
                            {this.props.AllSettings.settingsVM.vAddlCol5
                              ? !this.state.VisitorDetails?.addlCol5 == null ||
                                (!this.state.VisitorDetails?.addlCol5 == '' && (
                                  <View style={{marginTop: 5}}>
                                    <Text style={{}}>
                                      {this.state.VisitorDetails?.colName5}
                                    </Text>
                                    <Text style={{fontWeight: 'bold'}}>
                                      {this.state.VisitorDetails?.addlCol5 ==
                                      'true'
                                        ? 'Yes'
                                        : this.state.VisitorDetails?.addlCol5 ==
                                          'false'
                                        ? 'No'
                                        : this.state.VisitorDetails?.addlCol5}
                                    </Text>
                                  </View>
                                ))
                              : null}
                          </View>

                          <View style={{width: width / 3}}>
                            {!this.state.VisitorDetails?.designation == null ||
                              (!this.state.VisitorDetails?.designation ==
                                '' && (
                                <View style={{marginTop: 5}}>
                                  <Text>Designation</Text>
                                  <Text
                                    style={{
                                      fontWeight: 'bold',
                                      textAlign: 'left',
                                    }}>
                                    {this.props.LoginDetails.userRoleId == 4 ||
                                    this.props.LoginDetails.userRoleId == 1
                                      ? this.state.VisitorDetails?.designation
                                      : this.state.VisitorDetails?.designation?.replace(
                                          /.(?=.{2,}$)/g,
                                          '*',
                                        )}
                                  </Text>
                                </View>
                              ))}

                            {this.props.AllSettings.settingsVM.vAddlCol2
                              ? !this.state.VisitorDetails?.addlCol2 == null ||
                                (!this.state.VisitorDetails?.addlCol2 == '' && (
                                  <View style={{marginTop: 5}}>
                                    <Text style={{}}>
                                      {this.state.VisitorDetails?.colName2}
                                    </Text>
                                    <Text style={{fontWeight: 'bold'}}>
                                      {this.state.VisitorDetails?.addlCol2 ==
                                      'true'
                                        ? 'Yes'
                                        : this.state.VisitorDetails?.addlCol2 ==
                                          'false'
                                        ? 'No'
                                        : this.state.VisitorDetails?.addlCol2}
                                    </Text>
                                  </View>
                                ))
                              : null}
                            {this.props.AllSettings.settingsVM.vAddlCol4
                              ? !this.state.VisitorDetails?.addlCol4 == null ||
                                (!this.state.VisitorDetails?.addlCol4 == '' && (
                                  <View style={{marginTop: 5}}>
                                    <Text style={{}}>
                                      {this.state.VisitorDetails?.colName4}
                                    </Text>
                                    <Text style={{fontWeight: 'bold'}}>
                                      {this.state.VisitorDetails?.addlCol4 ==
                                      'true'
                                        ? 'Yes'
                                        : this.state.VisitorDetails?.addlCol4 ==
                                          'false'
                                        ? 'No'
                                        : this.state.VisitorDetails?.addlCol4}
                                    </Text>
                                  </View>
                                ))
                              : null}
                          </View>
                        </View>
                        {!this.state.VisitorDetails?.address == null ||
                          (!this.state.VisitorDetails?.address == '' && (
                            <View style={{marginTop: 5}}>
                              <Text style={{textAlign: 'left'}}>Address</Text>
                              <Text
                                style={{
                                  fontWeight: 'bold',
                                  textAlign: 'left',
                                  marginLeft: 0,
                                }}>
                                {this.state.VisitorDetails?.address}
                              </Text>
                            </View>
                          ))}
                      </View>

                      {/* <View style={{ marginTop: 50, width: "90%", alignSelf: 'center', borderWidth: 1, borderColor: Colors.primary }} /> */}
                    </View>
                  </View>
                </View>
                {/* {photo != null && (
                  <View
                    style={{
                      padding: 10,
                      width: '100%',
                      marginTop: 10,
                      borderRadius: 13,
                      backgroundColor: Colors.white,
                    }}>
                    <ScrollView horizontal={true}>
                      <TouchableOpacity
                        style={{}}
                        onPress={() => this.setImageOpen(true, photo[0])}>
                        <Image
                          source={{
                            uri: IMAGEURL + '/' + photo[0],
                          }}
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: 7,
                          }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{marginLeft: 20}}
                        onPress={() => this.setImageOpen(true, photo[1])}>
                        <Image
                          source={{
                            uri: IMAGEURL + '/' + photo[1],
                          }}
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: 7,
                          }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{marginLeft: 20}}
                        onPress={() => this.setImageOpen(true, photo[2])}>
                        <Image
                          source={{
                            uri: IMAGEURL + '/' + photo[2],
                          }}
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: 7,
                          }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{marginLeft: 20}}
                        onPress={() => this.setImageOpen(true, photo[3])}>
                        <Image
                          source={{
                            uri: IMAGEURL + '/' + photo[3],
                          }}
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: 7,
                          }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{marginLeft: 20}}
                        onPress={() => this.setImageOpen(true, photo[4])}>
                        <Image
                          source={{
                            uri: IMAGEURL + '/' + photo[4],
                          }}
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: 7,
                          }}
                        />
                      </TouchableOpacity>
                    </ScrollView>
                  </View>
                )} */}
                {(this.state.meetingoutSH || this.state.RejectMeeiting) && (
                  <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                    style={{
                      // paddingLeft: 10,
                      marginTop: 10,
                      // borderRadius: 2,
                      // borderWidth: 1,
                      backgroundColor: COLORS.white,
                      width: '100%',
                      fontSize: 18,
                      color: COLORS.black,
                      // borderColor: COLORS.primary,
                    }}>
                    <View
                      style={{
                        padding: 10,
                        width: '100%',
                        marginTop: 10,
                        borderRadius: 13,
                        backgroundColor: Colors.white,
                      }}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          textAlign: 'center',
                          color: Colors.black,
                          padding: 7,
                        }}>
                        {this.state.meetingoutSH
                          ? 'Meeting Out'
                          : 'Reject Reason'}
                      </Text>
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: Colors.primary,
                          marginBottom: 20,
                          width: '100%',
                          alignSelf: 'center',
                        }}
                      />

                      <RichEditor
                        ref={richText}
                        placeholder="Remarks"
                        initialHeight={70}
                        keyboardDisplayRequiresUserAction={true}
                        hideKeyboardAccessoryView={true}
                        style={{backgroundColor: Colors.whitef4}}
                        editorStyle={{backgroundColor: Colors.grayf4}}
                        onChange={descriptionText => {
                          this.setState({remarks: descriptionText});
                        }}
                      />

                      <RichToolbar
                        editor={richText}
                        actions={[
                          actions.setBold,
                          actions.setItalic,
                          actions.setUnderline,
                          actions.insertImage,
                          actions.insertBulletsList,
                          // actions.insertOrderedList,
                          // actions.insertLink,
                          actions.alignLeft,
                          actions.alignCenter,
                          actions.alignRight,
                          actions.code,
                          // actions.line,                          // actions.setStrikethrough,
                          actions.undo,
                          actions.redo,
                          actions.checkboxList,
                        ]}
                        selectedIconTint={Colors.primary}
                        style={{
                          backgroundColor: Colors.white,
                          alignSelf: 'flex-start',
                        }}
                        onPressAddImage={() => this.setModalVisible(true)}
                      />
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            this.state.meetingoutSH
                              ? this.onRejectSubmit(1)
                              : this.onRejectSubmit(2);
                          }}
                          style={{
                            margin: 10,
                            marginTop: 20,
                            backgroundColor: COLORS.secondary,
                            padding: 7,
                            borderRadius: 10,
                            paddingHorizontal: 20,
                            paddingVertical: 7,
                            alignSelf: 'center',
                            fontSize: 15,
                          }}>
                          <Text style={{color: COLORS.white}}>Submit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({
                              meetingoutSH: false,
                              RejectMeeiting: false,
                            });
                          }}
                          style={{
                            margin: 10,
                            marginTop: 20,
                            backgroundColor: COLORS.third,
                            padding: 7,
                            borderRadius: 10,
                            paddingHorizontal: 20,
                            paddingVertical: 7,
                            alignSelf: 'center',
                            fontSize: 15,
                          }}>
                          <Text style={{color: COLORS.white}}>Cacnel</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </KeyboardAvoidingView>
                )}
                <View
                  style={{
                    padding: 10,
                    width: '100%',
                    marginTop: 10,
                    borderRadius: 13,
                    backgroundColor: Colors.white,
                  }}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      textAlign: 'center',
                      color: Colors.black,
                      padding: 7,
                    }}>
                    MEETING DETAILS
                  </Text>
                  <View style={{borderWidth: 1, borderColor: Colors.primary}} />
                  <View
                    style={{
                      marginTop: 5,
                      flexDirection: 'row',
                      marginLeft: 5,
                    }}>
                    <View style={{width: width / 2.3}}>
                      {!this.state.VisitorDetails?.date == null ||
                        (!this.state.VisitorDetails?.date == '' && (
                          <View style={{marginTop: 5}}>
                            <Text>Exp. In Time :</Text>
                            <Text style={{fontWeight: 'bold'}}>
                              {/* {Moment(new Date(this.state.VisitorDetails?.inTime)).zone(this.props.LoginDetails.timeZone).format(
                                'DD-MMM-yyyy hh:mm a',
                              )} */}
                              {Moment(
                                    moment.utc(this.state.VisitorDetails?.inTime)
                                  ).format('YYYY-MM-DD HH:mm:ss')}
                              {/* {this.state.VisitorDetails?.inTime} */}
                            </Text>
                          </View>
                        ))}
                      {!this.state.VisitorDetails?.outTime == null ||
                        (!this.state.VisitorDetails?.outTime == '' && (
                          <View style={{marginTop: 5}}>
                            <Text>Exp. Out Time :</Text>
                            <Text style={{fontWeight: 'bold'}}>
                              {this.state.VisitorDetails?.outTime == null
                                ? ''
                                : Moment(
                                  moment.utc(this.state.VisitorDetails?.outTime)
                                  ).format('YYYY-MM-DD HH:mm:ss')}
                            </Text>
                          </View>
                        ))}
                      {!this.state.VisitorDetails?.checkInTime == null ||
                        (!this.state.VisitorDetails?.checkInTime == '' && (
                          <View style={{marginTop: 5}}>
                            <Text>Check In Time :</Text>
                            <Text style={{fontWeight: 'bold'}}>
                              {this.state.VisitorDetails?.checkInTime == null
                                ? ''
                                : Moment(moment.utc(this.state.VisitorDetails?.checkInTime)
                                    
                                  ).format('YYYY-MM-DD HH:mm:ss')}
                            </Text>
                          </View>
                        ))}
                      {(this.state.VisitorDetails?.whomToMeetName != null ||
                        this.state.VisitorDetails?.whomToMeetName != '') && (
                        <View style={{marginTop: 5}}>
                          <Text>Whom to Meet:</Text>
                          <Text style={{fontWeight: 'bold'}}>
                            {this.state.VisitorDetails?.whomToMeetName}
                          </Text>
                        </View>
                      )}
                      {!this.state.VisitorDetails?.department == null ||
                        (!this.state.VisitorDetails?.department == '' && (
                          <View style={{marginTop: 5}}>
                            <Text>Department:</Text>
                            <Text style={{fontWeight: 'bold'}}>
                              {' '}
                              {this.props.LoginDetails.userRoleId == 4 ||
                              this.props.LoginDetails.userRoleId == 1
                                ? this.state.VisitorDetails?.department
                                : this.state.VisitorDetails?.department?.replace(
                                    /.(?=.{2,}$)/g,
                                    '*',
                                  )}
                            </Text>
                          </View>
                        ))}
                    </View>
                    <View style={{width: width / 3}}>
                      {!this.state.VisitorDetails?.purpose == null ||
                        (!this.state.VisitorDetails?.purpose == '' && (
                          <View style={{marginTop: 5}}>
                            <Text>Purpose</Text>
                            <Text style={{fontWeight: 'bold'}}>
                              {this.state.VisitorDetails?.purpose}
                            </Text>
                          </View>
                        ))}
                      {/* {!this.state.VisitorDetails?.outTime == null ||
                        (!this.state.VisitorDetails?.outTime == '' && (
                          <View style={{marginTop: 5}}>
                            <Text>Exp. Out Time :</Text>
                            <Text style={{fontWeight: 'bold'}}>
                              {this.state.VisitorDetails?.outTime == null
                                ? ''
                                : Moment(
                                    this.state.VisitorDetails?.outTime,
                                  ).format('HH:mm')}
                            </Text>
                          </View>
                        ))} */}
                      {!this.state.VisitorDetails?.checkOutTime == null ||
                        (!this.state.VisitorDetails?.checkOutTime == '' && (
                          <View style={{marginTop: 5}}>
                            <Text>Check Out Time:</Text>
                            <Text style={{fontWeight: 'bold'}}>
                              {this.state.VisitorDetails?.checkOutTime == null
                                ? ''
                                : Moment(moment.utc(this.state.VisitorDetails?.checkOutTime)
                                    
                                  ).format('YYYY-MM-DD HH:mm:ss')}
                            </Text>
                          </View>
                        ))}

                      {
                        (console.log(status),
                        !status == null ||
                          (!status == '' && (
                            <View style={{marginTop: 5}}>
                              <Text>Status:</Text>
                              <Text
                                style={{
                                  color: backgroundColor,
                                  fontWeight: 'bold',
                                }}>
                                {status}
                              </Text>
                            </View>
                          )))
                      }
                    </View>
                  </View>
                  {!this.state.VisitorDetails?.remarks == null ||
                    (!this.state.VisitorDetails?.remarks == '' && (
                      <View style={{marginTop: 5, marginLeft: 5}}>
                        <Text style={{}}>Remarks:</Text>

                        <AutoHeightWebView
                          // originWhitelist={['*']}
                          source={{html: this.state.VisitorDetails?.remarks}}
                        />
                      </View>
                    ))}
 
                  {this.props.LoginDetails.isApprover==true && this.props.Blockedviz.blockedId!=1 && (this.props.LoginDetails.userRoleId == 3 ||
                  this.props.LoginDetails.userRoleId == 4 ||
                  this.props.LoginDetails.userRoleId == 1) ? (
                    <View style={{alignItems: 'center', padding: 10}}>
                      {this.state.VisitorDetails?.status == 5 &&
                      this.state.VisitorDetails?.checkInTime != null &&
                      this.state.VisitorDetails?.checkOutTime != null ? null : (
                        <View style={{flexDirection: 'row'}}>
                          {this.state.VisitorDetails?.checkOutTime == null &&
                          this.state.VisitorDetails?.status == 5 ? (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({modalVisible: false});
                                console.log(
                                  'Parameter ++=,',
                                  this.state.VisitorDetails,
                                );
                                this.props.VizApprove(
                                    this.state.VisitorDetails?.inOutId +'/'+
                                    this.props.LoginDetails.userID +
                                    '/' +
                                    this.props.LoginDetails.empID +
                                    '/' +
                                    this.state.VisitorDetails?.fullName,
                                  this.vizApproveSuccess,
                                );
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
                          ) : null}
                          {this.state.VisitorDetails?.status == 4 ||
                          this.state.VisitorDetails?.status == 5 ? (
                            <TouchableOpacity
                              onPress={() => {
                                console.log("first"),
                                this.setState({RejectMeeiting: true,});
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
                          ) : null}

                          {this.state.VisitorDetails?.status == 4 ||
                          this.state.VisitorDetails?.status == 5 ? (
                            <TouchableOpacity
                              onPress={() => {
                                this.rescheduledVisit();
                              }}
                              style={{
                                backgroundColor: COLORS.tempYellow,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 10,
                                height: 30,
                                width: '28%',
                                margin: '1%',
                              }}>
                              <Text style={{color: 'white', fontSize: 12}}>
                                Reschedule
                              </Text>
                            </TouchableOpacity>
                          ) : null}
                          {!this.state.meetingoutSH &&
                          this.props.LoginDetails.userRoleId == 4 &&
                          this.props.isReport != 1 &&
                          this.state.VisitorDetails?.status == 1 &&
                          this.state.VisitorDetails?.meetOutTime == null ? (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({
                                  modalVisible: false,
                                  remarks: '',
                                  meetingoutSH: true,
                                }),
                                  Toast.show('Scroll Down');
                              }}
                              style={{
                                backgroundColor: COLORS.skyBlue,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 10,
                                height: 30,
                                width: '29%',
                                margin: '0.5%',
                              }}>
                              <Text style={{color: 'white', fontSize: 12}}>
                                Meeting Out
                              </Text>
                            </TouchableOpacity>
                          ) : this.props.LoginDetails.userRoleId == 1 &&
                            this.props.isReport != 1 &&
                            this.state.VisitorDetails?.status == 1 &&
                            this.state.VisitorDetails?.meetOutTime == null ? (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({
                                  modalVisible: false,
                                  remarks: '',
                                  meetingoutSH: true,
                                }),
                                  Toast.show('Scroll Down');
                              }}
                              style={{
                                backgroundColor: COLORS.skyBlue,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 10,
                                height: 30,
                                width: '29%',
                                margin: '0.5%',
                              }}>
                              <Text style={{color: 'white', fontSize: 12}}>
                                Meeting Out
                              </Text>
                            </TouchableOpacity>
                          ) : null}
                          {
                            this.state.VisitorDetails?.status==4 &&
                            <TouchableOpacity
                              onPress={() => {
                                this.props.MeetingIn(this.state.VisitorDetails.inOutId,this.vizMeetingIn())
                              }}
                              style={{
                                backgroundColor: COLORS.skyBlue,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 10,
                                height: 30,
                                width: '29%',
                                margin: '0.5%',
                              }}>
                              <Text style={{color: 'white', fontSize: 12}}>
                                Meeting In
                              </Text>
                            </TouchableOpacity>
                          }
                        </View>
                      )}
                    </View>
                  ) : this.props.LoginDetails.isApprover==false && this.props.LoginDetails.userId == this.state.VisitorDetails?.whomToMeet &&
                  <View style={{alignItems: 'center', padding: 10}}>
                      {this.state.VisitorDetails?.status == 5 &&
                      this.state.VisitorDetails?.checkInTime != null &&
                      this.state.VisitorDetails?.checkOutTime != null ? null : (
                        <View style={{flexDirection: 'row'}}>
                          {this.state.VisitorDetails?.checkOutTime == null &&
                          this.state.VisitorDetails?.status == 5 ? (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({modalVisible: false});
                                console.log(
                                  'Parameter ++=,',
                                  this.state.VisitorDetails,
                                );
                                this.props.VizApprove(
                                    this.state.VisitorDetails?.inOutId +'/'+
                                    this.props.LoginDetails.userID +
                                    '/' +
                                    this.props.LoginDetails.empID +
                                    '/' +
                                    this.state.VisitorDetails?.fullName,
                                  this.vizApproveSuccess,
                                );
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
                          ) : null}
                          {this.state.VisitorDetails?.status == 4 ||
                          this.state.VisitorDetails?.status == 5 ? (
                            <TouchableOpacity
                              onPress={() => {
                                console.log("first"),
                                this.setState({RejectMeeiting: true,});
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
                          ) : null}

                          {this.state.VisitorDetails?.status == 4 ||
                          this.state.VisitorDetails?.status == 5 ? (
                            <TouchableOpacity
                              onPress={() => {
                                this.rescheduledVisit();
                              }}
                              style={{
                                backgroundColor: COLORS.tempYellow,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 10,
                                height: 30,
                                width: '28%',
                                margin: '1%',
                              }}>
                              <Text style={{color: 'white', fontSize: 12}}>
                                Reschedule
                              </Text>
                            </TouchableOpacity>
                          ) : null}
                          {!this.state.meetingoutSH &&
                          this.props.LoginDetails.userRoleId == 4 &&
                          this.props.isReport != 1 &&
                          this.state.VisitorDetails?.status == 1 &&
                          this.state.VisitorDetails?.meetOutTime == null ? (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({
                                  modalVisible: false,
                                  remarks: '',
                                  meetingoutSH: true,
                                }),
                                  Toast.show('Scroll Down');
                              }}
                              style={{
                                backgroundColor: COLORS.skyBlue,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 10,
                                height: 30,
                                width: '29%',
                                margin: '0.5%',
                              }}>
                              <Text style={{color: 'white', fontSize: 12}}>
                                Meeting Out
                              </Text>
                            </TouchableOpacity>
                          ) : this.props.LoginDetails.userRoleId == 1 &&
                            this.props.isReport != 1 &&
                            this.state.VisitorDetails?.status == 1 &&
                            this.state.VisitorDetails?.meetOutTime == null ? (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({
                                  modalVisible: false,
                                  remarks: '',
                                  meetingoutSH: true,
                                }),
                                  Toast.show('Scroll Down');
                              }}
                              style={{
                                backgroundColor: COLORS.skyBlue,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 10,
                                height: 30,
                                width: '29%',
                                margin: '0.5%',
                              }}>
                              <Text style={{color: 'white', fontSize: 12}}>
                                Meeting Out
                              </Text>
                            </TouchableOpacity>
                          ) : null}
                          {
                            this.state.VisitorDetails?.status==4 &&
                            <TouchableOpacity
                              onPress={() => {
                                this.props.MeetingIn(this.state.VisitorDetails.inOutId,this.vizMeetingIn())
                              }}
                              style={{
                                backgroundColor: COLORS.skyBlue,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 10,
                                height: 30,
                                width: '29%',
                                margin: '0.5%',
                              }}>
                              <Text style={{color: 'white', fontSize: 12}}>
                                Meeting In
                              </Text>
                            </TouchableOpacity>
                          }
                        </View>
                      )}
                    </View>
                  }
                </View>
              </ScrollView>
            )}
          </View>
        </ScrollView>

        <Modal
          isVisible={this.state.PicModalVisible}
          onBackdropPress={() => this.setModalVisible(false)}
          onSwipeComplete={() => this.setModalVisible(false)}
          swipeDirection="left"
          onBackButtonPress={() => this.setModalVisible(false)}>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <View
              style={{
                width: '70%',
                padding: 10,
                borderRadius: 13,
                backgroundColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  padding: 10,
                  color: '#FF9214',
                }}>
                Choose Image
              </Text>
              <View
                style={{borderWidth: 0.5, width: '100%', borderColor: '#000'}}
              />
              <TouchableOpacity onPress={() => this.selectPhotoTapped()}>
                <Text style={{fontSize: 15, padding: 10, color: '#FF9214'}}>
                  Camera
                </Text>
              </TouchableOpacity>
              <View
                style={{borderWidth: 0.5, width: '100%', borderColor: '#000'}}
              />
              <TouchableOpacity onPress={() => this.chooseFileGallary()}>
                <Text style={{fontSize: 15, padding: 10, color: '#FF9214'}}>
                  Gallery
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          isVisible={this.state.picModalVisible}
          onBackdropPress={() => this.setImageOpen(false)}
          onSwipeComplete={() => this.setImageOpen(false)}
          swipeDirection="left"
          onBackButtonPress={() => this.setImageOpen(false)}>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            {this.state.picImagePath != null ? (
              <Image
                style={{height: '70%', width: '100%'}}
                source={{uri: IMAGEURL + '/' + this.state.picImagePath}}
              />
            ) : (
              <Image
                style={{height: '70%', width: '100%'}}
                source={Images.def_visitor}
              />
            )}
          </View>
        </Modal>
        <Modal
          isVisible={this.state.resmodalVisible}
          onBackdropPress={() => {
            this.setState({resmodalVisible: false});
          }}
          onSwipeComplete={() => {
            this.setState({resmodalVisible: false});
          }}
          swipeDirection="left"
          onBackButtonPress={() => {
            this.setState({resmodalVisible: false});
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              // backgroundColor: 'rgba(52, 52, 52, 0.8)',
            }}>
            <TouchableWithoutFeedback
              onPressOut={() => {
                this.setState({resmodalVisible: false});
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
            <View
              style={{
                width: '90%',
                height: null,
                paddingLeft: 20,
                paddingRight: 20,
                backgroundColor: COLORS.white,
                borderRadius: 13,
                padding: 10,
              }}>
              <Text
                style={{
                  width: '100%',
                  color: COLORS.primary,
                  textAlign: 'center',
                  fontSize: 20,
                  fontWeight: 'bold',
                }}>
                Meeting Re-Schedule
              </Text>
              {/* <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: null, padding: 15 }}> */}

              {/* <DatePicker
                style={{width: '100%', top: 10}}
                date={this.state.date}
                mode="date"
                placeholder="Select Date*"
                format="DD-MM-YYYY" //T'HH:mm:ss.SSSSSSz"
                minDate={Moment().format('DD-MM-YYYY')}
                maxDate={Moment().add(2, 'month').format('DD-MM-YYYY')}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    right: 0,
                    top: 4,
                    marginLeft: 0,
                  },
                  dateInput: {
                    borderLeftWidth: 0,
                    borderRightWidth: 0,
                    borderTopWidth: 0,
                    marginRight: 36,
                    borderBottomWidth: 1,
                    borderBottomColor: COLORS.graye3,
                    marginLeft: 3,
                  },
                  dateText: {
                    alignSelf: 'flex-start',
                  },
                  placeholderText: {
                    alignSelf: 'flex-start',
                    color: placeholderTextColor,
                  },
                  // ... You can check the source to find the other keys.
                }}
                onDateChange={date => {
                  this.setState({date: date, Intime: null, Outtime: null});
                }}
              /> */}
              <ScrollView>

              
              <View style={{}}>
                {
                  Platform.OS=='android'?
                <View>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginRight: 5,
                  }}
                  onPress={() => this.showDatepicker()}>
                  <Hoshi
                    editable={false}
                    // disabled={true}
                    style={{
                      color: COLORS.black,
                      borderBottomWidth: 1,
                      borderBottomColor: COLORS.black,
                      flexGrow: 1,
                      fontSize: 10,
                      marginRight: 10,
                    }}
                    label="Expected In Time*"
                    value={
                      this.state.Indate != null &&
                      Moment(this.state.Indate).format('DD-MM-YYYY') +
                        '  ' +
                        moment(this.state.time).format('hh:mm a')
                    }
                  />
                  {this.state.show && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      // style={{ height: 55, paddingTop: 10 }}
                      timeZoneOffsetInMinutes={0}
                      value={this.state.Indate}
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
                    style={{height: 28, width: 32}}
                  />
                </TouchableOpacity>
                </View>:
                <View style={{alignItems:'flex-start',justifyContent:'flex-start'}}>
                <Text>Expected In Time*:</Text>
                  <DateTimePicker
                    // testID="dateTimePicker"
                    // style={{ backgroundColor: "white"}} //add this
                    style={{ height: 60,alignSelf:'center',marginRight:50, borderRadius:50,  marginLeft:12,width:"100%"}}
                    // timeZoneOffsetInMinutes={0}
                    value={this.state.Indate}
                    minimumDate={new Date()}
                    // maximumDate={Moment().add(2, 'month')}
                    mode="datetime"
                    // is24Hour={true}
                    display="default" 
                    
                    onChange={this.onChangeeee}
                  />
                
                
                </View>
                }
              </View>
              {/* {Platform.OS === 'ios' ? (
                <DatePicker
                  style={{width: '100%', top: 10}}
                  date={this.state.Intime}
                  mode="time"
                  placeholder="Expected In Time*"
                  format="HH:mm:ss"
                  ref={el => {
                    this.Intime = el;
                  }}
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateInput: {
                      left: 0,
                      top: 4,
                      marginLeft: 0,
                      borderLeftWidth: 0,
                      borderRightWidth: 0,
                      borderTopWidth: 0,
                      borderBottomWidth: 1,
                      borderBottomColor: COLORS.graye3,
                    },
                    dateIcon: {
                      right: 0,
                      top: 4,
                    },
                    dateText: {
                      alignSelf: 'flex-start',
                    },
                    placeholderText: {
                      alignSelf: 'flex-start',
                      color: placeholderTextColor,
                    },
                  }}
                  onDateChange={Intime => {
                    this.setState({Intime});
                  }}
                />
              ) : (
                <View
                  style={{flexDirection: 'row', width: '100%', marginTop: 5}}>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      paddingRight: 5,
                    }}
                    activeOpacity={1}
                    onPress={() => this.showTimePicker(1)}>
                    <TextInput
                      editable={false}
                      style={{
                        flexGrow: 1,
                        color: COLORS.black,
                        borderBottomWidth: 1,
                        borderBottomColor: COLORS.graye3,
                        marginLeft: 0,
                      }}
                      placeholder="Expected In Time*"
                      value={this.state.Intime}
                    />
                    <Image
                      source={IMAGES.clock}
                      style={{height: 25, width: 32, top: 15}}
                    />
                  </TouchableOpacity>
                  {this.state.isExpectedInVisible ? (
                    <DateTimePicker
                      mode={'time'}
                      format="HH:mm:ss"
                      ref={el => {
                        this.inTime = el;
                      }}
                      isVisible={this.state.isExpectedInVisible}
                      value={this.state.Intime}
                      onConfirm={inTime => {
                        var resDate;
                        if (this.state.date != null) {
                          resDate = this.getParsedDate1(this.state.date);
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
                            if (this.state.Outtime != null) {
                              var resDate1 = this.getParsedDate1(
                                this.state.date + ' ' + this.state.Outtime,
                              );
                              var finalIn = resDate1 + 'T' + this.state.Outtime;
                              if (
                                new Date(finalDat).getTime() >
                                new Date(finalIn).getTime()
                              ) {
                                var inTime = Moment(inTime).format('HH:mm:ss');
                                this.setState({
                                  Intime: inTime,
                                  isExpectedInVisible: false,
                                });
                              } else {
                                this.setState({
                                  Intime: null,
                                  Outtime: null,
                                });
                                Toast.show('Please select valid In Time');
                              }
                            } else {
                              inTime = Moment(inTime).format('HH:mm:ss');
                              this.setState({
                                Intime: inTime,
                                isExpectedInVisible: false,
                              });
                            }
                          } else {
                            this.setState({
                              Intime: null,
                              Outtime: null,
                            });
                            Toast.show('Please select valid In Time');
                          }
                        } else {
                          inTime = Moment(inTime).format('HH:mm:ss');
                          this.setState({
                            Intime: inTime,
                            isExpectedInVisible: false,
                          });
                        }
                      }}
                      onCancel={date =>
                        this.setState({
                          isExpectedInVisible: false,
                        })
                      }
                    />
                  ) : null}
                </View>
              )} */}

              <View>
                {Platform.OS=='android'?
              <View style={{}}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginRight: 5,
                  }}
                  onPress={() => this.OutshowDatepicker()}>
                  <Hoshi
                    editable={false}
                    style={{
                      color: COLORS.black,
                      borderBottomWidth: 1,
                      borderBottomColor: COLORS.black,
                      flexGrow: 1,
                      marginRight: 10,
                    }}
                    label="Expected Out Time*"
                    value={
                      this.state.Outdate != null &&
                      Moment(this.state.Outdate).format('DD-MM-YYYY') +
                      '  ' +
                      Moment(this.state.Outtime).format('hh:mm a')
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
                    style={{height: 28, width: 32}}
                  />
                </TouchableOpacity>
              </View>:
             <View style={{alignItems:'flex-start', justifyContent:'flex-start'}}>
             <Text>Expected Out Time:-</Text>
               <DateTimePicker
                 // testID="dateTimePicker"
                 // style={{ backgroundColor: "white"}} //add this
                 style={{ height: 60,alignSelf:'center', marginRight:50, borderRadius:50,  marginLeft:12,width:"100%"}}
                 // timeZoneOffsetInMinutes={0}
                 value={this.state.Outdate}
                 minimumDate={this.state.Indate}
                 // maximumDate={Moment().add(2, 'month')}
                 mode="datetime"
                 // is24Hour={true}
                 display="default" 
                 
                 onChange={this.onOutChangeeee}
               />
             
             
             </View>
                
              }
              </View>
              {/* {Platform.OS === 'ios' ? (
                <DatePicker
                  style={{width: '100%', marginTop: 10}}
                  date={this.state.Outtime}
                  mode="time"
                  placeholder="Expected Out Time"
                  format="HH:mm:ss"
                  ref={el => {
                    this.Outtime = el;
                  }}
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateInput: {
                      left: 0,
                      top: 4,
                      marginLeft: 0,
                      borderLeftWidth: 0,
                      borderRightWidth: 0,
                      borderTopWidth: 0,
                      borderBottomWidth: 1,
                      borderBottomColor: COLORS.graye3,
                    },
                    dateIcon: {
                      right: 0,
                      top: 4,
                    },
                    dateText: {
                      alignSelf: 'flex-start',
                    },
                    placeholderText: {
                      alignSelf: 'flex-start',
                      color: placeholderTextColor,
                    },
                    // ... You can check the source to find the other keys.
                  }}
                  onDateChange={Outtime => {
                    // this.setState({ Outtime })
                    if (this.state.date != null) {
                      var resDate1;
                      var resDate = this.getParsedDate1(
                        this.state.date +
                          ' ' +
                          Moment(Outtime).format('HH:mm:ss'),
                      );
                      console.log('check out time111====', Outtime);

                      var finalDat = resDate + 'T' + Outtime;
                      //  Moment(Outtime).format('HH:mm:ss')
                      //check with date & out time
                      console.log('check out Final time====', finalDat);

                      if (new Date(finalDat).getTime() > new Date().getTime()) {
                        if (this.state.Intime != null) {
                          resDate1 = this.getParsedDate1(
                            this.state.date + ' ' + this.state.Intime,
                          );
                          var finalIn = resDate1 + 'T' + this.state.Intime;
                          // check with in time & out time
                          console.log(
                            'check out time====1',
                            finalDat + '==' + finalIn,
                          );

                          if (
                            new Date(finalDat).getTime() >
                            new Date(finalIn).getTime()
                          ) {
                            outTime = Outtime;
                            // Moment(Outtime).format('HH:mm:ss')
                            console.log('check out time====', outTime);
                            this.setState({
                              Outtime: outTime,
                              isExpectedInVisible: false,
                            });
                          } else {
                            this.setState({
                              Outtime: null,
                            });
                            Toast.show(
                              'Out time must be greater than In time ',
                              Toast.LONG,
                            );
                          }
                        } else {
                          outTime = Moment(Outtime).format('HH:mm:ss');
                          this.setState({
                            Outtime: outTime,
                            isExpectedInVisible: false,
                          });
                        }
                      } else {
                        this.setState({
                          Outtime: null,
                        });
                        Toast.show(
                          'Out time must be greater than In time ',
                          Toast.LONG,
                        );
                      }
                    } else {
                      outTime = Moment(Outtime).format('HH:mm:ss');
                      this.setState({
                        Outtime: outTime,
                        isExpectedInVisible: false,
                      });
                    }
                  }}
                />
              ) : (
                <View style={{flexDirection: 'row', width: '100%'}}>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      paddingRight: 5,
                    }}
                    activeOpacity={1}
                    onPress={() => this.showTimePicker(2)}>
                    <TextInput
                      editable={false}
                      style={{
                        flexGrow: 1,
                        color: COLORS.black,
                        borderBottomWidth: 1,
                        borderBottomColor: COLORS.graye3,
                        marginLeft: 0,
                      }}
                      placeholder="Expected Out Time"
                      value={this.state.Outtime}
                    />
                    <Image
                      source={IMAGES.clock}
                      style={{height: 25, width: 32, top: 10}}
                    />
                  </TouchableOpacity>
                  {this.state.isExpectedOutVisible ? (
                    <DateTimePicker
                      mode={'time'}
                      format="HH:mm:ss"
                      ref={el => {
                        this.OutTime = el;
                      }}
                      isVisible={this.state.isExpectedOutVisible}
                      value={this.state.Outtime}
                      onConfirm={Outtime => {
                        if (this.state.date != null) {
                          var resDate1, outTime;
                          var resDate = this.getParsedDate1(this.state.date);
                          var finalDat =
                            resDate + 'T' + Moment(Outtime).format('HH:mm:ss');
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
                            if (this.state.Intime != null) {
                              resDate1 = this.getParsedDate1(
                                this.state.date + ' ' + this.state.Intime,
                              );

                              var finalIn = resDate1 + 'T' + this.state.Intime;

                              if (
                                new Date(finalDat).getTime() >
                                new Date(finalIn).getTime()
                              ) {
                                outTime = Moment(Outtime).format('HH:mm:ss');
                                this.setState({
                                  Outtime: outTime,
                                  isExpectedOutVisible: false,
                                });
                              } else {
                                this.setState({
                                  Outtime: null,
                                });
                                Toast.LONG(
                                  'Out time must be greater than In time ',
                                  Toast.LONG,
                                );
                              }
                            } else {
                              outTime = Moment(Outtime).format('HH:mm:ss');
                              this.setState({
                                Outtime: outTime,
                                isExpectedOutVisible: false,
                              });
                            }
                          } else {
                            this.setState({
                              Outtime: null,
                            });
                            Toast.show(
                              'Out time must be greater than In time ',
                              Toast.LONG,
                            );
                          }
                        } else {
                          outTime = Moment(Outtime).format('HH:mm:ss');
                          this.setState({
                            Outtime: outTime,
                            isExpectedOutVisible: false,
                          });
                        }
                      }}
                      onCancel={date =>
                        this.setState({
                          isExpectedOutVisible: false,
                        })
                      }
                    />
                  ) : null}
                  
                </View>
              )} */}
              <RichEditor
                ref={richText}
                placeholder="Remarks"
                initialHeight={70}
                keyboardDisplayRequiresUserAction={true}
                hideKeyboardAccessoryView={false}
                style={{backgroundColor: Colors.whitef4}}
                editorStyle={{backgroundColor: Colors.grayf4}}
                onChange={descriptionText => {
                  this.setState({remarks: descriptionText});
                }}
              />

              <RichToolbar
                editor={richText}
                actions={[
                  actions.setBold,
                  actions.setItalic,
                  actions.setUnderline,
                  actions.insertImage,
                  actions.insertBulletsList,
                  // actions.insertOrderedList,
                  // actions.insertLink,
                  actions.alignLeft,
                  actions.alignCenter,
                  actions.alignRight,
                  actions.code,
                  // actions.line,                          // actions.setStrikethrough,
                  actions.undo,
                  actions.redo,
                  actions.checkboxList,
                ]}
                selectedIconTint={Colors.primary}
                style={{
                  backgroundColor: Colors.white,
                  alignSelf: 'flex-start',
                }}
                onPressAddImage={() => this.setModalVisible(true)}
              />
              {/* </View> */}
              <TouchableOpacity
                onPress={() => {
                  this.props.SubscriptionLimit !== 0
                    ? alert('Subscription Limit cross')
                    : this.state.Indate == null
                    ? alert('Please Select Date')
                    : this.state.Indate == null
                    ? alert('Please Select In Time')
                    : this.rescheduleMeeting();
                }}
                style={{
                  alignSelf: 'center',
                  marginTop: 15,
                  borderRadius: 6,
                  height: 40,
                  width: '30%',
                  backgroundColor: COLORS.secondary,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{color: COLORS.white}}>Submit</Text>
              </TouchableOpacity>
            </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
  onOpen() {
    this.setState({modalVisible: true});
  }
  meetOutModal() {
    //   return (
    //     <Modal
    //       isVisible={this.state.meetOutModalVisible}
    //       onBackdropPress={() => {
    //         this.setState({meetOutModalVisible: false});
    //       }}
    //       onSwipeComplete={() => {
    //         this.setState({meetOutModalVisible: false});
    //       }}
    //       swipeDirection="left"
    //       onBackButtonPress={() => {
    //         this.setState({meetOutModalVisible: false});
    //       }}>
    //       <View
    //         style={{
    //           width: '100%',
    //           height: '100%',
    //           justifyContent: 'center',
    //           alignItems: 'center',
    //         }}>
    //         <TouchableWithoutFeedback
    //           onPressOut={() => {
    //             this.setState({meetOutModalVisible: false});
    //           }}>
    //           <View
    //             style={{
    //               position: 'absolute',
    //               top: 0,
    //               bottom: 0,
    //               left: 0,
    //               right: 0,
    //               flex: 1,
    //             }}></View>
    //         </TouchableWithoutFeedback>
    //         <View
    //           style={{
    //             paddingBottom: this.state.paddingBottom,
    //             height: null,
    //             width: '90%',
    //             justifyContent: 'center',
    //             alignItems: 'center',
    //             borderRadius: 10,
    //           }}>
    //           <View
    //             style={{
    //               height: null,
    //               width: '100%',
    //               backgroundColor: COLORS.white,
    //               justifyContent: 'center',
    //               alignItems: 'center',
    //               borderRadius: 10,
    //             }}>
    //             <Text
    //               style={{
    //                 fontSize: 22,
    //                 marginBottom: 10,
    //                 padding: '5%',
    //                 color: COLORS.primary,
    //               }}>
    //               Meeting Out
    //             </Text>
    //             {/* <TextInput
    //               placeholder="Remarks"
    //               style={{
    //                 paddingLeft: 10,
    //                 marginTop: 10,
    //                 borderRadius: 2,
    //                 borderWidth: 1,
    //                 backgroundColor: COLORS.white,
    //                 width: '85%',
    //                 fontSize: 18,
    //                 color: COLORS.black,
    //                 borderColor: COLORS.black,
    //               }}
    //               multiline={true}
    //               onChangeText={remarks => {
    //                 this.setState({remarks: remarks});
    //               }}
    //               value={this.state.remarks}
    //             /> */}
    //             <KeyboardAvoidingView
    //               behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    //               style={{
    //                 paddingLeft: 10,
    //                 marginTop: 10,
    //                 borderRadius: 2,
    //                 borderWidth: 1,
    //                 backgroundColor: COLORS.white,
    //                 width: '85%',
    //                 // height:100,
    //                 fontSize: 18,
    //                 color: COLORS.black,
    //                 borderColor: COLORS.black,
    //               }}>
    //               <RichEditor
    //                 ref={richText}
    //                 placeholder="Remarks"
    //                 // keyboardDisplayRequiresUserAction={true}
    //                 // hideKeyboardAccessoryView={true}
    //                 onChange={descriptionText => {
    //                   this.setState({remarks: descriptionText});
    //                 }}
    //               />
    //             </KeyboardAvoidingView>
    //             <RichToolbar
    //               editor={richText}
    //               actions={[
    //                 actions.setBold,
    //                 actions.setItalic,
    //                 actions.setUnderline,
    //                 actions.heading1,
    //                 actions.insertImage,
    //               ]}
    //               onPressAddImage={this.selectPhotoTapped}
    //               iconMap={{
    //                 [actions.heading1]: ({tintColor}) => (
    //                   <Text style={[{color: tintColor}]}>H1</Text>
    //                 ),
    //               }}
    //             />
    //             <TouchableOpacity
    //               onPress={() => {
    //                 var param = {
    //                   inOutId: this.state.VisitorDetails.inOutId,
    //                   comment: this.state.remarks,
    //                 };
    //                 this.props.MeetingOut(param, this.meetinOutSuccess);
    //               }}
    //               style={{
    //                 margin: 10,
    //                 marginTop: 20,
    //                 backgroundColor: COLORS.secondary,
    //                 padding: 7,
    //                 borderRadius: 10,
    //                 paddingHorizontal: 20,
    //                 paddingVertical: 7,
    //                 alignSelf: 'center',
    //                 fontSize: 15,
    //               }}>
    //               <Text style={{color: COLORS.white}}>Submit</Text>
    //             </TouchableOpacity>
    //           </View>
    //         </View>
    //       </View>
    //     </Modal>
    //   );
  }

  rescheduledVisit() {
    this.setState({
      modalVisible: false,
      resmodalVisible: true,
    });
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
  addZero(no) {
    if (no.toString().length == 1) {
      return '0' + no;
    } else {
      return no;
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
      if (this.state.Intime != null) {
        this.setState({
          isExpectedInVisible: false,
          isExpectedOutVisible: true,
          isReschedualVisible: false,
        });
      } else {
        Toast.show('Please First Select In Time');
      }
    } else if (tag == 3) {
      this.setState({
        isExpectedInVisible: false,
        isExpectedOutVisible: false,
        isReschedualVisible: true,
      });
    }
  }
  getParsedDate(date) {
    date = String(date).split('-');
    return [
      parseInt(date[2]) + '-' + parseInt(date[1]) + '-' + parseInt(date[0]),
    ];
  }
  async rescheduleMeeting() {
    var newDate = this.getParsedDate(this.state.date);
    var params = {
      inOutId:this.state.VisitorDetails?.inOutId,
      rshDate:Moment(this.state.Indate).format("YYYY-MM-DD"), //newDate + 'T00:00:00.000Z',
      expIntime:this.state.VisitorDetails.inTime,
      expOuttime:this.state.VisitorDetails.outTime,
      RshdldBy: this.props.LoginDetails.fullName,
      empId:this.props.LoginDetails.empID,
      // this.props.LoginDetails.userRoleId == 4 ||
      // this.props.LoginDetails.userRoleId == 1
      //   ? 'Employee'
      //   : 'Reception',
      notifyid:
        this.props.LoginDetails.userRoleId == 3
          ? this.state.VisitorDetails?.whomToMeet
          : 0,
      remarks: this.state.remarks,
    };
    console.log('param', params);
    this.props.VizReschedule(params, this.vizRescheduleSuccess);
  }
  vizRescheduleSuccess = res => this.afterVizRescheduleSuccess(res);
  afterVizRescheduleSuccess(respp) {
    if (respp) {
      this.props.navigation.goBack();
      Alert.alert('Success', 'Reschedule Submitted');
      // send only reception to emply
      // if (this.props.LoginDetails.userRoleId == 3) {
      //     this.sendNotification(this.state.VisitorDetails, 4)
      // } else if (this.props.LoginDetails.userRoleId === 4) {
      //     // send notification to all reception
      //     this.getAllReceptionst(7)
      // }
      this.props.onUpdate();
      // this.callApi(this.state.selectedList)
    } else {
      alert('Reschedule Unsuccessfull');
    }
    this.setState({
      resmodalVisible: false,
      modalVisible: false,
      date: null,
      Intime: null,
      Outtime: null,
      SelectedItem: '',
    });
  }
  vizApproveSuccess = res => this.afterVizApproveSuccess(res);
  afterVizApproveSuccess(respp) {
    console.log('Response++++', respp);
    if (respp == true) {
      this.props.navigation.goBack();
      Alert.alert(
        'Success',
        this.state.VisitorDetails?.fullName + ' Approve successfully',
      );

      // send only reception to emply
      if (this.props.LoginDetails.userRoleId === 3) {
        // this.sendNotification(this.state.VisitorDetails, 2);
      } else if (
        this.props.LoginDetails.userRoleId === 4 ||
        this.props.LoginDetails.userRoleId === 1
      ) {
        this.sendNotification(this.state.VisitorDetails, 2);
        // send notification to all reception
        // this.getAllReceptionst(this.state.VisitorDetails, 5);
      }
      this.props.onUpdate();

      // this.callApi(this.state.selectedList)
    } else {
      alert(this.state.VisitorDetails?.fullName + ' Approve Unsuccessfull');
    }
  }
  vizMeetingIn=()=>{
    this.props.navigation.goBack();
    Alert.alert(
      'Success',
      this.state.VisitorDetails?.fullName + ' Meeting Started',
    );
  }
  vizRejectedSuccess = res => this.afterVizRejectedSuccess(res);
  afterVizRejectedSuccess(respp) {
    console.log('reject log', respp);
    if (respp) {
      this.props.navigation.goBack();
      Alert.alert(
        'Success',
        this.state.VisitorDetails?.fullName + ' Reject successfully',
      );

      if (this.props.LoginDetails.userRoleId === 3) {
        this.getAllReceptionst(this.state.VisitorDetails, 6);
      } else if (
        this.props.LoginDetails.userRoleId === 4 ||
        this.props.LoginDetails.userRoleId === 1
      ) {
        // send notification to all reception
        // this.sendNotification(this.state.VisitorDetails, 3);
        // this.getAllReceptionst(this.state.VisitorDetails, 6);
      }
      // this.callApi(this.state.selectedList)

      this.props.onUpdate();
    } else {
      alert(this.state.VisitorDetails?.fullName + ' Reject Unsuccessfull');
    }
  }
  sendNotification(item, tag) {
    let by;

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
      notifDate: Moment(moment.utc()).format('YYYY-MM-DDTHH:mm:ss'),
      userId: item.whomToMeet,
    };
    console.log('Notification=Reject====', param);
    this.props.SaveNotification(param);
  }
  getAllReceptionst(params1, tag) {
    this.props.ReceptionList.forEach(element => {
      console.log('Element => ', element);
      this.sendNotificationRec(params1, element, tag); // 5 = Approve
    });
  }
  async sendNotificationRec(params1, item, tag) {
    console.log('Receptionist reject==', params1, tag);
    // tag = 5 = approve, 6 = reject, 7 = reschedule 8 = check in
    let by;

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
    if (tag == 5) {
      notifText1 =
        params1.fullName +
        ' ( ' +
        params1.inviteCode.toString().trim() +
        ' ) Approved by ' +
        by; //by Employee "
      // notifText1 = item.fullName  + " Approved"// by Employee "
    } else if (tag == 6) {
      notifText1 =
        params1.fullName +
        ' ( ' +
        params1.inviteCode.toString().trim() +
        ' )  Rejected by ' +
        by; // by Employee "
    } else if (tag == 7) {
      notifText1 =
        params1.fullName +
        ' ( ' +
        params1.inviteCode.toString().trim() +
        ' ) Rescheduled by ' +
        by; // by Employee "
    } else if (tag == 8) {
      if (params1 != '') {
        notifText1 =
          params1.fullName +
          ' ( ' +
          params1.inviteCode.toString().trim() +
          ' ) Checked In by ' +
          by; // by Employee "
      } else {
        notifText1 =
          params1.fullName +
          ' ( ' +
          params1.inviteCode.toString().trim() +
          ' ) Checked In by ' +
          by; // by Employee "
      }
    } else if (tag == 9) {
      notifText1 =
        params1.fullName +
        ' ( ' +
        params1.inviteCode.toString().trim() +
        ' ) Checked Out by ' +
        by; // by Employee "
    }
    var param = {
      notifText: notifText1,
      notifDate: Moment(moment.utc()).format('YYYY-MM-DDTHH:mm:ss'),
      userId: item.usrId,
    };
    console.log('Notification Reject==', param);
    this.props.SaveNotification(param);
  }

  checkoutSuccess = res => this.afterCheckOutSuccess(res);
  afterCheckOutSuccess = async respp => {
    try {
      let response = await axiosPost('Visitor/CheckOut/' + respp, respp);
      console.log('checkout', response);
      this.sendNotification(this.state.VisitorDetails, 21);
      this.getAllReceptionst(this.state.VisitorDetails, 9);
      this.props.navigation.goBack();
      Alert.alert(
        'Success',
        this.state.VisitorDetails?.fullName + ' Check Out successfully',
      );

      this.props.onUpdate();
    } catch (error) {}
    // if (respp) {
    //     this.sendNotification(this.state.VisitorDetails, 21)
    //     this.getAllReceptionst(this.state.VisitorDetails, 9)
    //     Alert.alert("Success", this.state.VisitorDetails?.fullName + " Check Out successfully")
    //     this.props.onUpdate()
    // } else {

    //     alert(this.state.VisitorDetails?.fullName + " Check Out Unsuccessfull")
    // }
    // this.props.onClose()
  };
  meetinOutSuccess = res => this.afterMeetinOutSuccess(res);
  afterMeetinOutSuccess(Response) {
    this.setState({meetOutModalVisible: false});
    if (Response) {
      this.props.navigation.goBack();
      Alert.alert('Success', 'Meeting Out successfully');
      this.props.onUpdate();
    } else {
      alert('Meeting Out failed');
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(VizDetails);
