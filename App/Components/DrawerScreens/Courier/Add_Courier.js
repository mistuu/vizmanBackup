import { Picker } from '@react-native-community/picker';
import { Formik } from 'formik';
import React from 'react';
import Modal from 'react-native-modal';
import { Dimensions, BackHandler, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView, Platform } from 'react-native';
import { color } from 'react-native-elements/dist/helpers';
import ImgToBase64 from 'react-native-image-base64';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import SimpleToast from 'react-native-simple-toast';
import DropDownPicker from 'react-native-dropdown-picker';
import { Hoshi } from 'react-native-textinput-effects';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import { IMAGES } from '../../../Assets';
import Colors from '../../../Assets/Colors';
import { mapStateToProps } from '../../../Reducers/ApiClass';
import { axiosAuthGet, axiosPost } from '../../../utility/apiConnection';
import { getItem } from '../../../utility/AsyncConfig';
import moment from 'moment';
import { PermissionsAndroid } from 'react-native';
import ImageResizer from 'react-native-image-resizer';
import ImagePicker from 'react-native-image-crop-picker';


const { width, height } = Dimensions.get('window');

const textField = Yup.object().shape({
  // company: Yup.string()
  //   .required("This Field is required."),
  mob: Yup.string()
    // .required("This Field is required.")
    .length(10, 'Mobile number should not be less than 10 digits')
    .matches(/^(0|91|\+91)?-?[6789]\d{9}$/, 'Please enter Valid Mobile Number'),
  // address: Yup.string()
  //   .required('This Field is required.'),
  dockerno: Yup.string()
    // .required("This Field is required.")
    .matches(/^[0-9aA-zZ]+$/, 'Only Alphabet and Numeric Value is Allowed')
    .trim(),

  from: Yup.string()
    .required("This Field is required."),

});
class Add_Courier extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
    this.state = {
      whoMetList: [],
      modalVisible: false,
      courierDetails: null,
      selectValue: '',
      imageBase64StringPhotoProof: { fileName: null, data: null },
      imageBase64StringIdProof: { fileName: null, data: null },
      urgentToggle: false,
      imagePath: '',
      whoommeetId: null,
      reRender: true,
      remark: '',
      executive: '',
      corEmp: null,
      add_courier: {
        to: '',
        from: '',
        address: '',
        dockerno: '',
        company: '',
        mob: '',
        dateAndtime: '',
        photo: '',
      },
    };
  }
  async componentDidMount() {
    console.log("Hellocvmskldmcvdocm", this.props.LoginDetails.fullName);
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

    try {
      getItem('courierDetails').then((data) => {
        console.log("courier Details:::===", data);
        this.setState({ courierDetails: data })
      })
      let response = await axiosAuthGet('Users/GetWhoomToMEet/' + this.props.LoginDetails.userID)
      console.log("whom meet===:", response);
      response.filter(e=>{
        this.state.whoMetList.push({label:e.name,value:e.whomToMeet})
      })
      // this.setState({ whoMetList: response })
      // this.state.whoMetList.push({ "name": "Select Employee..."})
      // response.forEach(element => {
      //   this.setState
      // });
      // console.log("id:", this.state.whoommeetId);
    } catch (error) {

    }
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);

  }
  handleBackButtonClick() {
    this.props.navigation.goBack()
    return true;
  }
  chooseFileCamera = async () => {
    try {
      if (Platform.OS === 'android') {
        // Calling the permission function
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Permission Granted
          // proceed();
          // alert('CAMERA Permission ');
          // const options = {
          //   quality: 1,
          //   mediaType: 'photo',
          //   // includeBase64:true,
          //   maxWidth: 350,
          //   maxHeight: 350,
          //   storageOptions: {
          //     skipBackup: true
          //   }
          // };
          ImagePicker.openCamera({
            
            cropping: false,
          }).then(async image => {
            var u;
            var imgName;
            console.log(image);
            await ImageResizer.createResizedImage(image.path,
              image.height,
              image.width,
              'JPEG',
              100,
              0,
              undefined,
              false,
)
              .then(async (res) => {
                this.setState({ imageBase64StringPhotoProof:{fileName:res.name} });
                u = res.uri
                imgName=res.name
                console.log("Resize", res);
              })
              .catch(err => {
             
              });
              ImgToBase64.getBase64String(u)
              .then(base64String => {
                  console.log(base64String);
                  this.setState({ imagePath: imgName + "," + base64String })
                  // console.log("+++++++", response.fileName + "," + base64String);
                }
                )
                .catch();
              this.setState({ modalVisible: false })
          })

          // launchCamera(options,async (response) => {

          //   if (response.didCancel) {
          //     this.setState({ modalVisible: false })

          //   }
          //   else {
          //     response = response.assets
          //     response = Object.assign({}, ...response)
          //     console.log(response);
          //     // 385x256
          //     // response.fileName + "," + "data:" + response.type + ";base64," + base64String.trim()
          //     // if (Platform.OS == 'ios') {
          //     //   var tempSplit = response.uri.split("/")
          //     //   response.fileName = tempSplit[tempSplit.length - 1]
          //     // }
          //     let ImageResponse = { fileName: response.fileName, data: "data:image/jpeg;base64," + response }

          //     // if (type == 'Photo') {
          //     // const VisitorDetails = Object.assign({}, this.state.VisitorDetails, { imageBase64StringPhotoProof: ImageResponse.data })
          //     this.setState({ imageBase64StringPhotoProof: response });
          //     var u;
          //     await ImageResizer.createResizedImage(response.uri, 1000, 1000, 'PNG', 100, 0, undefined, false)
          //     .then(async (res) => {
          //       u = res.uri
          //       console.log("Resize", res);
          //     })
          //     .catch(err => {
             
          //     });
          //     ImgToBase64.getBase64String(u)
          //     .then(base64String => {
          //         console.log(base64String);
          //         this.setState({ imagePath: response.fileName + "," + base64String })
          //         // console.log("+++++++", response.fileName + "," + base64String);
          //       }
          //       )
          //       .catch();
          //     this.setState({ modalVisible: false })
          //     // console.log(this.state.imageBase64StringPhotoProof);
          //     // } else if (type == 'Id') {
          //     // const VisitorDetails = Object.assign({}, this.state.VisitorDetails, { imageBase64StringIdProof: ImageResponse.data })
          //     // this.setState({ VisitorDetails, imageBase64StringIdProof: ImageResponse });
          //     // }
          //   }
          // });
        } else {
          // Permission Denied
          alert('CAMERA Permission Denied');
        }
      } 
      else {
        // proceed();
        ImagePicker.openCamera({
            
          cropping: false,
        }).then(async image => {
          var u;
          var imgName;
          console.log(image);
          await ImageResizer.createResizedImage(image.path,
            image.height,
            image.width,
            'JPEG',
            100,
            0,
            undefined,
            false,
            ).then(async (res) => {
              this.setState({ imageBase64StringPhotoProof:{fileName:res.name} });
              u = res.uri
              imgName=res.name
              console.log("Resize", res);
            })
            .catch(err => {
              console.log(err);
            });
            ImgToBase64.getBase64String(u)
            .then(base64String => {
                console.log(base64String);
                this.setState({ imagePath: imgName + "," + base64String })
                // console.log("+++++++", response.fileName + "," + base64String);
              }
              )
              .catch();
            this.setState({ modalVisible: false })
        })
          
      }

    } catch (err) {
      console.warn(err);
    }

  }
  chooseFileGallary = () => {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };
    ImagePicker.openPicker({
      cropping: false,
    }).then(async image => {
      var u;
      var imgName;
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
        this.setState({ imageBase64StringPhotoProof:{fileName:res.name} });
        imgName=res.name
        u = res.uri;
  
        ImgToBase64.getBase64String(u)
          .then(base64String => {
            this.setState({imagePath: imgName + ',' + base64String});
            // console.log("+++++++", response.fileName + "," + base64String);
          })
          .catch();
      });
      this.setState({modalVisible: false});
    });
    // launchImageLibrary(options, (response) => {
    //   if (response.didCancel) {
    //     this.setState({ modalVisible: false })

    //   }
    //   else {

    //     response = response.assets
    //     response = Object.assign({}, ...response)
    //     console.log(response);

    //     // response.fileName + "," + "data:" + response.type + ";base64," + base64String.trim()
    //     if (Platform.OS == 'ios') {
    //       var tempSplit = response.uri.split("/")
    //       response.fileName = tempSplit[tempSplit.length - 1]
    //     }
    //     let ImageResponse = { fileName: response.fileName, data: "data:image/jpeg;base64," + response }
        
    //     // if (type == 'Photo') {
    //     // const VisitorDetails = Object.assign({}, this.state.VisitorDetails, { imageBase64StringPhotoProof: ImageResponse.data })
    //     this.setState({ imageBase64StringPhotoProof: response });
    //     ImgToBase64.getBase64String(response.uri)
    //       .then(base64String => {
    //         this.setState({ imagePath: response.fileName + "," + base64String })
    //         console.log("+++++++", response.fileName + "," + base64String);
    //       }).catch();
    //     this.setState({ modalVisible: false })
    //     // console.log(this.state.imageBase64StringPhotoProof);
    //     // } else if (type == 'Id') {
    //     // const VisitorDetails = Object.assign({}, this.state.VisitorDetails, { imageBase64StringIdProof: ImageResponse.data })
    //     // this.setState({ VisitorDetails, imageBase64StringIdProof: ImageResponse });
    //     // }
    //   }
    // });
  }
  
  setModalVisible(visible) {
    this.setState({ modalVisible: visible })
  }
  onchangeValue = async (value) => {
    console.log(this.state.whoMetList);
    let x = null
    await this.state.whoMetList.forEach(element => {
      if (element.value == value.value) {
        x = value.label

      }
      // console.log("values:", element);
    });

    console.log("values:", x);
    this.setState({ selectValue: value.value, corEmp: x })
  }
  switchToggle(toggle) {
    this.setState({ urgentToggle: toggle })
    if (toggle == true) {
      // SimpleToast.show("Urgent Courier")
    }
    else {
      // SimpleToast.show("Urgent Cancle....")

    }
  }
  getCurrentDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    var d = this.addZero(dd) + '-' + this.addZero(mm) + '-' + this.addZero(yyyy)
    var temp = this.getParsedDate1(d)
    let date1 = new Date();
    let hours = date1.getHours();
    let minutes = date1.getMinutes();
    let seconds = date1.getSeconds();
    var t3 = temp + "T" + this.addZero(hours) + ":" + this.addZero(minutes) + ":" + this.addZero(seconds)
    return t3
  }
  onSubmit = async (values) => {

    if (this.state.selectValue != '') {
      // SimpleToast.show("Employee Selected...");
      const params = {
        courierId: 0,
        name: values.from,
        address: values.address,
        employeeId: this.state.selectValue,
        docket_No: values.dockerno,
        courierCompany: values.company,
        courierEmployeeName: this.state.executive,
        courierMobile: values.mob,
        remark: this.state.remark,
        image: this.state.imagePath,
        type: false,
        is_IMP: this.state.urgentToggle,
        orgId: this.props.LoginDetails.orgID,
        userId: this.props.LoginDetails.userID,
        employeeName: "",
        page: "",
        courierDate: ""
      }
      let notifText1 = '';
      if (values.dockerno != '') {
        console.log("this.state.corEmp",this.state.corEmp);
        notifText1 = "Hi " + this.state.corEmp + ", a courier is received for you vide docket no " + values.dockerno + " " + " from " + values.from;
      }
      else {
        console.log("this.state.corEmp",this.state.corEmp);
       
        notifText1 = "Hi " + this.state.corEmp + ", your courier from " + " " + values.from + " " + "is here."
      }
      console.log("parameter:====", params);
      try {
        let response = await axiosPost('Courier/SaveCourier', params);

        console.log("success...", response);
        if (response === 0) {
          var param = {
            notifText: notifText1,
            notifDate: moment().format("YYYY-MM-DDTHH:mm:ss"),
            userId: this.state.selectValue
          }
          console.log("params:====", param);
          let re = axiosPost('Notification/SaveNotification', param);
          console.log("Responce==:", re);
          SimpleToast.show("Add Courier Successfully")
          this.props.navigation.goBack('Courier');
        }
        else {
          SimpleToast.show("Unsuccessfully")

        }

      } catch (error) {

      }

      console.log("Final value========", this.state.selectValue);
    }
    else {
      SimpleToast.show("To* Field is Required.");

      console.log("Final value========", this.state.selectValue);

    }
    //

  }
  defaultValueSet = async (value) => {
    // console.log(value);
    var c = ''
    var m = ''
    await this.state.courierDetails.forEach(element => {
      console.log("Response Details:=", element.courierMobile + "===" + this.props.LoginDetails.userID);
      if (value === element.courierMobile) {
        this.setState({ executive: element.courierEmployeeName, add_courier: { company: element.courierCompany, mob: element.courierMobile } })
      }
    });

  }
  render() {
    return (
      <ScrollView style={{ backgroundColor: Colors.white, }}>
        <View style={{ flex: 1, marginBottom: 30, backgroundColor: COLORS.white }}>
          
          <LinearGradient
            style={{ flexDirection: 'row', width: '100%', height:Platform.OS=='ios'?"16%" :"15%", justifyContent: 'flex-start', alignItems: 'center', borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}
            colors={[
              COLORS.primary,
              COLORS.third
            ]}>
            <TouchableOpacity onPress={() => this.handleBackButtonClick()} style={{padding:10, marginTop: 40, alignItems: 'flex-start', marginLeft: 10 }}>
              <Image source={IMAGES.back}
                style={{ height: 15,padding:10, width: 22, tintColor: 'white', alignSelf: 'center' }} />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.white, marginLeft: 20, marginTop: 40 }}>Courier-In</Text>
          </LinearGradient>
          <Formik
            enableReinitialize={this.state.reRender}

            validationSchema={textField}
            // initialValues={this.state.loginObject}
            // onSubmit={(values) => this.getOtp(values)}
            initialValues={this.state.add_courier}
            onSubmit={async (values) => await this.onSubmit(values)}
          >
            {({ setFieldValue,
              handleSubmit,
              handleChange,
              values, handleBlur,
              errors, touched
            }) => (
              <>
                <View style={{ margin: 10,  backgroundColor: Colors.white }}>
                    <DropDownPicker
                      items={this.state.whoMetList}
                      placeholder={"To *"}
                      // ={"Select Program"}
                      containerStyle={{ height: 50 }}
                      // style={{ backgroundColor: '#fafafa', zIndex: 10 }}
                      dropDownStyle={{ backgroundColor: '#fafafa' }}
                      onChangeItem={item => this.onchangeValue(item)}
                    />
                    
                  <View style={styles.otpView}>
                    <TextInput
                      placeholder="From *"
                      placeholderTextColor={Colors.primary}
                      value={values.from}
                      maxLength={50}
                      onBlur={handleBlur("from")}
                      onChangeText={handleChange("from")}
                      style={{ flex: 1, fontSize: 18, color: Colors.primary, marginTop: 20 }}
                    />
                  </View>
                  {
                  
                    errors.from && touched.from ?
                      <Text style={{ color: Colors.red, fontSize: 15 }}>{errors.from}</Text>
                      : null
                  }
                  <View style={styles.otpView}>
                    <TextInput
                      placeholder="Address "
                      placeholderTextColor={Colors.primary}
                      value={values.address}
                      multiline={true}
                      maxLength={50}
                      onBlur={handleBlur("address")}
                      onChangeText={handleChange("address")}
                      style={{ flex: 1, fontSize: 18, color: Colors.primary, marginTop: 20 }}
                    />
                  </View>
                  {
                    
                    errors.address && touched.address ?
                      <Text style={{ color: Colors.red, fontSize: 15 }}>{errors.address}</Text>
                      : null
                  }
                  <View style={styles.otpView}>
                    <TextInput
                      placeholder="Docket No "
                      placeholderTextColor={Colors.primary}
                      value={values.dockerno}
                      maxLength={50}
                      onBlur={handleBlur("dockerno")}
                      onChangeText={(value) => {
                        let val = value.replace(/\s/g, "")
                        setFieldValue("dockerno", val)
                      }}
                      style={{ flex: 1, fontSize: 18, color: Colors.primary, marginTop: 20 }}
                    />
                  </View>
                  {
                    errors.dockerno && touched.dockerno ?
                      <Text style={{ color: Colors.red, fontSize: 15 }}>{errors.dockerno}</Text>
                      : null
                  }
                  <View style={styles.otpView}>
                    <TextInput
                      placeholder="Courier Company "
                      placeholderTextColor={Colors.primary}
                      value={values.company}
                      maxLength={50}
                      onBlur={handleBlur("company")}
                      onChangeText={handleChange("company")}
                      style={{ flex: 1, fontSize: 18, color: Colors.primary, marginTop: 20 }}
                    />
                  </View>
                  {
                    
                    errors.company && touched.company ?
                      <Text style={{ color: Colors.red, fontSize: 15 }}>{errors.company}</Text>
                      : null
                  }
                  <View style={styles.otpView}>
                    <TextInput
                      placeholder="Courier Executive"
                      placeholderTextColor={Colors.primary}
                      value={this.state.executive}
                      maxLength={50}
                      onChangeText={txt => this.setState({ executive: txt })}
                      style={{ flex: 1, fontSize: 18, color: Colors.primary, marginTop: 20 }}
                    />
                  </View>
                  <View style={styles.otpView}>
                    <TextInput
                      placeholder="Mobile No "
                      placeholderTextColor={Colors.primary}
                      value={values.mob}
                      onBlur={handleBlur("mob")}
                      onChangeText={(value) => {
                        let num = value.replace(/[- #*;,.+<>N()\{\}\[\]\\\/]/gi, '')
                        setFieldValue("mob", num),
                          value.toString().length === 10 && this.defaultValueSet(value)
                      }}
                      keyboardType='phone-pad'
                      maxLength={10}
                      style={{ flex: 1, fontSize: 18, color: Colors.primary, marginTop: 20 }}
                    />
                  </View>
                  {
                    
                    errors.mob && touched.mob ?
                      <Text style={{ color: Colors.red, fontSize: 15 }}>{errors.mob}</Text>
                      : null
                  }

                  <View style={styles.otpView}>
                    <TextInput
                      placeholder="Remark"
                      placeholderTextColor={Colors.primary}
                      value={this.state.remark}
                      onChangeText={txt => this.setState({ remark: txt })}
                      style={{ flex: 1, fontSize: 18, color: Colors.primary, marginTop: 20 }}
                    />
                  </View>
                  <View style={{ marginTop: 20 }}>
                    <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', width: "100%" }} onPress={() => this.setModalVisible(true)}>
                      <TextInput
                        placeholder="Photo"
                        editable={false}
                        maxLength={30}
                        placeholderTextColor={Colors.primary}
                        style={{
                          color: Colors.primary,
                          borderBottomWidth: 1,
                          fontSize: 18,
                          borderBottomColor: Colors.primary, flexGrow: 1, marginRight: 15
                        }}
                        value={this.state.imageBase64StringPhotoProof.fileName}
                      />
                      {/* <Hoshi
                        editable={false}
                        style={{
                          color: Colors.primary,
                          borderBottomWidth: 1,
                          borderBottomColor: Colors.primary, flexGrow: 1, marginRight: 15
                        }}
                        labelStyle={{justifyContent:'flex-start', color: Colors.primary,textAlign:'left',alignSelf:'flex-start' }}
                        label="Photo"
                        // onBlur={handleBlur("photo")}
                        value={this.state.imageBase64StringPhotoProof.fileName} /> */}
                      <Image source={IMAGES.camera}
                        style={{ right: 5, top: 10, height: 28, width: 32 }}
                      />

                    </TouchableOpacity>
                  </View>
                  {/* {
                    console.log("Errors:", errors.photo),
                    errors.photo && touched.photo ?
                      <Text style={{ color: Colors.red, fontSize: 15 }}>{errors.photo}</Text>
                      : null
                  } */}

                  <TouchableOpacity
                    onPress={() => handleSubmit()}
                    style={{padding:10}}
                  >
                    <View
                      style={{
                        backgroundColor:Colors.primary,
                        marginTop: 30,
                        borderRadius: 8,
                        marginLeft: 200
                      }}
                      >
                      <Text style={styles.submitText}> Submit </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
          <Modal
            isVisible={this.state.modalVisible}
            onBackdropPress={() => this.setModalVisible(false)}
            onSwipeComplete={() => this.setModalVisible(false)}
            swipeDirection="left"
            onBackButtonPress={() => this.setModalVisible(false)}
          >
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ width: "70%", padding: 10, borderRadius: 13, backgroundColor: "#fff", alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', padding: 10, color: "#FF9214" }}>Choose Image</Text>
                <View style={{ borderWidth: 0.5, width: "100%", borderColor: "#000" }} />
                <TouchableOpacity onPress={() => this.chooseFileCamera()}>
                  <Text style={{ fontSize: 15, padding: 10, color: '#FF9214' }}>Camera</Text>
                </TouchableOpacity>
                <View style={{ borderWidth: 0.5, width: "100%", borderColor: "#000" }} />
                <TouchableOpacity onPress={() => this.chooseFileGallary()}>
                  <Text style={{ fontSize: 15, padding: 10, color: "#FF9214" }}>Gallery</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>

      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  otpView: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
    alignItems: 'center',
  },
  submitButton: {
    // backgroundColor:[{}],
    marginTop: 30,
    borderRadius: 8,
    marginLeft: 200

    // justifyContent: 'center',
    // textAlign: 'center',
    // alignItems: 'center'
  },
  submitText: {
    color: "#fff",
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 5,
    fontSize: 18,
    paddingBottom: 5,
    // justifyContent: 'center',
    textAlign: 'center',
    // alignItems: 'center'
  },
})

export default connect(mapStateToProps)(Add_Courier)