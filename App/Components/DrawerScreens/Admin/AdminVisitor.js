import React, {useState} from 'react';
import {
  Text,
  View,
  Animated,
  Image,
  ScrollView,
  FlatList,
  TouchableWithoutFeedback,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Platform,
} from 'react-native';
import Toast from 'react-native-simple-toast'
import {BASEURL} from '../../../utility/util'
import {Header} from '../../CusComponent';
import {connect} from 'react-redux';
import {COLORS, IMAGES} from '../../../Assets';
import {mapDispatchToProps, mapStateToProps} from '../../../Reducers/ApiClass';
import {RFPercentage} from 'react-native-responsive-fontsize';
import LinearGradient from 'react-native-linear-gradient';
import { axiosAuthGet, axiosPost, axPost } from '../../../utility/apiConnection';
import axios from 'axios';

class AdminVisitor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isRefreshing: false,
      curY: new Animated.Value(0),
      VisitorList: [],
      search: '',
      tempList: [],
      modalVisible: false,
      selectedItem: [],
    };
  }
  componentDidMount() {
    
    this.props.GetVisitorAll(
      this.props.LoginDetails.userID+"/"+this.props.LoginDetails.orgID,
      this.visitorListSuccess,
    );
    this.focusListener = this.props.navigation.addListener('focus', () => {
      if (this.props.Update) {
        this.props.Update(false);
        this.props.GetVisitorAll(
          this.props.LoginDetails.userID+"/"+this.props.LoginDetails.orgID,
          this.visitorListSuccess,
        );
      }
    });
  }
  onRefresh() {
    this.setState({isRefreshing: true, search: ''});
    setTimeout(() => {
      this.componentDidMount();
      this.setState({isRefreshing: false});
    }, 3000);
  }
  visitorListSuccess = res => this.afterVisitorListSuccess(res);
  afterVisitorListSuccess(VisitorListArray) {
    this.setState({
      VisitorList: VisitorListArray,
      tempList: VisitorListArray,
    });
  }
 async getDetails(id) {
   console.log("====",id+"/"+this.props.LoginDetails.empID);
    this.props.GetVisitorDtlsForAdmin(id+"/"+this.props.LoginDetails.empID, this.visitorListSuccess1);
    // try {
    //   let res=await axiosAuthGet("Visitor/GetVisitorDtlsForAdmin/"+id+"/"+this.props.LoginDetails.empID)
    //   console.log("response",res);
    // } catch (error) {
      
    // }
  }
  visitorListSuccess1 = AdmindVisitordtls => {
    var i=AdmindVisitordtls.length-1
    console.log("length=",i);
    this.props.VisitorDetails(AdmindVisitordtls[i]),
    console.log("Detils",AdmindVisitordtls);
    this.props.BlockedViz({blockedId:0,status:0})
      this.props.navigation.navigate('VizDetails');
  };
  blockUser=async()=>{
    console.log(this.state.selectedItem.visitorId);
    let response=await axPost("AdminDealer/VisitorBlock/"+this.state.selectedItem.visitorId+"/"+true)
    if(response==true){
      Toast.show("Visitor Blocked Successful")
      this.setState({modalVisible:false})
    }
      console.log(response)
      
  }
  modalOpen() {
    return (
      <Modal
        backgroundColor={'black'}
        backdropColor={'black'}
        animationType={'slide'}
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          this.setState({modalVisible: false});
        }}>
        <View
          style={{
            backgroundColor: 'rgba(52, 52, 52, 0.8)',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ScrollView
            style={{width: '100%', height: '100%'}}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 45,
            }}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({modalVisible: false});
              }}>
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  flex: 1,
                }}></View>
            </TouchableWithoutFeedback>
            <View
              style={{
                flexDirection: 'row',
                padding: 10,
                alignItems: 'center',
                backgroundColor: '#df8109',
                height: null,
                width: '90%',
                borderRadius: 10,
              }}>
              <View style={{padding: 15, flex: 1}}>
                <TouchableOpacity
                  style={{padding: 6, flex: 1}}
                  onPress={() => {
                    this.setState({modalVisible: false, search: ''}),
                      this.getDetails(this.state.selectedItem.visitorId);
                  }}>
                  <Text
                    style={{
                      marginTop: 10,
                      color: COLORS.white,
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}>
                    View
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{padding: 6, flex: 1}}
                  onPress={() => {
                    this.setState({modalVisible: false, search: ''}),
                      this.props.navigation.navigate('VisitorUpdate', {
                        VisitorDetails: this.state.selectedItem.visitorId,
                        tag: 6,
                      });
                  }}>
                  <Text
                    style={{
                      marginTop: 10,
                      fontSize: 18,
                      color: COLORS.white,
                      fontWeight: 'bold',
                    }}>
                    Edit
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{padding: 6, flex: 1}}
                  onPress={() =>this.blockUser()
                  }>
                  <Text
                    style={{
                      marginTop: 10,
                      fontSize: 18,
                      color: COLORS.white,
                      fontWeight: 'bold',
                    }}>
                    Block
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  }

  render() {
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: COLORS.whitef4,
        }}>
       
        <View style={{flex: 1, paddingBottom: 10, alignSelf: 'center'}}>
          <Animated.FlatList
            style={{flex: 1}}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: this.state.curY}}}],
              {useNativeDriver: true},
            )}
            stickyHeaderIndices={[0]}
            contentContainerStyle={{flexGrow: 1, paddingTop: this.state.height}}
            data={this.state.VisitorList}
            ref={r => (this.refs = r)}
            refreshing={this.state.isRefreshing}
            onRefresh={() => this.onRefresh()}
            ListHeaderComponent={
              <View style={{backgroundColor: COLORS.whitef4}}>
                <View
                  style={{
                    alignSelf: 'center',
                    alignItems: 'center',
                    marginTop: 6,
                    marginBottom: 6,
                    backgroundColor: COLORS.white,
                    flexDirection: 'row',
                    borderRadius: 10,
                    height: 40,
                    width: '98%',
                  }}>
                  <Image
                    style={{height: 20, width: 25, resizeMode: 'contain'}}
                    source={IMAGES.search_a}
                  />
                  <View style={{height: 25, flexGrow: 1, marginLeft: 5}}>
                    <TextInput
                      placeholderTextColor={COLORS.placeholderColor}
                      maxLength={
                        this.props.LoginDetails.userRoleId != 2 ? 70 : 6
                      }
                      style={{color: COLORS.black, padding: 0}}
                      ref={el => {
                        this.search = el;
                      }}
                      onChangeText={search => this.SearchFilterFunction(search)}
                      placeholder={'Search'}
                      value={this.state.search}
                    />
                  </View>
                </View>
                <View style={{alignSelf: 'center', justifyContent: 'center'}}>
                  <View
                    style={{
                      padding: 10,
                      flexDirection: 'row',
                      backgroundColor: COLORS.placeholderColor,
                      borderRadius: 10,
                      paddingVertical: 5,
                      justifyContent: 'center',
                      marginLeft: '1%',
                      marginRight: '1%',
                      width: '98%',
                      elevation: 0.5,
                      alignSelf: 'center',
                    }}>
                    <View style={{width: '33%'}}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          textAlign: 'left',
                          width: '100%',
                        }}>
                        Name
                      </Text>
                    </View>

                    <View style={{width: '33%'}}>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontWeight: 'bold',
                          width: '100%',
                        }}>
                        Mobile
                      </Text>
                    </View>

                    <View style={{width: '33%'}}>
                      <Text style={{fontWeight: 'bold', textAlign: 'right'}}>
                        Email
                      </Text>
                    </View>

                    {/* <View style={{ alignItems: 'center', width: '20%' }}>
                                        <Text style={{ fontWeight: 'bold', flex: 1, }}>
                                            Action
                                        </Text>
                                    </View> */}
                  </View>
                </View>
              </View>
            }
            renderItem={({item, key}) => {
              return (
                <View
                  style={{
                    alignSelf: 'center',
                    padding: 10,
                    width: '98%',
                    borderRadius: 10,
                    marginTop: 5,
                    backgroundColor: COLORS.white,
                    elevation: 0.5,
                  }}>
                  <TouchableOpacity
                    onLongPress={() =>
                      this.setState({modalVisible: true, selectedItem: item})
                    }
                    style={{
                      alignItems: 'center',
                      borderColor: '#6a7989',
                      borderRadius: 10,
                      paddingTop: 5,
                      paddingBottom: 5,
                      flexDirection: 'row',
                      backgroundColor: COLORS.white,
                    }}>
                    <View style={{width: '33%'}}>
                      <Text
                        numberOfLines={1}
                        style={{
                          textAlign: 'left',
                          width: '100%',
                          color: '#6a7989',
                          fontWeight: 'bold',
                          fontSize: RFPercentage(1.7),
                        }}>
                        {item.fullName}
                      </Text>
                    </View>
                    <View style={{width: '33%'}}>
                      <Text
                        numberOfLines={1}
                        style={{
                          textAlign: 'center',
                          width: '100%',
                          color: '#6a7989',
                          fontWeight: 'bold',
                          fontSize: RFPercentage(1.7),
                        }}>
                        {item.mobile}
                      </Text>
                    </View>
                    <View style={{width: '33%'}}>
                      <Text
                        numberOfLines={2}
                        style={{
                          textAlign: 'right',
                          width: '100%',
                          color: '#6a7989',
                          fontWeight: 'bold',
                          fontSize: RFPercentage(1.7),
                        }}>
                        {item.email}
                      </Text>
                    </View>
                    {/* <View style={{ width: '20%', justifyContent: 'space-evenly', alignSelf: 'flex-end', flexDirection: 'row' }} >
                                            <TouchableOpacity onPress={() => this.props.navigation.navigate("AdminVisitorDetails", { visitorDtl: item })} style={{ marginLeft: 12, padding: 3 }}>
                                                <Image style={{ height: 23, width: 23, tintColor: COLORS.black, resizeMode: "contain", }} source={IMAGES.hidden} />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => this.props.navigation.navigate("VisitorForm", { VisitorDetails: item, tag: 6 })} style={{ marginLeft: 8, padding: 3 }}>
                                                <Image style={{ height: 20, width: 20, tintColor: COLORS.black, resizeMode: "contain", }} source={IMAGES.edit} />
                                            </TouchableOpacity>
                                        </View> */}
                  </TouchableOpacity>
                </View>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{color: COLORS.placeholderColor, fontSize: 20}}>
                  No {this.state.visitors ? 'Visitor' : 'Employee'} List Record
                </Text>
              </View>
            }
          />
        </View>
        {/* <View style={{ position: 'absolute', bottom: 50, right: 20 }}>
                    <LinearGradient
                        style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 55 / 2, height: 55, width: 55, }}
                        colors={[
                            COLORS.primary,
                            COLORS.third
                        ]}
                    >
                        <TouchableOpacity
                            style={{ borderRadius: 55 / 2, height: 55, width: 55, justifyContent: 'center', alignItems: 'center' }}
                            onPress={() => {
                                this.props.navigation.navigate("VisitorForm", { tag: 0 })
                            }}>
                            <Text style={{ alignSelf: 'center', marginBottom: 6, color: COLORS.white, fontSize: (Platform.OS === 'ios') ? 42 : 50, }}>+</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View> */}
        {this.modalOpen()}
      </View>
    );
  }
  SearchFilterFunction(search) {
    if (search != '') {
      const newData = this.state.tempList.filter(function (item) {
        var itemm = item.fullName + item.mobile + item.email;
        const itemData = itemm ? itemm.toUpperCase() : ''.toUpperCase();
        const textData = search.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      this.setState({
        VisitorList: newData,
        search,
      });
    } else {
      this.setState({
        search,
        VisitorList: this.state.tempList,
      });
    }
  }
}

const styles = StyleSheet.create({});

export default connect(mapStateToProps, mapDispatchToProps)(AdminVisitor);
