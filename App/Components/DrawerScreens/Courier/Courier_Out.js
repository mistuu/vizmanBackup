import React, {Component} from 'react';
import {Alert, TouchableOpacity} from 'react-native';
import {
  View,
  Text,
  Dimensions,
  FlatList,
  RefreshControl,
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
import {StyleSheet} from 'react-native';
import {ScrollView} from 'react-native';
const {width, height} = Dimensions.get('window');

class Courier_Out extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      imageOpen: false,
      CourierList: null,
      hideButton: true,
      setRefreshing: false,
      CourierDetails: null,
      is_IMP: '',
      courierId: '',
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
      dummy: [],
    };
  }
  async componentDidMount() {
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
    if (
      this.props.LoginDetails.userRoleId == 4 ||
      this.props.LoginDetails.userRoleId == 1
    ) {
      this.setState({hideButton: false});
    }
    console.log('LoginDetails=====', this.props.LoginDetails.userRoleId);
    let response = await axiosAuthGet(
      'Courier/GetCourierList/' + this.props.LoginDetails.userID,
    );
    var x = [];
    var details = [];
    const groups = response.reduce((groups, game) => {
      const date = game.courierDate.split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(game);
      return groups;
    }, {});

    // Edit: to add it in the array format instead
    const groupArrays = Object.keys(groups).map(date => {
      // const output = Object.assign({}, ...groups[date])
      return {
        date,
        CourierDetails: groups[date],
      };
    });
    //filter courier in wise
    groupArrays.filter(element => {
      element.CourierDetails = element.CourierDetails.filter(e => {
        return e.type == true;
      });
    });

    let array = groupArrays.filter(a => a.CourierDetails.length > 0);

    // this.setState({ courierDetails: array, dummy: array })
    if (
      this.props.LoginDetails.userRoleId == 2 ||
      this.props.LoginDetails.userRoleId == 3
    ) {
      this.setState({courierDetails: array, dummy: array});

      console.log('All Data===', array);
    } else {
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

        // }
        // if (this.props.LoginDetails.userRoleId == 2 || this.props.LoginDetails.userRoleId == 3) {
        //   details.push({
        //     courierCompany: element.courierCompany,
        //     courierEmployeeName: element.courierEmployeeName,
        //     courierMobile: element.courierMobile
        //   })

        // }
      });
    }

    console.log('All Data===', array);

    this.setState({courierDetails: array, dummy: array});

    // this.setState({ CourierList: x })
    this.setState({setRefreshing: false});

    // console.log(this.state.CourierList);
  };
  setImageOpen = visible => {
    this.setState({imageOpen: visible});
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
    is_IMP,
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
      // is_IMP: is_IMP,
      remark: remark,
      // photo: 'https://nblapi.vizman.app/' + photo
    });
    if (is_IMP == true) {
      this.setState({is_IMP: 'Yes'});
    } else {
      this.setState({is_IMP: 'No'});
    }
    if (photo != '') {
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
        'Are you sure you want to delete courier Delivered by ' + name + '?',
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

          {
            // console.log("nsnosn", this.state.dummy),
            this.state.dummy.length > 0 ? (
              <View style={{marginBottom: '20%'}}>
                <FlatList
                  data={this.state.courierDetails}
                  style={{margin: 10}}
                  refreshing={this.state.setRefreshing}
                  onRefresh={() => this.handleRefresh()}
                  // inverted={true}
                  // contentContainerStyle={{ flexDirection: 'column-reverse' }}

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
                        <Text
                          style={{color: COLORS.white, alignItems: 'center'}}>
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
                                //   item.name,
                                //   item.employeeName,
                                //   item.address,
                                //   item.docket_No,
                                //   item.courierCompany,
                                //   item.courierEmployeeName,
                                //   item.courierMobile,
                                //   item.courierDate,
                                //   item.is_IMP,
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
                                    {item.name}
                                  </Text>
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
                <Text style={styles.emptyMessageStyle}>No Courier Out</Text>
              </View>
            )
          }
        

        <View
          style={{
            position: 'absolute',
            margin: 16,
            right: 10,
            bottom: 100,
          }}>
          {this.state.hideButton && (
            <LinearGradient
              style={{
                borderRadius: 55 / 2,
                height: 55,
                width: 55,
              }}
              colors={[COLORS.primary, COLORS.third]}>
              <TouchableOpacity
                style={{
                  borderRadius: 55 / 2,
                  height: 55,
                  width: 55,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => this.props.navigation.navigate('Out_Courier')}>
                <Image source={Images.plus} style={{height: 45, width: 45,tintColor:Colors.white}} />
                {/* <Text style={{ marginBottom: 6, color: COLORS.white, fontSize: (Platform.OS === 'ios') ? 42 : 50, }}>+</Text> */}
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
                <View style={{width: '90%', flexDirection: 'row'}}>
                  <Text style={{color: COLORS.graye00, width: width / 2.5}}>
                    To
                  </Text>
                  <Text style={{color: COLORS.graye00, width: width / 2}}>
                    From
                  </Text>
                </View>
                <View style={{width: '90%', flexDirection: 'row'}}>
                  <Text style={{fontWeight: 'bold', width: width / 2.5}}>
                    {this.state.to}
                  </Text>
                  <Text style={{fontWeight: 'bold', width: width / 2.5}}>
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
                  <Text style={{fontWeight: 'bold', width: width / 1.3}}>
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
                  <Text style={{fontWeight: 'bold', width: width / 2.5}}>
                    {this.state.dockerno}
                  </Text>
                  <Text style={{fontWeight: 'bold', width: width / 2.5}}>
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
                  <Text style={{fontWeight: 'bold', width: width / 2.5}}>
                    {this.state.executive}
                  </Text>
                  <Text style={{fontWeight: 'bold', width: width / 2.5}}>
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
                  <Text style={{fontWeight: 'bold', width: width / 1.5}}>
                    {Moment(this.state.dateAndtime).format('LLL')}
                  </Text>
                </View>
                <View
                  style={{width: '90%', flexDirection: 'row', marginTop: 13}}>
                  <Text style={{color: COLORS.graye00, width: width}}>
                    Urgent
                  </Text>
                </View>
                <View style={{width: '90%', flexDirection: 'row'}}>
                  <Text style={{fontWeight: 'bold', width: width / 1.5}}>
                    {this.state.is_IMP}
                  </Text>
                </View>
                <View
                  style={{width: '90%', flexDirection: 'row', marginTop: 13}}>
                  <Text style={{color: COLORS.graye00, width: width}}>
                    Remarks
                  </Text>
                </View>
                <View style={{width: '90%', flexDirection: 'row'}}>
                  <Text style={{fontWeight: 'bold', width: width / 1.3}}>
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
                  style={{height: 50, width: '15%'}}
                  source={this.state.photo}
                />
                {/* </TouchableOpacity> */}
              </View>
              {this.state.hideButton && (
                <View style={{flexDirection: 'row', marginTop: 20}}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setModalVisible(false);
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
                      this.deleteRecord(this.state.courierId, this.state.from)
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
export default connect(mapStateToProps, mapDispatchToProps)(Courier_Out);
