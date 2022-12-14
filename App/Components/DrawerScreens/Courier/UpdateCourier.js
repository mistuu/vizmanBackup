import React, { Component } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { TextInput } from 'react-native';
import { ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { View, BackHandler, Text, Dimensions, } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import ImgToBase64 from 'react-native-image-base64';
import * as Yup from 'yup';
import { IMAGEURL } from '../../../utility/util'
import Modal from 'react-native-modal';
import DropDownPicker from 'react-native-dropdown-picker';
import { Formik } from 'formik'
import Colors from '../../../Assets/Colors';
import { mapStateToProps } from '../../../Reducers/ApiClass';
import { axiosAuthGet, axiosPost } from '../../../utility/apiConnection';
import { Header } from '../../CusComponent';
import { Picker } from '@react-native-community/picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Hoshi } from 'react-native-textinput-effects';
import { COLORS, IMAGES } from '../../../Assets';
import { Image } from 'react-native';
import { colors } from 'react-native-elements';
import ToggleSwitch from 'toggle-switch-react-native'
import SimpleToast from 'react-native-simple-toast';
import Images from '../../../Assets/Images';
import { PermissionsAndroid } from 'react-native';
import ImageResizer from 'react-native-image-resizer';
import ImagePicker from 'react-native-image-crop-picker';
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import Icon from "react-native-vector-icons/MaterialIcons";
import DateTimePicker from '@react-native-community/datetimepicker';
import Moment from 'moment';
const { width, height } = Dimensions.get('window');
const textField = Yup.object().shape({
  // company: Yup.string()
  //   .required("This Field is required."),
  mob: Yup.string(),
    // .required("This Field is required.")
    // .length(15, 'Mobile number should not be less than 10 digits')
    // .matches(/^(0|91|\+91)?-?[6789]\d{9}$/, 'Please enter Valid Mobile Number'),
  // address: Yup.string()
  //   .required('This Field is required.'),
  dockerno: Yup.string()
    // .required("This Field is required.")
    .matches(/^[0-9aA-zZ]+$/, 'Only Alphabet and Numeric Value is Allowed')
    .trim(),

  from: Yup.string()
    .required("This Field is required."),

});
class UpdateCourier extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)

    this.state = {
      whoMetList: [],
      selectedItem: [],
      selectedEmpItems: [],
      show:false,
      date:Platform.OS=="ios"? new Date():null,
      typePlaceHolder: "",
      modalVisible: false,
      type: false,
      defaultPlaceHolder: '',
      showHideToggle: true,
      selectValue: '',
      imageBase64StringPhotoProof: { fileName: null, data: null },
      imageBase64StringIdProof: { fileName: null, data: null },
      urgentToggle: false,
      imagePath: '',
      whoommeetId: null,
      remark: '',
      executive: '',
      photo: '',
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
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

    // console.log("update id:",this.props.courierID);
    try {
      let response = await axiosAuthGet('Courier/GetCourierDetails/' + this.props.courierID)
      console.log(response);
      this.state.selectedEmpItems.push(response.employeeId)
      this.setState({
        executive: response.courierEmployeeName,
        remark: response.remark,
        selectValue: response.employeeId,
        urgentToggle: response.is_IMP,
        // selectedEmpItems:response.employeeId,
        // imagePath: response.image,
        type: response.type,
        defaultPlaceHolder: response.employeeName,
        showHideToggle: response.type,
        date:Platform.OS=="ios"?new Date(response.courierDate):response.courierDate,
        typePlaceHolder:response.employeeName,
        add_courier: {
          to: response.employeeName,
          from: response.name,
          address: response.address,
          dockerno: response.docket_No,
          company: response.courierCompany,
          mob: response.courierMobile,
          dateAndtime: response.courierDate,
        }
      })

      // if (response.type != true) {
      //   this.setState({ typePlaceHolder: "To *" })
      // }
      // else {
      //   this.setState({ typePlaceHolder: "From *" })

      // }
      if (response.image != '') {
        this.setState({ imagePath: response.image, photo: { uri: IMAGEURL + response.image } })
      }
      else {
        this.setState({ imagePath: Images.user_default, photo: "" })
      }
      console.log("Employee name:", response.image);
    } catch (error) {

    }
    try {
      let response = await axiosAuthGet('Users/GetWhoomToMEet/' + this.props.LoginDetails.userID)
      console.log("whom meet===:", response);
      response.filter(e => {
        this.state.whoMetList.push({ name: e.name, id: e.whomToMeet })
      })
      // this.setState({ whoMetList: response })
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
                  this.setState({ imagePath: imgName + "," + base64String,photo: { uri: "data:image/jpeg;base64," + base64String } })
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
                this.setState({ imagePath: imgName + "," + base64String,photo: { uri: "data:image/jpeg;base64," + base64String } })
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
            this.setState({imagePath: imgName + ',' + base64String,photo: { uri: "data:image/jpeg;base64," + base64String }});
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
  onchangeValue = (value) => {
    this.setState({ selectValue: value.value })
    console.log("EMployee name:", value);
  }
  switchToggle(toggle) {
    this.setState({ urgentToggle: toggle })
    if (toggle == true) {
      // SimpleToast.show("Urgent Courier")
    }
    else {
      // SimpleToast.show("Urgent Cancle")
    }
  }

  onSubmit = async (values) => {
    if (this.state.selectValue != '') {
      if(values.mob==null ||values.mob==""|| values.mob.length>=8){
        const params = {
          courierId: this.props.courierID,
          name: values.from,
          address: values.address,
          employeeId: this.state.selectValue,
          docket_No: values.dockerno,
          courierCompany: values.company,
          courierEmployeeName: this.state.executive,
          courierMobile: values.mob,
          remark: this.state.remark,
          image: this.state.imagePath,
          type: this.state.type,
          is_IMP: this.state.urgentToggle,
          orgId: this.props.LoginDetails.orgID,
          userId: this.props.LoginDetails.userID,
          employeeName: "",
          page: "",
          empId:this.props.LoginDetails.empID,
          courierDate:Moment(this.state.date).format(),
        }
        console.log("parameter:====", params);
        try {
          let response = await axiosPost('Courier/SaveCourier', params);
          console.log("success", response);
          if (response === 0) {
            SimpleToast.show("Update Courier Successfully")
            this.props.navigation.goBack();
          }
          else {
            SimpleToast.show("Unsuccessfull")
  
          }
  
        } catch (error) {
  
        }
      }
      else{
        alert("Invalid Mobile No")
      }
   
    } else {
      SimpleToast.show("Select Employee");

    }
  }
  onStateSelectedItemsChange = async (value, index) => {
    let x = null
    console.log(value);
    // value=Object.assign({}, value)
     this.state.whoMetList.forEach(element => {
      if (element.id == value[0]) {
        x = element.name

      }
      // console.log("values:", element);
    });

    console.log("values:", x);
    this.setState({ selectValue: value[0],selectedEmpItems:value, corEmp: x })
    // this.state.visitorDetails.filter(i=>{
    //   value.filter(x=>{
    //     console.log(i);
    //     if(i.userId==x){
    //       this.state.tempList.push(i)
    //     }
    //   }
    //     )
    // })
    // console.log("Selcted Item:-", value);
  };
  showMode = () => {
    this.setState({show: true,date:new Date()});
  };
  render() {
    return (
      <ScrollView style={{ backgroundColor: Colors.white, }}>

        <View style={{ flex: 1, marginBottom: 30, backgroundColor: COLORS.white }}>
          {/* <Header title={"Courier-In"} navigation={this.props.navigation} /> */}
          <LinearGradient
            style={{ flexDirection: 'row', width: '100%', height:Platform.OS=='ios'?"16%" :"15%", justifyContent: 'flex-start', alignItems: 'center', borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}
            colors={[
              COLORS.primary,
              COLORS.third
            ]}>
            <TouchableOpacity onPress={() => this.handleBackButtonClick()} style={{ marginTop: 40, alignItems: 'flex-start', marginLeft: 10 }}>
              <Image source={IMAGES.back}
                style={{ height: 15, width: 22,padding:10, tintColor: 'white', alignSelf: 'center' }} />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.white, marginLeft: 20, marginTop: 40 }}>Update Courier</Text>
          </LinearGradient>

          <Formik
            validationSchema={textField}
            initialValues={this.state.add_courier}
            onSubmit={values => this.onSubmit(values)}
            enableReinitialize
          >
            {({ setFieldValue,
              handleSubmit,
              handleChange,
              values, handleBlur,
              errors, touched
            }) => (
              <>
              
                <View style={{ margin: 10,paddingBottom:20, marginBottom: 10, backgroundColor: Colors.white }}>
                <ScrollView contentContainerStyle={{flex:1,marginBottom:"10%"}}>
                
                
                  {/* <View style={styles.otpView}> */}
                  <SectionedMultiSelect
                    styles={search}
                    colors={sColor}
                    items={this.state.whoMetList}
                    single={true}
                    searchPlaceholderText="Search"
                    IconRenderer={Icon}
                    uniqueKey="id"
                    // subKey="id"
                    selectText={this.state.typePlaceHolder}
                    showDropDowns={true}
                    // readOnlyHeadings={true}
                    onSelectedItemsChange={(value, index) =>
                      this.onStateSelectedItemsChange(value, index)
                    }
                    selectedItems={this.state.selectedEmpItems}
                    // confirmText={"Select"}
                    // onConfirm={() => this.onApproveSubmit()}
                    hideConfirm={true}
                  />
                  {/* </View> */}
                  {/* <View style={styles.otpView}>
                    <Picker
                      style={{ width: width, color: Colors.primary, marginTop: 20 }}
                      selectedValue={this.state.selectValue}
                      onValueChange={(value) => {
                        // if (value == "emp") {
                        //   SimpleToast.show("Select Employee...");
                        // } else {
                        this.onchangeValue(value)
                        // }
                      }
                      }
                    >
                      {
                        this.state.whoMetList && this.state.whoMetList.map((item, index) => {
                          return (
                            <Picker.Item label={item.name} value={item.whomToMeet} key={index} />
                          );
                        })
                      }
                    </Picker>
                  </View> */}
                  <View style={styles.otpView}>
                    {
                      (this.state.showHideToggle) ?
                        <TextInput
                          placeholder="To *"
                          placeholderTextColor={Colors.primary}
                          value={values.from}
                          maxLength={50}
                          onBlur={handleBlur("from")}
                          onChangeText={handleChange("from")}
                          style={{ flex: 1, fontSize: 18, color: Colors.primary, marginTop: 20 }}
                        /> :
                        <TextInput
                          placeholder="From *"
                          placeholderTextColor={Colors.primary}
                          value={values.from}
                          maxLength={50}
                          onBlur={handleBlur("from")}
                          onChangeText={handleChange("from")}
                          style={{ flex: 1, fontSize: 18, color: Colors.primary, marginTop: 20 }}
                        />

                    }

                  </View>
                  {
                    console.log("Errors:", errors.from),
                    errors.from && touched.from ?
                      <Text style={{ color: Colors.red, fontSize: 15 }}>{errors.from}</Text>
                      : null
                  }
                   {
                    Platform.OS=="android"?

                    <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginRight: 5,
                            marginTop:10,
                            marginBottom:5
                          }}
                          onPress={() => this.showMode()}>
                          <TextInput
                            editable={false}
                            style={{
                              flexGrow: 1,
                              borderBottomColor:Colors.primary,
                              borderBottomWidth:1,
                              marginRight: 10,
                            }}
                            placeholderTextColor={Colors.primary}
                            placeholder="Select Date*"
                            value={
                              Moment(this.state.date).format('DD-MM-YYYY') 
                               
                            }
                          />
                          {this.state.show &&
                          (
                           
                            <DateTimePicker
                              testID="dateTimePicker"
                              // style={{width: '100%', backgroundColor: 'white'}} //add this
                              // style={{ height: 55, paddingTop: 10 }}
                              timeZoneOffsetInMinutes={0}
                              value={this.state.date}
                              minimumDate={new Date()}
                              // maximumDate={Moment().add(2, 'month')}
                              mode={this.state.mode}
                              is24Hour={true}
                              display="default"
                              onChange={(event,date)=>this.setState({date:date,show:false})}
                            />
                          )
                          
  }
                        
              
                          <Image
                            source={Images.date_icon}
                            style={{height: 28, width: 32}}
                          />
                        </TouchableOpacity>:
                        <View style={{ flexDirection: 'row',
                        alignItems: 'center',
                        marginRight: 20,
                        marginTop:10,
                        marginBottom:5}}>
                         <TextInput
                            editable={false}
                            style={{
                              flexGrow: 1,
                              borderBottomColor:Colors.primary,
                              borderBottomWidth:1,
                              marginRight: 10,
                            }}
                            placeholderTextColor={Colors.primary}
                            placeholder="Select Date*"
                            value={
                              Moment(this.state.date).format('DD-MM-YYYY') 
                               
                            }
                          />  
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
                        mode="date"
                        is24Hour={true}
                        display="default"
                        onChange={(event,date)=>this.setState({date:date,show:false})}
                        />
                        </View>

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
                    console.log("Errors:", errors.address),
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
                    console.log("Errors:", errors.dockerno),
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
                    console.log("Errors:", errors.company),
                    errors.company && touched.company ?
                      <Text style={{ color: Colors.red, fontSize: 15 }}>{errors.company}</Text>
                      : null
                  }
                  <View style={styles.otpView}>
                    <TextInput
                      placeholder="Courier Executive"
                      placeholderTextColor={Colors.primary}
                      maxLength={50}
                      value={this.state.executive}
                      onChangeText={txt => this.setState({ executive: txt })}
                      style={{ flex: 1, fontSize: 18, color: Colors.primary, marginTop: 20 }}
                    />
                  </View>
                  <View style={styles.otpView}>
                    <TextInput
                      placeholder="Mobile No "
                      placeholderTextColor={Colors.primary}
                      value={values.mob}
                      // onBlur={handleBlur("mob")}
                      onChangeText={(value) => {
                        let num = value.replace(/[- #*;,.+<>N()\{\}\[\]\\\/]/gi, '')
                        setFieldValue("mob", num)
                      }}
                      keyboardType='phone-pad'
                      maxLength={15}
                      style={{ flex: 1, fontSize: 18, color: Colors.primary, marginTop: 20 }}
                    />
                  </View>
                  {
                    console.log("Errors:", errors.mob),
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
                  {this.state.showHideToggle &&
                    <View style={{ justifyContent: 'center', marginTop: 20 }}>
                      <ToggleSwitch
                        isOn={this.state.urgentToggle}
                        onColor="green"
                        offColor={Colors.grayCCC}
                        label="Urgent"
                        labelStyle={{ fontSize: 18, color: Colors.primary, }}
                        size="medium"
                        onToggle={(isOn) => this.switchToggle(isOn)}
                      />
                    </View>
                  }
                  <View style={{ marginTop: 10 }}>
                    <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }} onPress={() => this.setModalVisible(true)}>

                      {/* <Hoshi
                        editable={false}
                        style={{
                          color: Colors.primary,
                          borderBottomWidth: 1,
                          borderBottomColor: Colors.primary, flexGrow: 1, marginRight: 10
                        }}
                        label="Photo"
                        // onBlur={handleBlur("photo")}
                        value={this.state.imagePath} /> */}
                      {/* {console.log("Photo:",this.state.photo)} */}
                      <Image style={{ height: 60, width: "20%", }}
                        source={this.state.photo} />
                      <Image source={IMAGES.camera}
                        style={{ height: 28, width: 32, marginLeft: 10 }}
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
                  >
                    <LinearGradient
                      style={{
                        marginTop: 30,
                        borderRadius: 8,
                        marginLeft: 'auto',
                        marginRight:10,
                      }}
                      colors={[COLORS.primary,
                      COLORS.third]}>
                      <Text style={styles.submitText}> Update </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  </ScrollView>
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
    paddingVertical:Platform.OS=="android"?0:10

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
const sColor = {
  // text:'#FF5733',
  primary: Colors.primary,
  // success:'#FF5733',
  // subText:'#FF5733',
  // searchPlaceholderTextColor: '#FF5733',
  // searchSelectionColor: '#FF5733',
  // itemBackground:'#FF5733',
  // chipColor:'#FF5733',
  // selectToggleTextColor:'#FF5733',
};
const search = {
  confirmText: {
    // color: Colors.primary,
    // backgroundColor:Colors.primary
  },
  // chipText: {
  //     color: '#FF5733',
  //     backgroundColor: '#FF5733',
  //     textDecorationColor: '#FF5733',
  //     textShadowColor: '#FF5733'

  // },
  // itemText: {
  //     color: '#FF5733',
  //     textShadowColor: '#FF5733',
  //     textDecorationColor: '#FF5733',

  // },
  selectedItemText: {
    // color: 'blue',
    backgroundColor: Colors.tempGreen,
  },
  subItemText: {
    // color: '#FF5733',
    // backgroundColor: '#FF5733',
    backgroundColor: Colors.primary,
  },
  confirmText: {
    color: Colors.white,
    textDecorationColor: "#FF5733",
    textShadowColor: "#FF5733",
  },
  item: {
    // backgroundColor:Colors.primary,
    paddingHorizontal: 10,
    textDecorationColor: "#FF5733",
    textShadowColor: "#FF5733",
  },
  subItem: {
    // backgroundColor:Colors.primary,
    paddingHorizontal: 10,
  },
  selectedItem: {
    // backgroundColor: '#FF5733'
  },
  selectedSubItem: {
    // backgroundColor: '#FF5733'
  },
  selectedSubItemText: {
    // backgroundColor:Colors.primary,
    // color: 'blue',
  },

  selectToggleText: {
    // color: '#FF5733',
    fontSize: 15,
  },
  scrollView: { paddingHorizontal: 0 },
};
export default connect(mapStateToProps)(UpdateCourier)