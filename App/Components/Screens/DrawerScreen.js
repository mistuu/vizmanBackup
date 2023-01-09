import {
  createDrawerNavigator,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import React, {Component} from 'react';
import {
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import {AppChangePassword, StatusBarBackground} from '.';
import {COLORS} from '../../Assets/index.js';
import {mapDispatchToProps, mapStateToProps} from '../../Reducers/ApiClass.js';
import {IMAGEURL} from '../../utility/util';
import {
  Courier,
  EmployDashboard,
  EmployReport,
  Gatekeepar,
  Visitors,
} from '../DrawerScreens';
import ToggleSwitch from 'toggle-switch-react-native';

import AdminDash from '../DrawerScreens/AdminDash';
import AdminDashBoardMain from '../DrawerScreens/AdminDashBoardMain';
import AdminEmp from '../DrawerScreens/AdminEmp';
import BuildingGateKeeper from '../DrawerScreens/BuildingGatekeepr/BuildingGateKeeper';
import VisitorListGatekeeper from '../DrawerScreens/BuildingGatekeepr/VisitorListGatekeeper';
import AdminEmployee from '../DrawerScreens/Admin/AdminEmployee'
import AdminVisitor from '../DrawerScreens/Admin/AdminVisitor'
import SettingScreen from '../DrawerScreens/Admin/SettingScreen'
import AdminVizScreen from '../DrawerScreens/Admin/AdminVizScreen';
import AdminViz from '../DrawerScreens/Admin/AdminViz';
import Reports from '../DrawerScreens/Reports/Reports';
import PendingInvitesScreen from '../DrawerScreens/PendingInvitesScreen';
import { axiosAuthGet } from '../../utility/apiConnection';
import AllVizRepo from '../DrawerScreens/Reports/AllVizRepo';
import AsyncStorage from '@react-native-async-storage/async-storage';


var PushNotification = require('react-native-push-notification');

const Drawer = createDrawerNavigator();

const colors = [COLORS.primary, COLORS.third];

class DrawerScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialScreen: 'Dashboard',
      userRoleId: 2,
      modalVisible: false,
      screen: 1,
      unReadNotification: 0,
      // title:'',
      label:"Admin",
      adminSwitch: false,
      title: 'Dashboard',
      tabArray: [
        {
          tintColor: COLORS.black,
          isSelected: true,
          title: 'Dashboard',
          screen: 1,
          backgroundColor: COLORS.primary,
        },
        {
          tintColor: COLORS.white,
          isSelected: false,
          title: 'Visitor',
          screen: 2,
          backgroundColor: 'transparent',
        },
        {
          tintColor: COLORS.white,
          isSelected: false,
          title: 'Change Password',
          screen: 3,
          backgroundColor: 'transparent',
        },
      ],
      
    };
  }
 async componentDidMount() {
    
  }
  // componentDidUpdate(prevProps) {
  //   if (this.props.AdminSwitch !== prevProps.AdminSwitch) {
  //     console.log('hthis.props.AdminSwitc', this.props.AdminSwitch);

  //     this.setState({AdminSwitch: this.props.AdminSwitch});
  //   }
  // }
  profile(props) {
    props.navigation.closeDrawer();
    props.navigation.navigate('Profile');
  }
  switchToggle(toggle) {
    console.log(toggle);
    this.setState({adminSwitch: toggle,label:toggle?"Employee":"Admin"});
    this.props.adminSwitch(toggle);

    // if (toggle == true) {

    //   Toast.show("Switch To Employee")
    // } else {
    //   // this.props.adminSwitch(toggle);

    //   Toast.show("Switch To Admin")
    // }
  }
  Logout=async()=>{
    
    try {
      let response=await axiosAuthGet("Notification/SaveNotifyToken/"+this.props.LoginDetails.empID+"/"+global.token+"007")
      console.log("response==",response);
      await AsyncStorage.clear()
              this.props.LogOut();
              props.navigation.replace('LoginScreen');
    } catch (error) {
      
    }
  }
  CustomDrawerContent = props => {
    global.props = props;
    if (this.props.LoginDetails != null && this.props.UserDetails != null) {
      var name = '';
      if (this.props.UserDetails?.fullName != '') {
        name = this.props.UserDetails?.fullName;
      }
      var s = '';
      if (this.props.UserDetails?.photoUrl != null) {
        s = this.props.UserDetails?.photoUrl.split('/');
      }

      var t;
      if (s[1] == 'ImageFiles') {
        t = IMAGEURL + this.props.UserDetails?.photoUrl;
      } else {
        t = this.props.UserDetails?.photoUrl;
      }
    }

    return (
      <LinearGradient
        style={{
          height: '100%',
          width: 200,
          paddingTop: 20,
        }}
        colors={colors}>
        <ScrollView style={{flex: 1}}>
          {this.props.LoginDetails?.userRoleId != 6 ? (
            <View
              style={{
                height: 100,
                width: 180,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}>
              {this.props.LoginDetails?.photoURL == null ? (
                <Image
                  source={IMAGES.logo}
                  style={{
                    resizeMode: 'contain',
                    height: 22,
                    width: 180,
                    bottom: 2,
                  }}
                />
              ) : (
                <Image
                  source={{uri: IMAGEURL + this.props.LoginDetails?.photoURL}}
                  style={{
                    resizeMode: 'contain',
                    height: 60,
                    width: 150,
                    bottom: 2,
                  }}
                />
              )}
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  height: 1,
                  width: 120,
                }}
                colors={['#ffffff00', '#828284', '#ffffff00']}
              />
            </View>
          ) : (
            <View
              style={{
                height: 100,
                width: 180,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}></View>
          )}
          <TouchableOpacity
            onPress={() => this.profile(props)}
            style={{
              height: 80,
              width: null,
              marginLeft: 15,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {console.log('Profile====', t)}
            {t == null || t == '' ? (
              <Image
                source={IMAGES.employe}
                style={{
                  resizeMode: 'cover',
                  borderRadius: 40 / 2,
                  height: 40,
                  width: 40,
                  margin: 5,
                  alignSelf: 'center',
                }}
              />
            ) : Platform.OS == 'ios' ? (
              <Image
                source={{uri: t}}
                style={{
                  resizeMode: 'cover',
                  borderRadius: 40 / 2,
                  height: 40,
                  width: 40,
                  margin: 5,
                  alignSelf: 'center',
                }}
              />
            ) : (
              <Image
                source={{uri: t}}
                style={{
                  resizeMode: 'cover',
                  borderRadius: 40 / 2,
                  height: 40,
                  width: 40,
                  margin: 5,
                  alignSelf: 'center',
                }}
              />
            )}
            <View
              style={{flexDirection: 'column', margin: 5,marginTop:20, alignSelf: 'center'}}>
              <Text
                style={{
                  color: COLORS.white,
                  fontWeight: 'bold',
                  fontSize: 20,
                  width: 120,
                }}>
                {name}
                {/* {this.props.LoginDetails?.userRoleId == 2 ? "Gatekeeper" : this.props.LoginDetails?.userRoleId == 3 ? "Receptionist" : "Employee"} */}
              </Text>
              {this.props.UserDetails?.designation != null &&
              this.props.UserDetails?.designation != '' ? (
                <Text style={{textAlign: 'justify', color: COLORS.white}}>
                  {this.props.UserDetails?.designation}
                </Text>
              ) : null}
          {this.props.LoginDetails.userRoleId == 1 && (
              <View style={{ flexDirection: 'column', margin: 5,marginRight:20,marginBottom:30, alignSelf: 'center'}}>
                <ToggleSwitch
                  isOn={this.state.adminSwitch}
                  onColor="green"
                  offColor={COLORS.grayCCC}
                  label={this.state.label}
                  labelStyle={{fontSize: 15, color: COLORS.white}}
                  size="medium"
                  onToggle={isOn => this.switchToggle(isOn)}
                />
              </View>
            )}
            </View>
          </TouchableOpacity>
          <DrawerItemList
            {...props}
            itemStyle={{borderColor: 'black', borderTopWidth: 1, padding: -2,marginTop:10}}
            activeTintColor="#676767"
            activeBackgroundColor="rgba(52, 52, 52, 0.2)"
            inactiveTintColor="rgba(0, 0, 0, .87)"
            inactiveBackgroundColor="transparent"
            style={{backgroundColor: COLORS.black}}
            labelStyle={{color: COLORS.white, width: 150}}
          />
          <DrawerItem
            label="Logout"
            onPress={() => {
              this.Logout()
            }}
            style={{borderColor: 'black', borderTopWidth: 1, padding: -2}}
            labelStyle={{color: COLORS.white, width: 150}}
          />
        </ScrollView>
      </LinearGradient>
    );
  };
  dashboard = ({navigation}) => {
    // console.log("Admin Switchsss===",this.state.AdminSwitch)

    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: COLORS.whitef2,
        }}>
        {this.props.LoginDetails?.userRoleId == 4 ? (
          <View style={{height: '100%', width: '100%'}}>
            <EmployDashboard navigation={navigation} />
          </View>
        ) : (
          <View style={{height: '100%', width: '100%'}}>
            {this.props.LoginDetails?.userRoleId == 3 ? (
              <Visitors navigation={navigation} />
            ) : this.props.LoginDetails?.userRoleId == 2 ? (
              <Gatekeepar navigation={navigation} />
            ) : (
              // <BuildingGateKeeper navigation={navigation} />

              <BuildingGateKeeper navigation={navigation} />
            )}
          </View>
        )}
      </View>
    );
  };
  BuildingGateKeeperdashboard = ({navigation}) => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: COLORS.whitef2,
        }}>
        {this.props.LoginDetails?.userRoleId == 6 ? (
          <View style={{height: '100%', width: '100%'}}>
            <BuildingGateKeeper navigation={navigation} />
          </View>
        ) : null}
      </View>
    );
  };
  courier = ({navigation}) => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: COLORS.whitef2,
        }}>
        <View style={{height: '100%', width: '100%'}}>
          <Courier navigation={navigation} />
        </View>
      </View>
    );
  };
  visitors = ({navigation}) => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: COLORS.whitef2,
        }}>
        <View style={{height: '100%', width: '100%'}}>
          <Visitors navigation={navigation} />
        </View>
      </View>
    );
  };
  visitorsListGatekeeper = ({navigation}) => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: COLORS.whitef2,
        }}>
        <View style={{height: '100%', width: '100%'}}>
          <VisitorListGatekeeper navigation={navigation} />
        </View>
      </View>
    );
  };
  AppChangePassword = ({navigation}) => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: COLORS.whitef2,
        }}>
        <View style={{height: '100%', width: '100%'}}>
          <AppChangePassword navigation={navigation} />
        </View>
      </View>
    );
  };
  EmployReport = ({navigation}) => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: COLORS.whitef2,
        }}>
        <View style={{height: '100%', width: '100%'}}>
          <EmployReport navigation={navigation} />
        </View>
      </View>
    );
  };
  adminEmployee = ({navigation}) => {
    return  (
      <View style={{height: '100%', width: '100%'}}>
        <AdminEmployee navigation={navigation} />
      </View>
    )
  };
  adminVisitor = ({navigation}) => {
    return  (
      <View style={{height: '100%', width: '100%'}}>
        <AdminViz navigation={navigation} />
      </View>
    )
  };
  adminScreen = ({navigation}) => {
    return  (
      <View style={{height: '100%', width: '100%'}}>
        {/* <AdminTab navigation={navigation} /> */}
        <AdminDash navigation={navigation} />
      </View>
    )
  };
  adminEmpScreen=({navigation})=>{
    return(
      <View style={{height: '100%', width: '100%'}}>
        <EmployDashboard navigation={navigation} />
      </View>
    )
  }
  SettingScreen=({navigation})=>{
    return(
      <View style={{height: '100%', width: '100%'}}>
        <SettingScreen navigation={navigation} />
      </View>
    )
  }
  ReportsScreen=({navigation})=>{
    return(
      <View style={{height: '100%', width: '100%'}}>
        <AllVizRepo navigation={navigation} />
      </View>
    )
  }
  InviteScreen=({navigation})=>{
    return(
      <View style={{height: '100%', width: '100%'}}>
        <PendingInvitesScreen navigation={navigation} />
      </View>
    )
  }
  render() {

    console.log("IN Log",this.state.adminSwitch);

    const{adminSwitch}=this.props

    return (
      <View style={{flex: 1, backgroundColor: 'green'}}>
        <StatusBarBackground style={{backgroundColor: COLORS.primary}} />
        <Drawer.Navigator
          drawerStyle={{
            width: 200,
          }}
          backBehavior="initialRoute"
          initialRouteName="Dashboard"
          drawerContent={props => this.CustomDrawerContent(props)}>
          {this.props.LoginDetails?.userRoleId != 1 ?
          (
            <Drawer.Screen name="Dashboard" component={this.dashboard} />
          ) : !this.state.adminSwitch?(
            <Drawer.Screen name="Dashboard" component={this.adminScreen} />
          ):
          <Drawer.Screen name="Dashboard" component={this.adminEmpScreen} />

          }

            {!this.state.adminSwitch && this.props.LoginDetails?.userRoleId == 1 &&<Drawer.Screen name="User" component={this.adminEmployee} />}
            {!this.state.adminSwitch && this.props.LoginDetails?.userRoleId == 1 &&<Drawer.Screen name="Visitor" component={this.adminVisitor} />}
            
            {
          this.state.adminSwitch && this.props.LoginDetails?.userRoleId == 1 && (

            <Drawer.Screen name="Visitors" component={this.visitors} />

          )}

          {
           (this.props.LoginDetails?.userRoleId == 4 ||
          this.props.LoginDetails?.userRoleId == 2) && (

            <Drawer.Screen name="Visitors" component={this.visitors} />

          )}
          {
            this.props.LoginDetails?.isApprover==true &&
            <Drawer.Screen name="Pending Invites" component={this.InviteScreen} />
          }
          {/* {this.props.LoginDetails?.userRoleId == 6 ?  <Drawer.Screen name="BuldingGateKeeper" component={this.BuildingGateKeeperdashboard} /> : null } */}
          { this.props.LoginDetails?.userRoleId == 6 ? (
            <Drawer.Screen
              name="Visitor List"
              component={this.visitorsListGatekeeper}
            />
          ) : null}

          { this.props.LoginDetails?.userRoleId != 6 ? (
            <Drawer.Screen name="Courier" component={this.courier} />
          ) : null}
          {
            !this.state.adminSwitch && this.props.LoginDetails.userRoleId == 1 &&
            <Drawer.Screen name="Setting" component={this.SettingScreen} />

          }
            {
          !this.state.adminSwitch && this.props.LoginDetails?.userRoleId == 1 && (

            <Drawer.Screen name="All Reports" component={this.ReportsScreen} />

          )}
          {this.props.LoginDetails?.userRoleId == 4 
           ? (
            <Drawer.Screen name="Report" component={this.EmployReport} />
          ) :this.state.adminSwitch && this.props.LoginDetails?.userRoleId == 1 &&
          <Drawer.Screen name="Report" component={this.EmployReport} />
          
          }

          <Drawer.Screen
            name="Change Password"
            component={this.AppChangePassword}
          />
        </Drawer.Navigator>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawerScreen);
