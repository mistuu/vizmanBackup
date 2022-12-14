import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  Image,
  StyleSheet,
  TextInput,
} from 'react-native';
import Toast from 'react-native-simple-toast';

import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import {COLORS, IMAGES} from '../../../Assets';
import Images from '../../../Assets/Images';
import { mapStateToProps } from '../../../Reducers/ApiClass';
import { axiosAuthGet, axiosPost } from '../../../utility/apiConnection';

 class EmailSMS extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    this.state = {
      OrgID: null,
      orgTagLine: null,
      orgShortName: null,
      orgFooterNote: null,
      data:null,
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
      orgTagLine: response.orgTagLine,
      orgShortName: response.orgShortName,
      orgFooterNote: response.orgFooterNote,
      data:response
    })
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
  submitData = async () => {
    const state = this.state;
    var params = {
      OrgID: state.OrgID,
      OrgTagLine: state.orgTagLine,
      OrgShortName: state.orgShortName,
      OrgFooterNote: state.orgFooterNote,
      UserId: this.props.LoginDetails.userID,
     
      OrgLogo: state.data.orgLogo,
      OrgName: state.data.orgName,
      OrgAddress:state.data.orgAddress,
      OrgState:state.data.orgState,
      OrgCity:state.data.orgCity,
      OrgPinCode:state.data.orgPinCode,
      GstNo:state.data.gstNo,
      Latitude:state.data.latitude,
      Longitude:state.data.longitude
    };
    console.log(params);
    if (state.OrgID > 0) {
      let response = await axiosPost(
        'VizOrganization/UpdateOrganization',
        params,
      );
      console.log(response);
      if(response==true){
        Toast.show('Update Successfully ');
        this.props.navigation.navigate('SettingScreen');
      }
    }
  };
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
            Email and SMS Setting
          </Text>
        </LinearGradient>
        <View style={{margin: 10, marginTop: 20}}>
          <View>
            <TextInput
              placeholder="Short Name for SMS"
              // placeholderTextColor={COLORS.black}
              maxLength={15}
              value={this.state.orgShortName}
              editable={true}
              onChangeText={txt => this.setState({orgShortName: txt})}
              style={styles.txtView}
            />
          </View>
          <View style={{marginTop: 10}}>
            <TextInput
              placeholder="TagLine"
              // placeholderTextColor={COLORS.black}
              value={this.state.orgTagLine}
              onChangeText={txt => this.setState({orgTagLine: txt})}
              maxLength={50}
              style={styles.txtView}
            />
          </View>
          <View style={{marginTop: 10}}>
            <TextInput
              placeholder="Footer Note for Email "
              // placeholderTextColor={COLORS.black}
              maxLength={50}
              multiline={true}
              // numberOfLines={100}
              value={this.state.orgFooterNote}
              onChangeText={txt => this.setState({orgFooterNote: txt})}
              style={{
                fontSize: 15,
                height: 100,
                textAlignVertical: 'top',
                color: COLORS.black,
                borderWidth: 1,
                borderColor: COLORS.graye3,
                alignItems: 'center',
                backgroundColor: COLORS.white,
                borderRadius: 8,
              }}
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
    backgroundColor: COLORS.white,
    borderRadius: 8,
    // marginTop: 20,
  },
});
export default connect(mapStateToProps)(EmailSMS);