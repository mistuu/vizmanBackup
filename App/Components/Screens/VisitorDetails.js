import Moment from 'moment';
import React from 'react';
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
  KeyboardAvoidingView
} from 'react-native';

import DatePicker from 'react-native-datepicker';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Toast from 'react-native-simple-toast';
import {Hoshi} from 'react-native-textinput-effects';
import {connect} from 'react-redux';
import {COLORS, IMAGES} from '../../Assets/index.js';
import {mapDispatchToProps, mapStateToProps} from '../../Reducers/ApiClass.js';
import {axiosAuthGet, axiosPost} from '../../utility/apiConnection.js';
import {visitorDetailEmpty} from '../../utility/emptyClass.js';
import {IMAGEURL} from '../../utility/util.js';
import CheckIn from './CheckIn.js';
import Modal from 'react-native-modal';
import Images from '../../Assets/Images/index.js';
import Colors from '../../Assets/Colors/index.js';
import {RFPercentage} from 'react-native-responsive-fontsize';
const {width, height} = Dimensions.get('window');

import ImgToBase64 from 'react-native-image-base64';

import {actions, RichEditor, RichToolbar} from 'react-native-pell-rich-editor';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
const placeholderTextColor = COLORS.placeholderColor;

const richText = React.createRef();

class VisitorDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      picModalVisible: false,
      picImagePath: null,
      modalVisible: this.props.modalVisible,
      VisitorDetails: visitorDetailEmpty,
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
    };
  }

  async componentDidMount() {
    // console.log("modal===", this.props.modalVisible);
    // console.log("Compnay:====", this.props.VisitorDetails.inOutId);
    try {
      let response = await axiosAuthGet(
        'Visitor/GetVisitorDtls/' + this.props.VisitorDetails.inOutId,
      );
      this.setState({VisitorDetails: response});

      // console.log("Response ====", response);
    } catch (error) {}
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
          launchCamera(options, async response => {
            // this.setState({visibleModal: false});
            if (response.didCancel) {
              console.log('selectPhotoTapped did Cancel: ', response);
            } else if (response.error) {
              console.log('selectPhotoTapped error: ', response);
            } else if (response.customButton) {
              console.log('selectPhotoTapped customButton: ', response);
            } else {
              response = response.assets;
              response = Object.assign({}, ...response);
              console.log(response);
              var u;
              await ImageResizer.createResizedImage(
                response.uri,
                response.height,
                response.width,
                'JPEG',
                100,
                0,
                undefined,
                false,
              )
                .then(async res => {
                  console.log(res);
                  PhotoEditor.Edit({
                    path: res.path,

                    colors: undefined,
                    onDone: async img => {
                      u = 'file://' + img;
                      console.log('on done', u);
                      await ImgToBase64.getBase64String(u)
                        .then(base64String => {
                          // this.setState({
                          //   imagePath: response.fileName + ',' + base64String,
                          // });
                          newPic =
                            'data:' + response.type + ';base64,' + base64String;
                          // console.log(newPic);
                          this.onPressAddImage(newPic);
                          // console.log("+++++++", response.fileName + "," + base64String);
                        })
                        .catch();

                      // console.log('SUCCESS CAMERA ', response);
                      let ImageResponse = response.fileName + ',' + response;
                      // this.setState({imageR: ImageResponse});
                      // this.setState(prevState => {
                      //   prevState.userProfile.photoUrl = u;
                      //   return {
                      //     userProfile: prevState.userProfile,
                      //   };
                      // });
                    },
                    onCancel: () => {
                      console.log('on cancel');
                    },
                  });
                })
                .catch(err => {});
              //   var newPic;
            }
          });
        } else {
          // Permission Denied
          alert('CAMERA Permission Denied');
        }
      } else {
        // proceed();
        const options = {};
      }
    } catch (error) {}
  };
  onPressAddImage = img => {
    // insert URL

    richText.current?.insertImage(img);
    // insert base64
    // this.richText.current?.insertImage(`data:${image.mime};base64,${image.data}`);
  };
  setImageOpen = (visible, picImagePath) => {
    console.log(picImagePath);
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
  whatsappShare = phone => {
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
  render() {
    return (
      <>
        {console.log('In Details modal===', this.props.modalVisible)}
        {this.props.VisitorDetails &&
          this.props.modalVisible &&
          this.modalVisitor()}
        {this.rescheduleVisitiMiting()}
        {this.props.LoginDetails.userRoleId == 4 ||
        this.props.LoginDetails.userRoleId == 1
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
              this.props.onClose();
            }}
            onUpdate={() => {
              this.props.onUpdate();
            }}
          />
        )}
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
      </>
    );
  }
  modalVisitor() {
    // this.state.VisitorDetails = this.props.VisitorDetails
    var backgroundColor = COLORS.white;
    var status = '';
    if (
      this.props.LoginDetails.userRoleId != 2 ||
      this.props.LoginDetails.userRoleId != 3
    ) {
      if (this.state.VisitorDetails.status == 3) {
        backgroundColor = COLORS.tempYellow;
        status = 'RESCHEDULED';
      } else if (this.state.VisitorDetails.status == 4) {
        if (
          this.state.VisitorDetails.checkInTime != null &&
          this.state.VisitorDetails.checkOutTime != null
        ) {
          backgroundColor = '#961448';
          status = 'ALREADY CHECKOUT';
        } else {
          backgroundColor = COLORS.skyBlue;
          status = 'WAITING';
        }
      } else if (this.state.VisitorDetails.status == 5) {
        backgroundColor = '#4667cc';
        status = 'INVITED';
      } else if (this.state.VisitorDetails.status == 2) {
        backgroundColor = COLORS.tempRed;
        status = 'REJECTED';
      } else if (this.state.VisitorDetails.status == 1) {
        backgroundColor = COLORS.tempGreen;
        status = 'APPROVED';
      } else if (this.state.VisitorDetails.status == 0) {
        backgroundColor = COLORS.white;
        status = '';
      }
    }
    console.log('this.state.VisitorDetails', this.state.modalVisible);
    return (
      <Modal
        isVisible={this.state.modalVisible}
        onBackdropPress={() => {
          this.setState({modalVisible: false}), this.props.onClose();
        }}
        onSwipeComplete={() => {
          this.setState({modalVisible: false}), this.props.onClose();
        }}
        swipeDirection="left"
        onBackButtonPress={() => {
          this.setState({modalVisible: false}), this.props.onClose();
        }}>
        <View
          style={{
            flex: 1,
            marginTop: 100,
            padding: 10,
            borderRadius: 13,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              padding: 10,
              width: '95%',
              borderRadius: 13,
              backgroundColor: Colors.white,
            }}>
            <View
              style={{
                marginTop: -90,
                borderRadius: 130 / 2,
                height: 130,
                width: 130,
                alignSelf: 'center',
              }}>
              <TouchableOpacity
                onPress={() =>
                  this.setImageOpen(true, this.state.VisitorDetails.photoProof)
                }>
                {this.state.VisitorDetails.photoProof != null ? (
                  <Image
                    source={{
                      uri:
                        IMAGEURL + '/' + this.state.VisitorDetails.photoProof,
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
              {this.state.VisitorDetails.isVip == true ? (
                <View style={{alignItems: 'center', marginTop: -10}}>
                  <Image source={Images.star} style={{height: 20, width: 20}} />
                </View>
              ) : null}
            </View>

            <View>
              {/* For Recpt and Gate*/}
              {console.log(this.state.VisitorDetails)}
              {this.props.LoginDetails.userRoleId == 2 ||
              this.props.LoginDetails.userRoleId == 3 ? (
                <View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      marginTop: 5,
                    }}>
                    {this.state.VisitorDetails.isVip == true
                      ? this.state.VisitorDetails.fullName?.replace(
                          /.(?=.{2,}$)/g,
                          '*',
                        )
                      : this.state.VisitorDetails.fullName}
                  </Text>
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <View style={{width: width / 2.3}}>
                      {!this.state.VisitorDetails.company == null ||
                        (!this.state.VisitorDetails.company == '' && (
                          <View>
                            <Text>Company</Text>
                            <Text
                              style={{fontWeight: 'bold', textAlign: 'left'}}>
                              {this.state.VisitorDetails.isVip == true
                                ? this.state.VisitorDetails.company?.replace(
                                    /.(?=.{2,}$)/g,
                                    '*',
                                  )
                                : this.state.VisitorDetails.company}
                            </Text>
                          </View>
                        ))}
                      {!this.state.VisitorDetails.mobile == null ||
                        (!this.state.VisitorDetails.mobile == '' && (
                          <View>
                            <Text>Mobile No:</Text>
                            <Text style={{fontWeight: 'bold'}}>
                              {this.props.LoginDetails.empID !=
                              this.state.VisitorDetails.whomToMeet
                                ? this.state.VisitorDetails.mobile?.replace(
                                    /.(?=.{2,}$)/g,
                                    '*',
                                  )
                                : this.state.VisitorDetails.mobile}
                            </Text>
                          </View>
                        ))}
                      {this.props.AllSettings.settingsVM.vAddlCol1
                        ? !this.state.VisitorDetails.addlCol1 == null ||
                          (!this.state.VisitorDetails.addlCol1 == '' && (
                            <View style={{}}>
                              <Text style={{}}>
                                {this.state.VisitorDetails.colName1}
                              </Text>
                              <Text style={{fontWeight: 'bold'}}>
                                {this.state.VisitorDetails.isVip == true
                                  ? this.state.VisitorDetails.addlCol1?.replace(
                                      /.(?=.{2,}$)/g,
                                      '*',
                                    )
                                  : this.state.VisitorDetails.addlCol1 == 'true'
                                  ? 'Yes'
                                  : this.state.VisitorDetails.addlCol1 ==
                                    'false'
                                  ? 'No'
                                  : this.state.VisitorDetails.addlCol1}
                              </Text>
                            </View>
                          ))
                        : null}
                      {this.props.AllSettings.settingsVM.vAddlCol3
                        ? !this.state.VisitorDetails.addlCol3 == null ||
                          (!this.state.VisitorDetails.addlCol3 == '' && (
                            <View style={{}}>
                              <Text style={{}}>
                                {this.state.VisitorDetails.colName3}
                              </Text>
                              <Text style={{fontWeight: 'bold'}}>
                                {this.state.VisitorDetails.isVip == true
                                  ? this.state.VisitorDetails.addlCol3?.replace(
                                      /.(?=.{2,}$)/g,
                                      '*',
                                    )
                                  : this.state.VisitorDetails.addlCol3 == 'true'
                                  ? 'Yes'
                                  : this.state.VisitorDetails.addlCol3 ==
                                    'false'
                                  ? 'No'
                                  : this.state.VisitorDetails.addlCol3}
                              </Text>
                            </View>
                          ))
                        : null}
                      {this.props.AllSettings.settingsVM.vAddlCol5
                        ? !this.state.VisitorDetails.addlCol5 == null ||
                          (!this.state.VisitorDetails.addlCol5 == '' && (
                            <View style={{}}>
                              <Text style={{}}>
                                {this.state.VisitorDetails.colName5}
                              </Text>
                              <Text style={{fontWeight: 'bold'}}>
                                {this.state.VisitorDetails.isVip == true
                                  ? this.state.VisitorDetails.addlCol5?.replace(
                                      /.(?=.{2,}$)/g,
                                      '*',
                                    )
                                  : this.state.VisitorDetails.addlCol5 == 'true'
                                  ? 'Yes'
                                  : this.state.VisitorDetails.addlCol5 ==
                                    'false'
                                  ? 'No'
                                  : this.state.VisitorDetails.addlCol5}
                              </Text>
                            </View>
                          ))
                        : null}
                    </View>

                    <View style={{width: width / 3}}>
                      {!this.state.VisitorDetails.designation == null ||
                        (!this.state.VisitorDetails.designation == '' && (
                          <View style={{marginTop: 5}}>
                            <Text>Designation</Text>
                            <Text
                              style={{fontWeight: 'bold', textAlign: 'left'}}>
                              {this.state.VisitorDetails.isVip == true
                                ? this.state.VisitorDetails.designation?.replace(
                                    /.(?=.{2,}$)/g,
                                    '*',
                                  )
                                : this.state.VisitorDetails.designation}
                            </Text>
                          </View>
                        ))}
                      {!this.state.VisitorDetails.email == null ||
                        (!this.state.VisitorDetails.email == '' && (
                          <View style={{marginTop: 5}}>
                            <Text>Email id:</Text>
                            <Text style={{fontWeight: 'bold'}}>
                              {this.state.VisitorDetails.email?.replace(
                                /(\w{0})[\w.-]+@([\w.]+\w)/,
                                '$1***@$2',
                              )}
                            </Text>
                          </View>
                        ))}
                      {this.props.AllSettings.settingsVM.vAddlCol2
                        ? !this.state.VisitorDetails.addlCol2 == null ||
                          (!this.state.VisitorDetails.addlCol2 == '' && (
                            <View style={{marginTop: 5}}>
                              <Text style={{}}>
                                {this.state.VisitorDetails.colName2}
                              </Text>
                              <Text style={{fontWeight: 'bold'}}>
                                {this.state.VisitorDetails.isVip == true
                                  ? this.state.VisitorDetails.addlCol2?.replace(
                                      /.(?=.{2,}$)/g,
                                      '*',
                                    )
                                  : this.state.VisitorDetails.addlCol2 == 'true'
                                  ? 'Yes'
                                  : this.state.VisitorDetails.addlCol2 ==
                                    'false'
                                  ? 'No'
                                  : this.state.VisitorDetails.addlCol2}
                              </Text>
                            </View>
                          ))
                        : null}
                      {this.props.AllSettings.settingsVM.vAddlCol4
                        ? !this.state.VisitorDetails.addlCol4 == null ||
                          (!this.state.VisitorDetails.addlCol4 == '' && (
                            <View style={{marginTop: 5}}>
                              <Text style={{}}>
                                {this.state.VisitorDetails.colName4}
                              </Text>
                              <Text style={{fontWeight: 'bold'}}>
                                {this.state.VisitorDetails.isVip == true
                                  ? this.state.VisitorDetails.addlCol4?.replace(
                                      /.(?=.{2,}$)/g,
                                      '*',
                                    )
                                  : this.state.VisitorDetails.addlCol4 == 'true'
                                  ? 'Yes'
                                  : this.state.VisitorDetails.addlCol4 ==
                                    'false'
                                  ? 'No'
                                  : this.state.VisitorDetails.addlCol4}
                              </Text>
                            </View>
                          ))
                        : null}
                    </View>
                  </View>
                  {!this.state.VisitorDetails.address == null ||
                    (!this.state.VisitorDetails.address == '' && (
                      <View style={{marginTop: 5}}>
                        <Text style={{textAlign: 'left'}}>Address</Text>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            textAlign: 'left',
                            marginLeft: 0,
                          }}>
                          {this.state.VisitorDetails.isVip == true
                            ? this.state.VisitorDetails.address?.replace(
                                /.(?=.{2,}$)/g,
                                '*',
                              )
                            : this.state.VisitorDetails.address}
                        </Text>
                      </View>
                    ))}

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 10,
                    }}>
                    {this.props.LoginDetails.empID !=
                    this.state.VisitorDetails.whomToMeet ? null : (
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <TouchableOpacity
                          onPress={() =>
                            this.whatsappShare(this.state.VisitorDetails.mobile)
                          }>
                          <Image
                            source={Images.whatsapp}
                            style={{height: 20, width: 20}}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            this.callShare(this.state.VisitorDetails.mobile)
                          }>
                          <Image
                            source={Images.call}
                            style={{height: 20, width: 20, marginLeft: 20}}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            this.SMSSahre(this.state.VisitorDetails.mobile)
                          }>
                          <Image
                            source={Images.SMS}
                            style={{height: 20, width: 20, marginLeft: 20}}
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() =>
                            this.gmailShare(this.state.VisitorDetails.email)
                          }>
                          <Image
                            source={Images.gmail}
                            style={{
                              height: 20,
                              width: 20,
                              marginLeft: 20,
                              marginRight: 20,
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                    {!this.state.VisitorDetails.idProof == null ||
                      (!this.state.VisitorDetails.idProof == '' && (
                        <TouchableOpacity
                          onPress={() =>
                            this.setImageOpen(
                              true,
                              this.state.VisitorDetails.idProof,
                            )
                          }>
                          <Image
                            source={Images.idProof}
                            style={{height: 20, width: 20}}
                          />
                        </TouchableOpacity>
                      ))}
                  </View>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: Colors.primary,
                      borderRadius: 13,
                      marginTop: 20,
                      paddingBottom: 10,
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
                    <View
                      style={{borderWidth: 1, borderColor: Colors.primary}}
                    />
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
                              <Text>Date</Text>
                              <Text style={{fontWeight: 'bold'}}>
                                {Moment(this.state.VisitorDetails?.date).format(
                                  'DD-MMM-yyyy',
                                )}
                              </Text>
                            </View>
                          ))}
                        {!this.state.VisitorDetails?.inTime == null ||
                          (!this.state.VisitorDetails?.inTime == '' && (
                            <View style={{marginTop: 5}}>
                              <Text>Exp. In Time :</Text>
                              <Text style={{fontWeight: 'bold'}}>
                                {this.state.VisitorDetails?.inTime == null
                                  ? ''
                                  : Moment(
                                      this.state.VisitorDetails?.inTime,
                                    ).format('HH:mm')}
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
                                  : Moment(
                                      this.state.VisitorDetails?.checkInTime,
                                    ).format('HH:mm')}
                              </Text>
                            </View>
                          ))}
                        {!this.state.VisitorDetails.whomToMeetName == null ||
                          (!this.state.VisitorDetails.whomToMeetName == '' && (
                            <View style={{marginTop: 5}}>
                              <Text>Whom to Meet:</Text>
                              <Text style={{fontWeight: 'bold'}}>
                                {this.state.VisitorDetails.whomToMeetName}
                              </Text>
                            </View>
                          ))}
                      </View>
                      <View style={{width: width / 3}}>
                        {!this.state.VisitorDetails.purpose == null ||
                          (!this.state.VisitorDetails.purpose == '' && (
                            <View style={{marginTop: 5}}>
                              <Text>Purpose</Text>
                              <Text style={{fontWeight: 'bold'}}>
                                {this.state.VisitorDetails.isVip == true
                                  ? this.state.VisitorDetails.purpose?.replace(
                                      /.(?=.{2,}$)/g,
                                      '*',
                                    )
                                  : this.state.VisitorDetails.purpose}
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
                                      this.state.VisitorDetails?.outTime,
                                    ).format('HH:mm')}
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
                                      this.state.VisitorDetails?.checkOutTime,
                                    ).format('HH:mm')}
                              </Text>
                            </View>
                          ))}
                        {!this.state.VisitorDetails.department == null ||
                          (!this.state.VisitorDetails.department == '' && (
                            <View style={{marginTop: 5}}>
                              <Text>Department:</Text>
                              <Text style={{fontWeight: 'bold'}}>
                                {' '}
                                {this.state.VisitorDetails.isVip == true
                                  ? this.state.VisitorDetails.department?.replace(
                                      /.(?=.{2,}$)/g,
                                      '*',
                                    )
                                  : this.state.VisitorDetails.department}
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
                    {(this.props.LoginDetails.userRoleId == 1 ||
                      this.props.LoginDetails.userRoleId == 4) && (
                      <View style={{marginTop: 5}}>
                        <Text style={{marginLeft: 5}}>Remarks:</Text>
                        <Text style={{fontWeight: 'bold', marginLeft: 5}}>
                          {this.state.VisitorDetails.isVip == true
                            ? this.state.VisitorDetails.remarks?.replace(
                                /.(?=.{2,}$)/g,
                                '*',
                              )
                            : this.state.VisitorDetails.remarks}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              ) : (
                // For Emp detail view
                <View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      marginTop: 5,
                    }}>
                    {this.props.LoginDetails.userRoleId == 4 ||
                    this.props.LoginDetails.userRoleId == 1
                      ? this.state.VisitorDetails.fullName
                      : this.state.VisitorDetails.fullName.replace(
                          /.(?=.{2,}$)/g,
                          '*',
                        )}
                  </Text>
                  <ScrollView>
                    <View style={{flexDirection: 'row'}}>
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
                                {this.state.VisitorDetails.company}
                              </Text>
                            </View>
                          ))}
                        {!this.state.VisitorDetails?.mobile == null ||
                          (!this.state.VisitorDetails?.mobile == '' && (
                            <View style={{marginTop: 5}}>
                              <Text>Mobile No:</Text>
                              <Text style={{fontWeight: 'bold'}}>
                                {this.props.LoginDetails.userRoleId == 4 ||
                                this.props.LoginDetails.userRoleId == 1
                                  ? this.state.VisitorDetails.mobile
                                  : this.state.VisitorDetails.mobile.replace(
                                      /.(?=.{2,}$)/g,
                                      '*',
                                    )}
                              </Text>
                            </View>
                          ))}

                        {this.props.AllSettings.settingsVM.vAddlCol1
                          ? !this.state.VisitorDetails.addlCol1 == null ||
                            (!this.state.VisitorDetails.addlCol1 == '' && (
                              <View style={{marginTop: 5}}>
                                <Text style={{}}>
                                  {this.state.VisitorDetails.colName1}
                                </Text>
                                <Text style={{fontWeight: 'bold'}}>
                                  {this.state.VisitorDetails.addlCol1 == 'true'
                                    ? 'Yes'
                                    : this.state.VisitorDetails.addlCol1 ==
                                      'false'
                                    ? 'No'
                                    : this.state.VisitorDetails.addlCol1}
                                </Text>
                              </View>
                            ))
                          : null}
                        {this.props.AllSettings.settingsVM.vAddlCol3
                          ? !this.state.VisitorDetails.addlCol3 == null ||
                            (!this.state.VisitorDetails.addlCol3 == '' && (
                              <View style={{marginTop: 5}}>
                                <Text style={{}}>
                                  {this.state.VisitorDetails.colName3}
                                </Text>
                                <Text style={{fontWeight: 'bold'}}>
                                  {this.state.VisitorDetails.addlCol3 == 'true'
                                    ? 'Yes'
                                    : this.state.VisitorDetails.addlCol3 ==
                                      'false'
                                    ? 'No'
                                    : this.state.VisitorDetails.addlCol3}
                                </Text>
                              </View>
                            ))
                          : null}
                        {this.props.AllSettings.settingsVM.vAddlCol5
                          ? !this.state.VisitorDetails.addlCol5 == null ||
                            (!this.state.VisitorDetails.addlCol5 == '' && (
                              <View style={{marginTop: 5}}>
                                <Text style={{}}>
                                  {this.state.VisitorDetails.colName5}
                                </Text>
                                <Text style={{fontWeight: 'bold'}}>
                                  {this.state.VisitorDetails.addlCol5 == 'true'
                                    ? 'Yes'
                                    : this.state.VisitorDetails.addlCol5 ==
                                      'false'
                                    ? 'No'
                                    : this.state.VisitorDetails.addlCol5}
                                </Text>
                              </View>
                            ))
                          : null}
                      </View>

                      <View style={{width: width / 3}}>
                        {!this.state.VisitorDetails.designation == null ||
                          (!this.state.VisitorDetails.designation == '' && (
                            <View style={{marginTop: 5}}>
                              <Text>Designation</Text>
                              <Text
                                style={{
                                  fontWeight: 'bold',
                                  textAlign: 'left',
                                }}>
                                {this.props.LoginDetails.userRoleId == 4 ||
                                this.props.LoginDetails.userRoleId == 1
                                  ? this.state.VisitorDetails.designation
                                  : this.state.VisitorDetails.designation?.replace(
                                      /.(?=.{2,}$)/g,
                                      '*',
                                    )}
                              </Text>
                            </View>
                          ))}
                        {!this.state.VisitorDetails.email == null ||
                          (!this.state.VisitorDetails.email == '' && (
                            <View style={{marginTop: 5}}>
                              <Text>Email id:</Text>
                              <Text style={{fontWeight: 'bold'}}>
                                {this.props.LoginDetails.userRoleId == 4 ||
                                this.props.LoginDetails.userRoleId == 1
                                  ? this.state.VisitorDetails.email
                                  : this.state.VisitorDetails.email?.replace(
                                      /(\w{0})[\w.-]+@([\w.]+\w)/,
                                      '$1***@$2',
                                    )}
                              </Text>
                            </View>
                          ))}
                        {this.props.AllSettings.settingsVM.vAddlCol2
                          ? !this.state.VisitorDetails.addlCol2 == null ||
                            (!this.state.VisitorDetails.addlCol2 == '' && (
                              <View style={{marginTop: 5}}>
                                <Text style={{}}>
                                  {this.state.VisitorDetails.colName2}
                                </Text>
                                <Text style={{fontWeight: 'bold'}}>
                                  {this.state.VisitorDetails.addlCol2 == 'true'
                                    ? 'Yes'
                                    : this.state.VisitorDetails.addlCol2 ==
                                      'false'
                                    ? 'No'
                                    : this.state.VisitorDetails.addlCol2}
                                </Text>
                              </View>
                            ))
                          : null}
                        {this.props.AllSettings.settingsVM.vAddlCol4
                          ? !this.state.VisitorDetails.addlCol4 == null ||
                            (!this.state.VisitorDetails.addlCol4 == '' && (
                              <View style={{marginTop: 5}}>
                                <Text style={{}}>
                                  {this.state.VisitorDetails.colName4}
                                </Text>
                                <Text style={{fontWeight: 'bold'}}>
                                  {this.state.VisitorDetails.addlCol4 == 'true'
                                    ? 'Yes'
                                    : this.state.VisitorDetails.addlCol4 ==
                                      'false'
                                    ? 'No'
                                    : this.state.VisitorDetails.addlCol4}
                                </Text>
                              </View>
                            ))
                          : null}
                      </View>
                    </View>
                  </ScrollView>
                  {!this.state.VisitorDetails.address == null ||
                    (!this.state.VisitorDetails.address == '' && (
                      <View style={{marginTop: 5}}>
                        <Text style={{textAlign: 'left'}}>Address</Text>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            textAlign: 'left',
                            marginLeft: 0,
                          }}>
                          {this.state.VisitorDetails.address}
                        </Text>
                      </View>
                    ))}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 10,
                    }}>
                    <TouchableOpacity
                      onPress={() =>
                        this.whatsappShare(this.state.VisitorDetails.mobile)
                      }>
                      <Image
                        source={Images.whatsapp}
                        style={{height: 20, width: 20}}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        this.callShare(this.state.VisitorDetails.mobile)
                      }>
                      <Image
                        source={Images.call}
                        style={{height: 20, width: 20, marginLeft: 20}}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        this.SMSSahre(this.state.VisitorDetails.mobile)
                      }>
                      <Image
                        source={Images.SMS}
                        style={{height: 20, width: 20, marginLeft: 20}}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        this.gmailShare(this.state.VisitorDetails.email)
                      }>
                      <Image
                        source={Images.gmail}
                        style={{
                          height: 20,
                          width: 20,
                          marginLeft: 20,
                          marginRight: 20,
                        }}
                      />
                    </TouchableOpacity>
                    {(this.state.VisitorDetails.idProof != null ||
                      this.state.VisitorDetails.idProof == '') && (
                      <TouchableOpacity
                        onPress={() =>
                          this.setImageOpen(
                            true,
                            this.state.VisitorDetails.idProof,
                          )
                        }>
                        <Image
                          source={Images.idProof}
                          style={{height: 20, width: 20}}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: Colors.primary,
                      borderRadius: 13,
                      marginTop: 20,
                      paddingBottom: 10,
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
                    <View
                      style={{borderWidth: 1, borderColor: Colors.primary}}
                    />
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
                              <Text>Date</Text>
                              <Text style={{fontWeight: 'bold'}}>
                                {Moment(this.state.VisitorDetails?.date).format(
                                  'DD-MMM-yyyy',
                                )}
                              </Text>
                            </View>
                          ))}
                        {!this.state.VisitorDetails?.inTime == null ||
                          (!this.state.VisitorDetails?.inTime == '' && (
                            <View style={{marginTop: 5}}>
                              <Text>Exp. In Time :</Text>
                              <Text style={{fontWeight: 'bold'}}>
                                {this.state.VisitorDetails?.inTime == null
                                  ? ''
                                  : Moment(
                                      this.state.VisitorDetails?.inTime,
                                    ).format('HH:mm')}
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
                                  : Moment(
                                      this.state.VisitorDetails?.checkInTime,
                                    ).format('HH:mm')}
                              </Text>
                            </View>
                          ))}
                        {(this.state.VisitorDetails.whomToMeetName != null ||
                          this.state.VisitorDetails.whomToMeetName != '') && (
                          <View style={{marginTop: 5}}>
                            <Text>Whom to Meet:</Text>
                            <Text style={{fontWeight: 'bold'}}>
                              {this.state.VisitorDetails.whomToMeetName}
                            </Text>
                          </View>
                        )}
                      </View>
                      <View style={{width: width / 3}}>
                        {!this.state.VisitorDetails.purpose == null ||
                          (!this.state.VisitorDetails.purpose == '' && (
                            <View style={{marginTop: 5}}>
                              <Text>Purpose</Text>
                              <Text style={{fontWeight: 'bold'}}>
                                {this.state.VisitorDetails.purpose}
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
                                      this.state.VisitorDetails?.outTime,
                                    ).format('HH:mm')}
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
                                      this.state.VisitorDetails?.checkOutTime,
                                    ).format('HH:mm')}
                              </Text>
                            </View>
                          ))}
                        {!this.state.VisitorDetails.department == null ||
                          (!this.state.VisitorDetails.department == '' && (
                            <View style={{marginTop: 5}}>
                              <Text>Department:</Text>
                              <Text style={{fontWeight: 'bold'}}>
                                {' '}
                                {this.props.LoginDetails.userRoleId == 4 ||
                                this.props.LoginDetails.userRoleId == 1
                                  ? this.state.VisitorDetails.department
                                  : this.state.VisitorDetails.department?.replace(
                                      /.(?=.{2,}$)/g,
                                      '*',
                                    )}
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
                    {this.state.VisitorDetails.remarks != null ||
                      (!this.state.VisitorDetails.remarks == '' && (
                        <View style={{marginTop: 5}}>
                          <Text style={{marginLeft: 5}}>Remarks:</Text>
                          <Text style={{fontWeight: 'bold', marginLeft: 5}}>
                            {this.state.VisitorDetails.remarks}
                          </Text>
                        </View>
                      ))}
                  </View>
                </View>
              )}

              {/* <View style={{ marginTop: 50, width: "90%", alignSelf: 'center', borderWidth: 1, borderColor: Colors.primary }} /> */}
              {this.props.LoginDetails.userRoleId == 3 ||
              this.props.LoginDetails.userRoleId == 4 ||
              this.props.LoginDetails.userRoleId == 1 ? (
                <View style={{alignItems: 'center', padding: 10}}>
                  {this.state.VisitorDetails.status == 4 &&
                  this.state.VisitorDetails.checkInTime != null &&
                  this.state.VisitorDetails.checkOutTime != null ? null : (
                    <View style={{flexDirection: 'row'}}>
                      {this.state.VisitorDetails.checkOutTime == null &&
                      this.state.VisitorDetails.status == 4 ? (
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({modalVisible: false});
                            console.log(
                              'Parameter ++=,',
                              this.state.VisitorDetails,
                            );
                            this.props.VizApprove(
                              this.state.VisitorDetails.inOutId +
                                '/' +
                                this.props.LoginDetails.userID +
                                '/' +
                                this.props.LoginDetails.empID +
                                '/' +
                                this.state.VisitorDetails.fullName +
                                '/' +
                                this.state.VisitorDetails.inviteCode,
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
                      {this.state.VisitorDetails.status == 4 ||
                      this.state.VisitorDetails.status == 5 ? (
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({modalVisible: false});
                            this.props.VizRejected(
                              this.state.VisitorDetails.inOutId,
                              this.vizRejectedSuccess,
                            );
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

                      {this.state.VisitorDetails.status == 4 ||
                      this.state.VisitorDetails.status == 5 ? (
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
                      {this.props.LoginDetails.userRoleId == 4 &&
                      this.props.isReport != 1 &&
                      this.state.VisitorDetails.status == 1 &&
                      this.state.VisitorDetails.meetOutTime == null ? (
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({
                              modalVisible: false,
                              remarks: '',
                              meetOutModalVisible: true,
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
                        this.state.VisitorDetails.status == 1 &&
                        this.state.VisitorDetails.meetOutTime == null ? (
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({
                              modalVisible: false,
                              remarks: '',
                              meetOutModalVisible: true,
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
                    </View>
                  )}
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </Modal>
    );
  }
  rescheduleVisitiMiting() {
    // temp.push(this.state.upComingList.map(item => {
    return (
      <Modal
        isVisible={this.state.resmodalVisible}
        onBackdropPress={() => {
          this.setState({resmodalVisible: false}), this.props.onClose();
        }}
        onSwipeComplete={() => {
          this.setState({resmodalVisible: false}), this.props.onClose();
        }}
        swipeDirection="left"
        onBackButtonPress={() => {
          this.setState({resmodalVisible: false}), this.props.onClose();
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
              this.props.onClose();
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
              width: '75%',
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

            <DatePicker
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
            />

            {Platform.OS === 'ios' ? (
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
                  // ... You can check the source to find the other keys.
                }}
                onDateChange={Intime => {
                  this.setState({Intime});
                }}
              />
            ) : (
              <View style={{flexDirection: 'row', width: '100%', marginTop: 5}}>
                <TouchableOpacity
                  style={{flexDirection: 'row', width: '100%', paddingRight: 5}}
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
                {/* <TouchableOpacity style={{ width: '10%', position: 'absolute', right: 10, top: 12 }} activeOpacity={1} onPress={() => this.showTimePicker(1)}>
                                    <Image source={IMAGES.date_icon}
                                        style={{ height: 25, width: 32 }}
                                    />
                                </TouchableOpacity> */}
                {this.state.isExpectedInVisible ? (
                  <DateTimePicker
                    mode={'time'}
                    format="HH:mm:ss"
                    ref={el => {
                      this.inTime = el;
                    }}
                    isVisible={this.state.isExpectedInVisible}
                    // display='clock' // 'default', 'spinner', 'calendar', 'clock' // Android Only
                    // is24Hour={false} // Android Only
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
                          new Date(finalDat).getTime() > new Date(t3).getTime()
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
            )}

            {Platform.OS === 'ios' ? (
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
                  style={{flexDirection: 'row', width: '100%', paddingRight: 5}}
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
                {/* <TouchableOpacity style={{ width: '10%', position: 'absolute', right: 10, top: 8 }} activeOpacity={1} onPress={() => this.showTimePicker(2)}>
                                    <Image source={IMAGES.date_icon}
                                        style={{ height: 28, width: 32 }}
                                    />
                                </TouchableOpacity> */}
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
                          new Date(finalDat).getTime() > new Date(t3).getTime()
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
            )}

            {/* </View> */}
            <TouchableOpacity
              onPress={() => {
                this.props.SubscriptionLimit !== 0
                  ? alert('Subscription Limit cross')
                  : this.state.date == null
                  ? alert('Please Select Date')
                  : this.state.Intime == null
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
          </View>
        </View>
      </Modal>
    );
    // }
    // ))
    // return temp
  }
  onOpen() {
    this.setState({modalVisible: true});
  }
  meetOutModal() {
    return (
      <Modal
        isVisible={this.state.meetOutModalVisible}
        onBackdropPress={() => {
          this.setState({meetOutModalVisible: false}), this.props.onClose();
        }}
        onSwipeComplete={() => {
          this.setState({meetOutModalVisible: false}), this.props.onClose();
        }}
        swipeDirection="left"
        onBackButtonPress={() => {
          this.setState({meetOutModalVisible: false}), this.props.onClose();
        }}>
        <View
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableWithoutFeedback
            onPressOut={() => {
              this.setState({meetOutModalVisible: false});
              this.props.onClose();
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
              paddingBottom: this.state.paddingBottom,
              height: null,
              width: '90%',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
            }}>
            <View
              style={{
                height: null,
                width: '100%',
                backgroundColor: COLORS.white,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
              }}>
              <Text
                style={{
                  fontSize: 22,
                  marginBottom: 10,
                  padding: '5%',
                  color: COLORS.primary,
                }}>
                Meeting Out
              </Text>
              {/* <TextInput
                placeholder="Remarks"
                style={{
                  paddingLeft: 10,
                  marginTop: 10,
                  borderRadius: 2,
                  borderWidth: 1,
                  backgroundColor: COLORS.white,
                  width: '85%',
                  fontSize: 18,
                  color: COLORS.black,
                  borderColor: COLORS.black,
                }}
                multiline={true}
                onChangeText={remarks => {
                  this.setState({remarks: remarks});
                }}
                value={this.state.remarks}
              /> */}
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{width: '90%', marginBottom: 20}}>
                <Text>Description:</Text>
                <RichEditor
                  ref={richText}
                  placeholder="Write"
                  onChange={descriptionText => {
                    console.log('descriptionText:', descriptionText);
                  }}
                />
              </KeyboardAvoidingView>

              <RichToolbar
                editor={richText}
                actions={[
                  actions.setBold,
                  actions.setItalic,
                  actions.setUnderline,
                  actions.heading1,
                  actions.insertImage,
                  actions.insertVideo,
                ]}
                onPressAddImage={this.selectPhotoTapped}
                iconMap={{
                  [actions.heading1]: ({tintColor}) => (
                    <Text style={[{color: tintColor}]}>H1</Text>
                  ),
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  var param = {
                    inOutId: this.state.VisitorDetails.inOutId,
                    comment: this.state.remarks,
                  };
                  this.props.MeetingOut(param, this.meetinOutSuccess);
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
            </View>
          </View>
        </View>
      </Modal>
    );
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
      inOutId: this.state.VisitorDetails.inOutId,
      rshDate: this.state.date.toString().split('-').join('/'), //newDate + 'T00:00:00.000Z',
      expIntime: newDate + 'T' + this.state.Intime,
      expOuttime:
        this.state.Outtime == null ? '' : newDate + 'T' + this.state.Outtime,
      RshdldBy:
        this.props.LoginDetails.userRoleId == 4 ||
        this.props.LoginDetails.userRoleId == 1
          ? 'Employee'
          : 'Reception',
      notifyid:
        this.props.LoginDetails.userRoleId == 3
          ? this.state.VisitorDetails.whomToMeet
          : 0,
    };
    console.log('param', params);
    this.props.VizReschedule(params, this.vizRescheduleSuccess);
  }
  vizRescheduleSuccess = res => this.afterVizRescheduleSuccess(res);
  afterVizRescheduleSuccess(respp) {
    if (respp) {
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
    this.props.onClose();
  }
  vizApproveSuccess = res => this.afterVizApproveSuccess(res);
  afterVizApproveSuccess(respp) {
    console.log('Response++++', respp);
    if (respp == true) {
      Alert.alert(
        'Success',
        this.state.VisitorDetails.fullName + ' Approve successfully',
      );

      // send only reception to emply
      if (this.props.LoginDetails.userRoleId === 3) {
        this.sendNotification(this.state.VisitorDetails, 2);
      } else if (
        this.props.LoginDetails.userRoleId === 4 ||
        this.props.LoginDetails.userRoleId === 1
      ) {
        // send notification to all reception
        this.getAllReceptionst(this.state.VisitorDetails, 5);
      }
      this.props.onUpdate();

      // this.callApi(this.state.selectedList)
    } else {
      alert(this.state.VisitorDetails.fullName + ' Approve Unsuccessfull');
    }
    this.props.onClose();
  }
  vizRejectedSuccess = res => this.afterVizRejectedSuccess(res);
  afterVizRejectedSuccess(respp) {
    if (respp) {
      Alert.alert(
        'Success',
        this.state.VisitorDetails.fullName + ' Reject successfully',
      );

      if (this.props.LoginDetails.userRoleId === 3) {
        this.sendNotification(this.state.VisitorDetails, 3);
      } else if (
        this.props.LoginDetails.userRoleId === 4 ||
        this.props.LoginDetails.userRoleId === 1
      ) {
        // send notification to all reception
        this.getAllReceptionst(this.state.VisitorDetails, 6);
      }
      // this.callApi(this.state.selectedList)

      this.props.onUpdate();
    } else {
      alert(this.state.VisitorDetails.fullName + ' Reject Unsuccessfull');
    }
    this.props.onClose();
  }
  sendNotification(item, tag) {
    let by;

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
      notifDate: Moment().format('YYYY-MM-DDTHH:mm:ss'),
      userId: item.whomToMeet,
    };
    this.props.SaveNotification(param);
  }
  getAllReceptionst(params1, tag) {
    this.props.ReceptionList.forEach(element => {
      console.log('Element => ', element);
      this.sendNotificationRec(params1, element, tag); // 5 = Approve
    });
  }
  async sendNotificationRec(params1, item, tag) {
    // tag = 5 = approve, 6 = reject, 7 = reschedule 8 = check in
    let by;

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
      notifDate: Moment().format('YYYY-MM-DDTHH:mm:ss'),
      userId: item.usrId,
    };
    this.props.SaveNotification(param);
  }

  checkoutSuccess = res => this.afterCheckOutSuccess(res);
  afterCheckOutSuccess = async respp => {
    try {
      let response = await axiosPost('Visitor/CheckOut/' + respp, respp);
      console.log('checkout', response);
      this.sendNotification(this.state.VisitorDetails, 21);
      this.getAllReceptionst(this.state.VisitorDetails, 9);
      Alert.alert(
        'Success',
        this.state.VisitorDetails.fullName + ' Check Out successfully',
      );
      this.props.onUpdate();
      this.props.onClose();
    } catch (error) {}
    // if (respp) {
    //     this.sendNotification(this.state.VisitorDetails, 21)
    //     this.getAllReceptionst(this.state.VisitorDetails, 9)
    //     Alert.alert("Success", this.state.VisitorDetails.fullName + " Check Out successfully")
    //     this.props.onUpdate()
    // } else {

    //     alert(this.state.VisitorDetails.fullName + " Check Out Unsuccessfull")
    // }
    // this.props.onClose()
  };
  meetinOutSuccess = res => this.afterMeetinOutSuccess(res);
  afterMeetinOutSuccess(Response) {
    this.setState({meetOutModalVisible: false});
    if (Response) {
      Alert.alert('Success', 'Meeting Out successfully');
      this.props.onUpdate();
    } else {
      alert('Meeting Out failed');
    }
    this.props.onClose();
  }
}

// const mapStateToProps = (state) => ({
//     // network: state.NetworkReducer.network,
//     // error: state.CommanReducer.error,
//     Update: state.CommanReducer.Update,
//     SubscriptionLimit: state.CommanReducer.SubscriptionLimit,
//     UserDetails: state.CommanReducer?.UserDetails,
//     LoginDetails: state.CommanReducer?.LoginDetails,
//     // ReceptionData: state.CommanReducer?.ReceptionData,
//     // VisitorList: state.VisitorsReducer?.VisitorList,
//     // EmployeeList: state.EmployeReducer?.EmployeeList,
//     ReceptionList: state.CommanReducer?.ReceptionList,
//     AllSettings: state.CommanReducer?.AllSettings,
// });
// const mapDispatchToProps = (dispatch) => ({
//     CheckOut: (inoutid, onSuccess) => dispatch(Fetch('Visitor/CheckOut/' + inoutid, 'POST', undefined, onSuccess)),
//     Update: (Update) => dispatch(serviceActionUpdate(Update)),
//     SaveNotification: (param) => dispatch(Fetch('Notification/SaveNotification', 'POST', param)),
//     GetReceptionList: (userID) => dispatch(Fetch('Users/GetReceptionList', 'GET', userID, serviceActionReceptionList)),
//     VizReschedule: (param, onSuccess) => dispatch(Fetch('Visitor/VizReschedule', 'POST', param, undefined, onSuccess)),
//     VizApprove: (param, onSuccess) => dispatch(Fetch('Visitor/VizApprove/' + param, 'POST', undefined, undefined, onSuccess)),
//     VizRejected: (param, onSuccess) => dispatch(Fetch('Visitor/VizRejected/' + param, 'POST', undefined, undefined, onSuccess)),
//     MeetingOut: (param, onSuccess) => dispatch(Fetch('Visitor/MeetingOut', 'POST', param, undefined, onSuccess)),
// })

export default connect(mapStateToProps, mapDispatchToProps)(VisitorDetails);

// checkArogyaSetu(item, tag) {
//     if (this.props.AllSettings.settingsVM.vArogya) {
//         if (item.isVizArogyaSetu != null) {
//             this.checkTemp(item, tag)
//         } else {
//             alert('Please choose Arogya Setu.')
//         }
//     } else {
//         this.checkTemp(item, tag)
//     }
// }
// checkTemp(item, tag) {
//     if (this.props.AllSettings.settingsVM.vtemprature) {
//         if (item.vizTemp != null && item.vizTemp != "") {
//             this.insetOrCheckin(tag)
//         } else {
//             alert('Please add visitor Temperature')
//         }
//     } else {
//         this.insetOrCheckin(tag)
//     }
// }
// insetOrCheckin(tag) {
//     if (tag == 2) {
//         this.insertChekIn(this.state.VisitorDetails)
//     } else if (tag == 1) {
//         this.checkinWithPhoto(this.state.VisitorDetails)
//     }
// }

// insertChekIn(item) {
//     this.setState({ skipModalCheckIn: false })
//     var isArogyaSetu = item.isArogyaSetu == null ? false : item.isArogyaSetu
//     var vizTemp = item.vizTemp == null ? false : item.vizTemp
//     var params1 = item.inOutId + "/" + isArogyaSetu + "/" + vizTemp
//     this.props.CheckIn(params1, this.insertChekInSuccess)
// }
// insertChekInSuccess = (res) => (this.afterInsertChekInSuccess(res))

// afterInsertChekInSuccess(respp) {
//     if (respp) {
//         // this.callApi(this.state.selectedList)
//         this.sendNotification(this.state.VisitorDetails, 1)
//         this.getAllReceptionst(this.state.VisitorDetails, 8)
//         Alert.alert("Success", this.state.VisitorDetails.fullName + " Check In successfully")
//         this.props.onUpdate()
//     } else {
//         alert(this.state.VisitorDetails.fullName + " Check In Unsuccessfull")
//     }
//     this.props.onClose()
// }
// checkinWithPhoto(item) {
//     this.setState({ skipModalCheckIn: false })
//     var isArogyaSetu = item.isArogyaSetu == null ? false : item.isArogyaSetu
//     var vizTemp = item.vizTemp == null ? false : item.vizTemp
//     var params1 = {
//         inOutId: item.inOutId,
//         visitorId: item.visitorId,
//         imageBase64StringPhotoProofChkin: this.state.imageBase64StringPhotoProof.data, // pass file name
//         imageBase64StringIdProofChkin: this.state.imageBase64StringIdProof.data,
//         photoProofPath: null,
//         idprfPath: null,
//         isVizArogyaSetu: isArogyaSetu,
//         vizTemp: vizTemp,
//         // inviteCode: this.makeid(6)
//     }
//     this.props.CheckinWithPhoto(params1, this.checkinWithPhotoSuccess)

// }
// checkinWithPhotoSuccess = (res) => (this.afterCheckinWithPhotoSuccess(res))
// afterCheckinWithPhotoSuccess(respp) {
//     if (respp) {
//         // this.callApi(this.state.selectedList)
//         this.props.onUpdate()
//         this.sendNotification(this.state.VisitorDetails, 1)
//         this.getAllReceptionst(this.state.VisitorDetails, 8)
//         Alert.alert("Success", this.state.VisitorDetails.fullName + " Check In successfully")
//     } else {
//         alert(this.state.VisitorDetails.fullName + " Check In Unsuccessfull")
//     }
//     this.props.onClose()

// }
