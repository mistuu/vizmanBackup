import React from 'react';
import {
  BackHandler,
  Image,
  Modal,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native';

import ImgToBase64 from 'react-native-image-base64';
import ImagePicker from 'react-native-image-crop-picker';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import DropDownPicker from 'react-native-dropdown-picker';
import {Hoshi} from 'react-native-textinput-effects';
import {connect} from 'react-redux';
import {COLORS, IMAGES} from '../../../Assets';
import {
  mapDispatchToProps,
  mapStateToProps,
} from '../../../Reducers/ApiClass.js';
import {IMAGEURL} from '../../../utility/util.js';
import {userProfileEmpty} from '../../../utility/emptyClass';
import Toast from 'react-native-simple-toast';
import {Buffer} from 'buffer';
import encoding from 'text-encoding';
import {Colors} from 'react-native/Libraries/NewAppScreen';

class AdminNewEmploy extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userProfile:
        this.props.route.params?.tag == 'Employee Details'
          ? this.props.route.params?.EmplDtls
          : userProfileEmpty,
      OhidePassword: false,
      data: this.props.route.params,
      elevation: 7,
      imageR: '',
      imageRes: {},
      open: true,
      imageShow: '',
      imagePath: null,
      selectedUserRole: [],
      visibleModal: false,
      userPic: IMAGEURL + '/ImageFiles/defaultuser.png',
      selectedItem: [{label: 'UK', value: 0}],
      userRole: [
        {label: 'Employee', value: 4},
        {label: 'Gatekeeper', value: 2},
        {label: 'Receptionist', value: 3},
      ],
      selectedTimezone: [ ],
      timeZone: [
        {label: '--Select TimeZone--', value: '0'},
        {label: '-12:00 - Eniwetok,Kwajalein', value: '-12'},
        {label: '-11:00 - MidwayIsland,Samoa', value: '-11'},
        {label: '-10:00 - Hawaii', value: '-10'},
        {label: '-09:30 - Taiohae', value: '-9.50'},
        {label: '-09:00 - Alaska', value: '-9'},
        {label: '-08:00 - PacificTime (US & Canada)', value: '-8'},
        {label: '-07:00 - MountainTime (US & Canada)', value: '-7'},
        {label: '-06:00 - CentralTime (US & Canada),MexicoCity', value: '-6'},
        {label: '-05:00 - EasternTime (US & Canada),Bogota,Lima', value: '-5'},
        {label: '-04:30 - Caracas', value: '-4.50'},
        {label: '-04:00 - AtlanticTime (Canada),Caracas,LaPaz', value: '-4'},
        {label: '-03:30 - Newfoundland', value: '-3.50'},
        {label: '-03:00 - Brazil,BuenosAires,Georgetown', value: '-3'},
        {label: '-02:00 - Mid-Atlantic', value: '-2'},
        {label: '-01:00 - Azores,CapeVerde Islands', value: '-1'},
        {
          label: '+00:00 - WesternEuropeTime,London,Lisbon,Casablanca',
          value: '+0',
        },
        {label: '+01:00 - Brussels,Copenhagen,Madrid,Paris', value: '+1'},
        {label: '+02:00 - Kaliningrad,SouthAfrica', value: '+2'},
        {label: '+03:00 - Baghdad,Riyadh,Moscow,St.Petersburg', value: '+3'},
        {label: '+03:30 - Tehran', value: '+3.50'},
        {label: '+04:00 - AbuDhabi,Muscat,Baku,Tbilisi', value: '+4'},
        {label: '+04:30 - Kabul', value: '+4.50'},
        {
          label: '+05:00 - Ekaterinburg,Islamabad,Karachi,Tashkent',
          value: '+5',
        },
        {label: '+05:30 - India', value: '+5.50'},
        {label: '+05:45 - Kathmandu,Pokhara', value: '+5.75'},
        {label: '+06:00 - Almaty,Dhaka,Colombo', value: '+6'},
        {label: '+06:30 - Yangon,Mandalay', value: '+6.50'},
        {label: '+07:00 - Bangkok,Hanoi,Jakarta', value: '+7'},
        {label: '+08:00 - Beijing,Perth,Singapore,HongKong', value: '+8'},
        {label: '+08:45 - Eucla', value: '+8.75'},
        {label: '+09:00 - Tokyo,Seoul,Osaka,Sapporo,Yakutsk', value: '+9'},
        {label: '+09:30 - Adelaide,Darwin', value: '+9.50'},
        {label: '+10:00 - EasternAustralia,Guam,Vladivostok', value: '+10'},
        {label: '+10:30 - LordHowe Island', value: '+10.50'},
        {label: '+11:00 - Magadan,SolomonIslands,NewCaledonia', value: '+11'},
        {label: '+11:30 - NorfolkIsland', value: '+11.50'},
        {label: '+12:00 - Auckland,Wellington,Fiji,Kamchatka', value: '+12'},
        {label: '+12:45 - ChathamIslands', value: '+12.75'},
        {label: '+13:00 - Apia,Nukualofa', value: '+13'},
        {label: '+14:00 - LineIslands,Tokelau', value: '+14'},
      ],
    };
  }

  componentDidMount() {
    if (this.props.route.params?.tag == 'Update Employee' ||this.props.route.params?.tag=='Employee Details') {
      this.props.GetUsersDetails1(
        this.props.route.params.EmplDtls?.usrId,
        this.responseUpdate,
      );
    }
    console.log('User Profile ==', this.state.userProfile);
  }

  responseUpdate = userProfile => {
    this.setState({userProfile});
  };

  removeImage() {
    this.setState(prevState => {
      prevState.userProfile.photoUrl = '';
      return {
        userProfile: prevState.userProfile,
      };
    });
    this.setState({imageR: ''});
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
          var base64Url;
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
                console.log('Hello world', res.name);

                u = res.uri;
                await ImgToBase64.getBase64String(u)
                  .then(base64String => {
                    base64Url = base64String;
                    this.setState({
                      imagePath: res.name + ',' + base64String,
                    });
                    //  var newPic ='data:'+image.mime + ';base64,' + base64String;
                    // console.log("+++++++", newPic);
                  })
                  .catch();

                console.log('SUCCESS CAMERA ', image);
                let ImageResponse = res.name + ',' + image;
                this.setState({imageR: ImageResponse});
                if (this.props.route.params.tag == 'Add New Employee') {
                  var img = 'data:' + image.mime + ';base64,' + base64Url;
                  this.setState({userPic: img});
                } else {
                  this.setState(prevState => {
                    prevState.userProfile.photoUrl = u;
                    return {
                      userProfile: prevState.userProfile,
                    };
                  });
                }
                this.setState({visibleModal: false});
              })
              .catch(err => {});
          });
          // launchCamera(options, async response => {
          //   this.setState({visibleModal: false});
          //   if (response.didCancel) {
          //     console.log('selectPhotoTapped did Cancel: ', response);
          //   } else if (response.error) {
          //     console.log('selectPhotoTapped error: ', response);
          //   } else if (response.customButton) {
          //     console.log('selectPhotoTapped customButton: ', response);
          //   } else {
          //     response = response.assets;
          //     response = Object.assign({}, ...response);

          //     //   var newPic;
          //     console.log('HelloWorld===', u);
          //   }
          // });
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
              console.log('Hello world', res.name);

              u = res.uri;
              await ImgToBase64.getBase64String(u)
                .then(base64String => {
                  base64Url = base64String;
                  this.setState({
                    imagePath: res.name + ',' + base64String,
                  });
                  //  var newPic ='data:'+image.mime + ';base64,' + base64String;
                  // console.log("+++++++", newPic);
                })
                .catch();

              console.log('SUCCESS CAMERA ', image);
              let ImageResponse = res.name + ',' + image;
              this.setState({imageR: ImageResponse});
              if (this.props.route.params.tag == 'Add New Employee') {
                var img = 'data:' + image.mime + ';base64,' + base64Url;
                this.setState({userPic: img});
              } else {
                this.setState(prevState => {
                  prevState.userProfile.photoUrl = u;
                  return {
                    userProfile: prevState.userProfile,
                  };
                });
              }
              this.setState({visibleModal: false});
            })
            .catch(err => {});
        });
      }
    } catch (error) {}
  };

  async selectGallaryTapped() {
    const options = {};
    var base64Url;
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
      ).then(async res => {
        console.log('Hello world', res.name);

        u = res.uri;

        await ImgToBase64.getBase64String(u)
          .then(base64String => {
            base64Url = base64String;
            console.log(base64Url);
            this.setState({imagePath: res.name + ',' + base64String});
            // console.log("+++++++", response.fileName + "," + base64String);
          })
          .catch();
        var fileName;
        // if (Platform.OS === 'ios') {
        //   fileName =
        //     response.uri.split('/')[response.uri.split('/').length - 1];
        // } else {
        //   fileName = response.fileName;
        // }
        fileName = res.name;
        console.log('fileName  ', fileName);

        let ImageResponse = fileName + ',' + image;
        this.setState({imageR: ImageResponse});
        if (this.props.route.params.tag == 'Add New Employee') {
          var img = 'data:' + image.mime + ';base64,' + base64Url;
          console.log(img);
          this.setState({userPic: img});
        } else {
          this.setState(prevState => {
            prevState.userProfile.photoUrl = u;
            return {
              userProfile: prevState.userProfile,
            };
          });
        }
      });
      this.setState({visibleModal: false});
    });
    // launchImageLibrary(options, response => {
    //   this.setState({visibleModal: false});
    //   if (response.didCancel) {
    //     console.log('selectGallaryTapped didCancel: ', response);
    //   } else if (response.error) {
    //     console.log('selectGallaryTapped error: ', response);
    //   } else if (response.customButton) {
    //     console.log('selectGallaryTapped customButton: ', response);
    //   } else {
    //     console.log('SUCCESS  ', response);
    //     response = response.assets;
    //     response = Object.assign({}, ...response);

    //   }
    // });
  }
  imagePickerDialog() {
    return (
      <Modal
        visible={this.state.visibleModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => this.setState({visibleModal: false})}>
        <View style={{flex: 1}}>
          <View style={{flex: 0.8, backgroundColor: 'rgba(52,52,52,0.8)'}}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({visibleModal: false});
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
          </View>

          <View
            style={{
              flex: 0.2,
              bottom: 0,
              justifyContent: 'center',
              backgroundColor: 'rgba(52,52,52,0.8)',
            }}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'white',
                flexDirection: 'row',
                justifyContent: 'center',
                alignContent: 'center',
                padding: 20,
                borderTopLeftRadius: 22,
                borderTopRightRadius: 22,
              }}>
              <View style={{alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={() => this.selectGallaryTapped()}
                  style={{
                    alignSelf: 'center',
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingTop: 20,
                    paddingBottom: 10,
                  }}>
                  <Image
                    style={{height: 75, width: 75}}
                    source={IMAGES.gallery}
                  />
                </TouchableOpacity>
                <Text>Gallery</Text>
              </View>
              <View style={{alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={() => this.selectPhotoTapped()}
                  style={{
                    alignSelf: 'center',
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingTop: 20,
                    paddingBottom: 10,
                  }}>
                  <Image
                    style={{height: 75, width: 75}}
                    source={IMAGES.camera_g}
                  />
                </TouchableOpacity>
                <Text>Camera</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
  switchToggle = visitorAllows => {
    const userProfile = Object.assign({}, this.state.userProfile, {
      visitorAllows,
    });
    this.setState({userProfile});
  };
  render() {
    var Img = '';
    var tag;
    if (
      this.state.userProfile?.photoUrl != '' &&
      this.state.userProfile?.photoUrl != undefined &&
      this.state.userProfile?.photoUrl != null
    ) {
      if (Platform.OS == 'android') {
        if (
          this.state.userProfile?.photoUrl.indexOf('content://') > -1 ||
          this.state.userProfile?.photoUrl.indexOf('file://') > -1
        ) {
          tag = 1;
          Img = this.state.userProfile?.photoUrl;

          console.log('Img1: ', Img);
        } else {
          tag = 1;
          Img = IMAGEURL + this.state.userProfile?.photoUrl;
          console.log('Img3: ', Img);
        }
      } else {
        if (this.state.userProfile?.photoUrl.indexOf('file://') > -1) {
          console.log('11 : ', this.state.userProfile?.photoUrl);
          tag = 1;
          Img = this.state.userProfile?.photoUrl;
          // console.log("Img2: ", Img)
        } else {
          tag = 1;
          Img = IMAGEURL + this.state.userProfile?.photoUrl;
        }
      }
    } else {
      tag = 2;
      Img = IMAGEURL + '/ImageFiles/defaultuser.png';
    }
    return (
      <SafeAreaView
        style={{flex: 1, paddingTop: 45, backgroundColor: COLORS.white}}>
        <View
          style={{
            flexDirection: 'row',
            width: '95%',
            paddingTop: 5,
            paddingLeft: 15,
            paddingBottom: 10,
            paddingRight: 10,
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              this.clearRefresh(), this.props.navigation.goBack();
            }}
            style={{
              height: 15,
              width: 22,
              alignItems: 'center',
              marginRight: 20,
            }}>
            <Image
              source={IMAGES.back}
              style={{
                height: 15,
                width: 22,
                tintColor: 'black',
                alignSelf: 'center',
              }}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: COLORS.primary,
              width: 250,
              textAlign: 'left',
            }}>
            {this.props.route.params.tag}
          </Text>
        </View>
        <ScrollView style={{flexGrow: 1}}>
          <View>
            {tag == 1 ? (
              <TouchableOpacity
                onPress={() =>
                  this.props.route.params?.tag != 'Employee Details' &&
                  this.setState({visibleModal: true})
                }
                style={{
                  zIndex: 1,
                  elevation: this.state.elevation,
                  marginTop: 15,
                  borderRadius: 170 / 2,
                  height: 170,
                  width: 170,
                  alignSelf: 'center',
                }}>
                <Image
                  source={{
                    uri:
                      this.props.route.params.tag == 'Add New Employee'
                        ? this.state.userPic
                        : Img,
                  }}
                  style={{width: 170, height: 170, borderRadius: 170 / 2}}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() =>
                  this.props.route.params?.tag != 'Employee Details' &&
                  this.setState({visibleModal: true})
                }
                style={{
                  zIndex: 1,
                  elevation: this.state.elevation,
                  marginTop: 15,
                  borderRadius: 170 / 2,
                  height: 170,
                  width: 170,
                  alignSelf: 'center',
                }}>
                <Image
                  source={{
                    uri:
                      this.props.route.params.tag == 'Add New Employee'
                        ? this.state.userPic
                        : Img,
                  }}
                  style={{width: 170, height: 170, borderRadius: 170 / 2}}
                />
              </TouchableOpacity>
            )}

            {this.props.route.params.tag != 'Employee Details' &&
            this.props.route.params.tag != 'Add New Employee' ? (
              <View
                style={{
                  marginTop: 15,
                  borderRadius: 170 / 2,
                  alignSelf: 'center',
                  position: 'absolute',
                  height: 170,
                  width: 170,
                }}>
                <TouchableOpacity
                  onPress={() => this.removeImage()}
                  style={{
                    bottom: '0%',
                    right: '-20%',
                    alignSelf: 'flex-end',
                    position: 'absolute',
                  }}>
                  <Image
                    source={IMAGES.delete}
                    style={{width: 27, height: 27}}
                  />
                </TouchableOpacity>
              </View>
            ) : null}
          </View>

          <View style={{margin: 10}}>
            <Hoshi
              style={[
                styles.textInputStyle,
                {
                  backgroundColor:
                    this.props.route.params.tag != 'Employee Details'
                      ? '#fff'
                      : '#EEEEEE',
                },
              ]}
              editable={
                this.props.route.params.tag == 'Employee Details' ? false : true
              }
              borderHeight={0}
              onChangeText={fullName => {
                const userProfile = Object.assign({}, this.state.userProfile, {
                  fullName,
                });
                this.setState({userProfile});
              }}
              value={this.state.userProfile?.fullName}
              label="Full Name*"
            />
            <Hoshi
              style={[
                styles.textInputStyle,
                {
                  backgroundColor:
                    this.props.route.params.tag != 'Employee Details'
                      ? '#fff'
                      : '#EEEEEE',
                },
              ]}
              editable={
                this.props.route.params.tag == 'Employee Details' ? false : true
              }
              borderHeight={0}
              maxLength={15}
              keyboardType={'number-pad'}
              onChangeText={mobile => {
                this.onChanged(mobile);
              }}
              // onChangeText={(mobile) => {
              //     const userProfile = Object.assign({}, this.state.userProfile, { mobile });
              //     this.setState({ userProfile })
              // }}
              value={this.state.userProfile?.mobile}
              label="Mobile*"
            />
            <Hoshi
              style={[
                styles.textInputStyle,
                {
                  backgroundColor:
                    this.props.route.params.tag != 'Employee Details'
                      ? '#fff'
                      : '#EEEEEE',
                },
              ]}
              editable={
                this.props.route.params.tag == 'Employee Details' ? false : true
              }
              borderHeight={0}
              onChangeText={emailId => {
                const userProfile = Object.assign({}, this.state.userProfile, {
                  emailId,
                });
                this.setState({userProfile});
              }}
              value={this.state.userProfile?.emailId}
              label="Email*"
            />

            {(this.props.route.params.tag == 'Employee Details' ||
              this.props.route.params.tag !== 'Update Employee') &&
            this.props.route.params.tag !== 'Add New Employee' ? (
              <Hoshi
                style={[
                  styles.textInputStyle,
                  {
                    backgroundColor:
                      this.props.route.params.tag == 'Add New Employee'
                        ? '#fff'
                        : '#EEEEEE',
                  },
                ]}
                editable={false}
                borderHeight={0}
                value={this.state.userProfile?.userRole}
                label="User Role"
              />
            ) : (
              <View
                style={{
                  backgroundColor: COLORS.white,
                  justifyContent: 'space-around',
                  overflow: 'hidden',
                  borderBottomColor: '#b9c1ca',
                  borderBottomWidth: 1,
                }}>
                <DropDownPicker
                  items={this.state.userRole}
                  placeholder={
                    this.props.route.params.tag == 'Add New Employee'
                      ? 'User Role*'
                      : this.state.userProfile?.userRole
                  }
                  // defaultValue="Employee"
                  placeholderStyle={{color: '#6a7989', fontSize: 15}}
                  containerStyle={{backgroundColor: '#fff'}}
                  dropDownStyle={{position: 'relative', maxHeight: 300}}
                  style={{right: 7, backgroundColor: '#fff', height: 55}}
                  itemStyle={{
                    justifyContent: 'flex-start',
                  }}
                  selectedLabelStyle={{color: '#6a7989', fontSize: 16}}
                  onChangeItem={item => {
                    if (item != undefined) {
                      const userProfile = Object.assign(
                        {},
                        this.state.userProfile,
                        {userRole: item.label, userRoleId: item.value},
                      );
                      this.setState({userProfile});
                    }
                  }}
                />
              </View>
            )}

            {this.props.route.params.tag == 'Add New Employee' ? (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Hoshi
                  style={[
                    styles.textInputStyle,
                    {
                      flex: 1,
                      backgroundColor:
                        this.props.route.params.tag != 'Employee Details'
                          ? '#fff'
                          : '#EEEEEE',
                    },
                  ]}
                  editable={
                    this.props.route.params.tag == 'Employee Details'
                      ? false
                      : true
                  }
                  borderHeight={0}
                  secureTextEntry={this.state.OhidePassword}
                  onChangeText={password => {
                    const userProfile = Object.assign(
                      {},
                      this.state.userProfile,
                      {password},
                    );
                    this.setState({userProfile});
                  }}
                  value={this.state.userProfile?.password}
                  label="Password*"
                />
                <TouchableOpacity
                  style={{
                    height: 50,
                    width: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    right: '0%',
                  }}
                  onPress={() =>
                    this.setState({OhidePassword: !this.state.OhidePassword})
                  }>
                  <Image
                    style={{
                      height: 20,
                      tintColor: COLORS.black,
                      width: 20,
                      resizeMode: 'contain',
                    }}
                    source={
                      this.state.OhidePassword ? IMAGES.hidden : IMAGES.eye
                    }
                  />
                </TouchableOpacity>
              </View>
            ) : null}
            <Hoshi
              style={[
                styles.textInputStyle,
                {
                  backgroundColor:
                    this.props.route.params.tag != 'Employee Details'
                      ? '#fff'
                      : '#EEEEEE',
                },
              ]}
              editable={
                this.props.route.params.tag == 'Employee Details' ? false : true
              }
              borderHeight={0}
              secureTextEntry={this.state.OhidePassword}
              onChangeText={department => {
                const userProfile = Object.assign({}, this.state.userProfile, {
                  department,
                });
                this.setState({userProfile});
              }}
              value={this.state.userProfile?.department}
              label="Department"
            />
            <Hoshi
              style={[
                styles.textInputStyle,
                {
                  backgroundColor:
                    this.props.route.params.tag != 'Employee Details'
                      ? '#fff'
                      : '#EEEEEE',
                },
              ]}
              editable={
                this.props.route.params.tag == 'Employee Details' ? false : true
              }
              borderHeight={0}
              onChangeText={designation => {
                const userProfile = Object.assign({}, this.state.userProfile, {
                  designation,
                });
                this.setState({userProfile});
              }}
              value={this.state.userProfile?.designation}
              label="Designation"
            />

            {(this.props.route.params.tag == 'Employee Details' ||
              this.props.route.params.tag !== 'Update Employee') &&
            this.props.route.params.tag !== 'Add New Employee' ? (
              <Hoshi
                style={[
                  styles.textInputStyle,
                  {
                    backgroundColor:
                      this.props.route.params.tag == 'Add New Employee'
                        ? '#fff'
                        : '#EEEEEE',
                  },
                ]}
                editable={false}
                borderHeight={0}
                value={this.state.userProfile?.timeZone}
                label="TimeZone"
              />
            ) : (
              <View
                style={{
                  backgroundColor: COLORS.white,
                  justifyContent: 'space-around',
                  overflow: 'hidden',
                  borderBottomColor: '#b9c1ca',
                  borderBottomWidth: 1,
                }}>
                <DropDownPicker
                  items={this.state.timeZone}
                  placeholder={
                    this.props.route.params.tag == 'Add New Employee'
                      ? 'Selecte TimeZone*'
                      : this.state.userProfile?.timeZone
                  }
                  // defaultValue="Employee"
                  placeholderStyle={{color: '#6a7989', fontSize: 15}}
                  containerStyle={{backgroundColor: '#fff'}}
                  dropDownStyle={{position: 'relative', maxHeight: 300}}
                  style={{right: 7, backgroundColor: '#fff', height: 55}}
                  itemStyle={{
                    justifyContent: 'flex-start',
                  }}
                  selectedLabelStyle={{color: '#6a7989', fontSize: 16}}
                  onChangeItem={item => {
                    console.log("timezone===",item);
                    if (item != undefined) {
                      const userProfile = Object.assign(
                        {},
                        this.state.userProfile,
                        {timeZone: item.value},
                      );
                      this.setState({userProfile});
                    }
                  }}
                />
              </View>
            )}

            <View
              style={{
                marginRight: 20,
                paddingTop: 20,
                width: '100%',
                paddingBottom: 15,
                borderBottomWidth: 1,
                borderBottomColor: COLORS.graye00,
                backgroundColor:
                  this.props.route.params.tag != 'Employee Details'
                    ? '#fff'
                    : '#EEEEEE',
              }}>
              <ToggleSwitch
                isOn={this.state.userProfile?.visitorAllows}
                onColor="green"
                disabled={
                  this.props.route.params.tag == 'Employee Details'
                    ? true
                    : false
                }
                offColor={COLORS.grayCCC}
                label={'Allow Visitors'}
                labelStyle={{fontSize: 15, color: COLORS.graye00}}
                size="medium"
                onToggle={isOn => this.switchToggle(isOn)}
              />
            </View>
            {/* {this.props.route.params.tag == 'Employee Details' ? (
              <Hoshi
                style={[
                  styles.textInputStyle,
                  {
                    backgroundColor:
                      this.props.route.params.tag != 'Employee Details'
                        ? '#fff'
                        : '#EEEEEE',
                  },
                ]}
                editable={
                  this.props.route.params.tag == 'Employee Details'
                    ? false
                    : true
                }
                borderHeight={0}
                editable={false}
                value={
                  this.state.userProfile?.status == 1
                    ? 'Verified'
                    : 'UnVerified'
                }
                label="Login Status"
              />
            ) : null} */}
            {this.props.route.params.tag == 'Add New Employee' ? (
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 30,
                  alignItems: 'center',
                  alignSelf: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => this.insertNewEmpl()}
                  style={{
                    margin: 10,
                    alignSelf: 'center',
                    padding: 10,
                    borderRadius: 6,
                    backgroundColor: COLORS.secondary,
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: COLORS.white,
                      fontWeight: 'bold',
                      width: 100,
                      textAlign: 'center',
                    }}>
                    Submit
                  </Text>
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={() => this.clearRefresh()} style={{ margin: 10, alignSelf: "center", padding: 10, borderRadius: 6, backgroundColor: COLORS.skyBlue }}>
                                <Text style={{ fontSize: 18, color: COLORS.white, fontWeight: "bold", width: 100, textAlign: 'center' }}>Refresh</Text>
                            </TouchableOpacity> */}
              </View>
            ) : null}
            {this.props.route.params.tag == 'Update Employee' ? (
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 30,
                  alignItems: 'center',
                  alignSelf: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => this.updateUserDetails()}
                  style={{
                    margin: 10,
                    alignSelf: 'center',
                    padding: 10,
                    borderRadius: 6,
                    backgroundColor: COLORS.secondary,
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: COLORS.white,
                      fontWeight: 'bold',
                      width: 100,
                      textAlign: 'center',
                    }}>
                    Update
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </ScrollView>
        {this.imagePickerDialog()}
      </SafeAreaView>
    );
  }
  updateUserDetails() {
    if (this.state.userProfile.fullName != '') {
      if (
        this.state.userProfile.mobile != '' &&
        this.state.userProfile.mobile.length <= 15
      ) {
        if (
          this.validate(this.state.userProfile.emailId) &&
          this.state.userProfile.emailId != ''
        ) {
          this.props.UpdateUser(
            this.state.userProfile,
            this.AfterresponseUpdate,
          );
        } else {
          alert('Please Enter Valid E-mail');
        }
      } else {
        alert('Please Enter Mobile Number');
      }
    } else {
      alert('Please Enter Full Name');
    }
  }
  AfterresponseUpdate = res => {
    if (res) {
      Toast.show('User updated succeesfully', Toast.LONG);
      this.props.Update(true);
      this.props.navigation.goBack();
    } else {
      Toast.show('User not updated succeesfully', Toast.LONG);
    }
  };
  clearRefresh() {
    // var userRole = [{ label: "Employee", value: 1 }, { label: "Gatekeeper", value: 2 }, { label: "Receptionist", value: 3 }]

    const userProfile = userProfileEmpty;
    this.setState({
      userProfile,
      selectedItem: '',
    });
  }
  onChanged(text) {
    let mobile = '';
    let numbers = '0123456789';
    for (var i = 0; i < text.length; i++) {
      if (numbers.indexOf(text[i]) > -1) {
        mobile = mobile + text[i];
        if (mobile[0] > 5) {
        } else {
          mobile = '';
          alert('Please Enter Valid Mobile Number');
        }
      } else {
        alert('Please Enter Numbers Only');
      }
    }
    const userProfile = Object.assign({}, this.state.userProfile, {
      mobile: mobile,
    });
    this.setState({userProfile});
  }
  validate = text => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (text != '' && reg.test(text) === false) {
      return false;
    } else {
      return true;
    }
  };
  chekTextinputforconform() {
    var filter =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    if (this.state.userProfile.password != '') {
      if (filter.test(this.state.userProfile.password)) {
        return true;
      } else {
        alert(
          'Password must contain at least minimum 6,at least one letter, one number and one special character',
        );
        // const userProfile = Object.assign({}, this.state.userProfile, { password: "" });
        // this.setState({ userProfile })
      }
    } else {
      alert('Please Enter Password');
      // const userProfile = Object.assign({}, this.state.userProfile, { password: "" });
      // this.setState({ userProfile })
    }
  }
  encriptPass(PASSWORD) {
    var saltString = 'VizNBPL2020';
    var saltBytes = new encoding.TextEncoder('utf-8').encode(saltString);
    var plainTextBytes = new encoding.TextEncoder('utf-8').encode(PASSWORD);
    var plainTextWithSaltBytes = [
      saltBytes.byteLength + plainTextBytes.byteLength,
    ];
    for (let i = 0; i < plainTextBytes.byteLength; i++) {
      plainTextWithSaltBytes[i] = plainTextBytes[i];
    }
    for (var i = 0; i < saltBytes.byteLength; i++) {
      plainTextWithSaltBytes[plainTextBytes.byteLength + i] = saltBytes[i];
    }
    var sha512 = require('js-sha512');
    var hashByte = sha512.update(plainTextWithSaltBytes).digest('byte');
    var hashWithSaltByte = [hashByte.Length + saltBytes.byteLength];
    for (let i = 0; i < hashByte.length; i++) {
      hashWithSaltByte[i] = hashByte[i];
    }
    for (var i = 0; i < saltBytes.byteLength; i++) {
      hashWithSaltByte[hashByte.length + i] = saltBytes[i];
    }
    var buff = new Buffer(hashWithSaltByte);
    var base64data = buff.toString('base64');
    return base64data;
  }
  newAddEmpRes = res => {
    if (res != 0) {
      Toast.show('User saved succeesfully', Toast.LONG);
      this.props.Update(true);
      this.props.navigation.goBack();
    } else {
      Toast.show('User not saved succeesfully', Toast.LONG);
    }
  };

  insertNewEmpl() {
    if (this.state.userProfile.fullName != null) {
      if (
        this.state.userProfile.mobile != null &&
        this.state.userProfile.mobile.length <= 15
      ) {
        if (this.validate(this.state.userProfile.emailId)) {
          if (this.state.userProfile.userRole != null) {
            if (this.chekTextinputforconform()) {
              var enc = this.encriptPass(this.state.userProfile.password);
              const userProfile = Object.assign({}, this.state.userProfile, {
                password: enc,
                parentID: this.props.LoginDetails.empID,
                photoUrl: this.state.imagePath,
              });
              console.log(userProfile);
              this.props.SaveUser(userProfile, this.newAddEmpRes);
            }
          } else {
            alert('Please Select User Role');
          }
        } else {
          alert('Please Enter Valid E-mail');
        }
      } else {
        alert('Please Enter Mobile Number');
      }
    } else {
      alert('Please Enter Full Name');
    }
  }
}
const styles = StyleSheet.create({
  textInputStyle: {
    color: COLORS.black,
    marginBottom: 1,
    height: Platform.OS === 'ios' ? 40 : null,
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(AdminNewEmploy);
