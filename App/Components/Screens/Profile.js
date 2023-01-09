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
import ImgToBase64 from 'react-native-image-base64';
import ImagePicker from 'react-native-image-crop-picker';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import Toast from 'react-native-simple-toast';
import {Hoshi} from 'react-native-textinput-effects';
import {connect} from 'react-redux';
import {COLORS, IMAGES} from '../../Assets';
import {mapDispatchToProps, mapStateToProps} from '../../Reducers/ApiClass.js';
import {IMAGEURL} from '../../utility/util.js';
import DropDownPicker from 'react-native-dropdown-picker';

class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      userProfile: this.props.UserDetails,
      elevation: 7,
      imageR: '',
      imageRes: {},
      open: true,
      imageShow: '',
      visibleModal: false,
      imagePath: '',
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
      timeLabel:null,
      adminTimeZone:null
    };
  }
  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  handleBackButtonClick() {
    this.props.navigation.goBack();
    return true;
  }
async  componentDidMount() {
    console.log('User Profile=====', this.props.UserDetails);
    this.props.GetUsersDetails(this.props.LoginDetails.empID);
    // this.setState({userProfile:{photoUrl:"https://nblapi.vizman.app/"+this.state.userProfile.photoUrl}})
    // console.log("Login Details==",this.props.LoginDetails);
    this.state.timeZone.forEach(e => {
        if(this.props.UserDetails.timeZone==e.value){
          this.setState({timeLabel:e.label,adminTimeZone:e.label})
        }
    });
    // console.log(this.state.timeLabel);
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }
  updateUser() {
    if (this.state.userProfile?.fullName != '') {
      this.insert();
    } else {
      alert('Please Enter Full Name');
    }
  }
  succeessProfile = respp => this.afterSucceessProfile(respp);

  afterSucceessProfile(userProfile) {
    if (userProfile == true) {
      this.props.GetUsersDetails(this.props.LoginDetails.empID);
      this.props.navigation.goBack();
      Toast.show('Profile Update successfully.');
    }
  }

  async insert() {
    this.setState({elevation: 0});
    var url;
    if (Platform.OS == 'android') {
      if (
        this.state.userProfile?.photoUrl.indexOf('content://') > -1 ||
        this.state.userProfile?.photoUrl.indexOf('file://') > -1
      ) {
        url = this.state.imageR;
      } else {
        url = this.state.userProfile?.photoUrl;
      }
    } else {
      if (this.state.userProfile?.photoUrl.indexOf('file://') > -1) {
        url = this.state.imageR;
      } else {
        url = this.state.userProfile?.photoUrl;
      }
    }
    // console.log("PhotoUrlBase:==");

    var param = {
      usrId: this.state.userProfile?.usrId,
      fullName: this.state.userProfile?.fullName,
      mobile: this.state.userProfile?.mobile,
      photoUrl: '',
      department:this.state.userProfile?.department,
      designation:this.state.userProfile?.designation,
      photoUrlBase: this.state.imagePath,
      timeZone:this.state.userProfile.timeZone=="0" ||this.state.userProfile.timeZone==null ?"+5.50":this.state.userProfile.timeZone
    };
    
    console.log('PhotoUrl:==', param);

    this.props.updateProfileDetails(param, this.succeessProfile);
    this.setState({elevation: 5});
  }
  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };
    launchImageLibrary(options, response => {
      // console.log('++++++++++++++Image============', response);

      if (response.didCancel) {
        // console.log('++++++++++++++Did cancle============');
      } else {
        response = response.assets;
        response = Object.assign({}, ...response);
        ImgToBase64.getBase64String(response.uri)
          .then(base64String => {
            this.setState({imagePath: response.fileName + ',' + base64String});
            console.log('+++++++', response.fileName + ',' + base64String);
          })
          .catch();
        // console.log('++++++++++++++Image============', response);
        let ImageResponse = response.fileName + ',' + response;
        this.setState({imageR: ImageResponse});
        this.setState(prevState => {
          prevState.userProfile.photoUrl = response.uri;
          return {
            userProfile: prevState.userProfile,
          };
        });
      }
    });
  }
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
                this.setState(prevState => {
                  prevState.userProfile.photoUrl = u;
                  return {
                    userProfile: prevState.userProfile,
                  };
                });
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
              this.setState(prevState => {
                prevState.userProfile.photoUrl = u;
                return {
                  userProfile: prevState.userProfile,
                };
              });
              this.setState({visibleModal: false});
            })
            .catch(err => {});
        });
      }
    } catch (error) {}
  };

  selectGallaryTapped() {
    const options = {};
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

        ImgToBase64.getBase64String(u)
          .then(base64String => {
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
        this.setState(prevState => {
          prevState.userProfile.photoUrl = res.uri;
          return {
            userProfile: prevState.userProfile,
          };
        });
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
  value(key) {
    return this.state.userProfile[key] == null ||
      this.state.userProfile[key] == ''
      ? ' '
      : this.state.userProfile[key].trim();
  }
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
      // Img = {uri:IMAGEURL+"ImageFiles/defaultuser.png"}
    }
    // console.log(" tagL ", tag);
    // console.log(" tagL ", Img);
    console.log(' this.state.userProfile ', this.state.userProfile);
    return (
      <SafeAreaView
        style={{flex: 1, paddingTop: 45, backgroundColor: COLORS.whitef4}}>
        <View
          style={{
            flexDirection: 'row',
            width: '95%',
            height: '9%',
            paddingTop: 5,
            paddingLeft: 15,
            paddingBottom: 10,
            paddingRight: 10,
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => this.handleBackButtonClick()}
            style={{
              padding: 10,
              justifyContent: 'center',
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
            Update Profile
          </Text>
        </View>
        <ScrollView style={{flexGrow: 1}}>
          <View>
            {tag == 1 ? (
              <TouchableOpacity
                onPress={() => this.setState({visibleModal: true})}
                style={{
                  zIndex: 1,
                  elevation: this.state.elevation,
                  marginTop: 15,
                  borderRadius: 170 / 2,
                  height: 170,
                  width: 170,
                  alignSelf: 'center',
                }}>
                {Platform.OS == 'ios' ? (
                  <Image
                    source={{uri: Img}}
                    style={{width: 170, height: 170, borderRadius: 170 / 2}}
                  />
                ) : (
                  <Image
                    source={{uri: Img}}
                    style={{width: 170, height: 170, borderRadius: 170 / 2}}
                  />
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => this.setState({visibleModal: true})}
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
                  source={{uri: Img}}
                  style={{width: 170, height: 170, borderRadius: 170 / 2}}
                />
              </TouchableOpacity>
            )}

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
                <Image source={IMAGES.delete} style={{width: 27, height: 27}} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{margin: 10}}>
            <Hoshi
              style={[styles.textInputStyle]}
              borderHeight={0}
              editable={true}
              onChangeText={Name =>
                this.setState(prevState => {
                  prevState.userProfile.fullName = Name.replace(/[^0-9 ^A-Za-z]/g, '');
                  return {
                    userProfile: prevState.userProfile.replace(/[^0-9 ^A-Za-z]/g, ''),
                  };
                })
              }
              value={this.state.userProfile?.fullName.replace(/[^0-9 ^A-Za-z]/g, '')}
              label="Full Name *"
            />
            {/* <View style={{ flexDirection: 'row', margin: 7, alignItems: 'center' }}>
                            <Text style={{ width: '25%', fontWeight: 'bold' }}>User Name</Text>
                            <TextInput
                                style={{ width: '75%', backgroundColor: COLORS.graye8, color: COLORS.black, borderRadius: 8, borderColor: COLORS.grayColor, borderWidth: 1, fontSize: 17, height: 50 }}
                                value={this.state.userProfile.userName}
                                multiline={true}
                                placeholder='User Name'
                                editable={false}
                            />
                        </View> */}
            {/* <Hoshi
              style={[styles.textInputStyle]}
              borderHeight={0}
              editable={false}
              value={this.value('userName')}
              label="User Name"
            /> */}
            {/* <View style={{ flexDirection: 'row', margin: 7, alignItems: 'center' }}>
                            <Text style={{ width: '20%', fontWeight: 'bold' }}>Mobile</Text>
                            <Text style={{ width: '5%', fontWeight: 'bold', color: 'red' }}> *</Text>
                            <TextInput
                                style={{ width: '75%', backgroundColor: COLORS.graye8, color: COLORS.black, borderRadius: 8, borderColor: COLORS.grayColor, borderWidth: 1, fontSize: 17, height: 50 }}
                                value={this.state.userProfile?.mobile}
                                placeholder='Mobile Number'
                                editable={false}
                            />
                        </View> */}
            <Hoshi
              style={[styles.textInputStyle],{backgroundColor:'#EEEEEE'}}
              borderHeight={0}
              editable={false}
              value={this.value('mobile')}
              label="Mobile Number"
            />
            {/* <View style={{ margin: 7, flexDirection: 'row', alignItems: 'center' }}>
                            <Text numberOfLines={1} style={{ width: '20%', fontWeight: 'bold' }}>Email</Text>
                            <Text style={{ width: '5%', fontWeight: 'bold', color: 'red' }}> *</Text>
                            <TextInput
                                style={{ width: '75%', backgroundColor: COLORS.graye8, color: COLORS.black, borderRadius: 8, borderColor: COLORS.grayColor, borderWidth: 1, fontSize: 17, height: 50 }}
                                value={this.state.userProfile?.emailId}
                                placeholder='Email '
                                editable={false}
                            />
                        </View> */}
            <Hoshi
              style={[styles.textInputStyle],{backgroundColor:'#EEEEEE'}}
              borderHeight={0}
              editable={false}
              value={this.value('emailId')}
              label="Email Id"
            />
            {/* <View style={{ margin: 7, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ width: '25%', fontWeight: 'bold' }}>Department</Text>
                            <TextInput
                                style={{ width: '75%', backgroundColor: COLORS.graye8, color: COLORS.black, borderRadius: 8, borderColor: COLORS.grayColor, borderWidth: 1, fontSize: 17, height: 50 }}
                                value={this.state.userProfile?.department}
                                placeholder='Department'
                                editable={false}
                            />
                        </View> */}
            <Hoshi
              style={[styles.textInputStyle]}
              borderHeight={0}
              editable={true}
              onChangeText={department =>
                this.setState(prevState => {
                  prevState.userProfile.department = department;
                  return {
                    userProfile: prevState.userProfile,
                  };
                })
              }
              value={this.state.userProfile?.department}
              label="Department"
            />
            {/* <View style={{ margin: 7, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ width: '25%', fontWeight: 'bold' }}>Designation</Text>
                            <TextInput
                                style={{ width: '75%', backgroundColor: COLORS.graye8, color: COLORS.black, borderRadius: 8, borderColor: COLORS.grayColor, borderWidth: 1, fontSize: 17, height: 50 }}
                                value={this.state.userProfile?.designation}
                                placeholder='Designation'
                                editable={false}
                            />
                        </View> */}
            <Hoshi
              style={[styles.textInputStyle]}
              borderHeight={0}
              editable={true}
              onChangeText={designation =>
                this.setState(prevState => {
                  prevState.userProfile.designation = designation;
                  return {
                    userProfile: prevState.userProfile,
                  };
                })
              }
              value={this.state.userProfile?.designation}
              label="Designation"
            />

            <Hoshi
              style={[styles.textInputStyle]}
              borderHeight={0}
              editable={false}
              value={this.state.userProfile?.userRole}
              label="User Role"
            />

   
  
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
                    this.state.userProfile?.timeZone==null
                      ? 'Selecte TimeZone*'
                      : this.state.adminTimeZone
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
                    console.log('timezone===', item);
                    if (item != undefined) {
                      const userProfile = Object.assign(
                        {},
                        this.state.userProfile,
                        {timeZone:item.value},
                      );
                      this.setState({userProfile});
                    }
                  }}
                />
              </View>
  
            
            <TouchableOpacity
              onPress={() => this.updateUser()}
              style={{
                margin: 25,
                alignSelf: 'center',
                padding: 16,
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
                SUBMIT
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {this.imagePickerDialog()}
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  textInputStyle: {
    color: COLORS.black,
    marginBottom: 1,
    backgroundColor: COLORS.white,
    // borderBottomWidth: 1.2,
    // borderBottomColor: COLORS.black,
    height: Platform.OS === 'ios' ? 40 : null,
  },
});
// const mapStateToProps = (state) => ({
//     userProfileGet: state.CommanReducer.UserDetails,
//     LoginDetails: state.CommanReducer.LoginDetails,

// });
// const mapDispatchToProps = (dispatch) => ({
//     updateProfileDetails: (param, onSuccess, isLoading) => dispatch(Fetch('Users/UpdateEmpProFile', 'POST', param, undefined, onSuccess, isLoading)),
//     GetUsersDetails: (empId, onSuccess, isLoading) => dispatch(Fetch('Users/GetUsersDetails', 'GET', empId, serviceActionUserDetail, onSuccess, isLoading)),
// })

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
