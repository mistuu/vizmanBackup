import Moment from 'moment';
import React from 'react';
import {
  FlatList,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import { NavigationActions } from 'react-navigation';
import {connect} from 'react-redux';
import {COLORS, IMAGES} from '../../Assets';
import {mapDispatchToProps, mapStateToProps} from '../../Reducers/ApiClass';
import {axPost} from '../../utility/apiConnection';

const colors = [COLORS.primary, COLORS.third];
class NotificationScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      unReadNotification: 0,
      isRefreshing: false,
      bgColor: COLORS.white,
    };
  }

  componentDidMount() {
    this.props.NotificationsListByuser(
      this.props.LoginDetails.empID,
      this.props.LoginDetails.userRoleId,
    );
  }
    succeessNotification = respp => this.afterSucceessNotification(respp);

  succeesReadSingle = () =>
    this.props.NotificationsListByuser(
      this.props.LoginDetails.empID,
      this.props.LoginDetails.userRoleId,
    );
  redirectMethod = (txt,id) => {
    this.props.ReadSingleMsg(id, this.succeesReadSingle);
    // if (txt.includes('courier')) {
    //   props.navigation.navigate('Courier');
    //   // this.props.ReadSingleMsg(id, this.succeesReadSingle);
    // } else {
    //   // props.navigation.closeDrawer()
    //   props.navigation.navigate('Visitors');

    //   // this.props.ReadSingleMsg(id, this.succeesReadSingle);
    // }
  };
  readAllMethod = async () => {
    // this.props.NotificationsListByuser(this.props.LoginDetails.empID, this.props.LoginDetails.userRoleId)
    // console.log('Login User Id:=', this.props.LoginDetails.empID);
    try {
      let response = await axPost(
        'Notification/ReadAllMsg/' + this.props.LoginDetails.empID,
      );
      this.props.NotificationsListByuser(
        this.props.LoginDetails.empID,
        this.props.LoginDetails.userRoleId,
      );

      // console.log('read All Message Response:-', response);
    } catch (error) {}
  };

  onRefresh() {
    this.setState({isRefreshing: true});

    this.props.NotificationsListByuser(
      this.props.LoginDetails.empID,
      this.props.LoginDetails.userRoleId,
    );
    setTimeout(() => {
      this.setState({isRefreshing: false});
    }, 3000);
  }
  render() {
    return (
      <View style={{flex: 1, backgroundColor: COLORS.whitef4}}>
        <LinearGradient
          style={{
            height: Platform.OS == 'ios' ? '12%' : '10%',
            paddingTop: 25,
            width: '100%',
            justifyContent: 'center',
            // justifyContent: 'center'
          }}
          colors={colors}>
          <StatusBar
            barStyle={'dark-content'}
            backgroundColor="transparent"
            translucent={true}
          />
          <View
            style={{
              flexDirection: 'row',
              marginTop: Platform.OS == 'ios' ? 17 : 5,
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                height: 30,
                width: 30,
                padding: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => this.props.navigation.goBack()}>
              <Image
                source={IMAGES.back}
                style={{height: 22, width: 22, left: 10}}
              />
            </TouchableOpacity>
            <View style={{paddingLeft: 20}}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  padding: 5,
                  fontSize: 22,
                }}>
                Notification
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => this.readAllMethod()}
              style={{
                alignItems: 'center',
                marginTop: 5,
                marginLeft: 'auto',
                marginRight: 5,
              }}>
              <View
                style={{
                  paddingTop: 5,
                  paddingBottom: 5,
                  paddingLeft: 10,
                  paddingRight: 10,
                  backgroundColor: COLORS.primary,
                  borderRadius: 8,
                }}>
                <Text
                  style={{color: 'white', textAlign: 'right', fontSize: 15}}>
                  Read all
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>
        <View style={{height: '93%', width: '100%', backgroundColor: 'white'}}>
          {/* <TouchableOpacity>
                        <View style={{ width: '100%', paddingLeft: 20 }}>
                            <Text style={{ color: "black", marginRight: 5, textAlign: "right", padding: 5, fontSize: 18 }}>Mark as all Read</Text>
                        </View>
                    </TouchableOpacity> */}
          {/* {this.state.notificationlist != null ? this.state.notificationlist.length != 0 ?  */}
          <FlatList
            style={{flexGrow: 1}}
            contentContainerStyle={{flexGrow: 1}}
            data={this.props.NotificationList}
            ref={r => (this.refs = r)}
            refreshing={this.state.isRefreshing}
            onRefresh={() => this.onRefresh()}
            // onRefresh={() => this.onRefresh.bind(this)}
            renderItem={({item, key}) => {
              return (
                <TouchableOpacity
                  onPress={() => this.redirectMethod(item.notifText,item.notifID)}
                  style={{
                    width: '100%',
                    backgroundColor: item.isRead ? 'white' : '#D3D3D3',
                    elevation: 5,
                    borderBottomWidth: 1,
                    padding: 10,
                  }}>
                  <View style={{flexDirection: 'row', flex: 1}}>
                    <Image
                      source={IMAGES.noti}
                      style={{
                        alignSelf: 'center',
                        height: 14,
                        width: 14,
                        tintColor: COLORS.primary,
                        resizeMode: 'contain',
                      }}
                    />
                    <View style={{marginLeft: 10, flex: 1}}>
                      <View>
                        <Text
                          style={{
                            textAlign: 'left',
                            width: '100%',
                            fontSize: 15,
                            color: '#6a7989',
                            fontWeight: 'bold',
                          }}>
                          {item.notifText}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: 2,
                          width: '100%',
                        }}>
                        <Text
                          style={{
                            width: 200,
                            alignSelf: 'flex-start',
                            textAlign: 'left',
                            fontSize: 12,
                            paddingRight: 10,
                            color: '#6a7989',
                            fontWeight: 'bold',
                          }}>
                          {Moment(item.notifDate).format('DD-MMM-YYYY HH:mm A')}
                        </Text>
                        {/* <Text style={{ fontSize: 12}}>{new Date(item.notifDate).getHours() + ":" + new Date(item.notifDate).getMinutes()}</Text> */}
                        {/* <Text style={{width:100, fontSize: 12,color: '#6a7989',fontWeight: 'bold', }}>{}</Text> */}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text>No Notification</Text>
              </View>
            }
          />
        </View>
      </View>
    );
  }
}

// const mapStateToProps = (state) => ({
//     LoginDetails: state.CommanReducer.LoginDetails,
//     NotificationList: state.CommanReducer.NotificationList,

// });
// const mapDispatchToProps = (dispatch) => ({
//     NotificationsListByuser: (empID, userRoleId) => dispatch(Fetch('Notification/NotificationsListByuser', 'GET', empID + "/" + userRoleId, serviceActionNotificationsListByuser)),
//     ReadSingleMsg: (param, onSuccess) => dispatch(Fetch('Notification/ReadSingleMsg/' + param, 'POST', undefined, undefined, onSuccess)),
// })

export default connect(mapStateToProps, mapDispatchToProps)(NotificationScreen);
