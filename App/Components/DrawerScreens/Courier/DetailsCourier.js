import React, {Component} from 'react';
import {Alert, Platform, StyleSheet} from 'react-native';
import {TextInput} from 'react-native';
import {ScrollView} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {View, BackHandler,Animated, Text, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import ImgToBase64 from 'react-native-image-base64';
import * as Yup from 'yup';
import {IMAGEURL} from '../../../utility/util';
import Modal from 'react-native-modal';
import DropDownPicker from 'react-native-dropdown-picker';
import {Formik} from 'formik';
import Colors from '../../../Assets/Colors';
import {mapDispatchToProps, mapStateToProps} from '../../../Reducers/ApiClass';
import {axiosAuthGet, axiosPost} from '../../../utility/apiConnection';
import {Header} from '../../CusComponent';
import {Picker} from '@react-native-community/picker';
import ImagePicker, {
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {Hoshi} from 'react-native-textinput-effects';
import {COLORS, IMAGES} from '../../../Assets';
import {Image} from 'react-native';
import {colors} from 'react-native-elements';
import ToggleSwitch from 'toggle-switch-react-native';
import SimpleToast from 'react-native-simple-toast';
import Images from '../../../Assets/Images';
import {PermissionsAndroid} from 'react-native';
import ImageResizer from 'react-native-image-resizer';
import moment from 'moment';
import {PinchGestureHandler, State} from 'react-native-gesture-handler';
import ReactNativeZoomableView from '@openspacelabs/react-native-zoomable-view/src/ReactNativeZoomableView';

const {width, height} = Dimensions.get('window');

class DetailsCourier extends Component {
  scale = new Animated.Value(1);
  onPinchEvent = Animated.event([{ nativeEvent: { scale: this.scale } }], {
    useNativeDriver: true,
  });

  onPinchStateChange = (event) => {
    if (event.nativeEvent.oldState === GestureHandler.State.ACTIVE) {
      Animated.spring(this.scale, {
        toValue: 1,
        useNativeDriver: true,
        bounciness: 1,
      }).start();
    }
  };

  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    this.state = {
      data: this.props.route.params?.EmplCou,
      hideButton:true,
      imageOpen:false
    };
  }
  componentDidMount() {
    if (
      this.props.LoginDetails.userRoleId == 4
    ) {
      this.setState({hideButton: false});
    }
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
    console.log('Emp Courier Details:==', this.props.route.params?.EmplCou);
  }
  handleBackButtonClick() {
    this.props.navigation.goBack();
    return true;
  }
  setImageOpen = visible => {
    console.log(this.state.photo);
    this.setState({imageOpen: visible});
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
                this.props.navigation.goBack()
                // this.setModalVisible(false);
                // this.getData();
              }
            },
          },
        ],
      );
      //
    } catch (error) {}
  };
  render() {
    return (
      <View style={{flex: 1,backgroundColor:Colors.white}}>
        <LinearGradient
          style={{
            height: Platform.OS == 'ios' ? '12%' : '10%',
            paddingTop: 25,
            width: '100%',
            justifyContent: 'center',
          }}
          colors={[COLORS.primary, COLORS.third]}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: Platform.OS == 'ios' ? 17 : 5,
            }}>
            <TouchableOpacity
              style={{
                marginLeft: 10,
                padding: 10,
                height: 50,
                width: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => this.props.navigation.goBack()}>
              <Image source={IMAGES.back} style={{height: 22, width: 22}} />
            </TouchableOpacity>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                paddingLeft: 20,
                padding: 5,
                fontSize: 22,
              }}>
              Courier-{this.state.data.type?"Out":"In"} Details
            </Text>
          </View>
        </LinearGradient>
        <ScrollView>
        <View
          style={{
            padding: 10,
            borderRadius: 13,
            backgroundColor: COLORS.white,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
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
                  {!this.state.data.type? this.state.data.employeeName:this.state.data.name}
                </Text>
                <Text
                  style={{
                    fontWeight: 'bold',
                    width: width / 2.5,
                    fontSize: 16,
                  }}>
                  {!this.state.data.type?this.state.data.name:this.state.data.employeeName}
                </Text>
              </View>
              <View style={{width: '90%', flexDirection: 'row', marginTop: 13}}>
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
                  {this.state.data.address}
                </Text>
              </View>
              <View style={{width: '90%', flexDirection: 'row', marginTop: 13}}>
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
                  {this.state.data.docket_No}
                </Text>
                <Text
                  style={{
                    fontWeight: 'bold',
                    width: width / 2.5,
                    fontSize: 16,
                  }}>
                  {this.state.data.courierCompany}
                </Text>
              </View>
              <View style={{width: '90%', flexDirection: 'row', marginTop: 13}}>
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
                  {this.state.data.courierEmployeeName}
                </Text>
                <Text
                  style={{
                    fontWeight: 'bold',
                    width: width / 2.5,
                    fontSize: 16,
                  }}>
                  {this.state.data.courierMobile}
                </Text>
              </View>
              <View style={{width: '90%', flexDirection: 'row', marginTop: 13}}>
                <Text style={{color: COLORS.graye00, width: width}}>
                  Date/Time
                </Text>
              </View>
              <View style={{width: '90%', flexDirection: 'row'}}>
                <Text style={{fontWeight: 'bold', width: width, fontSize: 16}}>
                  {moment(this.state.data.courierDate).format('MMMM Do YYYY')}
                </Text>
              </View>
              {
                  this.state.data.type &&
              <View>
              <View
                  style={{width: '90%', flexDirection: 'row', marginTop: 13}}>
                  <Text style={{color: COLORS.graye00, width: width}}>
                    Urgent
                  </Text>
                </View>
                <View style={{width: '90%', flexDirection: 'row'}}>
                  <Text style={{fontWeight: 'bold', width: width / 1.5}}>
                    {this.state.data.is_IMP?"YES":"No"}
                  </Text>
                </View>
              </View>
              }

              <View style={{width: '90%', flexDirection: 'row', marginTop: 13}}>
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
                  {this.state.data.remark}
                </Text>
              </View>
              <View style={{width: '90%', flexDirection: 'row', marginTop: 13}}>
                <Text style={{color: COLORS.graye00, width: width}}>Photo</Text>
              </View>
              <TouchableOpacity style={{ marginTop: 5 }}
                onPress={() => this.setImageOpen(true)}>
              <Image
                style={{height: 70, width: '25%'}}
                source={{uri:IMAGEURL+this.state.data.image}}
              />
              </TouchableOpacity>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    marginTop: 20,
                  }}>
                    {this.state.hideButton && !this.props.AdminSwitch &&(
                  <TouchableOpacity
                    onPress={() => {
                      this.props.courierId(this.state.data.courierId);
                      this.props.navigation.replace('UpdateCourier');
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
                  )}
                  {
                    this.props.LoginDetails.userRoleId==1 && !this.props.AdminSwitch &&
                  <TouchableOpacity
                    onPress={() =>
                      this.deleteRecord(
                        this.state.data.courierId,
                        !this.state.data.type? this.state.data.employeeName:this.state.data.name,
                      )
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
                  }
                </View>
            </View>
        </View>
          </ScrollView>
        <Modal
          isVisible={this.state.imageOpen}
          onBackdropPress={() => this.setState({imageOpen:false})}
          onSwipeComplete={() => this.setState({imageOpen:false})}
          swipeDirection="left"
          onBackButtonPress={() => this.setState({imageOpen:false})}>
        <TouchableOpacity
              style={{
                marginLeft: 10,
                padding: 10,
                height: 50,
                width: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => this.setState({imageOpen:false})}>
              <Image source={IMAGES.cross} style={{tintColor:Colors.white, height: 22, width: 22}} />
            </TouchableOpacity>
        <View style={styles.container}>

        <ReactNativeZoomableView
          maxZoom={30}
          // Give these to the zoomable view so it can apply the boundaries around the actual content.
          // Need to make sure the content is actually centered and the width and height are
          // dimensions when it's rendered naturally. Not the intrinsic size.
          // For example, an image with an intrinsic size of 400x200 will be rendered as 300x150 in this case.
          // Therefore, we'll feed the zoomable view the 300x150 size.
          contentWidth={300}
          contentHeight={150}
          
        >
          {/* <Animated.Image
            source={{
              uri:
                IMAGEURL+this.state.data.image,
            }}
            style={[
              styles.image,
              {
                transform: [{ scale: this.scale }],
              },
            ]}
            resizeMode="contain"
          /> */}
          <Image
          source={{
            uri:
              IMAGEURL+this.state.data.image,
          }}
          style={[
            styles.image,
            
          ]}
          />
        </ReactNativeZoomableView>
      </View>
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: width,
    height: width,
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(DetailsCourier)