import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  Image,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, IMAGES} from '../../../Assets';
import Colors from '../../../Assets/Colors';
import Images from '../../../Assets/Images';
import {PermissionsAndroid} from 'react-native';
import ImageResizer from 'react-native-image-resizer';
import ImgToBase64 from 'react-native-image-base64';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { axiosAuthGet, axiosPost } from '../../../utility/apiConnection';
import { connect } from 'react-redux';
import { mapStateToProps } from '../../../Reducers/ApiClass';
import Toast from 'react-native-simple-toast';
import {IMAGEURL} from '../../../utility/util'
import Geolocation from '@react-native-community/geolocation';

class OrgDetails extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    this.state = {
      img: Images.cameraimg,
      OrgLogo: null,
      OrgID: 0,
      OrgName: null,
      OrgAddress: null,
      OrgState: null,
      OrgCity: null,
      OrgPinCode: null,
      OrgCountry: null,
      OrgTagLine: null,
      OrgFooterNote: null,
      OrgShortName: null,
      UserId: null,
      PhotoUrlBase: null,
      GstNo: null,
      data:null,
      currentLongitude:null,
      currentLatitude:null,
    };
  }
  componentDidMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
    this.getCompanyData()
  }
  getCompanyData=async()=>{
    let response=await axiosAuthGet("VizOrganization/GetCompanyById/"+this.props.LoginDetails.userID)
    console.log(response); 
    this.setState({
      OrgID: response.orgID,
      OrgName: response.orgName,
      OrgAddress:response.orgAddress,
      OrgState:response.orgState,
      OrgCity:response.orgCity,
      OrgPinCode:response.orgPinCode,
      OrgShortName:response.orgShortName,
      UserId:this.props.LoginDetails.userId,
      GstNo:response.gstNo,
      currentLatitude:response.latitude,
      currentLongitude:response.longitude,
      data:response
    })
    if(response.orgLogo!=null){
      this.setState({OrgLogo: response.orgLogo,img:{uri:IMAGEURL+ response.orgLogo}}) 
      
    }
  }
  handleBackButtonClick() {
    this.props.navigation.goBack();
    return true;
  }
  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }
  chooseFileGallary = () => {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        this.setState({modalVisible: false});
      } else {
        response = response.assets;
        response = Object.assign({}, ...response);
        console.log(response);

        this.setState({imageBase64StringPhotoProof: response});
        ImgToBase64.getBase64String(response.uri)
          .then(base64String => {
            this.setState({
              OrgLogo: response.fileName + ',' + base64String,
              img: {uri: 'data:' + response.type + ';base64,' + base64String},
            });
          })
          .catch();
      }
    });
  };
  submitData=async()=>{
    const state=this.state
   var  params={
      OrgLogo: state.OrgLogo,
      OrgID: state.OrgID,
      OrgName: state.OrgName,
      OrgAddress:state.OrgAddress,
      OrgState:state.OrgState,
      OrgCity:state.OrgCity,
      OrgPinCode:state.OrgPinCode,
      OrgShortName:state.OrgName.substring(0,15),
      UserId:this.props.LoginDetails.userID,
      GstNo:state.GstNo,
      OrgTagLine: state.data.orgTagLine,
      OrgShortName: state.data.orgShortName,
      OrgFooterNote: state.data.orgFooterNote,
      Latitude:state.currentLatitude,
      Longitude:state.currentLongitude

    }
    console.log(params);
    if(state.OrgID>0){
      let response=await axiosPost("VizOrganization/UpdateOrganization",params)
      console.log(response);
      Toast.show("Update Successfully ")
      this.props.navigation.navigate("SettingScreen")

     
    }
    else{
      let response=await axiosPost("VizOrganization/SaveOrganization",params)
      Toast.show("Successfully Add")
      this.props.navigation.navigate("SettingScreen")
      console.log(response);
      


    }
  }
  getLocation=()=>{
    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        // setLocationStatus('You are Here');
 
        //getting the Longitude from the location json
        const currentLongitude = 
          JSON.stringify(position.coords.longitude);
 
        //getting the Latitude from the location json
        const currentLatitude = 
          JSON.stringify(position.coords.latitude);
    
          this.setState({currentLongitude:currentLongitude,currentLatitude:currentLatitude})
            }      )
  }
  render() {
    return (
      <View style={{flex: 1, backgroundColor: COLORS.whitef4}}>
        <LinearGradient
          style={{
            flexDirection: 'row',
            width: '100%',
            height: Platform.OS == 'ios' ? '16%' : '12%',
            justifyContent: 'flex-start',
            alignItems: 'center',
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          }}
          colors={[COLORS.primary, COLORS.third]}>
          <TouchableOpacity
            onPress={() => this.handleBackButtonClick()}
            style={{
              padding: 10,
              marginTop: 40,
              alignItems: 'flex-start',
              marginLeft: 10,
            }}>
            <Image
              source={Images.back}
              style={{
                height: 15,
                padding: 10,
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
              color: COLORS.white,
              marginLeft: 20,
              marginTop: 40,
            }}>
            Organization Details
          </Text>
        </LinearGradient>
        <ScrollView>
          <View style={{margin: 10, marginTop: 20}}>
            <View>
              <TextInput
                placeholder="org. Name"
                // placeholderTextColor={COLORS.black}
                value={this.state.OrgName}
                onChangeText={txt=>this.setState({OrgName:txt})}
                maxLength={50}
                style={styles.txtView}
              />
            </View>
            <View style={{marginTop: 10}}>
              <TextInput
                placeholder="GSTIN"
                // placeholderTextColor={COLORS.black}
                maxLength={50}
                value={this.state.GstNo}
                onChangeText={txt=>this.setState({GstNo:txt})}
                style={styles.txtView}
              />
            </View>
            <View style={{marginTop: 10}}>
              <TextInput
                placeholder="Address"
                // placeholderTextColor={COLORS.black}
                maxLength={50}
                multiline={true}
                // numberOfLines={100}
                value={this.state.OrgAddress}
                onChangeText={txt=>this.setState({OrgAddress:txt})}
                style={{
                  fontSize: 15,
                  height: 100,
                  textAlignVertical: 'top',
                  color: COLORS.black,
                  borderWidth: 1,
                  borderColor: COLORS.graye3,
                  alignItems: 'center',
                  backgroundColor: Colors.white,
                  borderRadius: 8,
                }}
              />
            </View>
            <View style={{marginTop: 10}}>
              <TextInput
                placeholder="Pin/Zip Code"
                // placeholderTextColor={COLORS.black}
                maxLength={50}
                value={this.state.OrgPinCode}
                onChangeText={txt=>this.setState({OrgPinCode:txt})}
                style={styles.txtView}
              />
            </View>
            <View style={{marginTop: 10}}>
              <TextInput
                placeholder="City"
                // placeholderTextColor={COLORS.black}
                maxLength={50}
                value={this.state.OrgCity}
                onChangeText={txt=>this.setState({OrgCity:txt})}
                style={styles.txtView}
              />
            </View>
            <View style={{marginTop: 10}}>
              <TextInput
                placeholder="State"
                // placeholderTextColor={COLORS.black}
                maxLength={50}
                value={this.state.OrgState}
                onChangeText={txt=>this.setState({OrgState:txt})}
                style={styles.txtView}
              />
            </View>
            {/* <View style={{marginTop: 10}}>
              <TextInput
                placeholder="Choose File"
                // placeholderTextColor={COLORS.black}
                maxLength={50}
                value={values.from}
                onChangeText={handleChange("from")}
                style={styles.txtView}
              />
            </View> */}
            <TouchableOpacity onPress={() => this.chooseFileGallary()}>
              <Image
                source={this.state.img}
                style={{height: 70, width: 100,resizeMode:'contain', marginTop: 10}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {this.getLocation()}}
              style={{
                borderRadius: 8,
                marginTop: 30,
                marginLeft: 'auto',
                marginRight: 10,
                // width: '50%',
                alignItems: 'center',
                padding: 10,
              }}>
              <LinearGradient
                style={{
                  paddingLeft: 25,
                  paddingRight: 25,
                  paddingTop: 7,
                  borderRadius: 8,
                  paddingBottom: 7,
                }}
                colors={[COLORS.primary, COLORS.third]}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: COLORS.white,
                    textAlign: 'center',
                    alignSelf: 'center',
                  }}>
                  Get Location
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <View style={{marginTop: 10}}>
              <TextInput
                placeholder="Latitude"
                // placeholderTextColor={COLORS.black}
                maxLength={50}
                editable={false}
                value={this.state.currentLatitude}
                onChangeText={txt=>this.setState({currentLatitude:txt})}
                style={styles.txtView}
              />
            </View>
            <View style={{marginTop: 10}}>
              <TextInput
                placeholder="Longitude"
                // placeholderTextColor={COLORS.black}
                editable={false}
                maxLength={50}
                value={this.state.currentLongitude}
                onChangeText={txt=>this.setState({currentLongitude:txt})}
                style={styles.txtView}
              />
            </View>
            
            <TouchableOpacity
              onPress={() => {this.submitData()}}
              style={{
                borderRadius: 8,
                marginTop: 30,
                marginLeft: 'auto',
                marginRight: 10,
                // width: '30%',
                alignItems: 'center',
                padding: 10,
              }}>
              <LinearGradient
                style={{
                  paddingLeft: 25,
                  paddingRight: 25,
                  paddingTop: 7,
                  borderRadius: 8,
                  paddingBottom: 7,
                }}
                colors={[COLORS.primary, COLORS.third]}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: COLORS.white,
                    textAlign: 'center',
                    alignSelf: 'center',
                  }}>
                  Next
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  txtView: {
    fontSize: 15,
    paddingLeft: 5,
    color: COLORS.black,
    borderWidth: 1,
    height:50,
    borderColor: COLORS.graye3,
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    // marginTop: 20,
  },
});
export default connect(mapStateToProps)(OrgDetails);