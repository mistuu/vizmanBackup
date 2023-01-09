import React, { Component } from 'react';
import { View, Text, TouchableOpacity, BackHandler, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { COLORS, IMAGES } from '../../../Assets';
import Images from '../../../Assets/Images';
import { mapStateToProps } from '../../../Reducers/ApiClass';
import { axiosAuthGet } from '../../../utility/apiConnection';
import { Header } from '../../CusComponent';

class AllVizRepo extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)

    this.state = {
      inviteUser:false
    };
  }
 async componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    console.log(this.props.LoginDetails.userID);
      let response=await axiosAuthGet("Users/UserCount/"+this.props.LoginDetails.userID)
      console.log(response);
      if(response>0){
        this.setState({inviteUser:true})
      }

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
          <View style={{width: '100%'}}>
          <Header title={'All Reports'} navigation={this.props.navigation} />
        </View>
          <Image source={Images.logo}
                style={{ marginTop:50,alignSelf:'center', tintColor: COLORS.primary,}} />

          <View style={{alignItems:'center',flex:1,justifyContent:'center',marginBottom:90}}>
          <LinearGradient
            style={{ width:"90%",borderRadius:8 }}
            colors={[
              COLORS.primary,
              COLORS.third
            ]}>
            <TouchableOpacity onPress={() =>this.props.navigation.navigate('Reports')} style={{padding:10,flexDirection: 'row', }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.white,textAlign:'center',alignSelf:'center' }}>All Visitors</Text>
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
            <TouchableOpacity onPress={() =>{this.props.navigation.navigate('InvitedVIzRepo')}} style={{padding:10,flexDirection: 'row', }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.white,textAlign:'center',alignSelf:'center' }}>Invited Visitors</Text>
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
            <TouchableOpacity onPress={() =>{this.props.navigation.navigate('DirectVizRepo')}} style={{padding:10,flexDirection: 'row', }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.white,textAlign:'center',alignSelf:'center' }}>Direct Visitor</Text>
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
            <TouchableOpacity onPress={() =>{this.props.navigation.navigate('TimeSpentRepo')}} style={{padding:10,flexDirection: 'row', }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.white,textAlign:'center',alignSelf:'center' }}>Time Spent</Text>
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
            <TouchableOpacity onPress={() =>{this.props.navigation.navigate('AttendRepo')}} style={{padding:10,flexDirection: 'row', }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.white,textAlign:'center',alignSelf:'center' }}>Attendance Master</Text>
              <Image source={Images.right}
                style={{ height: 25,padding:15, width: 22, tintColor: 'white', alignSelf:'flex-end',marginLeft:'auto' }} />
                </TouchableOpacity>
       
          </LinearGradient> */}
          <LinearGradient
            style={{ width:"90%",borderRadius:8,marginTop:30  }}
            colors={[
              COLORS.primary,
              COLORS.third
            ]}>
            <TouchableOpacity onPress={() =>{this.props.navigation.navigate('CourierRepo')}} style={{padding:10,flexDirection: 'row', }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.white,textAlign:'center',alignSelf:'center' }}>Courier</Text>
              <Image source={Images.right}
                style={{ height: 25,padding:15, width: 22, tintColor: 'white', alignSelf:'flex-end',marginLeft:'auto' }} />
                </TouchableOpacity>
       
          </LinearGradient>
        
        
          </View>
      </View>
    );
  }
}
export default connect(mapStateToProps)(AllVizRepo)