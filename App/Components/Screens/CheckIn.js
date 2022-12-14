import React from 'react';
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  PermissionsAndroid,
  FlatList,
} from 'react-native';
import ImagePicker, {
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import {Hoshi} from 'react-native-textinput-effects';
import {connect} from 'react-redux';
import {COLORS, IMAGES} from '../../Assets/index.js';
import {mapDispatchToProps, mapStateToProps} from '../../Reducers/ApiClass.js';
import {visitorDetailEmpty} from '../../utility/emptyClass.js';
import ImgToBase64 from 'react-native-image-base64';
import {axiosPost} from '../../utility/apiConnection.js';
import ImageResizer from 'react-native-image-resizer';

class CheckIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      VisitorDetails: this.props.visitorDetails,
      skipModalCheckIn: this.props.skipModalCheckIn,
      imageBase64StringPhotoProof: {fileName: null, data: null},
      imageBase64StringIdProof: {fileName: null, data: null},
      imagePath64Photo: null,
      imagePath64Id: null,
      Temperature: null,
      date: null,
      Intime: null,
      Outtime: null,
      imagePath: '',
      idProofPath:'',
      AllImages: [],
      AllImagesUrl: [],
    };
  }
  render() {
    return <>{this.skipCheckIn()}</>;
  }
  skipCheckIn() {
    return (
      <Modal
        backgroundColor={'black'}
        backdropColor={'black'}
        animationType={'slide'}
        transparent={true}
        visible={this.state.skipModalCheckIn}
        onRequestClose={() => {
          this.setState({skipModalCheckIn: false});
          this.props.onClose();
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(52, 52, 52, 0.8)',
          }}>
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
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
          <View style={{backgroundColor: 'white', width: '95%'}}>
            {/* <LinearGradient
                        style={{ height: 45, width: '98%',justifyContent:'center' }}
                        colors={[
                            COLORS.primary,
                           COLORS.third
                        ]} >
                      
                        {/* <View style={{ justifyContent: "flex-start", alignItems: "center", height: "100%", width: null, flexDirection: "row" }}>
                            <TouchableOpacity onPress={() => { this.backBtnforModal() }}
                                style={{ alignItems: "center", height: "100%", width: 50 }} >
                                <Text style={{ fontSize: 30, color: COLORS.white, margin: 5, }} >{"<"}</Text>
                            </TouchableOpacity>
                            </View> 
                        </LinearGradient> */}

            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: null,
                flexDirection: 'row',
              }}>
              <Image
                source={IMAGES.camera}
                style={{
                  alignSelf: 'center',
                  resizeMode: 'cover',
                  height: 25,
                  width: 30,
                }}
              />
              <Text
                style={{
                  color: COLORS.primary,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                  textAlign: 'center',
                  fontSize: 18,
                  margin: 10,
                  width: 250,
                }}>
                Capture Photo &amp; Id Proof
              </Text>

              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  width: 50,
                  height: 30,
                }}
                onPress={() => {
                  this.setState({skipModalCheckIn: false});
                  this.props.onClose();
                }}>
                <Image
                  source={IMAGES.cross}
                  style={{
                    tintColor: COLORS.primary,
                    alignSelf: 'flex-start',
                    resizeMode: 'cover',
                    height: 25,
                    width: 30,
                  }}
                />
              </TouchableOpacity>
            </View>

            <View style={{padding: 15}}>
              {this.state.VisitorDetails.fullName != undefined ? (
                <Text
                  style={{
                    padding: 7,
                    color: COLORS.black,
                    fontWeight: 'bold',
                    textAlign: 'left',
                    fontSize: 15,
                    width: '100%',
                  }}>
                  {this.state.VisitorDetails?.fullName}{' '}
                  {'(' + this.state.VisitorDetails?.inviteCode?.trim() + ')'}
                </Text>
              ) : null}

              <View
                style={{flexDirection: 'row',alignItems:'center',justifyContent:'center'  }}>
                <View>
                  <Text>Id Proof</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignContent: 'center',
                      alignItems: 'center',
                      // justifyContent: 'center',
                    }}>
                    <TouchableOpacity
                      activeOpacity={1}
                      style={{flexDirection: 'row'}}
                      onPress={() => this.selectPhotoTapped('Id')}>
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
                        style={{right: 5, top: 10, height: 28, width: 32}}
                      />
                    </TouchableOpacity>
                    {this.state.idProofPath != '' && (
                      <Image
                        source={{uri: this.state.idProofPath}}
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
                <View style={{marginLeft: 'auto', marginRight: 50}}>
                  <Text>Photo</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignContent: 'center',
                      alignItems: 'center',
                      // justifyContent: 'center',
                    }}>
                    <TouchableOpacity
                      activeOpacity={1}
                      style={{}}
                      onPress={() => this.selectPhotoTapped('Photo')}>
                      <Image
                        source={IMAGES.camera}
                        style={{right: 5, top: 10, height: 28, width: 32}}
                      />
                    </TouchableOpacity>
                    {this.state.imagePath != '' && (
                      <Image
                        source={{uri: this.state.imagePath}}
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
              </View>
              {/* <TouchableOpacity
                activeOpacity={1}
                style={{flexDirection: 'row', width: '100%'}}
                onPress={() => this.selectPhotoTapped('Id')}>
                <Hoshi
                  editable={false}
                  style={{
                    color: COLORS.black,
                    borderBottomWidth: 1,
                    borderBottomColor: COLORS.black,
                    flexGrow: 1,
                    marginRight: 10,
                  }}
                  label="Id Proof"
                  value={this.state.imageBase64StringIdProof.fileName}
                />

                <Image
                  source={IMAGES.camera}
                  style={{right: 5, top: 10, height: 28, width: 32}}
                />
              </TouchableOpacity> */}
              {/* <TouchableOpacity style={{ padding: 13, flexDirection: 'row', width: '100%', borderBottomWidth: 1, borderBottomColor: COLORS.black }} onPress={() => this.selectPhotoTapped("Photo")}>
                                <Text style={{ color: COLORS.black, fontSize: 14, right: 7 }}>{(this.state.imageBase64StringPhotoProof.fileName != null) ? this.state.imageBase64StringPhotoProof.fileName : "Photo Proof"}</Text>
                                <Image source={IMAGES.camera}
                                    style={{ alignSelf: 'center', resizeMode: 'cover', height: 25, width: 30, position: 'absolute', right: '1%' }} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ padding: 13, flexDirection: 'row', width: '100%', borderBottomWidth: 1, borderBottomColor: COLORS.black }} onPress={() => this.selectPhotoTapped("Id")}>
                                <Text style={{ color: COLORS.black, fontSize: 14, right: 7 }}>{(this.state.imageBase64StringIdProof.fileName != null) ? this.state.imageBase64StringIdProof.fileName : "Id Proof"}</Text>
                                <Image source={IMAGES.camera}
                                    style={{ alignSelf: 'center', resizeMode: 'cover', height: 25, width: 30, position: 'absolute', right: '1%' }} />
                            </TouchableOpacity> */}
              {this.props.AllSettings.settingsVM?.vtemprature ? (
                <View
                  style={{
                    width: '100%',
                    paddingVertical: 10,
                    justifyContent: 'center',
                  }}>
                  {/* <Text style={{ fontSize: 10, color: COLORS.graye00, textAlign: 'left', flexGrow: 1 }}>{"Temperature"}</Text> */}
                  <Hoshi
                    style={{borderBottomWidth: 0.5, width: '100%'}}
                    label={'Temperature Ex.:- 93' + '\u00b0' + ''}
                    placeholderTextColor={COLORS.placeholderColor}
                    maxLength={6}
                    keyboardType={'phone-pad'}
                    onChangeText={vizTemp => this.handleInputChange(vizTemp, 2)}
                    value={this.state.VisitorDetails?.vizTemp}
                  />
                </View>
              ) : null}
              {this.props.AllSettings.settingsVM?.vArogya ? (
                <View style={[styles.switchContainer, {alignItems: 'center'}]}>
                  <Text style={styles.switchLable}>is vaccinated</Text>
                  <View style={[styles.switchLable, {flexDirection: 'row'}]}>
                    <TouchableOpacity
                      onPress={() => {
                        var VisitorDetails = Object.assign(
                          {},
                          this.state.VisitorDetails,
                          {isVizArogyaSetu: true},
                        );
                        this.setState({VisitorDetails});
                        console.log('arogy true====', VisitorDetails);
                      }}
                      style={{
                        width: '50%',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          borderRadius: 15,
                          height: 15,
                          width: 15,
                          backgroundColor: COLORS.white,
                          borderWidth: 1,
                          backgroundColor:
                            this.state.VisitorDetails?.isVizArogyaSetu !=
                              null && this.state.VisitorDetails?.isVizArogyaSetu
                              ? COLORS.primary
                              : COLORS.white,
                        }}
                      />
                      <Text style={{paddingLeft: 2, alignSelf: 'flex-start'}}>
                        Yes
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        var VisitorDetails = Object.assign(
                          {},
                          this.state.VisitorDetails,
                          {isVizArogyaSetu: false},
                        );
                        this.setState({VisitorDetails});
                      }}
                      style={{
                        width: '50%',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          borderRadius: 15,
                          height: 15,
                          width: 15,
                          backgroundColor: COLORS.white,
                          borderWidth: 1,
                          backgroundColor:
                            this.state.VisitorDetails?.isVizArogyaSetu !=
                              null &&
                            !this.state.VisitorDetails?.isVizArogyaSetu
                              ? COLORS.primary
                              : COLORS.white,
                        }}
                      />
                      <Text style={{paddingLeft: 2, alignSelf: 'flex-start'}}>
                        No
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null}
              <View
                style={{
                  alignSelf: 'center',
                  flexDirection: 'row',
                  padding: 10,
                  margin: 10,
                }}>
                <TouchableOpacity
                  style={{
                    paddingRight: 10,
                    height: 37,
                    width: 200,
                    alignSelf: 'center',
                    borderRadius: 6,
                  }}
                  onPress={() => {
                    this.checkArogyaSetu(this.state.VisitorDetails, 2);
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
                        width: 150,
                      }}>
                      Skip And Check In
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    height: 37,
                    width: 90,
                    alignSelf: 'center',
                    borderRadius: 6,
                  }}
                  onPress={() => {
                    // console.log("All Data CHeck In:-", this.state.VisitorDetails)
                    if (
                      this.state.imageBase64StringPhotoProof?.data != null ||
                      this.state.imageBase64StringIdProof.data != null
                    ) {
                      this.checkArogyaSetu(this.state.VisitorDetails, 1);
                    } else {
                      alert('Please select Photo or Id Proof');
                    }
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
                      Check In
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  handleInputChange = (Temperature, tag) => {
    var Temp = Temperature.replace(/[- #*;,+<>N()\{\}\[\]\\\/]/gi, '');
    if (this.validateTemp(Temp)) {
      if (tag == 2) {
        console.log('Temp', Temp);
        var VisitorDetails = Object.assign({}, this.state.VisitorDetails, {
          vizTemp: Temp,
        });
        console.log('VisitorDetails', VisitorDetails);
        this.setState({VisitorDetails});
      } else {
        this.setState({Temperature: Temp});
      }
    }
  };
  validateTemp(s) {
    var rgx = /^[0-9]*\.?[0-9]*$/;
    return s.match(rgx);
  }
  selectPhotoTapped = async type => {
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
          const options = {
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
              skipBackup: true,
            },
          };
          launchCamera(options, async response => {
            if (response.didCancel) {
              console.log('Cancle');
            } else {
              console.log('Photo Rsponse====', response);
              response = response.assets;
              response = Object.assign({}, ...response);
              var base64Url = null;
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
                  u = await res.uri;
                  console.log('Resize', res);
                })
                .catch(err => {});
              await ImgToBase64.getBase64String(u)
                .then(base64String => {
                  base64Url = base64String;
                  // console.log("+++++++", response.fileName + "," + base64String);
                })
                .catch();
              if (Platform.OS == 'ios') {
                var tempSplit = response.uri.split('/');
                response.fileName = tempSplit[tempSplit.length - 1];
              }
              let ImageResponse = {
                fileName: response.fileName,
                data: ',' + base64Url,
              };

              if (type == 'Photo') {
                this.setState({
                  imagePath: 'data:' + response.type + ';base64,' + base64Url,
                });

                var ImageResponseCopy = response.fileName + ',' + base64Url;

                // if (this.state.AllImages.length < 1) {
                //   this.state.AllImagesUrl.push(
                //     response.fileName + ',' + base64Url+'$',
                //   );
                //   this.state.AllImages.push({
                //     img: 'data:' + response.type + ';base64,' + base64Url,
                //   });
                // } else {
                //   Toast.show('Maximum 1 photo can be add.');
                // }
                // var ImageResponseCopy =
                //   this.state?.AllImagesUrl[0] +
                //   this.state?.AllImagesUrl[1] +
                //   this.state?.AllImagesUrl[2] +
                //   this.state?.AllImagesUrl[3] +
                //   this.state?.AllImagesUrl[4];
                // ImageResponseCopy=ImageResponseCopy.replace(/undefined/g,"")
                const VisitorDetails = Object.assign(
                  {},
                  this.state.VisitorDetails,
                  {imageBase64StringPhotoProof: ImageResponseCopy},
                );
                this.setState({
                  VisitorDetails,
                  imageBase64StringPhotoProof: ImageResponse,
                  imagePath64Photo: ImageResponseCopy,
                });
              } else if (type == 'Id') {
                this.setState({
                  idProofPath: 'data:' + response.type + ';base64,' + base64Url,
                });
                var ImageResponseCopy = response.fileName + ',' + base64Url;
                const VisitorDetails = Object.assign(
                  {},
                  this.state.VisitorDetails,
                  {imageBase64StringIdProof: ImageResponseCopy},
                );
                this.setState({
                  VisitorDetails,
                  imageBase64StringIdProof: ImageResponse,
                  imagePath64Id: ImageResponseCopy,
                });
              }
            }
          });
        } else {
          // Permission Denied
          alert('CAMERA Permission Denied');
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
        launchCamera(options, async response => {
          if (response.didCancel) {
            console.log('Cancle');
          } else {
            console.log('Photo Rsponse====', response);
            response = response.assets;
            response = Object.assign({}, ...response);
            var base64Url = null;
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
                u = await res.uri;
                console.log('Resize', res);
              })
              .catch(err => {});
            await ImgToBase64.getBase64String(u)
              .then(base64String => {
                base64Url = base64String;

                // console.log("+++++++", response.fileName + "," + base64String);
              })
              .catch();
            // if (Platform.OS == 'ios') {
            //   var tempSplit = response.uri.split('/');
            //   response.fileName = tempSplit[tempSplit.length - 1];
            // }
            let ImageResponse = {
              fileName: response.fileName,
              data: ',' + base64Url,
            };
            var ImageResponseCopy = response.fileName + ',' + base64Url;

            if (type == 'Photo') {
              this.setState({
                imagePath: 'data:' + response.type + ';base64,' + base64Url,
              });

              console.log('path ', response?.uri);
              console.log('file name', response?.fileName);

              // this.state.imageBase64StringPhotoProof.fileName
              const VisitorDetails = Object.assign(
                {},
                this.state.VisitorDetails,
                {imageBase64StringPhotoProof: ImageResponseCopy},
              );
              this.setState({
                VisitorDetails,
                imageBase64StringPhotoProof: ImageResponse,
                imagePath64Photo: ImageResponseCopy,
              });
            } else if (type == 'Id') {
              this.setState({
                idProofPath: 'data:' + response.type + ';base64,' + base64Url,
              });
              const VisitorDetails = Object.assign(
                {},
                this.state.VisitorDetails,
                {imageBase64StringIdProof: ImageResponseCopy},
              );
              this.setState({
                VisitorDetails,
                imageBase64StringIdProof: ImageResponse,
                imagePath64Id: ImageResponseCopy,
              });
            }
          }
        });
        // proceed();
      }
    } catch (error) {}
  };
  checkArogyaSetu(item, tag) {
    // if (this.props.AllSettings.settingsVM.vArogya) {
    //     if (item.isVizArogyaSetu != null) {
    //         this.checkTemp(item, tag)
    //     } else {
    //         alert('Please choose Arogya Setu.')
    //     }
    // } else {
    // }
    this.checkTemp(item, tag);
    console.log('Itrdm-===', item.isVizArogyaSetu);
  }
  checkTemp(item, tag) {
    // if (this.props.AllSettings.settingsVM.vtemprature) {
    //     if (item.vizTemp != null && item.vizTemp != "") {
    //         this.insetOrCheckin(tag)
    //     } else {
    //         alert('Please add visitor Temperature')
    //     }
    // } else {
    //     this.insetOrCheckin(tag)
    // }
    this.insetOrCheckin(tag);
  }
  insetOrCheckin(tag) {
    console.log('Teg=====', tag);
    if (tag == 2) {
      console.log(this.state.VisitorDetails);
      this.insertChekIn(this.props.visitorDetails);
    } else if (tag == 1) {
      this.checkinWithPhoto(this.props.visitorDetails);
    }
  }

  insertChekIn = async item => {
    this.setState({skipModalCheckIn: false});
    // console.log("Item:=", item);
    // console.log("All Data:=", this.state.VisitorDetails);
    console.log('arogya setu final===', item.inOutId);
    var isArogyaSetu =
      item.isVizArogyaSetu == null ? false : item.isVizArogyaSetu;
    var vizTemp = item.vizTemp == null ? false : item.vizTemp;
    var params1 = item.inOutId + '/' + isArogyaSetu + '/' + vizTemp+"/"+this.props.LoginDetails.empID;
    console.log('final data==', params1);
    // this.props.CheckIn(params1, this.insertChekInSuccess);
    try {
      let response = await axiosPost('Visitor/CheckIn/' + params1, params1);
      console.log('Check In ', response);
      if (response) {
        // this.callApi(this.state.selectedList)
        // this.sendNotification(this.state.VisitorDetails, 1);
        // this.getAllReceptionst(this.state.VisitorDetails, 8);
        Alert.alert(
          'Success',
          this.state.VisitorDetails.fullName + ' Check In successfully',
        );
        this.props.onUpdate();
      } else {
        alert(this.state.VisitorDetails.fullName + ' Check In Unsuccessfull');
      }
      this.props.onClose();
    } catch (error) {}
  };
  insertChekInSuccess = res => this.afterInsertChekInSuccess(res);
  afterInsertChekInSuccess(respp) {
    if (respp) {
      // this.callApi(this.state.selectedList)
      this.sendNotification(this.state.VisitorDetails, 1);
      this.getAllReceptionst(this.state.VisitorDetails, 8);
      Alert.alert(
        'Success',
        this.state.VisitorDetails.fullName + ' Check In successfully',
      );
      this.props.onUpdate();
    } else {
      alert(this.state.VisitorDetails.fullName + ' Check In Unsuccessfull');
    }
    this.props.onClose();
    // this.clearData()
  }
  checkinWithPhoto = async item => {
    this.setState({skipModalCheckIn: false});
    console.log('ArogySetu====', item.isArogyaSetu);
    var isArogyaSetu =
      item.isVizArogyaSetu == null ? false : item.isVizArogyaSetu;
    var vizTemp = item.vizTemp == null ? false : item.vizTemp;
    var params1 = {
      inOutId: item.inOutId,
      visitorId: item.visitorId,
      imageBase64StringPhotoProofChkin: this.state.imagePath64Photo, // pass file name
      imageBase64StringIdProofChkin: this.state.imagePath64Id,
      photoProofPath: null,
      idprfPath: null,
      isVizArogyaSetu: isArogyaSetu,
      vizTemp: vizTemp,
      userId:this.props.LoginDetails.userID,
      empId:this.props.LoginDetails.empID
      // inviteCode: this.makeid(6)
    };
    console.log('Params:====', params1);

    // this.props.CheckinWithPhoto(params1, this.checkinWithPhotoSuccess)
    try {
      let response = await axiosPost('Visitor/CheckinWithPhoto', params1);
      console.log('checkout with photo===', response);
      if (response) {
        // this.callApi(this.state.selectedList)

        this.sendNotification(this.state.VisitorDetails, 1);
        this.getAllReceptionst(this.state.VisitorDetails, 8);
        Alert.alert(
          'Success',
          this.state.VisitorDetails.fullName + ' Check In successfully',
        );
        this.props.onUpdate();
      } else {
        alert(this.state.VisitorDetails.fullName + ' Check In Unsuccessfull');
      }
      this.props.onClose();
    } catch (error) {}
  };
  checkinWithPhotoSuccess = res => this.afterCheckinWithPhotoSuccess(res);
  afterCheckinWithPhotoSuccess(respp) {
    if (respp) {
      // this.callApi(this.state.selectedList)

      this.sendNotification(this.state.VisitorDetails, 1);
      this.getAllReceptionst(this.state.VisitorDetails, 8);
      Alert.alert(
        'Success',
        this.state.VisitorDetails.fullName + ' Check In successfully',
      );
      this.props.onUpdate();
    } else {
      alert(this.state.VisitorDetails.fullName + ' Check In Unsuccessfull');
    }
    this.props.onClose();
    // this.clearData()
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
      notifDate: this.getCurrentDate(),
      userId: item.whomToMeet,
    };
    console.log('Check In notification=====', param);
    // this.props.SaveNotification(param);
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
      notifDate: this.getCurrentDate(),
      userId: item.usrId,
    };
    // this.props.SaveNotification(param);
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
}
const styles = StyleSheet.create({
  switchLable: {
    paddingLeft: 15,
    paddingTop: 15,
    textAlign: 'left',
    alignSelf: 'center',
    width: '49%',
  },
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
//     UserDetails: state.CommanReducer?.UserDetails,
//     LoginDetails: state.CommanReducer?.LoginDetails,
//     // ReceptionData: state.CommanReducer?.ReceptionData,
//     // VisitorList: state.VisitorsReducer?.VisitorList,
//     // EmployeeList: state.EmployeReducer?.EmployeeList,
//     ReceptionList: state.CommanReducer?.ReceptionList,
//     AllSettings: state.CommanReducer?.AllSettings,
// });
// const mapDispatchToProps = (dispatch) => ({
//     Update: (Update) => dispatch(serviceActionUpdate(Update)),
//     CheckinWithPhoto: (param, onSuccess) => dispatch(Fetch('Visitor/CheckinWithPhoto', 'POST', param, undefined, onSuccess)),
//     CheckIn: (param, onSuccess) => dispatch(Fetch('Visitor/CheckIn/' + param, 'POST', undefined, undefined, onSuccess)),
//     SaveNotification: (param) => dispatch(Fetch('Notification/SaveNotification', 'POST', param)),
//     GetReceptionList: (userID) => dispatch(Fetch('Users/GetReceptionList', 'GET', userID, serviceActionReceptionList)),
// })

export default connect(mapStateToProps, mapDispatchToProps)(CheckIn);
