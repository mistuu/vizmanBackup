import React, {Component} from 'react';
import {ScrollView} from 'react-native';
import {View, Text, TouchableOpacity, BackHandler, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import {COLORS, IMAGES} from '../../../Assets';
import Colors from '../../../Assets/Colors';
import Images from '../../../Assets/Images';
import {mapStateToProps} from '../../../Reducers/ApiClass';
import {axiosAuthGet, axiosPost} from '../../../utility/apiConnection';
import Toast from 'react-native-simple-toast';

class BadgeTemp extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    this.state = {
      data: [
        {img: Images.Temp4, id: 0},
        {img: Images.Temp1, id: 1},
        {img: Images.Temp2, id: 2},
        {img: Images.Temp3, id: 3},
      ],
      img1SH: false,
      img2SH: false,
      img3SH: false,
      img4SH: false,
      enable: false,
      data: null,
      templateId: 4,
    };
  }
  componentDidMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
    this.getData();
  }
  getData = async () => {
    let respo = await axiosAuthGet(
      'Settings/GetAllSettings/' + this.props.LoginDetails.userID,
    );
    console.log(respo);
    var sett = respo.settingsVM;
    this.setState({
      // address: sett.vAddress,
      // vaccination: sett.vArogya,
      // Company: sett.vCompany,
      // Department: sett.vDepartment,
      // Designation: sett.vDesignation,
      // Email: sett.vEmail,
      // idProof: sett.vIdProof,
      // photo: sett.vPhotoProof,
      // purpose: sett.vPurpose,
      // temprature: sett.vtemprature,
      // settingsID:sett.settingsID,
      // userId:sett.userId,
      // orgId:sett.orgId,
      templateId: sett.templateId,
      data: sett,
    });
    if (sett.templateId == 4) {
      this.setState({img4SH: true});
    } else if (sett.templateId == 1) {
      this.setState({img1SH: true});
    } else if (sett.templateId == 2) {
      this.setState({img2SH: true});
    } else if (sett.templateId == 3) {
      this.setState({img3SH: true});
    }
  };
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
  submitData = async() => {
    // const data = this.state.data;
    // var params = {
    //   settingsVM: {
    //     SettingsID: data.settingsID,
    //     UserId: data.userId,
    //     OrgId: data.orgId,
    //     VAddress: data.vAddress,
    //     VCompany: data.vCompany,
    //     VDesignation: data.vDesignation,
    //     VEmail: data.vEmail,
    //     VIdProof: data.vIdProof,
    //     VPhotoProof: data.vPhotoProof,
    //     VDepartment: data.vDepartment,
    //     VPurpose: data.vPurpose,
    //     Vtemprature: data.vtemprature,
    //     VArogya: data.vArogya,
    //     templateId: this.state.templateId,
    //   },
    // };

    // console.log(params);

    let response=await axiosAuthGet("Settings/UpdateTemplate/"+this.state.templateId+"/"+this.props.LoginDetails.userID)
    console.log(response);
    if(response==true){
      Toast.show("Update Successfully ")
      this.props.navigation.navigate("SettingScreen")

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
            Badge Template
          </Text>
        </LinearGradient>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 50,
          }}>
          <LinearGradient
            style={{borderRadius: 5}}
            colors={[
              this.state.img1SH ? COLORS.primary : COLORS.white,
              this.state.img1SH ? COLORS.third : Colors.white,
            ]}>
            <TouchableOpacity
              onPress={() =>
                this.setState({
                  templateId: 1,
                  enable: true,
                  img1SH: true,
                  img2SH: false,
                  img3SH: false,
                  img4SH: false,
                })
              }
              style={{}}>
              <Text
                style={{
                  color: this.state.img1SH ? COLORS.white : COLORS.graye00,
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 5,
                  paddingBottom: 5,
                }}>
                Temp1
              </Text>
            </TouchableOpacity>
          </LinearGradient>
          <LinearGradient
            style={{borderRadius: 5, marginLeft: 10}}
            colors={[
              this.state.img2SH ? COLORS.primary : COLORS.white,
              this.state.img2SH ? COLORS.third : COLORS.white,
            ]}>
            <TouchableOpacity
              onPress={() =>
                this.setState({
                  templateId: 2,
                  img1SH: false,
                  img2SH: true,
                  img3SH: false,
                  img4SH: false,
                })
              }
              style={{}}>
              <Text
                style={{
                  color: this.state.img2SH ? COLORS.white : COLORS.graye00,
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 5,
                  paddingBottom: 5,
                }}>
                Temp2
              </Text>
            </TouchableOpacity>
          </LinearGradient>
          <LinearGradient
            style={{borderRadius: 5, marginLeft: 10}}
            colors={[
              this.state.img3SH ? COLORS.primary : Colors.white,
              this.state.img3SH ? COLORS.third : Colors.white,
            ]}>
            <TouchableOpacity
              onPress={() =>
                this.setState({
                  templateId: 3,
                  img1SH: false,
                  img2SH: false,
                  img3SH: true,
                  img4SH: false,
                })
              }
              style={{}}>
              <Text
                style={{
                  color: this.state.img3SH ? COLORS.white : Colors.graye00,
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 5,
                  paddingBottom: 5,
                }}>
                Temp3
              </Text>
            </TouchableOpacity>
          </LinearGradient>
          <LinearGradient
            style={{borderRadius: 5, marginLeft: 10}}
            colors={[
              this.state.img4SH ? COLORS.primary : Colors.white,
              this.state.img4SH ? COLORS.third : Colors.white,
            ]}>
            <TouchableOpacity
              onPress={() =>
                this.setState({
                  templateId: 4,
                  img1SH: false,
                  img2SH: false,
                  img3SH: false,
                  img4SH: true,
                })
              }
              style={{}}>
              <Text
                style={{
                  color: this.state.img4SH ? COLORS.white : Colors.graye00,
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 5,
                  paddingBottom: 5,
                }}>
                Temp4
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
        <ScrollView>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 100,
            }}>
            {this.state.img1SH && <Image source={Images.Temp1} />}
            {this.state.img2SH && <Image source={Images.Temp2} />}
            {this.state.img3SH && <Image source={Images.Temp3} />}
            {this.state.img4SH && <Image source={Images.Temp4} />}
          </View>
          <TouchableOpacity
            onPress={() => {
              this.submitData();
            }}
            style={{
              borderRadius: 8,
              marginTop: 30,
              marginLeft: 'auto',
              marginRight: 10,
             
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
                  fontSize: 15,
                  fontWeight: 'bold',
                  color: COLORS.white,
                  textAlign: 'center',
                  alignSelf: 'center',
                }}>
                Select
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}
export default connect(mapStateToProps)(BadgeTemp);
