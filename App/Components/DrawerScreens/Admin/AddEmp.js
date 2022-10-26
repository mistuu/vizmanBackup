import React, { Component } from 'react';
import { View, Text, TouchableOpacity, BackHandler, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, IMAGES } from '../../../Assets';
import Images from '../../../Assets/Images';

export default class AddEmp extends Component {
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
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.white, marginLeft: 20, marginTop: 40 }}>Add Employee</Text>
      </LinearGradient>
      <Text> OrgDetails </Text>
    </View>
    );
  }
}
