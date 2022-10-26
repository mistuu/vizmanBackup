//import liraries
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
  Dimensions,
  Keyboard,
  SafeAreaView,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Toast from 'react-native-simple-toast';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {axiosAuthGet, axiosPost} from '../../../utility/apiConnection';
import {COLORS, IMAGES} from '../../../Assets';
import ImgToBase64 from 'react-native-image-base64';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../../Assets/Colors/index.js';
import {getItem} from '../../../utility/AsyncConfig.js';
import Images from '../../../Assets/Images';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import {IMAGEURL, GateIMAGEURL} from '../../../utility/util';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class AddNewVisitor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: '',
      modalVisible: false,
      radiovalue: null,
      officesLists: [],
      parkingLists: [],
      officeId: 0,
      offId: 0,
      Selectedvehicle: null,
      parkingId: 0,
      parkId: 0,
      imagePathPhotoProof: '',
      imagePathIdProof: '',
      imagePath64Photo: null,
      imagePath64Id: null,
      name: null,
      selectedOfficeItems: '',
      selectedParkingItems: '',
      mobile: null,
      numofvisitor: '1',
      vehicleNo: '',
      remark: null,
      isPhotoProof: false,
      addParking: false,
      valParkingData: null,
      adddropDownParking: false,
      fullResponseofParking: null,
      parkingPlacetxt: ' --Select Parking-- ',
      officeplaceText: ' --Select Office-- ',
    };
  }

  async componentDidMount() {
    var Uid;
    await getItem('LoginDetails').then(data => {
      var LoginDetails = JSON.parse(data);
      //console.log(data.userID);
      Uid = LoginDetails.userID;
      this.setState({userID: LoginDetails.userID});
    });
    console.log('UserIDDDDDDDD======>', Uid);

    try {
      // this.setState({ addParking: Parking.parkingStatus, valParkingData: Parking })

      // console.log("AddNewVisitorAddNewVisitor",this.props.route.params?.parkAllocate);

     

      let response = await axiosAuthGet(
        'BuildingAdmin/GetUnit/' + this.state.userID + '/' + '1',
      );
      console.log('my office response====', response);
      await response.filter(val => {
        this.state.officesLists.push({id: val.unitId, name: val.unitName});
      });

      let res = await axiosAuthGet(
        'BuildingAdmin/GetParkingUnit/' + this.state.userID + '/' + '0',
      );
      console.log('my parking response====', res);
      // if (res.length != 0) {
      //   this.setState({ addParking: true })
      // } else {
      //   this.setState({ addParking: false })

      // }

      await res.filter(val => {
        this.state.parkingLists.push({
          id: val.unitId,
          name: val.unitName,
          UnitTypeId: val.unitTypeId,
        });
      });

      console.log(this.state.parkingLists);

      this.setState({fullResponseofParking: this.state.parkingLists});
      let Parking = await axiosAuthGet('BuildingAdmin/GetBuildingById/' + Uid);
      console.log('Additional Parking==', Parking);
      this.setState({valParkingData: Parking});

      if (Parking.parkingStatus == false) {
        console.log('dropdown hide====');
        this.setState({addParking: true, adddropDownParking: false});
      } else if (Parking.parkingStatus == true && Parking.addiParking == true) {
        // console.log("dropdown hide====");

        this.setState({addParking: true, adddropDownParking: true});
      } else if (
        Parking.parkingStatus == true &&
        Parking.addiParking == false &&
        res.length != 0
      ) {
        // console.log("dropdown hide====");

        this.setState({addParking: true, adddropDownParking: true});
      }
      let allocateDetials = await axiosAuthGet(
        'BuildingAdmin/GetVisitorDetails/' +
          this.props.route.params?.parkAllocate,
      );
      console.log('AddNewVisitorAddNewVisitor', allocateDetials.parkingName);
      if (allocateDetials != null || allocateDetials != '') {
        this.setState({
          officeplaceText:allocateDetials.officeName,
          offId:allocateDetials.officeId!=null || allocateDetials.officeId!=""&&allocateDetials.officeId,
          parkingPlacetxt:allocateDetials.parkingName==null||allocateDetials.parkingName==""?" --Select Parking-- ":allocateDetials.parkingName,
          parkId:allocateDetials.parkingId,
          Viname:allocateDetials.visitorName,
          name:allocateDetials.visitorName,
          mobile:allocateDetials.mobileNo,
          Selectedvehicle:allocateDetials.unitId,
          NoOfVisitnumofvisitor:allocateDetials.noofVisitor,
          vehicleNo:allocateDetials.vehicleNo,
          Veradiovalue:allocateDetials.unitId,
          imagePathPhotoProof:{uri:IMAGEURL+allocateDetials.photoUrl},
          imagePathIdProof:{uri:IMAGEURL+allocateDetials.idUrl},
          // imagePath64Photo:allocateDetials,
          // imagePath64Id:allocateDetials,
          remark:allocateDetials.remarks,
        });
      }
      // const transformed = response.map(({ unitName, unitId }) => ({ label: unitName, value: unitId }));
      // this.setState({ officesLists: transformed })
    } catch (error) {}

    try {
    } catch (error) {}
  }

  async submit() {
    if (
      this.state.offId != null ||
      this.state.name != null ||
      this.state.mobile != null ||
      this.state.numofvisitor != null ||
      this.state.vehicleNo != '' ||
      this.state.radiovalue != null ||
      this.state.remark != null
    ) {
      console.log('IN DATA SEND');
      // if (this.state.mobile.length != 10) {
      //   Toast.show('Please enter valid mobile no.');
      // }
      console.log(
        this.state.valParkingData.parkingStatus,
        this.state.valParkingData.addiParking,
        this.state.parkingLists.length,
      );
      console.log(this.state.radiovalue, this.state.vehicleNo);
      if (this.state.radiovalue != null || this.state.vehicleNo != '') {
        if (this.state.radiovalue != null || this.state.vehicleNo != '') {
          //   console.log("333");
          //   Toast.show('Please enter valid vehicle number.');
          if (
            this.state.valParkingData.parkingStatus == true &&
            this.state.valParkingData.addiParking == true &&
            this.state.parkingLists.length == 0
          ) {
            this.setModalVisible(true);
            console.log('Step:1');
          } else {
            this.saveData();
          }
        } else {
          console.log('Step:2');
          // this.saveData()
          Toast.show('Please enter valid vehicle number.');
        }
        console.log('Step:3');
      } else {
        this.saveData();
      }
      // this.saveData()
    } else {
      Toast.show('Please fill atleast one field');
    }
  }
  saveData = async () => {
    var params = {
      UserId: this.state.userID,
      officeId: this.state.offId,
      parkingId: this.state.parkId,
      VisitorName: this.state.name,
      mobileNo: this.state.mobile,
      NoOfVisitor: Number(this.state.numofvisitor),
      VehicleNo: this.state.vehicleNo.toUpperCase(),
      VehicleType: this.state.radiovalue,
      PhotoUrl: this.state.imagePath64Photo,
      IdUrl: this.state.imagePath64Id,
      remarks: this.state.remark,
    };

    console.log('SaveVisitor param====>', params);

    try {
      let res = await axiosPost('BuildingAdmin/SaveVisitor', params);
      console.log('success', res);
      if (res == 0) {
        Toast.show('Add visitor successfully');
        this.setModalVisible(false);
        this.handleBackButtonClick();
      }
    } catch (error) {}
  };
  setModalVisible = visible => {
    this.setState({modalVisible: visible});
  };
  onOfficeChange = async (value, index) => {
    console.log(value);

    this.setState({selectedOfficeItems: value});
    var x = [];
    await this.state.officesLists.filter(e => {
      value.filter(s => {
        if (e.name == s) {
          this.setState({offId: e.id});
        }
      });
    });
    // this.setState({ data1: this.state.data1 })
    console.log('Selcted Item:-', this.state.offId);
  };
  onParkingChange = async (value, index) => {
    console.log('parking value ===', value);

    this.setState({selectedParkingItems: value});
    var x = [];
    this.state.parkingLists.filter(e => {
      value.filter(s => {
        if (e.name == s) {
          this.setState({parkId: e.id});
        }
      });
    });
    // this.setState({ data1: this.state.data1 })
    console.log('Selcted Item:-', this.state.parkId);
  };
  handleBackButtonClick() {
    this.setModalVisible(false);
    this.props.navigation.goBack();
    return true;
  }

  selectPhotoTapped = async isPhotoProof => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const options = {
          quality: 1,
          mediaType: 'photo',
          maxWidth: 350,
          maxHeight: 350,
          storageOptions: {
            skipBackup: true,
          },
        };

        launchCamera(options, response => {
          if (response.didCancel) {
            this.setState({modalVisible: false});
          } else {
            response = response.assets;
            response = Object.assign({}, ...response);
            console.log(response);

            var base64Url = null;
            var ImageResponseCopy = '';
            if (isPhotoProof) {
              ImgToBase64.getBase64String(response.uri)
                .then(base64String => {
                  this.setState({
                    imagePathPhotoProof: {
                      uri: 'data:' + response.type + ';base64,' + base64String,
                    },
                    imagePath64Photo: response.fileName + ',' + base64String,
                  });
                })
                .catch();
              this.setState({isPhotoProof: false});
            } else {
              ImgToBase64.getBase64String(response.uri)
                .then(base64String => {
                  this.setState({
                    imagePathIdProof: {
                      uri: 'data:' + response.type + ';base64,' + base64String,
                    },
                    imagePath64Id: response.fileName + ',' + base64String,
                  });
                })
                .catch();
            }
          }
        });
      } else {
        // Permission Denied
        alert('CAMERA Permission Denied');
      }
    } else {
      const options = {
        quality: 1,
        mediaType: 'photo',
        // includeBase64:true,
        maxWidth: 350,
        maxHeight: 350,
        storageOptions: {
          skipBackup: true,
        },
      };

      launchCamera(options, response => {
        this.setState({visibleModal: false});
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

          var base64Url = null;
          var ImageResponseCopy = '';
          if (isPhotoProof) {
            ImgToBase64.getBase64String(response.uri)
              .then(base64String => {
                this.setState({
                  imagePathPhotoProof: {
                    uri: 'data:' + response.type + ';base64,' + base64String,
                  },
                  imagePath64Photo: response.fileName + ',' + base64String,
                });
              })
              .catch();
            this.setState({isPhotoProof: false});
          } else {
            ImgToBase64.getBase64String(response.uri)
              .then(base64String => {
                this.setState({
                  imagePathIdProof: {
                    uri: 'data:' + response.type + ';base64,' + base64String,
                  },
                  imagePath64Id: response.fileName + ',' + base64String,
                });
              })
              .catch();
          }
        }
      });
    }
  };

  onSelect(index, value) {
    console.log(value, index, this.state.radiovalue);
    console.log(this.state.parkingLists);
    if (index == 0) {
      var x = this.state.fullResponseofParking.filter(e => e.UnitTypeId == 2);
      console.log(x);
      if (x.length != 0) {
        this.setState({
          parkingLists: x,
          parkId: x[0].id,
          selectedParkingItems: x[0].name,
          parkingPlacetxt: x[0].name,
        });
      } else {
        Toast.show('Bike Parking Not available');
      }
    } else if (index == 1) {
      var y = this.state.fullResponseofParking.filter(e => e.UnitTypeId == 1);
      console.log(y);
      if (y.length != 0) {
        this.setState({
          parkingLists: y,
          parkId: y[0].id,
          selectedParkingItems: y[0].name,
          parkingPlacetxt: y[0].name,
        });
      } else {
        Toast.show('Car Parking Not available');
      }
    } else {
      this.setState({parkingLists: this.state.fullResponseofParking});
    }
    this.setState({radiovalue: value});
  }
  vehicleNoValue = async text => {
    // this.setState({vehicleNo: text});
    // if(text.length==4){
    let response = await axiosAuthGet(
      'BuildingAdmin/GetAllocateParking/' +
        this.state.userID +
        '/' +
        text +
        '/' +
        0,
    );
    this.setState({
      Selectedvehicle: response[0].unitTypeId == 2 ? 0 : 1,
      parkingPlacetxt:
        response[0].parkingUnitName != ' --Select Parking-- '
          ? response[0].parkingUnitName
          : '',
      parkId: response[0].unitId,
    });
    // this.onParkingChange([response[0].parkingUnitName])
    console.log('my office response====', [response[0].parkingUnitName]);

    // }
  };
  render() {
    return (
      <View style={styles.container}>
        <LinearGradient
          style={{
            flexDirection: 'row',
            width: '100%',
            height: '12%',
            justifyContent: 'flex-start',
            alignItems: 'center',
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          }}
          colors={[COLORS.primary, COLORS.third]}>
          <TouchableOpacity
            onPress={() => this.handleBackButtonClick()}
            style={{marginTop: 40, alignItems: 'flex-start', marginLeft: 10}}>
            <Image
              source={IMAGES.back}
              style={{
                height: 15,
                width: 22,
                tintColor: 'white',
                alignSelf: 'center',
              }}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: Colors.white,
              marginLeft: 20,
              marginTop: 40,
            }}>
            Add New Visitor
          </Text>
        </LinearGradient>

        <ScrollView bounces={false}>
          <View
            style={{
              marginRight: 10,
              marginLeft: 10,
              marginBottom: 10,
              marginTop: 30,
            }}>
            <View style={styles.to}>
              <SectionedMultiSelect
                items={this.state.officesLists}
                selectText={this.state.officeplaceText}
                searchPlaceholderText={'Search Office..'}
                onSelectedItemsChange={(value, index) =>
                  this.onOfficeChange(value, index)
                }
                selectedItems={this.state.selectedOfficeItems}
                //hideConfirm={true}
                single={true}
                uniqueKey="name"
                IconRenderer={Icon}
                noItemsComponent={<Text></Text>}
                confirmText="Close"
                noResultsComponent={<Text></Text>}
                styles={{
                  selectToggle: {
                    padding: 10,
                    borderColor: '#E5E5E5',
                    borderRadius: 5,
                    backgroundColor: '#fff',
                  },
                  button: {backgroundColor: Colors.primary},
                  confirmText: {color: Colors.white},
                }}
              />
            </View>

            <TextInput
              style={styles.txtInput}
              keyboardType="default"
              placeholder="Name"
              value={this.state.name}
              onChangeText={value => this.setState({name: value})}
            />

            <TextInput
              style={styles.txtInput}
              keyboardType="number-pad"
              maxLength={10}
              placeholder="Mobile No"
              returnKeyType={'done'}
              onChangeText={value => this.setState({mobile: value})}
              value={this.state.mobile}
            />

            <TextInput
              style={styles.txtInput}
              keyboardType="number-pad"
              placeholder="Number Of Visitor"
              returnKeyType={'done'}
              onChangeText={value => this.setState({numofvisitor: value})}
              value={this.state.numofvisitor}
            />
            {this.state.addParking == true ? (
              <View>
                <TextInput
                  style={styles.txtInput}
                  keyboardType="default"
                  placeholder="Vehicle No"
                  returnKeyType={'done'}
                  onSubmitEditing={value =>
                    this.vehicleNoValue(this.state.vehicleNo)
                  }
                  onChangeText={value => this.setState({vehicleNo: value})}
                  value={this.state.vehicleNo}
                />

                <RadioGroup
                  color="#000"
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    marginTop: 20,
                  }}
                  selectedIndex={this.state.Selectedvehicle}
                  onSelect={(index, value) => this.onSelect(index, value)}>
                  <RadioButton style={{alignItems: 'center'}} value="Bike">
                    <Image
                      style={{width: 30, height: 30, paddingLeft: 10}}
                      source={Images.bike}
                    />
                  </RadioButton>

                  <RadioButton
                    style={{alignItems: 'center', marginLeft: 50}}
                    value="Car">
                    <Image
                      style={{width: 30, height: 30, paddingLeft: 10}}
                      source={Images.car}
                    />
                  </RadioButton>
                </RadioGroup>

                {this.state.adddropDownParking == true ? (
                  <View style={styles.to}>
                    <SectionedMultiSelect
                      items={this.state.parkingLists}
                      selectText={this.state.parkingPlacetxt}
                      searchPlaceholderText={'Search Parking..'}
                      onSelectedItemsChange={(value, index) =>
                        this.onParkingChange(value, index)
                      }
                      selectedItems={this.state.selectedParkingItems}
                      single={true}
                      uniqueKey="name"
                      IconRenderer={Icon}
                      confirmText="Close"
                      // displayKey={this.state.selectedParkingItems}
                      noItemsComponent={<Text></Text>}
                      noResultsComponent={<Text></Text>}
                      styles={{
                        selectToggle: {
                          padding: 10,
                          borderColor: '#E5E5E5',
                          borderRadius: 5,
                          backgroundColor: '#fff',
                        },
                        button: {backgroundColor: Colors.primary},
                        confirmText: {color: Colors.white},
                      }}
                    />
                  </View>
                ) : null}
                {/* <View style={styles.to}>
                  <SectionedMultiSelect
                    items={this.state.parkingLists}
                    selectText=" --Select Parking-- "
                    searchPlaceholderText={"Search Parking.."}
                    onSelectedItemsChange={(value, index) => this.onParkingChange(value, index)}
                    selectedItems={this.state.selectedParkingItems}
                    single={true}
                    uniqueKey="name"
                    IconRenderer={Icon}
                    confirmText="Close"
                    noItemsComponent={(
                      <Text></Text>
                    )}
                    noResultsComponent={(
                      <Text></Text>
                    )}
                    styles={{
                      selectToggle: {
                        padding: 10, borderColor: '#E5E5E5',
                        borderRadius: 5, backgroundColor: '#fff',
                      },
                      button: { backgroundColor: Colors.primary },
                      confirmText: { color: Colors.white, }
                    }}
                  />
                </View> */}
              </View>
            ) : null}

            <TextInput
              style={[styles.txtInput, {marginBottom: 10}]}
              keyboardType="default"
              placeholder="Remark"
              value={this.state.remark}
              onChangeText={value => this.setState({remark: value})}
            />

            <View
              style={{
                width: '100%',
                marginTop: 20,
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                flexDirection: 'row',
              }}>
              <TouchableOpacity onPress={() => this.selectPhotoTapped(true)}>
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: '#EEEEEE',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{width: 25, height: 25, margin: 5}}
                    source={Images.userIcon}></Image>
                  <Text style={{fontSize: 17, marginRight: 5}}>Photo</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.selectPhotoTapped()}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginLeft: 50,
                    backgroundColor: '#EEEEEE',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{width: 25, height: 25, margin: 5}}
                    source={Images.userIcon}></Image>
                  <Text style={{fontSize: 17, marginRight: 5}}>ID Proof</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View
              style={{
                width: '100%',
                marginTop: 10,
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {/* <TouchableOpacity onPress={() => this.selectPhotoTapped(true)}> */}
                <Image
                  style={{width: 55,resizeMode:'contain', height: 43}}
                  source={this.state.imagePathPhotoProof}
                />
                {/* </TouchableOpacity> */}
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginLeft: 80,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {/* <TouchableOpacity onPress={() => this.selectPhotoTapped()}> */}
                <Image
                  style={{width: 55,resizeMode:'contain', height: 43}}
                  source={this.state.imagePathIdProof}
                />
                {/* </TouchableOpacity> */}
              </View>
            </View>

            <TouchableOpacity
              style={styles.btnSubmit}
              onPress={() => {
                this.submit();
              }}>
              <Text style={styles.txtSubmit}>Submit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Modal
          isVisible={this.state.modalVisible}
          onBackdropPress={() => this.setModalVisible(false)}
          onSwipeComplete={() => this.setModalVisible(false)}
          //swipeDirection="left"
          onBackButtonPress={() => this.setModalVisible(false)}
          style={{alignItems: 'center'}}>
          <View
            style={{backgroundColor: 'white', width: '100%', borderRadius: 10}}>
            <Image
              style={{
                marginTop: 30,
                width: 70,
                height: 70,
                paddingLeft: 10,
                alignSelf: 'center',
              }}
              source={Images.erroricon}
            />
            <Text
              style={{
                marginTop: 15,
                textAlign: 'center',
                fontSize: 30,
                fontWeight: 'bold',
                color: '#505458',
              }}>
              Parking Full!
            </Text>
            <Text
              style={{
                marginTop: 15,
                marginLeft: 15,
                marginRight: 15,
                fontSize: 17,
                color: '#6D757D',
                textAlign: 'center',
              }}>
              It seems your parking is already full, Are you sure you want to
              continue?
            </Text>

            <View
              style={{
                flexDirection: 'row',
                marginTop: 13,
                alignSelf: 'center',
                marginBottom: 30,
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 5,
                  borderColor: '#E5E5E5',
                  borderWidth: 0.5,
                  width: '30%',
                  height: 40,
                  justifyContent: 'center',
                }}
                onPress={() => {
                  this.handleBackButtonClick();
                }}>
                <Text
                  style={{color: '#000', textAlign: 'center', fontSize: 20}}>
                  No
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  marginLeft: 35,
                  backgroundColor: '#FF8C00',
                  borderRadius: 5,
                  borderColor: '#E5E5E5',
                  borderWidth: 0.5,
                  width: '30%',
                  height: 40,
                  justifyContent: 'center',
                }}
                onPress={() => {
                  this.saveData();
                }}>
                <Text
                  style={{color: '#fff', textAlign: 'center', fontSize: 20}}>
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
const sColor = {
  text: '#FF5733',
  height: 50,
  // primary:'#FF5733',
  // success:'#FF5733',
  subText: '#FF5733',
  searchPlaceholderTextColor: '#FF5733',
  searchSelectionColor: '#FF5733',

  // itemBackground:'#FF5733',
  // chipColor:'#FF5733',
  // selectToggleTextColor:'#FF5733',
};
const s = {
  confirmText: {
    color: '#000',
  },

  chipContainer: {
    // backgroundColor: 'red',
    // color: 'green',

    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'white',
  },
  // chipText: {
  //   maxWidth: Dimensions.get('screen').width - 90,
  // },
  // itemText: {
  //   color: this.state.selectedItems.length ? 'black' : 'lightgrey'
  // },
  selectedItemText: {
    color: 'blue',
  },
  // subItemText: {
  //   color: this.state.selectedItems.length ? 'black' : 'lightgrey'
  // },
  selectedSubItemText: {
    color: 'blue',
  },

  chipText: {
    color: '#FF5733',
    backgroundColor: '#FF5733',
    textDecorationColor: '#FF5733',
    textShadowColor: '#FF5733',
  },

  itemText: {
    color: '#FF5733',
    textShadowColor: '#FF5733',
    textDecorationColor: '#FF5733',
  },
  selectedItemText: {
    // color: 'blue',
  },
  subItemText: {
    color: '#FF5733',
  },
  confirmText: {
    backgroundColor: '#FF5733',
    color: '#FF5733',
    textDecorationColor: '#FF5733',
    textShadowColor: '#FF5733',
  },
  item: {
    paddingHorizontal: 10,
    textDecorationColor: '#FF5733',
    textShadowColor: '#FF5733',
  },
  subItem: {
    paddingHorizontal: 10,
  },
  selectedItem: {
    // backgroundColor: '#FF5733'
  },
  selectedSubItem: {
    // backgroundColor: '#FF5733'
  },
  selectedSubItemText: {
    // color: 'blue',
  },

  selectToggleText: {
    color: '#FF5733',
    fontSize: 15,
  },
  scrollView: {paddingHorizontal: 0},
};
// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.whitef4,
  },

  txtInput: {
    marginTop: Platform.OS === 'ios' ? 10 : 10,
    paddingLeft: 10,
    color: '#000',
    borderWidth: 0.5,
    height: Platform.OS === 'ios' ? 55 : null,
    borderColor: '#E5E5E5',
    borderRadius: 5,
    backgroundColor: '#fff',
  },

  btnSubmit: {
    backgroundColor: '#FC8F14',
    marginTop: 30,
    marginBottom: 20,
    height: 40,
    width: 100,
    justifyContent: 'center',
    borderRadius: 10,
  },
  to: {
    paddingLeft: 10,
    color: '#000',
    borderWidth: 0.5,
    // height: Platform.OS === 'ios' ? 50 : null,
    borderColor: '#E5E5E5',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  txtSubmit: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },

  photoView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

//make this component available to the app
export default AddNewVisitor;
