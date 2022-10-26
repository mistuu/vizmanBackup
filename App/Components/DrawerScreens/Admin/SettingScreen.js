import React, { Component } from 'react';
import { View, Text, TouchableOpacity, BackHandler, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, IMAGES } from '../../../Assets';
import Images from '../../../Assets/Images';

export default class SettingScreen extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)

    this.state = {
    };
  }
  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

  }
  handleBackButtonClick() {
    this.props.navigation.goBack()
    return true;
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);

  }
  render() {
    return (
      <View style={{flex:1, backgroundColor:COLORS.whitef4}}>
          <LinearGradient
            style={{ flexDirection: 'row', width: '100%', height:Platform.OS=='ios'?"16%" :"12%", justifyContent: 'flex-start', alignItems: 'center', borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}
            colors={[
              COLORS.primary,
              COLORS.third
            ]}>
            <TouchableOpacity onPress={() => this.handleBackButtonClick()} style={{padding:10, marginTop: 40, alignItems: 'flex-start', marginLeft: 10 }}>
              <Image source={Images.back}
                style={{ height: 15,padding:10, width: 22, tintColor: 'white', alignSelf: 'center' }} />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.white, marginLeft: 20, marginTop: 40 }}>Set up your account</Text>
          </LinearGradient>
          <Image source={Images.logo}
                style={{ marginTop:50,alignSelf:'center', tintColor: COLORS.primary,}} />

          <View style={{alignItems:'center',flex:1,justifyContent:'center',marginBottom:90}}>
          <LinearGradient
            style={{ width:"90%",borderRadius:8 }}
            colors={[
              COLORS.primary,
              COLORS.third
            ]}>
            <TouchableOpacity onPress={() =>this.props.navigation.navigate('OrgDetails')} style={{padding:10,flexDirection: 'row', }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.white,textAlign:'center',alignSelf:'center' }}>Organization Details</Text>
              <Image source={Images.right}
                style={{ height: 25,padding:15, width: 22, tintColor: 'white', alignSelf:'flex-end',marginLeft:'auto' }} />
                </TouchableOpacity>

          </LinearGradient>
          <LinearGradient
            style={{ width:"90%",borderRadius:8,marginTop:30 }}
            colors={[
              COLORS.primary,
              COLORS.third
            ]}>
            <TouchableOpacity onPress={() =>{this.props.navigation.navigate('FieldSetting')}} style={{padding:10,flexDirection: 'row', }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.white,textAlign:'center',alignSelf:'center' }}>Field Settings</Text>
              <Image source={Images.right}
                style={{ height: 25,padding:15, width: 22, tintColor: 'white', alignSelf:'flex-end',marginLeft:'auto' }} />
                </TouchableOpacity>

          </LinearGradient>
          <LinearGradient
            style={{ width:"90%",borderRadius:8 ,marginTop:30 }}
            colors={[
              COLORS.primary,
              COLORS.third
            ]}>
            <TouchableOpacity onPress={() =>{this.props.navigation.navigate('BadgeTemp')}} style={{padding:10,flexDirection: 'row', }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.white,textAlign:'center',alignSelf:'center' }}>Badge Template</Text>
              <Image source={Images.right}
                style={{ height: 25,padding:15, width: 22, tintColor: 'white', alignSelf:'flex-end',marginLeft:'auto' }} />
                </TouchableOpacity>

          </LinearGradient>
          <LinearGradient
            style={{ width:"90%",borderRadius:8,marginTop:30  }}
            colors={[
              COLORS.primary,
              COLORS.third
            ]}>
            <TouchableOpacity onPress={() =>{this.props.navigation.navigate('EmailSMS')}} style={{padding:10,flexDirection: 'row', }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.white,textAlign:'center',alignSelf:'center' }}>Email and SMS Settings</Text>
              <Image source={Images.right}
                style={{ height: 25,padding:15, width: 22, tintColor: 'white', alignSelf:'flex-end',marginLeft:'auto' }} />
                </TouchableOpacity>

          </LinearGradient>
          {/* <LinearGradient
            style={{ width:"90%",borderRadius:8,marginTop:30  }}
            colors={[
              COLORS.primary,
              COLORS.third
            ]}>
            <TouchableOpacity onPress={() =>{this.props.navigation.navigate('AddEmp')}} style={{padding:10,flexDirection: 'row', }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.white,textAlign:'center',alignSelf:'center' }}>Add Employee</Text>
              <Image source={Images.right}
                style={{ height: 25,padding:15, width: 22, tintColor: 'white', alignSelf:'flex-end',marginLeft:'auto' }} />
                </TouchableOpacity>

          </LinearGradient> */}
          </View>
      </View>
    );
  }
}
