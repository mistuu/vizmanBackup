import React, {Component} from 'react';
import {Alert, TouchableOpacity} from 'react-native';
import {
  View,
  Text,
  Dimensions,
  RefreshControl,
  FlatList,
  Image,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, IMAGES} from '../../../Assets';
import Colors from '../../../Assets/Colors';
import Images from '../../../Assets/Images';
import Modal from 'react-native-modal';
import {connect} from 'react-redux';
import {IMAGEURL} from '../../../utility/util';
import {mapDispatchToProps, mapStateToProps} from '../../../Reducers/ApiClass';
import {axiosAuthGet, axiosPost} from '../../../utility/apiConnection';
import Moment from 'moment';
import SimpleToast from 'react-native-simple-toast';
import {storeItem} from '../../../utility/AsyncConfig';
import {StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
const {width, height} = Dimensions.get('window');

class Courier_In extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      courierDetails: null,
      imageOpen: false,
      CourierList: null,
      hideButton: true,
      refreshing: false,
      setRefreshing: false,
      to: '',
      from: '',
      address: '',
      dockerno: '',
      company: '',
      executive: '',
      mob: '',
      dateAndtime: '',
      remark: '',
      photo: '',
      courierId: '',
      dummy: [],
    };
  }
  async componentDidMount() {
    //   try {
    //     var s = {
    //         "parameter": "",
    //         "pageSize": "10",
    //         "page": "1",
    //         "sortColumn": "partnerid desc"
    //     }
    //     let fid = await axiosPost("https://partnerapi.naapbooks.com/api/Admin/GetPartnerList"+s, s)
    //     console.log("+++++Anvit Api+++++", fid);
    // } catch (error) {

    // }
    console.log('Login Details======', this.props.LoginDetails.empID);
    this.getData();
    this.willFocusSubscription = this.props.navigation.addListener(
      'focus',
      () => {
        this.getData();
      },
    );
  }
  componentDidUpdate(prevProps) {
    const {NotificationList} = this.props;
    if (NotificationList != prevProps.NotificationList) {
      this.getData();
    }
  }
  getData = async () => {
    console.log('Admin:');
    if (
      this.props.LoginDetails.userRoleId == 4 ||
      this.props.LoginDetails.userRoleId == 1
    ) {
      this.setState({hideButton: false});
    }
    console.log('LoginDetails=====', this.props.LoginDetails);
    let response = await axiosAuthGet(
      'Courier/GetCourierList/' + this.props.LoginDetails.userID,
    );
    var x = [];
    var details = [];
    // this gives an object with dates as keys
    var groups = response.reduce((groups, game) => {
    console.log("List=",game.courierDate);

      const date = game.courierDate?.split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(game);
      return groups;
    }, {});
    var s = [];
    var de = [];

    var groupArrays = Object.keys(groups).map(date => {
      return {
        date,
        CourierDetails: groups[date],
      };
    });

    //filter courier in wise
    groupArrays.filter(element => {
      element.CourierDetails = element.CourierDetails.filter(e => {
        return e.type == false;
      });
    });

    let array = groupArrays.filter(a => a.CourierDetails.length > 0);
    if (
      this.props.LoginDetails.userRoleId == 2 ||
      this.props.LoginDetails.userRoleId == 3 ||(this.props.LoginDetails.userRoleId == 1 && !this.props.AdminSwitch )
    ) {
      this.setState({courierDetails: array, dummy: array});

      console.log('All Data===', array);
    } 
    else {
      response.forEach(element => {
        // if (this.props.LoginDetails.empID === element.employeeId) {
        //   details.push({
        //     courierCompany: element.courierCompany,
        //     courierEmployeeName: element.courierEmployeeName,
        //     courierMobile: element.courierMobile
        //   })
        array.forEach(element => {
          element.CourierDetails = element.CourierDetails.filter(e => {
            return this.props.LoginDetails.empID === e.employeeId;
          });
        });
        array = array.filter(a => a.CourierDetails.length > 0);
        console.log(array);
        // this.setState({ courierDetails: array })

        // }
      });
    }

    this.setState({courierDetails: array, dummy: array});

    // console.log(array);

    await storeItem('courierDetails', details);
    // this.setState({ CourierList: x })
    this.setState({setRefreshing: false});
    // console.log(this.state.CourierList);
  };
  setImageOpen = visible => {
    console.log(this.state.photo);
    this.setState({imageOpen: true});
  };
  setModalVisible = (
    courierId,
    visible,
    to,
    from,
    address,
    dockerno,
    company,
    executive,
    mob,
    dateAndtime,
    remark,
    photo,
  ) => {
    this.setState({
      courierId: courierId,
      modalVisible: visible,
      to: to,
      from: from,
      address: address,
      dockerno: dockerno,
      company: company,
      executive: executive,
      mob: mob,
      dateAndtime: dateAndtime,
      remark: remark,
      // photo: 'https://nblapi.vizman.app/' + photo
    });
    console.log('Photo:', photo);
    if (photo != '') {
      // console.log("============",IMAGEURL + photo);
      this.setState({photo: {uri: IMAGEURL + photo}});
    } else {
      this.setState({photo: ''});
    }
  };
  deleteRecord = async (id, name) => {
    console.log(id);

    try {
      Alert.alert(
        'Alert',
        'Are you sure you want to delete courier Received for ' + name + '?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: async () => {
              let response = await axiosPost('Courier/DeleteCourier/' + id, id);
              console.log(response);
              if (response === true) {
                SimpleToast.show('Delete Record Successfully');
                this.setModalVisible(false);
                this.getData();
              }
            },
          },
        ],
      );
      //
    } catch (error) {}
  };
  handleRefresh() {
    this.setState({setRefreshing: true});
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        this.getData();
      } else {
        alert('Please check Network');
      }
    });
    setTimeout(() => {
      this.setState({setRefreshing: false});
    }, 3000);
  }
  render() {
    const {modalVisible} = this.state;

    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: COLORS.whitef4,
        }}>
  
          {this.state.dummy.length > 0 ? (
            <View style={{marginBottom: '20%'}}>
              <FlatList
                data={this.state.courierDetails}
                style={{margin: 10}}
                refreshing={this.state.setRefreshing}
                onRefresh={() => this.handleRefresh()}
                // inverted={true}
                contentContainerStyle={{}}
                // initialScrollIndex={this.state.courierDetails.length - 1}
                renderItem={({item}) => (
                  <View
                    style={{
                      marginTop: 5,
                      marginBottom: 5,
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <LinearGradient
                      style={{
                        padding: 7,
                        alignItems: 'center',
                        width: '32%',
                        borderRadius: 8,
                        marginTop: 7,
                        marginBottom: 10,
                      }}
                      colors={[COLORS.primary, COLORS.third]}>
                      <Text style={{color: COLORS.white, alignItems: 'center'}}>
                        {Moment(item.date).format('DD-MM-YYYY')}
                      </Text>
                    </LinearGradient>
                    <FlatList
                      data={item.CourierDetails}
                      style={{margin: 10}}
                      // refreshing={this.state.setRefreshing}
                      // onRefresh={() => this.handleRefresh()}
                      // inverted={true}
                      renderItem={({item}) => (
                        // <View />
                        <View
                          style={{
                            marginTop: 5,
                            marginBottom: 5,
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate("DetailsCourier", { EmplCou: item })
                              // this.setModalVisible(
                              //   item.courierId,
                              //   true,
                              //   item.employeeName,
                              //   item.name,
                              //   item.address,
                              //   item.docket_No,
                              //   item.courierCompany,
                              //   item.courierEmployeeName,
                              //   item.courierMobile,
                              //   item.courierDate,
                              //   item.remark,
                              //   item.image,
                              // )
                            }
                            style={{
                              marginTop: 5,
                              marginBottom: 5,
                              width: '100%',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <View
                              style={{
                                width: '90%',
                                borderRadius: 8,
                                backgroundColor: Colors.white,
                                padding: 10,
                              }}>
                              <View style={{flexDirection: 'row'}}>
                                <Text
                                  style={{
                                    color: COLORS.graye00,
                                    width: width / 3,
                                  }}>
                                  To
                                </Text>
                                <Text
                                  style={{
                                    color: COLORS.graye00,
                                    width: width / 3,
                                  }}>
                                  From
                                </Text>
                                <Text
                                  style={{
                                    color: COLORS.graye00,
                                    width: width / 3,
                                  }}>
                                  Mobile
                                </Text>
                              </View>

                              <View style={{flexDirection: 'row'}}>
                                <Text
                                  style={{
                                    fontWeight: 'bold',
                                    width: width / 3,
                                  }}>
                                  {item.employeeName}
                                </Text>
                                <Text
                                  style={{
                                    fontWeight: 'bold',
                                    width: width / 3,
                                  }}>
                                  {item.name}
                                </Text>
                                <Text
                                  style={{
                                    fontWeight: 'bold',
                                    width: width / 4.4,
                                  }}>
                                  {item.courierMobile}
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                      )}
                      numColumns={1}
                      keyExtractor={item => item.courierId}
                    />
                  </View>
                )}
                numColumns={1}
                keyExtractor={item => item.date}
              />
            </View>
          ) : (
            <View style={styles.emptyListStyle}>
              <Text style={styles.emptyMessageStyle}>No Courier In</Text>
            </View>
          )}
        

        <View
          style={{
            position: 'absolute',
            margin: 16,
            right: 10,
            bottom: 100,
            alignContent: 'center',
            justifyContent: 'center',
          }}>
          {this.props.LoginDetails.userRoleId!=4 && !this.props.AdminSwitch &&(
            <LinearGradient
              style={{
                borderRadius: 55 / 2,
                height: 55,
                width: 55,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              colors={[COLORS.primary, COLORS.third]}>
              <TouchableOpacity
                style={{justifyContent: 'center', alignItems: 'center'}}
                onPress={() => this.props.navigation.navigate('Add_Courier')}>
                <Image source={Images.plus} style={{height: 45, width: 45,tintColor:Colors.white}} />
                {/* <Text style={{ textAlign: 'center', color: COLORS.white, fontSize: (Platform.OS === 'ios') ? 42 : 50, }}>+</Text> */}
              </TouchableOpacity>
            </LinearGradient>
          )}
        </View>
        <Modal
          isVisible={this.state.modalVisible}
          onBackdropPress={() => this.setModalVisible(false)}
          onSwipeComplete={() => this.setModalVisible(false)}
          swipeDirection="left"
          onBackButtonPress={() => this.setModalVisible(false)}>
          <View
            style={{
              padding: 10,
              borderRadius: 13,
              backgroundColor: COLORS.white,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ScrollView>
              <View
                style={{
                  width: '90%',
                  borderRadius: 13,
                  backgroundColor: Colors.white,
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{color: COLORS.graye00, width: width / 2.5}}>
                    To
                  </Text>
                  <Text style={{color: COLORS.graye00, width: width / 2}}>
                    From
                  </Text>
                </View>
                <View style={{width: '90%', flexDirection: 'row'}}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      width: width / 2.5,
                      fontSize: 16,
                    }}>
                    {this.state.to}
                  </Text>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      width: width / 2.5,
                      fontSize: 16,
                    }}>
                    {this.state.from}
                  </Text>
                </View>
                <View
                  style={{width: '90%', flexDirection: 'row', marginTop: 13}}>
                  <Text style={{color: COLORS.graye00, width: width}}>
                    Address
                  </Text>
                </View>
                <View style={{width: '90%', flexDirection: 'row'}}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      width: width / 1.3,
                      fontSize: 16,
                    }}>
                    {this.state.address}
                  </Text>
                </View>
                <View
                  style={{width: '90%', flexDirection: 'row', marginTop: 13}}>
                  <Text style={{color: COLORS.graye00, width: width / 2.5}}>
                    Docket No
                  </Text>
                  <Text style={{color: COLORS.graye00, width: width / 2}}>
                    Courier Company
                  </Text>
                </View>
                <View style={{width: '90%', flexDirection: 'row'}}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      width: width / 2.5,
                      fontSize: 16,
                    }}>
                    {this.state.dockerno}
                  </Text>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      width: width / 2.5,
                      fontSize: 16,
                    }}>
                    {this.state.company}
                  </Text>
                </View>
                <View
                  style={{width: '90%', flexDirection: 'row', marginTop: 13}}>
                  <Text style={{color: COLORS.graye00, width: width / 2.5}}>
                    Courier Executive
                  </Text>
                  <Text style={{color: COLORS.graye00, width: width / 2}}>
                    Mobile
                  </Text>
                </View>
                <View style={{width: '90%', flexDirection: 'row'}}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      width: width / 2.5,
                      fontSize: 16,
                    }}>
                    {this.state.executive}
                  </Text>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      width: width / 2.5,
                      fontSize: 16,
                    }}>
                    {this.state.mob}
                  </Text>
                </View>
                <View
                  style={{width: '90%', flexDirection: 'row', marginTop: 13}}>
                  <Text style={{color: COLORS.graye00, width: width}}>
                    Date/Time
                  </Text>
                </View>
                <View style={{width: '90%', flexDirection: 'row'}}>
                  <Text
                    style={{fontWeight: 'bold', width: width, fontSize: 16}}>
                    {Moment(this.state.dateAndtime).format('LLL')}
                  </Text>
                </View>
                <View
                  style={{width: '90%', flexDirection: 'row', marginTop: 13}}>
                  <Text style={{color: COLORS.graye00, width: width}}>
                    Remarks
                  </Text>
                </View>
                <View style={{width: '90%', flexDirection: 'row'}}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      width: width / 1.3,
                      fontSize: 16,
                    }}>
                    {this.state.remark}
                  </Text>
                </View>
                <View
                  style={{width: '90%', flexDirection: 'row', marginTop: 13}}>
                  <Text style={{color: COLORS.graye00, width: width}}>
                    Photo
                  </Text>
                </View>
                {/* <TouchableOpacity style={{ marginTop: 5 }}
                onPress={() => this.setImageOpen(true)}> */}
                <Image
                  style={{height: 70, width: '25%'}}
                  source={this.state.photo}
                />
                {/* </TouchableOpacity> */}
                {this.state.hideButton && (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      marginTop: 20,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.props.courierId(this.state.courierId);
                        this.props.navigation.navigate('UpdateCourier');
                      }}>
                      <View
                        style={{
                          paddingTop: 8,
                          paddingBottom: 8,
                          paddingLeft: 20,
                          paddingRight: 20,
                          borderRadius: 8,
                          backgroundColor: Colors.primary,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text style={{color: Colors.white}}>Edit</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        this.deleteRecord(this.state.courierId, this.state.to)
                      }>
                      <View
                        style={{
                          marginLeft: 20,
                          paddingTop: 8,
                          paddingBottom: 8,
                          paddingLeft: 15,
                          paddingRight: 15,
                          borderRadius: 8,
                          backgroundColor: Colors.red,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text style={{color: Colors.white}}>Delete</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </Modal>
        <Modal
          isVisible={this.state.imageOpen}
          onBackdropPress={() => this.setImageOpen(false)}
          onSwipeComplete={() => this.setImageOpen(false)}
          swipeDirection="left"
          onBackButtonPress={() => this.setImageOpen(false)}>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Image
              style={{height: '70%', width: '100%'}}
              source={this.state.photo}
            />
          </View>
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyListStyle: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyMessageStyle: {
    textAlign: 'center',
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(Courier_In);
