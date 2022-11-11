import React, { Component } from "react";
import LinearGradient from "react-native-linear-gradient";
import { COLORS, IMAGES } from "../../../Assets";
import Colors from "../../../Assets/Colors";
import Images from "../../../Assets/Images";
import ToggleSwitch from "toggle-switch-react-native";
import {
  Text,
  View,
  Animated,
  Alert,
  BackHandler,
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
} from "react-native";
import { connect } from "react-redux";
import {
  mapDispatchToProps,
  mapStateToProps,
} from "../../../Reducers/ApiClass";
import { RFPercentage } from "react-native-responsive-fontsize";
import Toast from "react-native-simple-toast";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import Icon from "react-native-vector-icons/MaterialIcons";
import { axiosAuthGet, axiosPost } from "../../../utility/apiConnection";

class ApprovalScreen extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    this.state = {
      urgentToggle: false,
      isRefreshing: false,
      curY: new Animated.Value(0),
      modalVisible: false,
      visitorDetails: [],
      search: "",
      tempList: [],
      selectedItem: [],
      background: 0,
      selectedEmpItems: [],
      settingsID: null,
      approvalid: null,
    };
  }
  async componentDidMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
    let respo = await axiosAuthGet(
      "Settings/GetAllSettings/" + this.props.LoginDetails.userID
    );
    console.log("response data==", this.props.LoginDetails);
    if(respo.settingsVM.approverIds!=undefined || respo.settingsVM.approverIds.length>0){
      this.setState({urgentToggle:true})
    }
    this.setState({ settingsID: respo.settingsVM.settingsID,selectedEmpItems:respo.settingsVM.approverIds});
    this.props.GetUsersList(
      this.props.LoginDetails.userID,
      this.visitorListSuccess
    );
    this.focusListener = this.props.navigation.addListener("focus", () => {
      if (this.props.Update) {
        this.props.Update(false);
        this.props.GetUsersList(
          this.props.LoginDetails.userID,
          this.visitorListSuccess
        );
      }
    });
  }
  handleBackButtonClick() {
    // this.onApproveSubmit()
    this.props.navigation.goBack();
    return true;
  }
  onRefresh() {
    this.setState({ isRefreshing: true, search: "" });
    setTimeout(() => {
      this.componentDidMount();
      this.setState({ isRefreshing: false });
    }, 3000);
  }
  visitorListSuccess = (res) => this.afterVisitorListSuccess(res);
  async afterVisitorListSuccess(VisitorListArray) {
    await VisitorListArray.filter((item) => {
      item.id = item.usrId;
      item.name = item.fullName;
    });
    console.log(VisitorListArray);
    this.setState({
      visitorDetails: VisitorListArray,
      tempList: [],
    });
    var intersection = VisitorListArray.filter((element) =>
    this.state.selectedEmpItems.includes(element.usrId)
  );
  this.setState({ tempList: intersection});
  console.log("temp List===",this.state.tempList);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }
  SearchFilterFunction(search) {
    if (search != "") {
      const newData = this.state.tempList.filter(function (item) {
        var itemm = item.fullName + item.mobile + item.userRole;
        const itemData = itemm ? itemm.toUpperCase() : "".toUpperCase();
        const textData = search.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      this.setState({
        visitorDetails: newData,
        search,
      });
    } else {
      this.setState({
        search,
        visitorDetails: this.state.tempList,
      });
    }
  }
  switchToggle(toggle) {
    this.setState({ urgentToggle: toggle });
  }
  changeBackground = async () => {
    this.setState({ background: 1 });
  };
  onStateSelectedItemsChange = async (value, index) => {
    this.setState({ selectedEmpItems: value });
    var intersection = this.state.visitorDetails.filter((element) =>
      value.includes(element.usrId)
    );
    this.setState({ tempList: intersection, approvalid: value });
    // this.state.visitorDetails.filter(i=>{
    //   value.filter(x=>{
    //     console.log(i);
    //     if(i.userId==x){
    //       this.state.tempList.push(i)
    //     }
    //   }
    //     )
    // })
    console.log("Selcted Item:-", value);
  };
  onApproveSubmit = async () => {
    var params = {
      settingsID: this.state.settingsID,
      userId: this.props.LoginDetails.userID,
      orgId: this.props.LoginDetails.orgID,
      inviteesApproval: true,
      approverIds: this.state.approvalid,
    };
    console.log("Submit Data===", params);
    if (this.state.settingsID != 0) {
      let response = await axiosPost("Settings/UpdateApprovalMatrix", params);
      console.log("Response==", response);
      this.props.navigation.goBack()
      Toast.show("Setting update successfully")
    } else {
      let response = await axiosPost("Settings/SaveApprovalMatrix", params);
      this.props.navigation.goBack()
      Toast.show("Setting save successfully")
      console.log("Response==", response);
    }
  };
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.whitef4 }}>
        <LinearGradient
          style={{
            flexDirection: "row",
            width: "100%",
            height: Platform.OS == "ios" ? "16%" : "12%",
            justifyContent: "flex-start",
            alignItems: "center",
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          }}
          colors={[COLORS.primary, COLORS.third]}
        >
          <TouchableOpacity
            onPress={() => this.handleBackButtonClick()}
            style={{
              padding: 10,
              marginTop: 40,
              alignItems: "flex-start",
              marginLeft: 10,
            }}
          >
            <Image
              source={Images.back}
              style={{
                height: 15,
                padding: 10,
                width: 22,
                tintColor: "white",
                alignSelf: "center",
              }}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: COLORS.white,
              marginLeft: 20,
              marginTop: 40,
            }}
          >
            Approval Require For Invite
          </Text>
        </LinearGradient>
        <View
          style={{
            // backgroundColor: Colors.white,
            margin: 10,
            padding: 10,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Approval Require For Invite?
          </Text>
          <View
            style={{
              justifyContent: "center",
              flexDirection: "row",
              marginTop: 10,
            }}
          >
            <Text style={{ fontSize: 18, marginTop: 10, marginRight: 5 }}>
              No
            </Text>
            <ToggleSwitch
              isOn={this.state.urgentToggle}
              onColor="green"
              offColor={Colors.grayCCC}
              label=""
              style={{ padding: 15 }}
              labelStyle={{}}
              size="medium"
              onToggle={(isOn) => this.switchToggle(isOn)}
            />
            <Text style={{ fontSize: 18, marginTop: 10, marginLeft: 5 }}>
              Yes
            </Text>
          </View>
        </View>
        {this.state.urgentToggle && (
          <View style={{ flex: 1, paddingBottom: 10, alignSelf: "center" }}>
            <Animated.FlatList
              style={{ flex: 1 }}
              scrollEventThrottle={16}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: this.state.curY } } }],
                { useNativeDriver: true }
              )}
              stickyHeaderIndices={[0]}
              contentContainerStyle={{
                flexGrow: 1,
                paddingTop: this.state.height,
              }}
              data={this.state.tempList}
              ref={(r) => (this.refs = r)}
              refreshing={this.state.isRefreshing}
              onRefresh={() => this.onRefresh()}
              ListHeaderComponent={
                <View style={{ backgroundColor: COLORS.whitef4 }}>
                  {/* <View
                    style={{
                      alignSelf: "center",
                      alignItems: "center",
                      marginTop: 6,
                      marginBottom: 6,
                      backgroundColor: COLORS.white,
                      flexDirection: "row",
                      borderRadius: 10,
                      height: 40,
                      width: "98%",
                    }}
                  >
                    <Image
                      style={{ height: 20, width: 25, resizeMode: "contain" }}
                      source={IMAGES.search_a}
                    />
                    <View style={{ height: 25, flexGrow: 1, marginLeft: 5 }}>
                      <TextInput
                        placeholderTextColor={COLORS.placeholderColor}
                        maxLength={
                          this.props.LoginDetails.userRoleId != 2 ? 70 : 6
                        }
                        style={{ color: COLORS.black, padding: 0 }}
                        ref={(el) => {
                          this.search = el;
                        }}
                        onChangeText={(search) =>
                          this.SearchFilterFunction(search)
                        }
                        placeholder={"Search"}
                        value={this.state.search}
                      />
                    </View>
                  </View> */}
                  <SectionedMultiSelect
                    styles={search}
                    colors={sColor}
                    items={this.state.visitorDetails}
                    // single={true}
                    searchPlaceholderText="Search"
                    IconRenderer={Icon}
                    uniqueKey="id"
                    // subKey="id"
                    selectText="Search Person Who Can Aprrove"
                    showDropDowns={true}
                    // readOnlyHeadings={true}
                    onSelectedItemsChange={(value, index) =>
                      this.onStateSelectedItemsChange(value, index)
                    }
                    selectedItems={this.state.selectedEmpItems}
                    confirmText={"Select"}
                    onConfirm={() => this.onApproveSubmit()}
                    // hideConfirm={true}
                  />
                  <View
                    style={{ alignSelf: "center", justifyContent: "center" }}
                  >
                    <View
                      style={{
                        padding: 10,
                        flexDirection: "row",
                        backgroundColor: COLORS.primary,
                        borderRadius: 10,
                        paddingVertical: 5,
                        justifyContent: "center",
                        marginLeft: "1%",
                        marginRight: "1%",
                        width: "98%",
                        elevation: 0.5,
                        alignSelf: "center",
                      }}
                    >
                      <View style={{ width: "33%" }}>
                        <Text
                          style={{
                            fontWeight: "bold",
                            textAlign: "left",
                            width: "100%",
                            color: Colors.white,
                          }}
                        >
                          First Name
                        </Text>
                      </View>

                      <View style={{ width: "33%" }}>
                        <Text
                          style={{
                            textAlign: "center",
                            fontWeight: "bold",
                            width: "100%",
                            color: Colors.white,
                          }}
                        >
                          Mobile
                        </Text>
                      </View>

                      <View style={{ width: "33%" }}>
                        <Text
                          style={{
                            fontWeight: "bold",
                            color: Colors.white,
                            textAlign: "right",
                          }}
                        >
                          Role
                        </Text>
                      </View>

                      {/* <View style={{ alignItems: 'center', width: '34%' }}>
                                        <Text style={{ fontWeight: 'bold', flex: 1, }}>
                                            Action
                                        </Text>
                                    </View> */}
                    </View>
                  </View>
                </View>
              }
              renderItem={({ item, key }) => {
                return (
                  <View
                    style={{
                      alignSelf: "center",
                      padding: 10,
                      width: "98%",
                      borderRadius: 10,
                      marginTop: 5,
                      backgroundColor:
                        this.state.background == 1
                          ? Colors.tempGreen
                          : Colors.white,
                      elevation: 0.5,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => this.changeBackground()}
                      style={{
                        alignItems: "center",
                        borderColor: "#6a7989",
                        borderRadius: 10,
                        paddingTop: 5,
                        paddingBottom: 5,
                        flexDirection: "row",
                        // backgroundColor: Colors.white,
                      }}
                    >
                      <View style={{ width: "33%" }}>
                        <Text
                          numberOfLines={1}
                          style={{
                            textAlign: "left",
                            width: "100%",
                            color:
                              this.state.background == 1
                                ? Colors.white
                                : Colors.black,
                            fontWeight: "bold",
                            fontSize: RFPercentage(1.7),
                          }}
                        >
                          {item.fullName}
                        </Text>
                      </View>
                      <View style={{ width: "33%" }}>
                        <Text
                          numberOfLines={1}
                          style={{
                            textAlign: "center",
                            width: "100%",
                            color:
                              this.state.background == 1
                                ? Colors.white
                                : Colors.black,
                            fontWeight: "bold",
                            fontSize: RFPercentage(1.7),
                          }}
                        >
                          {item.mobile}
                        </Text>
                      </View>
                      <View style={{ width: "33%" }}>
                        <Text
                          numberOfLines={2}
                          style={{
                            textAlign: "right",
                            width: "100%",
                            color:
                              this.state.background == 1
                                ? Colors.white
                                : Colors.black,
                            fontWeight: "bold",
                            fontSize: RFPercentage(1.7),
                          }}
                        >
                          {item.userRole}
                        </Text>
                      </View>
                      {/* <View style={{ width: '34%', justifyContent: 'space-evenly', alignSelf: 'flex-end', flexDirection: 'row' }} >
                                            {item.userRoleId != 1 ? <TouchableOpacity onPress={() => this.props.navigation.navigate("AdminNewEmploy", { EmplDtls: item, tag: "Update Employee" })} style={{ marginLeft: 12, padding: 3 }}>
                                                <Image style={{ height: 23, width: 23, tintColor: COLORS.black, resizeMode: "contain", }} source={IMAGES.edit} />
                                            </TouchableOpacity> : null}
                                            {item.userRoleId != 1 ? <TouchableOpacity onPress={() => this.deleteEmploy(item)} style={{ marginLeft: 8, padding: 3 }}>
                                                <Image style={{ height: 20, width: 20, tintColor: COLORS.black, resizeMode: "contain", }} source={IMAGES.delete} />
                                            </TouchableOpacity> : null}
                                            <TouchableOpacity onPress={() => this.props.navigation.navigate("AdminNewEmploy", { EmplDtls: item, tag: "Employee Details" })} style={{ marginLeft: 8, padding: 3 }}>
                                                <Image style={{ height: 23, width: 23, tintColor: COLORS.black, resizeMode: "contain", }} source={IMAGES.hidden} />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => this.props.navigation.navigate("AdminEmployeDetails", { UserId: item.usrId })} style={{ marginLeft: 8, padding: 3 }}>
                                                <Image style={{ height: 20, width: 20, tintColor: COLORS.black, resizeMode: "contain", }} source={IMAGES.history} />
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
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{ color: COLORS.placeholderColor, fontSize: 20 }}
                  >
                    Search Record
                    {/* No {this.state.visitors ? "Visitor" : "Employee"} List
                    Record */}
                  </Text>
                </View>
              }
            />
          </View>
        )}
      </View>
    );
  }
}
const sColor = {
  // text:'#FF5733',
  primary: Colors.primary,
  // success:'#FF5733',
  // subText:'#FF5733',
  // searchPlaceholderTextColor: '#FF5733',
  // searchSelectionColor: '#FF5733',
  // itemBackground:'#FF5733',
  // chipColor:'#FF5733',
  // selectToggleTextColor:'#FF5733',
};
const search = {
  confirmText: {
    // color: Colors.primary,
    // backgroundColor:Colors.primary
  },
  // chipText: {
  //     color: '#FF5733',
  //     backgroundColor: '#FF5733',
  //     textDecorationColor: '#FF5733',
  //     textShadowColor: '#FF5733'

  // },
  // itemText: {
  //     color: '#FF5733',
  //     textShadowColor: '#FF5733',
  //     textDecorationColor: '#FF5733',

  // },
  selectedItemText: {
    // color: 'blue',
    backgroundColor: Colors.tempGreen,
  },
  subItemText: {
    // color: '#FF5733',
    // backgroundColor: '#FF5733',
    backgroundColor: Colors.primary,
  },
  confirmText: {
    color: Colors.white,
    textDecorationColor: "#FF5733",
    textShadowColor: "#FF5733",
  },
  item: {
    // backgroundColor:Colors.primary,
    paddingHorizontal: 10,
    textDecorationColor: "#FF5733",
    textShadowColor: "#FF5733",
  },
  subItem: {
    // backgroundColor:Colors.primary,
    paddingHorizontal: 10,
  },
  selectedItem: {
    // backgroundColor: '#FF5733'
  },
  selectedSubItem: {
    // backgroundColor: '#FF5733'
  },
  selectedSubItemText: {
    // backgroundColor:Colors.primary,
    // color: 'blue',
  },

  selectToggleText: {
    // color: '#FF5733',
    fontSize: 15,
  },
  scrollView: { paddingHorizontal: 0 },
};
export default connect(mapStateToProps, mapDispatchToProps)(ApprovalScreen);
