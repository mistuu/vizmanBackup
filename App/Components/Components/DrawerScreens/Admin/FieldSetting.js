import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Icon from 'react-native-vector-icons/MaterialIcons';

import LinearGradient from 'react-native-linear-gradient';
import {COLORS, IMAGES} from '../../../Assets';
import Images from '../../../Assets/Images';
import ToggleSwitch from 'toggle-switch-react-native';
import Colors from '../../../Assets/Colors';
import {axiosAuthGet, axiosPost} from '../../../utility/apiConnection';
import {connect} from 'react-redux';
import {mapStateToProps} from '../../../Reducers/ApiClass';
import Toast from 'react-native-simple-toast';
import DropDownPicker from 'react-native-dropdown-picker';

class FieldSetting extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    this.state = {
      mappID: 0,
      templateId: 4,
      settingsID: 0,
      userId: null,
      orgId: null,
      address: false,
      vaccination: false,
      Company: false,
      Department: false,
      Designation: false,
      Email: false,
      idProof: false,
      photo: false,
      purpose: false,
      temprature: false,
      typeField: [
        {name: 'Text', id: 1},
        {name: 'Number', id: 2},
        {name: 'Email', id: 3},
        {name: 'Mobile', id: 4},
        {name: 'Check Box', id: 5},
      ],
      cal1Value: [],
      cal2Value: [],
      cal3Value: [],
      cal4Value: [],
      cal5Value: [],

      coltrue: false,
      column1: null,
      col1: false,

      col2true: false,
      column2: null,
      col2: false,

      col3true: false,
      column3: null,
      col3: false,

      col4true: false,
      column4: null,
      col4: false,

      col5true: false,
      column5: null,
      col5: false,

      val1:null,
      val2:null,
      val3:null,
      val4:null,
      val5:null,
    };
  }
  componentDidMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
    this.getData();
  }
  getData = async () => {
    let respo = await axiosAuthGet(
      'Settings/GetAllSettings/' + this.props.LoginDetails.userID,
    );
    console.log(respo);
    var sett = respo.settingsVM;
    var mappID = respo.mappingVM;
    this.setState({
      mappID: mappID.mappID,
      templateId: sett.templateId,
      address: sett.vAddress,
      vaccination: sett.vArogya,
      Company: sett.vCompany,
      Department: sett.vDepartment,
      Designation: sett.vDesignation,
      Email: sett.vEmail,
      idProof: sett.vIdProof,
      photo: sett.vPhotoProof,
      purpose: sett.vPurpose,
      temprature: sett.vtemprature,
      settingsID: sett.settingsID,
      userId: sett.userId,
      orgId: sett.orgId,
      col1: sett.vAddlCol1,
      col2: sett.vAddlCol2,
      col3: sett.vAddlCol3,
      col4: sett.vAddlCol4,
      col5: sett.vAddlCol5,
      column1: mappID.col1,
      column2: mappID.col2,
      column3: mappID.col3,
      column4: mappID.col4,
      column5: mappID.col5,
      cal1Value: [mappID.valCol1],
      cal2Value: [mappID.valCol2],
      cal3Value: [mappID.valCol3],
      cal4Value: [mappID.valCol4],
      cal5Value: [mappID.valCol5],
      coltrue: sett.vAddlCol1,
      col2true: sett.vAddlCol2,
      col3true: sett.vAddlCol3,
      col4true: sett.vAddlCol4,
      col5true: sett.vAddlCol5,

      val1:mappID.col1,
      val2:mappID.col2,
      val3:mappID.col3,
      val4:mappID.col4,
      val5:mappID.col5,      
    });
  };
  handleBackButtonClick() {
    this.props.navigation.goBack();
    return true;
  }
  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }
  onCal1Change = async value => {
    console.log(value);
    this.setState({cal1Value: value});
  };
  onCal2Change = async value => {
    console.log(value);
    this.setState({cal2Value: value});
  };
  onCal3Change = async value => {
    console.log(value);
    this.setState({cal3Value: value});
  };
  onCal4Change = async value => {
    console.log(value);
    this.setState({cal4Value: value});
  };
  onCal5Change = async value => {
    console.log(value);
    this.setState({cal5Value: value});
  };

  switchToggle(toggle) {
    console.log(toggle);
    this.setState({address: toggle});
  }
  vaccineToggle(toggle) {
    console.log(toggle);
    this.setState({vaccination: toggle});
  }
  companyToggle(toggle) {
    console.log(toggle);
    this.setState({Company: toggle});
  }
  departmantToggle(toggle) {
    console.log(toggle);
    this.setState({Department: toggle});
  }
  designationToggle(toggle) {
    console.log(toggle);
    this.setState({Designation: toggle});
  }
  emailToggle(toggle) {
    console.log(toggle);
    this.setState({Email: toggle});
  }
  idProofToggle(toggle) {
    console.log(toggle);
    this.setState({idProof: toggle});
  }
  photoToggle(toggle) {
    console.log(toggle);
    this.setState({photo: toggle});
  }
  purposeToggle(toggle) {
    console.log(toggle);
    this.setState({purpose: toggle});
  }
  tempToggle(toggle) {
    console.log(toggle);
    this.setState({temprature: toggle});
  }
  col1Toggle(toggle) {
    this.setState({coltrue: toggle});
  }
  col2Toggle(toggle) {
    this.setState({col2true: toggle});
  }
  col3Toggle(toggle) {
    this.setState({col3true: toggle});
  }
  col4Toggle(toggle) {
    this.setState({col4true: toggle});
  }
  col5Toggle(toggle) {
    this.setState({col5true: toggle});
  }
  submitData = async () => {
    const val = this.state;
    var params = {
      mappingVM: {
        MappID: val.mappID,
        Col1: val.column1,
        Col2: val.column2,
        Col3: val.column3,
        Col4: val.column4,
        Col5: val.column5,
        ValCol1: val.cal1Value[0],
        ValCol2: val.cal2Value[0],
        ValCol3: val.cal3Value[0],
        ValCol4: val.cal4Value[0],
        ValCol5: val.cal5Value[0],
        UserId: val.userId,
        OrgId: val.orgId,
      },
      settingsVM: {
        SettingsID: val.settingsID,
        UserId: val.userId,
        OrgId: val.orgId,
        templateId: val.templateId,
        vAddlCol1: val.coltrue,
        vAddlCol2: val.col2true,
        vAddlCol3: val.col3true,
        vAddlCol4: val.col4true,
        vAddlCol5: val.col5true,
        VAddress: val.address,
        VCompany: val.Company,
        VDesignation: val.Designation,
        VEmail: val.Email,
        VIdProof: val.idProof,
        VPhotoProof: val.photo,
        VDepartment: val.Department,
        VPurpose: val.purpose,
        Vtemprature: val.temprature,
        VArogya: val.vaccination,
      },
    };
    console.log(params);
    let response = await axiosPost('Settings/UpdateSetting', params);
    console.log(response);
    let re = await axiosPost('Settings/UpdateColomMapping', params);
    console.log(re);
    if (response == true) {
      Toast.show('Update Successfully ');
      this.props.navigation.navigate('SettingScreen');
    }
  };
  setenablefield = async col => {
    const val = this.state;

    const params = {
      settingsVM: {
        SettingsID: val.settingsID,
        UserId: val.userId,
        OrgId: val.orgId,
        templateId: val.templateId,
        vAddlCol1: col == 1 && true,
        vAddlCol2: col == 2 && true,
        vAddlCol3: col == 3 && true,
        vAddlCol4: col == 4 && true,
        vAddlCol5: col == 5 && true,
      },
    };

    let response = await axiosPost('Settings/UpdateSetting', params);
    console.log(response);
  };
  render() {
    return (
      <View style={{flex: 1, backgroundColor: COLORS.whitef4}}>
        <LinearGradient
          style={{
            flexDirection: 'row',
            width: '100%',
            height: Platform.OS == 'ios' ? '16%' : '12%',
            justifyContent: 'flex-start',
            alignItems: 'center',
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          }}
          colors={[COLORS.primary, COLORS.third]}>
          <TouchableOpacity
            onPress={() => this.handleBackButtonClick()}
            style={{
              padding: 10,
              marginTop: 40,
              alignItems: 'flex-start',
              marginLeft: 10,
            }}>
            <Image
              source={Images.back}
              style={{
                height: 15,
                padding: 10,
                width: 22,
                tintColor: 'white',
                alignSelf: 'center',
              }}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: COLORS.white,
              marginLeft: 20,
              marginTop: 40,
            }}>
            Field Setting
          </Text>
        </LinearGradient>
        <ScrollView nestedScrollEnabled={true}>
          <View
            style={{
              marginTop: 40,
              justifyContent: 'center',
              marginLeft: 20,
              marginRight: 5,
            }}>
            <View style={{flexDirection: 'row', width: '100%'}}>
              <View style={{width: '50%'}}>
                <Text
                  style={{
                    marginRight: 60,
                    color: 'red',
                    marginTop: 20,
                    fontSize: 18,
                  }}>
                  Field Name
                </Text>
                <Text style={{marginRight: 60, marginTop: 20, fontSize: 18}}>
                  Address
                </Text>
                <Text style={{marginRight: 45, marginTop: 20, fontSize: 18}}>
                  Vaccination
                </Text>
                <Text style={{marginRight: 45, marginTop: 20, fontSize: 18}}>
                  Company
                </Text>
                <Text style={{marginRight: 45, marginTop: 20, fontSize: 18}}>
                  Department
                </Text>
                <Text style={{marginRight: 45, marginTop: 20, fontSize: 18}}>
                  Designation
                </Text>
                <Text style={{marginRight: 45, marginTop: 20, fontSize: 18}}>
                  Email
                </Text>
                <Text style={{marginRight: 45, marginTop: 20, fontSize: 18}}>
                  ID Proof
                </Text>
                <Text style={{marginRight: 45, marginTop: 20, fontSize: 18}}>
                  Photo
                </Text>
                <Text style={{marginRight: 45, marginTop: 20, fontSize: 18}}>
                  Purpose
                </Text>
                <Text style={{marginRight: 45, marginTop: 20, fontSize: 18}}>
                  Temprature
                </Text>
                {this.state.column1!=null && (
                  <Text style={{marginRight: 45, marginTop: 20, fontSize: 18}}>
                    {this.state.column1}
                  </Text>
                )}
                {this.state.column2!=null && (
                  <Text style={{marginRight: 45, marginTop: 22, fontSize: 18}}>
                    {this.state.column2}
                  </Text>
                )}
                {this.state.column3!=null && (
                  <Text style={{marginRight: 45, marginTop: 25, fontSize: 18}}>
                    {this.state.column3}
                  </Text>
                )}
                {this.state.column4!=null && (
                  <Text style={{marginRight: 45, marginTop: 30, fontSize: 18}}>
                    {this.state.column4}
                  </Text>
                )}
                {this.state.column5!=null && (
                  <Text style={{marginRight: 45, marginTop: 30, fontSize: 18}}>
                    {this.state.column5}
                  </Text>
                )}
              </View>
              <View style={{width: '50%'}}>
                <Text
                  style={{
                    marginRight: 60,
                    color: 'red',
                    marginTop: 20,
                    fontSize: 18,
                  }}>
                  Enabled
                </Text>
                <View style={{marginTop: 20}}>
                  <ToggleSwitch
                    isOn={this.state.address}
                    onColor={Colors.primary}
                    offColor={Colors.grayCCC}
                    label=""
                    labelStyle={{fontSize: 18, color: Colors.black}}
                    size="medium"
                    onToggle={isOn => this.switchToggle(isOn)}
                  />
                </View>
                <View style={{marginTop: 20}}>
                  <ToggleSwitch
                    isOn={this.state.vaccination}
                    onColor={Colors.primary}
                    offColor={Colors.grayCCC}
                    label=""
                    labelStyle={{fontSize: 18, color: Colors.black}}
                    size="medium"
                    onToggle={isOn => this.vaccineToggle(isOn)}
                  />
                </View>
                <View style={{marginTop: 20}}>
                  <ToggleSwitch
                    isOn={this.state.Company}
                    onColor={Colors.primary}
                    offColor={Colors.grayCCC}
                    label=""
                    labelStyle={{
                      fontSize: 18,
                      marginRight: 45,
                      color: Colors.black,
                    }}
                    size="medium"
                    onToggle={isOn => this.companyToggle(isOn)}
                  />
                </View>
                <View style={{marginTop: 20}}>
                  <ToggleSwitch
                    isOn={this.state.Department}
                    onColor={Colors.primary}
                    offColor={Colors.grayCCC}
                    label=""
                    labelStyle={{
                      fontSize: 18,
                      marginRight: 25,
                      color: Colors.black,
                    }}
                    size="medium"
                    onToggle={isOn => this.departmantToggle(isOn)}
                  />
                </View>
                <View style={{marginTop: 20}}>
                  <ToggleSwitch
                    isOn={this.state.Designation}
                    onColor={Colors.primary}
                    offColor={Colors.grayCCC}
                    label=""
                    labelStyle={{
                      fontSize: 18,
                      marginRight: 25,
                      color: Colors.black,
                    }}
                    size="medium"
                    onToggle={isOn => this.designationToggle(isOn)}
                  />
                </View>
                <View style={{marginTop: 20}}>
                  <ToggleSwitch
                    isOn={this.state.Email}
                    onColor={Colors.primary}
                    offColor={Colors.grayCCC}
                    label=""
                    labelStyle={{
                      fontSize: 18,
                      marginRight: 75,
                      color: Colors.black,
                    }}
                    size="medium"
                    onToggle={isOn => this.emailToggle(isOn)}
                  />
                </View>
                <View style={{marginTop: 20}}>
                  <ToggleSwitch
                    isOn={this.state.idProof}
                    onColor={Colors.primary}
                    offColor={Colors.grayCCC}
                    label=""
                    labelStyle={{
                      fontSize: 18,
                      marginRight: 55,
                      color: Colors.black,
                    }}
                    size="medium"
                    onToggle={isOn => this.idProofToggle(isOn)}
                  />
                </View>
                <View style={{marginTop: 20}}>
                  <ToggleSwitch
                    isOn={this.state.photo}
                    onColor={Colors.primary}
                    offColor={Colors.grayCCC}
                    label=""
                    labelStyle={{
                      fontSize: 18,
                      marginRight: 75,
                      color: Colors.black,
                    }}
                    size="medium"
                    onToggle={isOn => this.photoToggle(isOn)}
                  />
                </View>
                <View style={{marginTop: 20}}>
                  <ToggleSwitch
                    isOn={this.state.purpose}
                    onColor={Colors.primary}
                    offColor={Colors.grayCCC}
                    label=""
                    labelStyle={{
                      fontSize: 18,
                      marginRight: 55,
                      color: Colors.black,
                    }}
                    size="medium"
                    onToggle={isOn => this.purposeToggle(isOn)}
                  />
                </View>
                <View style={{marginTop: 20}}>
                  <ToggleSwitch
                    isOn={this.state.temprature}
                    onColor={Colors.primary}
                    offColor={Colors.grayCCC}
                    label=""
                    labelStyle={{
                      fontSize: 18,
                      marginRight: 30,
                      color: Colors.black,
                    }}
                    size="medium"
                    onToggle={isOn => this.tempToggle(isOn)}
                  />
                </View>
                {this.state.column1!=null && (
                  <View style={{marginTop: 20, flexDirection: 'row'}}>
                    <ToggleSwitch
                      isOn={this.state.coltrue}
                      onColor={Colors.primary}
                      offColor={Colors.grayCCC}
                      label=""
                      labelStyle={{
                        fontSize: 18,
                        marginRight: 30,
                        color: Colors.black,
                      }}
                      size="medium"
                      onToggle={isOn => this.col1Toggle(isOn)}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({
                          col1: false,
                          column1: null,
                          coltrue: false,
                        })
                      }
                      style={{
                        backgroundColor: Colors.red,
                        padding: 3,
                        borderRadius: 8,
                        marginLeft: 30,
                      }}>
                      <Image
                        source={Images.iconminus}
                        style={{height: 25, width: 25}}
                      />
                    </TouchableOpacity>
                  </View>
                )}
                {this.state.column2!=null && (
                  <View style={{marginTop: 20, flexDirection: 'row'}}>
                    <ToggleSwitch
                      isOn={this.state.col2true}
                      onColor={Colors.primary}
                      offColor={Colors.grayCCC}
                      label=""
                      labelStyle={{
                        fontSize: 18,
                        marginRight: 30,
                        color: Colors.black,
                      }}
                      size="medium"
                      onToggle={isOn => this.col2Toggle(isOn)}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({
                          col2: false,
                          column2: null,
                          col2true: false,
                        })
                      }
                      style={{
                        backgroundColor: Colors.red,
                        padding: 3,
                        borderRadius: 8,
                        marginLeft: 30,
                      }}>
                      <Image
                        source={Images.iconminus}
                        style={{height: 25, width: 25}}
                      />
                    </TouchableOpacity>
                  </View>
                )}
                {this.state.column3!=null && (
                  <View style={{marginTop: 20, flexDirection: 'row'}}>
                    <ToggleSwitch
                      isOn={this.state.col3true}
                      onColor={Colors.primary}
                      offColor={Colors.grayCCC}
                      label=""
                      labelStyle={{
                        fontSize: 18,
                        marginRight: 30,
                        color: Colors.black,
                      }}
                      size="medium"
                      onToggle={isOn => this.col3Toggle(isOn)}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({
                          col3: false,
                          column3: null,
                          col3true: false,
                        })
                      }
                      style={{
                        backgroundColor: Colors.red,
                        padding: 3,
                        borderRadius: 8,
                        marginLeft: 30,
                      }}>
                      <Image
                        source={Images.iconminus}
                        style={{height: 25, width: 25}}
                      />
                    </TouchableOpacity>
                  </View>
                )}
                {this.state.column4!=null && (
                  <View style={{marginTop: 20, flexDirection: 'row'}}>
                    <ToggleSwitch
                      isOn={this.state.col4true}
                      onColor={Colors.primary}
                      offColor={Colors.grayCCC}
                      label=""
                      labelStyle={{
                        fontSize: 18,
                        marginRight: 30,
                        color: Colors.black,
                      }}
                      size="medium"
                      onToggle={isOn => this.col4Toggle(isOn)}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({
                          col4: false,
                          column4: null,
                          col4true: false,
                        })
                      }
                      style={{
                        backgroundColor: Colors.red,
                        padding: 3,
                        borderRadius: 8,
                        marginLeft: 30,
                      }}>
                      <Image
                        source={Images.iconminus}
                        style={{height: 25, width: 25}}
                      />
                    </TouchableOpacity>
                  </View>
                )}
                {this.state.column5!=null && (
                  <View style={{marginTop: 20, flexDirection: 'row'}}>
                    <ToggleSwitch
                      isOn={this.state.col5true}
                      onColor={Colors.primary}
                      offColor={Colors.grayCCC}
                      label=""
                      labelStyle={{
                        fontSize: 18,
                        marginRight: 30,
                        color: Colors.black,
                      }}
                      size="medium"
                      onToggle={isOn => this.col5Toggle(isOn)}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({
                          col5: false,
                          column5: null,
                          col5true: false,
                        })
                      }
                      style={{
                        backgroundColor: Colors.red,
                        padding: 3,
                        borderRadius: 8,
                        marginLeft: 30,
                      }}>
                      <Image
                        source={Images.iconminus}
                        style={{height: 25, width: 25}}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
            <Text
              style={{
                textAlign: 'center',
                marginRight: 20,
                color: Colors.red,
                marginTop: 20,
                fontSize: 18,
              }}>
              Add New Columns (Upto 5 allowed) to your Visitor Form
            </Text>
            {/* column 1 */}
            <View>
              <Text style={{marginRight: 20, marginTop: 20, fontSize: 18}}>
                Column 1
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput
                  placeholder="column 1"
                  onChangeText={txt => this.setState({val1: txt})}
                  value={this.state.val1}
                  style={{
                    padding: 5,
                    borderWidth: 0.5,
                    height: 70,
                    borderRadius: 8,
                    backgroundColor: Colors.white,
                    borderColor: Colors.graye3,
                    width: '40%',
                  }}
                />
                <View
                  style={{
                    width: '35%',
                    marginLeft: 10,
                    borderWidth: 1,
                    borderColor: Colors.graye3,
                    backgroundColor: Colors.white,
                    borderRadius: 8,
                  }}>
                  <SectionedMultiSelect
                    items={this.state.typeField}
                    searchPlaceholderText="Search"
                    IconRenderer={Icon}
                    styleDropdownMenu={{height: 50}}
                    uniqueKey="id"
                    selectText="Type"
                    showDropDowns={true}
                    single={true}
                    onSelectedItemsChange={value => this.onCal1Change(value)}
                    selectedItems={this.state.cal1Value}
                    hideConfirm={true}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => {this.setState({col1: true,column1:this.state.val1})}}
                  style={{
                    backgroundColor: Colors.tempGreen,
                    padding: 3,
                    borderRadius: 8,
                    marginLeft: 10,
                  }}>
                  <Image
                    source={Images.iconplus}
                    style={{height: 25, width: 25}}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* column 2 */}
            <View>
              <Text style={{marginRight: 20, marginTop: 20, fontSize: 18}}>
                Column 2
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput
                  placeholder="column 2"
                  onChangeText={txt => this.setState({val2: txt})}
                  value={this.state.val2}
                  style={{
                    padding: 5,
                    borderWidth: 0.5,
                    height: 70,
                    borderRadius: 8,
                    backgroundColor: Colors.white,
                    borderColor: Colors.graye3,
                    width: '40%',
                  }}
                />
                <View
                  style={{
                    width: '35%',
                    marginLeft: 10,
                    borderWidth: 1,
                    borderColor: Colors.graye3,
                    backgroundColor: Colors.white,
                    borderRadius: 8,
                  }}>
                  <SectionedMultiSelect
                    items={this.state.typeField}
                    searchPlaceholderText="Search"
                    IconRenderer={Icon}
                    styleDropdownMenu={{height: 50}}
                    uniqueKey="id"
                    selectText="Type"
                    showDropDowns={true}
                    single={true}
                    onSelectedItemsChange={value => this.onCal2Change(value)}
                    selectedItems={this.state.cal2Value}
                    hideConfirm={true}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => this.setState({col2: true,column2:this.state.val2})}
                  style={{
                    backgroundColor: Colors.tempGreen,
                    padding: 3,
                    borderRadius: 8,
                    marginLeft: 10,
                  }}>
                  <Image
                    source={Images.iconplus}
                    style={{height: 25, width: 25}}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Column 3 */}
            <View>
              <Text style={{marginRight: 20, marginTop: 20, fontSize: 18}}>
                Column 3
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput
                  placeholder="column 3"
                  onChangeText={txt => this.setState({val3: txt})}
                  value={this.state.val3}
                  style={{
                    padding: 5,
                    borderWidth: 0.5,
                    height: 70,
                    borderRadius: 8,
                    backgroundColor: Colors.white,
                    borderColor: Colors.graye3,
                    width: '40%',
                  }}
                />
                <View
                  style={{
                    width: '35%',
                    marginLeft: 10,
                    borderWidth: 1,
                    borderColor: Colors.graye3,
                    backgroundColor: Colors.white,
                    borderRadius: 8,
                  }}>
                  <SectionedMultiSelect
                    items={this.state.typeField}
                    searchPlaceholderText="Search"
                    IconRenderer={Icon}
                    styleDropdownMenu={{height: 50}}
                    uniqueKey="id"
                    selectText="Type"
                    showDropDowns={true}
                    single={true}
                    onSelectedItemsChange={value => this.onCal3Change(value)}
                    selectedItems={this.state.cal3Value}
                    hideConfirm={true}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => this.setState({col3: true,column3:this.state.val3})}
                  style={{
                    backgroundColor: Colors.tempGreen,
                    padding: 3,
                    borderRadius: 8,
                    marginLeft: 10,
                  }}>
                  <Image
                    source={Images.iconplus}
                    style={{height: 25, width: 25}}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* column 4 */}
            <View>
              <Text style={{marginRight: 20, marginTop: 20, fontSize: 18}}>
                Column 4
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput
                  placeholder="column 4"
                  onChangeText={txt => this.setState({val4: txt})}
                  value={this.state.val4}
                  style={{
                    padding: 5,
                    borderWidth: 0.5,
                    height: 70,
                    borderRadius: 8,
                    backgroundColor: Colors.white,
                    borderColor: Colors.graye3,
                    width: '40%',
                  }}
                />
                <View
                  style={{
                    width: '35%',
                    marginLeft: 10,
                    borderWidth: 1,
                    borderColor: Colors.graye3,
                    backgroundColor: Colors.white,
                    borderRadius: 8,
                  }}>
                  <SectionedMultiSelect
                    items={this.state.typeField}
                    searchPlaceholderText="Search"
                    IconRenderer={Icon}
                    styleDropdownMenu={{height: 50}}
                    uniqueKey="id"
                    selectText="Type"
                    showDropDowns={true}
                    single={true}
                    onSelectedItemsChange={value => this.onCal4Change(value)}
                    selectedItems={this.state.cal4Value}
                    hideConfirm={true}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => this.setState({col4: true,column4:this.state.val4})}
                  style={{
                    backgroundColor: Colors.tempGreen,
                    padding: 3,
                    borderRadius: 8,
                    marginLeft: 10,
                  }}>
                  <Image
                    source={Images.iconplus}
                    style={{height: 25, width: 25}}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* column 5 */}
            <View>
              <Text style={{marginRight: 20, marginTop: 20, fontSize: 18}}>
                Column 5
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput
                  placeholder="column 5"
                  onChangeText={txt => this.setState({val5: txt})}
                  value={this.state.val5}
                  style={{
                    padding: 5,
                    borderWidth: 0.5,
                    height: 70,
                    borderRadius: 8,
                    backgroundColor: Colors.white,
                    borderColor: Colors.graye3,
                    width: '40%',
                  }}
                />
                <View
                  style={{
                    width: '35%',
                    marginLeft: 10,
                    borderWidth: 1,
                    borderColor: Colors.graye3,
                    backgroundColor: Colors.white,
                    borderRadius: 8,
                  }}>
                  <SectionedMultiSelect
                    items={this.state.typeField}
                    searchPlaceholderText="Search"
                    IconRenderer={Icon}
                    styleDropdownMenu={{height: 50}}
                    uniqueKey="id"
                    selectText="Type"
                    showDropDowns={true}
                    single={true}
                    onSelectedItemsChange={value => this.onCal5Change(value)}
                    selectedItems={this.state.cal5Value}
                    hideConfirm={true}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => this.setState({col5: true,column5:this.state.val5})}
                  style={{
                    backgroundColor: Colors.tempGreen,
                    padding: 3,
                    borderRadius: 8,
                    marginLeft: 10,
                  }}>
                  <Image
                    source={Images.iconplus}
                    style={{height: 25, width: 25}}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                this.submitData();
              }}
              style={{
                borderRadius: 8,
                marginTop: 30,
                marginLeft: 'auto',
                marginRight: 10,
                width: '30%',
                alignItems: 'center',
                padding: 10,
              }}>
              <LinearGradient
                style={{
                  paddingLeft: 25,
                  paddingRight: 25,
                  paddingTop: 7,
                  borderRadius: 8,
                  paddingBottom: 7,
                }}
                colors={[COLORS.primary, COLORS.third]}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: COLORS.white,
                    textAlign: 'center',
                    alignSelf: 'center',
                  }}>
                  Next
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}
const search = {
  confirmText: {
    color: '#fff',
  },
  chipText: {
    color: '#FF5733',
    backgroundColor: '#FF5733',
    textDecorationColor: '#FF5733',
    textShadowColor: '#FF5733',
  },
  itemText: {
    color: '#FF5733',
    textShadowColor: '#FF5733',
    textDecorationColor: '#FF5733',
  },
  selectedItemText: {
    // color: 'blue',
  },
  subItemText: {
    color: '#FF5733',
  },
  confirmText: {
    backgroundColor: '#FF5733',
    color: '#FF5733',
    textDecorationColor: '#FF5733',
    textShadowColor: '#FF5733',
  },
  item: {
    paddingHorizontal: 10,
    textDecorationColor: '#FF5733',
    textShadowColor: '#FF5733',
  },
  subItem: {
    paddingHorizontal: 10,
  },
  selectedItem: {
    // backgroundColor: '#FF5733'
  },
  selectedSubItem: {
    // backgroundColor: '#FF5733'
  },
  selectedSubItemText: {
    // color: 'blue',
  },
  chipText: {
    maxHeight: 50,
  },
  selectToggleText: {
    color: '#FF5733',
    fontSize: 15,
  },
  scrollView: {paddingHorizontal: 0},
};
export default connect(mapStateToProps)(FieldSetting);
