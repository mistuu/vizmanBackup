import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, Dimensions, TextInput, Image, Platform, StyleSheet } from 'react-native';
import { COLORS, IMAGES } from '../../../Assets';
import Colors from '../../../Assets/Colors';
import { Header } from '../../CusComponent';
import Modal from 'react-native-modal';
import { IMAGEURL, GateIMAGEURL } from '../../../utility/util'
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';
import axios from 'axios';
import Images from '../../../Assets/Images';
import { axiosAuthGet, axiosPost, axPost } from '../../../utility/apiConnection';
import Toast from 'react-native-simple-toast'
const { width, height } = Dimensions.get('window');
import { getItem } from '../../../utility/AsyncConfig'
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from '../../../Reducers/ApiClass';
const fs = RNFetchBlob.fs;

class VisitorListGatekeeper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      data: null,
      data1: null,
      Vizdetails: null,
      search: '',
      setRefreshing: false,
      CkOutModalVisible: false,
      VizId: null,
      remarks: null,
      idProof: null,
      photoProof: null,
      progress: false,
      imageOpen: false,
      photo: null,
    };
  }
  componentDidMount() {
    this.getData()
  }
  componentDidUpdate(prevProps) {

    // const {Visitorlist} =this.props
    // if(Visi!=prevProps.data){
    // this.getData()
    // }  

  }

  getData = async () => {
    var Userid;
    await getItem("LoginDetails").then((data) => {
      var LoginDetails = JSON.parse(data)
      console.log(data.userID);
      Userid = LoginDetails.userID
    })
    try {

      console.log(Userid);
      let response = await axiosAuthGet("BuildingAdmin/GetVisitorForGatekeeper/" + Userid)
     
      response = await response.sort((a, b) =>
        b.visitsId - a.visitsId
      )
      this.setState({ data: response, data1: response })
      this.setState({ setRefreshing: false })

      console.log("Data==", response);
    } catch (error) {

    }
  }
  setModalVisible = async (visible, VisId) => {
    try {
      let response = await axiosAuthGet("BuildingAdmin/GetVisitorDetails/" + VisId)
      console.log("Modal Details==", response);

      this.setState({ Vizdetails: response })
    } catch (error) {

    }
    this.setState({ modalVisible: visible })
  }

  setCkOutModalVisible = async (visible, VisId, remark) => {

    this.setState({ CkOutModalVisible: visible, VizId: VisId, remarks: remark })
  }
  progressVisible = (visible) => {

    this.setState({ progress: visible })
  }
  SearchFilterFunction = async (search) => {
    this.setState({ search: search })
    console.log(search);
    if (search.trim() != '') {
      let arry = await this.state.data1.filter(item =>
        item?.visitorName?.toLowerCase().match(search.toLowerCase().trim()) ||
        item?.officeName?.toLowerCase().match(search.toLowerCase().trim()) ||
        item?.vehicleNo?.toLowerCase().match(search.toLowerCase().trim()) ||
        item?.mobileNo?.match(search)
      )
      this.setState({ data: arry })
    } else this.setState({ data: this.state.data1 })

  }
  checkOut = async () => {
    console.log(this.state.VizId + "/" + this.state.remarks);
    try {
      let response = await axPost("BuildingAdmin/CheckOut/" + this.state.VizId + "/" + this.state.remarks)
      console.log("visitor====", response);
      this.setCkOutModalVisible(false)
      this.setState({ remarks: '' })
      this.getData();
      if (response == true) {
        Toast.show("Visitor Checkout Successfully")
      }
    } catch (error) {

    }


  }
  handleRefresh() {
    this.setState({ setRefreshing: true })
    this.getData()
  }
  async shareTheProductDetails(vizId, mobile) {
    let imagePath = null;
    console.log("Viz ID", vizId, mobile);
    let res = await axios.get(GateIMAGEURL + "/Template/GenerateGatePass?VisitsId=" + vizId)
    // let res=axiosAuthGet("https://nblapp.vizman.app/Template/GenerateGatePass?VisitsId="+vizId)
    console.log("Images=", res.data);


    if (mobile != null) {
      RNFetchBlob
        .fetch('GET', res.data)
        // the image is now dowloaded to device's storage
        .then((resp) => {

          // console.log("resData",resp.base64());
          return resp.base64();
        })
        .then((base64Data) => {
          // here's base64 encoded image
          var imageUrl = 'data:image/png;base64,' + base64Data;
          let shareImage = {
            // title: "Vizman test", //string
            // message: "Welcome to Vizman",
            url: imageUrl,
            social: Share.Social.WHATSAPP,
            // whatsAppNumber: "91" + mobile,
          };
          Share.shareSingle(shareImage)
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              err && console.log(err);
            });
          // remove the file from storage
          return fs.unlink(imagePath);
        });
    } else {
      Toast.show("Mobile number not be found.")
    }
  }
  setImageOpen = (visible, photo) => {
    // console.log(this.state.photo);
    this.setState({ imageOpen: visible, photo: photo })
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.whitef4 }}>
        <Header title={"Visitor List"} navigation={this.props.navigation} />
        <View style={{ alignSelf: 'center', backgroundColor: COLORS.white, flexDirection: "row", borderRadius: 10, height: 35, width: '98%', padding: 5, marginVertical: 3 }}>
          <Image style={{ height: 20, width: 25, resizeMode: "contain", alignSelf: 'flex-start' }} source={IMAGES.search_a} />
          <View style={{ height: 25, flexGrow: 1, marginLeft: 5 }}>
            <TextInput
              placeholderTextColor={COLORS.placeholderColor}
              style={{ color: COLORS.black, padding: 0 }}
              onChangeText={search => this.SearchFilterFunction(search)}
              value={this.state.search} placeholder={"Mobile / Name / Office / Vehicle No"}
            />
          </View>
        </View>
        <FlatList
          data={this.state.data}
          style={{ margin: 5 }}
          contentContainerStyle={{}}
          refreshing={this.state.setRefreshing}
          onRefresh={() => this.handleRefresh()}
          renderItem={({ item }) =>
            <View style={{ marginTop: 5, marginBottom: 5, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => { this.setModalVisible(true, item.visitsId) }}
                style={{ marginTop: 5, marginBottom: 5, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ width: "90%", borderRadius: 8, backgroundColor: Colors.white, padding: 10 }}>
                  <View style={{ flexDirection: 'row' }}>

                    <View style={{ width: width / 3 }}>
                      <Text style={{ color: COLORS.graye00, }}>Office No</Text>
                      <Text style={{ fontWeight: 'bold', }}>{item?.officeName}</Text>
                      <Text style={{ color: COLORS.graye00, }}>Vehicle No</Text>
                      <Text style={{ fontWeight: 'bold', }}>{item?.vehicleNo}</Text>
                      <TouchableOpacity onPress={() => this.shareTheProductDetails(item.visitsId, item.mobileNo)}>
                        <Image source={Images.whatsapp} style={{ marginTop: 5, height: 20, width: 20 }} />
                      </TouchableOpacity>
                    </View>
                    <View style={{ width: width / 4 }}>
                      <Text style={{ color: COLORS.graye00 }}>Name</Text>
                      <Text style={{ fontWeight: 'bold', }}>{item?.visitorName}</Text>
                      <Text style={{ color: COLORS.graye00 }}>Parking</Text>
                      <Text style={{ fontWeight: 'bold', }}>{item?.parkingName}</Text>
                    </View>
                    <View style={{ width: width / 4 }}>
                      <Text style={{ color: COLORS.graye00, }}>Mobile</Text>
                      <Text style={{ fontWeight: 'bold', }}>{item?.mobileNo}</Text>
                      <TouchableOpacity onPress={() => this.setCkOutModalVisible(true, item.visitsId, item.remarks)}>
                        <Text style={{ fontWeight: 'bold', borderRadius: 13, color: Colors.white, textAlign: 'center', marginTop: 5, padding: 7, backgroundColor: Colors.primary, overflow: 'hidden' }}>Check Out</Text>
                      </TouchableOpacity>

                    </View>

                  </View>

                </View>
              </TouchableOpacity>
            </View>
          }
          ListEmptyComponent={<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: COLORS.placeholderColor, fontSize: 20 }}>No Visitor List</Text></View>}

        />
        <Modal
          isVisible={this.state.progress}
          onBackdropPress={() => this.progressVisible(false)}
          onSwipeComplete={() => this.progressVisible(false)}
          swipeDirection="left"
          onBackButtonPress={() => this.progressVisible(false)}
          transparent={true}
        >
          <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%', backgroundColor: 'rgba(52, 52, 52, 0.8)' }}>
            <Image
              source={require('../../../Assets/Images/progress.gif')}
              style={{ width: 95, height: 95 }}
            />
          </View>
        </Modal>
        <Modal
          isVisible={this.state.modalVisible}
          onBackdropPress={() => this.setModalVisible(false)}
          onSwipeComplete={() => this.setModalVisible(false)}
          swipeDirection="left"
          onBackButtonPress={() => this.setModalVisible(false)}
        >

          <View style={{ borderRadius: 13, paddingBottom: 20, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: Colors.primary, paddingTop: 20, fontSize: 18, fontWeight: 'bold' }}>Visitor Details</Text>
            <View style={{ borderColor: COLORS.graye00, borderWidth: 0.5, marginTop: 20, marginBottom: 15, width: "90%" }} />

            <View style={{ flexDirection: 'row', }}>

              <View style={{ width: width / 3, paddingLeft: 20, alignContent: 'center', alignItems: 'flex-start', marginLeft: 20 }}>
                <Text style={{ color: COLORS.graye00, }}>Visitor Name</Text>
                <Text style={{ fontWeight: 'bold', textAlign: 'left' }}>{this.state.Vizdetails?.visitorName}</Text>
                <Text style={{ color: COLORS.graye00, marginTop: 10 }}>CheckIn Time</Text>
                <Text style={{ fontWeight: 'bold', }}>{this.state.Vizdetails?.checkInTime}</Text>
                <Text style={{ color: COLORS.graye00, marginTop: 10 }}>Parking</Text>
                <Text style={{ fontWeight: 'bold', }}>{this.state.Vizdetails?.parkingName}</Text>
                <Text style={{ color: COLORS.graye00, marginTop: 10 }}>Photo</Text>
                <TouchableOpacity onPress={() => this.setImageOpen(true, this.state.Vizdetails.photoUrl)}>
                  <Image style={{ height: 50, width: 50, marginTop: 10 }} source={{ uri: IMAGEURL + this.state.Vizdetails?.photoUrl }} />
                </TouchableOpacity>


              </View>
              <View style={{ width: width / 3, alignContent: 'center', alignItems: 'flex-start', }}>
                <Text style={{ color: COLORS.graye00, }}>Mobile No</Text>
                <Text style={{ fontWeight: 'bold', }}>{this.state.Vizdetails?.mobileNo}</Text>

                <Text style={{ color: COLORS.graye00, marginTop: 10 }}>Office</Text>
                <Text style={{ fontWeight: 'bold', }}>{this.state.Vizdetails?.officeName}</Text>

                <Text style={{ color: COLORS.graye00, marginTop: 10 }}>No Of Visitors</Text>
                <Text style={{ fontWeight: 'bold', }}>{this.state.Vizdetails?.noofVisitor}</Text>


                <Text style={{ color: COLORS.graye00, marginTop: 10, marginTop: 'auto' }}>ID Proof</Text>
                <TouchableOpacity onPress={() => this.setImageOpen(true, this.state.Vizdetails.idUrl)}>
                  <Image style={{ height: 50, width: 50, marginTop: 10 }} source={{ uri: IMAGEURL + this.state.Vizdetails?.idUrl }} />
                </TouchableOpacity>

              </View>
              <View style={{ width: width / 3, paddingRight: 20, alignContent: 'center', alignItems: 'flex-start', marginRight: 10 }}>
                <Text style={{ color: COLORS.graye00 }}>Vehicle No</Text>
                <Text style={{ fontWeight: 'bold', marginRight: 5 }}>{this.state.Vizdetails?.vehicleNo}</Text>
                <Text style={{ color: COLORS.graye00, marginTop: 10 }}>Vehicle Type</Text>
                <Text style={{ fontWeight: 'bold', }}>{this.state.Vizdetails?.vehicleType === "True" ? "Car" : this.state.Vizdetails?.vehicleType === "False" ? "Bike" : ""}</Text>
                <Text style={{ color: COLORS.graye00, marginTop: 10 }}>Remark</Text>
                <Text style={{ fontWeight: 'bold', }}>{this.state.Vizdetails?.remarks}</Text>


              </View>
            </View>
          </View>
        </Modal>
        <Modal
          isVisible={this.state.CkOutModalVisible}
          onBackdropPress={() => this.setCkOutModalVisible(false)}
          onSwipeComplete={() => this.setCkOutModalVisible(false)}
          swipeDirection="left"
          onBackButtonPress={() => this.setCkOutModalVisible(false)}
        >

          <View style={{ borderRadius: 13, paddingBottom: 20, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: Colors.primary, paddingTop: 20, fontSize: 18, fontWeight: 'bold' }}>CheckOut Remark</Text>
            <View style={{ borderColor: COLORS.graye00, borderWidth: 0.5, marginTop: 20, marginBottom: 15, width: "90%" }} />
            <TextInput style={{
              marginTop: Platform.OS === 'ios' ? 10 : 10,
              paddingLeft: 10,
              color: '#989898',
              width: width / 1.5,
              borderWidth: 0.5,
              height: Platform.OS === 'ios' ? 45 : null,
              borderColor: '#000',
              borderRadius: 5,
              backgroundColor: '#fff'
            }}
              multiline={true}
              placeholder="Remark"
              onChangeText={(txt) => this.setState({ remarks: txt })}
              value={this.state.remarks}
            />
            <TouchableOpacity style={styles.btnSubmit}
              onPress={() => this.checkOut()}>
              <Text style={styles.txtSubmit}>Submit</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal
          isVisible={this.state.imageOpen}
          onBackdropPress={() => this.setImageOpen(false)}
          onSwipeComplete={() => this.setImageOpen(false)}
          swipeDirection="left"
          onBackButtonPress={() => this.setImageOpen(false)}
        >
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Image style={{ height: "70%", width: "100%" }}
              source={{ uri: IMAGEURL + this.state.photo }} />
          </View>
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.whitef4,
  },

  txtInput: {
    marginTop: Platform.OS === 'ios' ? 10 : 10,
    paddingLeft: 10,
    color: '#989898',
    borderWidth: 0.5,
    height: Platform.OS === 'ios' ? 45 : null,
    borderColor: '#E5E5E5',
    borderRadius: 5,
    backgroundColor: '#fff'
  },

  btnSubmit: {
    backgroundColor: '#FC8F14',
    marginTop: 30,
    height: 40,
    width: 100,
    justifyContent: 'center',
    alignSelf: 'flex-end',
    borderRadius: 10,
    marginRight: 45,

  },

  txtSubmit: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },

  photoView: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(VisitorListGatekeeper)