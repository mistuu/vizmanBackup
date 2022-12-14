import React, {Component} from 'react';
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CodeInput from 'react-native-confirmation-code-input';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-simple-toast';
import {Hoshi} from 'react-native-textinput-effects';
import {connect} from 'react-redux';
import ToggleSwitch from 'toggle-switch-react-native';
import Colors from '../../Assets/Colors/index.js';
import Images from '../../Assets/Images/index.js';
import {COLORS, IMAGES} from '../../Assets/index.js';
import {mapStateToProps} from '../../Reducers/ApiClass.js';
import {axiosAuthGet, axiosPost} from '../../utility/apiConnection.js';

const {width, height} = Dimensions.get('window');
class VisitorUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mob: null,
      name: null,
      email: null,
      designation: null,
      company: null,
      address: null,
      vip: false,
      block: false,
      pan: null,
      mobile: null,
      alEmailId: null,
      vAddlCol1Error: '',
      vAddlCol2Error: '',
      vAddlCol3Error: '',
      vAddlCol4Error: '',
      DisplyName: ['uk'],
      vAddlCol5Error: '',
      mobileError: '',
      emailError: '',
      //add col name
      col1Name: null,
      col2Name: null,
      col3Name: null,
      col4Name: null,
      col5Name: null,

      //col value
      col1Val: null,
      col2Val: null,
      col3Val: null,
      col4Val: null,
      col5Val: null,

      VisitorDetails: null,
      AllSettings: null,
      visitorId:null,
      orgId:null,
      settingsVM:null
    };
  }
  async componentDidMount() {
    console.log('Viz Details==', this.props.route.params.VisitorDetails);
    let res = await axiosAuthGet(
      'Visitor/GetVisitorEdit/' + this.props.route.params.VisitorDetails,
    );
    console.log(res);
    this.setState({VisitorDetails: res});
    var data = res;
    let respo = await axiosAuthGet(
      'Settings/GetAllSettings/' + this.props.LoginDetails.userID,
    );
    this.setState({AllSettings: respo,settingsVM:respo.settingsVM});
    var data1 = respo.mappingVM;
    console.log("Setting ==",respo.settingsVM);
    this.setState({
      orgId:respo.settingsVM.orgId,
      address: data.address,
      mob: data.mobile,
      name: data.fullName,
      email: data.email,
      company: data.company,
      vip: data.isVip,
      designation: data.designation,
      block: data.isBlock,
      visitorId:data.visitorId,
      //col name
      col1Name: data1.col1,
      col2Name: data1.col2,
      col3Name: data1.col3,
      col4Name: data1.col4,
      col5Name: data1.col5,

      //col value
      col1Val: data.addlCol1,
      col2Val: data.addlCol2,
      col3Val: data.addlCol3,
      col4Val: data.addlCol4,
      col5Val: data.addlCol5,
    });
  }
  switchToggle = toggle => {
    this.setState({vip: toggle});
  };
  blockToggle = toggle => {
    this.setState({block: toggle});
  };

  updateSubmit =async () => {
    const data = this.state;
    if(data.mob.length!=0){
      if(data.mob.length>=8){
        if(data.name.length!=0){
          const params = {
            visitorId:data.visitorId,
            orgId:data.orgId,
            userId:this.props.LoginDetails.userID,
            mobile: data.mob,
            fullName: data.name,
            email: data.email,
            designation: data.designation,
            company: data.company,
            address: data.address,
            isVip: data.vip,
            isBlock: data.block,
            addlCol1: data.col1Val,
            addlCol2: data.col2Val,
            addlCol3: data.col3Val,
            addlCol4: data.col4Val,
            addlCol5: data.col5Val,
          };
          console.log('Updated Value==', params);
          let res=await axiosPost("Visitor/VisitorUpdate",params)
          console.log("Update value ==",res);
          if(res==true){
            Toast.show("Visitor Updated")
            this.props.navigation.goBack()
          }
        }else{
          alert("Name is Mendatory")
        }
      
      }else{
        alert("Invalid Mobile Number")
      }
    }else{
      alert("Enter Mobile Number")
    }
   
    
  };
  render() {
    return (
      <View style={{flex: 1, backgroundColor: Colors.whitef4}}>
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
              Update Visitor
            </Text>
          </View>
        </LinearGradient>
        <View style={{flex: 1}}>
          <ScrollView>
            <View
              style={{
                margin: 10,
                paddingTop: 10,
                paddingBottom: 10,
                //   backgroundColor: Colors.white,
                borderRadius: 9,
              }}>
              <ScrollView>
                <TextInput
                  placeholder="Mobile*"
                  keyboardType="phone-pad"
                  value={this.state.mob}
                  maxLength={15}
                  onChangeText={txt => this.setState({mob: txt})}
                  style={styles.textboxStyle}
                />
                <TextInput
                  placeholder="Full Name*"
                  onChangeText={txt => this.setState({name: txt})}
                  value={this.state.name}
                  style={styles.textboxStyle}
                />
                <TextInput
                  placeholder="Email"
                  style={styles.textboxStyle}
                  onChangeText={txt => this.setState({email: txt})}
                  value={this.state.email}
                  keyboardType="email-address"
                />
                <TextInput
                  placeholder="Company"
                  style={styles.textboxStyle}
                  onChangeText={txt => this.setState({company: txt})}
                  value={this.state.company}
                />
                <TextInput
                  placeholder="Address"
                  style={styles.textboxStyle}
                  multiline={true}
                  onChangeText={txt => this.setState({address: txt})}
                  value={this.state.address}
                />
                <View style={{marginTop: 10, marginBottom: 10}}>
                  <ToggleSwitch
                    isOn={this.state.vip}
                    onColor="green"
                    offColor={Colors.grayCCC}
                    label="VIP"
                    labelStyle={{fontSize: 18, color: Colors.gray}}
                    size="medium"
                    onToggle={isOn => this.switchToggle(isOn)}
                  />
                </View>
                <View style={{marginTop: 10, marginBottom: 10}}>
                  <ToggleSwitch
                    isOn={this.state.block}
                    onColor="green"
                    offColor={Colors.grayCCC}
                    label="Block"
                    labelStyle={{fontSize: 18, color: Colors.gray}}
                    size="medium"
                    onToggle={isOn => this.blockToggle(isOn)}
                  />
                </View>
            
                {this.state.settingsVM?.vAddlCol1 && this.props.AllSettings.mappingVM.col1 != null ?(
                  this.state.AllSettings.mappingVM?.valCol1 != 5 ? (
                    <View style={{}}>
                      <TextInput
                        editable={true}
                        returnKeyType={'done'}
                        keyboardType={
                          this.state.AllSettings.mappingVM?.valCol1 == 2 ||
                          this.state.AllSettings.mappingVM?.valCol1 == 4
                            ? 'phone-pad'
                            : 'default'
                        }
                        maxLength={
                          this.state.AllSettings.mappingVM?.valCol1 == 4
                            ? 10
                            : 100
                        }
                        style={[styles.textboxStyle]}
                        ref={el => {
                          this.purpose = el;
                        }}
                        onChangeText={txt => this.setState({col1Val: txt})}
                        value={this.state.col1Val}
                        placeholder={this.state.AllSettings.mappingVM?.col1}
                      />
                      {this.state.vAddlCol1Error != '' ? (
                        <Text style={styles.error}>
                          {this.state.vAddlCol1Error}
                        </Text>
                      ) : null}
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.switchContainer,
                        {
                          // backgroundColor: this.state.enable
                          //   ? COLORS.white
                          //   : COLORS.whiteE0,
                        },
                      ]}>
                      <Text style={styles.switchLable}>
                        {this.state.AllSettings.mappingVM?.col1}
                      </Text>
                      <View style={styles.switch}>
                        <Switch
                          // disabled={!this.state.enable}
                          onValueChange={value => {
                            var VisitorDetails = Object.assign(
                              {},
                              this.state.VisitorDetails,
                              {addlCol1: value},
                            );
                            this.setState({VisitorDetails, col2Val: value});
                          }}
                          value={
                            this.state.VisitorDetails.addlCol1 == 'true'
                              ? true
                              : this.state.VisitorDetails.addlCol1
                          }
                        />
                      </View>
                    </View>
                  )
                ) : null}

                {this.state.settingsVM?.vAddlCol2 ? (
                  this.state.AllSettings.mappingVM?.valCol2 != 5 ? (
                    <View style={{}}>
                      <TextInput
                        editable={true}
                        returnKeyType={'done'}
                        keyboardType={
                          this.state.AllSettings.mappingVM?.valCol2 == 2 ||
                          this.state.AllSettings.mappingVM?.valCol2 == 4
                            ? 'phone-pad'
                            : 'default'
                        }
                        maxLength={
                          this.state.AllSettings.mappingVM?.valCol2 == 4
                            ? 10
                            : 100
                        }
                        style={[styles.textboxStyle]}
                        ref={el => {
                          this.purpose = el;
                        }}
                        onChangeText={txt => this.setState({col2Val: txt})}
                        value={this.state.col2Val}
                        placeholder={this.state.AllSettings.mappingVM?.col2}
                      />
                      {this.state.vAddlCol2Error != '' ? (
                        <Text style={styles.error}>
                          {this.state.vAddlCol2Error}
                        </Text>
                      ) : null}
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.switchContainer,
                        {
                          // backgroundColor: this.state.enable
                          //   ? COLORS.white
                          //   : COLORS.whiteE0,
                        },
                      ]}>
                      <Text style={styles.switchLable}>
                        {this.state.AllSettings.mappingVM?.col2}
                      </Text>
                      <View style={styles.switch}>
                        <Switch
                          // disabled={!this.state.enable}
                          onValueChange={value => {
                            var VisitorDetails = Object.assign(
                              {},
                              this.state.VisitorDetails,
                              {addlCol2: value},
                            );
                            this.setState({VisitorDetails, col2Val: value});
                          }}
                          value={
                            this.state.VisitorDetails.addlCol2 == 'true'
                              ? true
                              : this.state.VisitorDetails.addlCol2
                          }
                        />
                      </View>
                    </View>
                  )
                ) : null}

                {this.state.settingsVM?.vAddlCol3  ? (
                  this.state.AllSettings.mappingVM?.valCol3 != 5 ? (
                    <View style={{}}>
                      <TextInput
                        editable={true}
                        returnKeyType={'done'}
                        keyboardType={
                          this.state.AllSettings.mappingVM?.valCol3 == 2 ||
                          this.state.AllSettings.mappingVM?.valCol3 == 4
                            ? 'phone-pad'
                            : 'default'
                        }
                        maxLength={
                          this.state.AllSettings.mappingVM?.valCol3 == 4
                            ? 10
                            : 100
                        }
                        style={[styles.textboxStyle]}
                        ref={el => {
                          this.purpose = el;
                        }}
                        onChangeText={txt => this.setState({col3Val: txt})}
                        value={this.state.col3Val}
                        placeholder={this.state.AllSettings.mappingVM?.col3}
                      />
                      {this.state.vAddlCol3Error != '' ? (
                        <Text style={styles.error}>
                          {this.state.vAddlCol3Error}
                        </Text>
                      ) : null}
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.switchContainer,
                        {
                          // backgroundColor: this.state.enable
                          //   ? COLORS.white
                          //   : COLORS.whiteE0,
                        },
                      ]}>
                      <Text style={styles.switchLable}>
                        {this.state.AllSettings.mappingVM?.col3}
                      </Text>
                      <View style={styles.switch}>
                        <Switch
                          // disabled={!this.state.enable}
                          onValueChange={value => {
                            var VisitorDetails = Object.assign(
                              {},
                              this.state.VisitorDetails,
                              {addlCol3: value},
                            );
                            this.setState({VisitorDetails, col3Val: value});
                          }}
                          value={
                            this.state.VisitorDetails.addlCol3 == 'true'
                              ? true
                              : this.state.VisitorDetails.addlCol3
                          }
                        />
                      </View>
                    </View>
                  )
                ) : null}

                {this.state.settingsVM?.vAddlCol4 ? (
                  this.state.AllSettings.mappingVM?.valCol4 != 5 ? (
                    <View style={{}}>
                      <TextInput
                        editable={true}
                        returnKeyType={'done'}
                        keyboardType={
                          this.state.AllSettings.mappingVM?.valCol4 == 2 ||
                          this.state.AllSettings.mappingVM?.valCol4 == 4
                            ? 'phone-pad'
                            : 'default'
                        }
                        maxLength={
                          this.state.AllSettings.mappingVM?.valCol4 == 4
                            ? 10
                            : 100
                        }
                        style={[styles.textboxStyle]}
                        ref={el => {
                          this.purpose = el;
                        }}
                        onChangeText={txt => this.setState({col4Val: txt})}
    value={this.state.col4Val}
                        placeholder={this.state.AllSettings.mappingVM?.col4}
                      />
                      {this.state.vAddlCol3Error != '' ? (
                        <Text style={styles.error}>
                          {this.state.vAddlCol3Error}
                        </Text>
                      ) : null}
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.switchContainer,
                        {
                          // backgroundColor: this.state.enable
                          //   ? COLORS.white
                          //   : COLORS.whiteE0,
                        },
                      ]}>
                      <Text style={styles.switchLable}>
                        {this.state.AllSettings.mappingVM?.col4}
                      </Text>
                      <View style={styles.switch}>
                        <Switch
                          // disabled={!this.state.enable}
                          onValueChange={value => {
                            var VisitorDetails = Object.assign(
                              {},
                              this.state.VisitorDetails,
                              {addlCol4: value},
                            );
                            this.setState({VisitorDetails, col4Val: value});
                          }}
                          value={
                            this.state.VisitorDetails.addlCol4 == 'true'
                              ? true
                              : this.state.VisitorDetails.addlCol4
                          }
                        />
                      </View>
                    </View>
                  )
                ) : null}

                {this.state.settingsVM?.vAddlCol5 ? (
                  this.state.AllSettings.mappingVM?.valCol5 != 5 ? (
                    <View style={{}}>
                      <TextInput
                        editable={true}
                        returnKeyType={'done'}
                        keyboardType={
                          this.state.AllSettings.mappingVM?.valCol5 == 2 ||
                          this.state.AllSettings.mappingVM?.valCol5 == 4
                            ? 'phone-pad'
                            : 'default'
                        }
                        maxLength={
                          this.state.AllSettings.mappingVM?.valCol5 == 4
                            ? 10
                            : 100
                        }
                        style={[styles.textboxStyle]}
                        ref={el => {
                          this.purpose = el;
                        }}
                        onChangeText={txt => this.setState({col5Val: txt})}
                        value={this.state.col5Val}
                        placeholder={this.state.AllSettings.mappingVM?.col5}
                      />
                      {this.state.vAddlCol5Error != '' ? (
                        <Text style={styles.error}>
                          {this.state.vAddlCol5Error}
                        </Text>
                      ) : null}
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.switchContainer,
                        {
                          // backgroundColor: this.state.enable
                          //   ? COLORS.white
                          //   : COLORS.whiteE0,
                        },
                      ]}>
                      <Text style={styles.switchLable}>
                        {this.state.AllSettings.mappingVM?.col5}
                      </Text>
                      <View style={styles.switch}>
                        <Switch
                          // disabled={!this.state.enable}
                          onValueChange={value => {
                            var VisitorDetails = Object.assign(
                              {},
                              this.state.VisitorDetails,
                              {addlCol4: value},
                            );
                            this.setState({VisitorDetails, col5Val: value});
                          }}
                          value={
                            this.state.VisitorDetails.addlCol5 == 'true'
                              ? true
                              : this.state.VisitorDetails.addlCol5
                          }
                        />
                      </View>
                    </View>
                  )
                ) : null}
                <TouchableOpacity
                  onPress={() => this.updateSubmit()}
                  style={{marginLeft: 100, marginRight: 100}}>
                  <View
                    style={{
                      marginTop: 30,
                      borderRadius: 8,
                      backgroundColor: Colors.primary,
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        paddingRight: 20,
                        paddingLeft: 20,
                        paddingTop: 5,
                        fontSize: 18,
                        paddingBottom: 5,
                        // justifyContent: 'center',
                        textAlign: 'center',
                      }}>
                      {' '}
                      Update{' '}
                    </Text>
                  </View>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  textboxStyle: {
    marginTop: 5,
    borderWidth: 0.5,
    margin: 5,
    paddingVertical:Platform.OS=="android"?0:10
  },
  textInputStyle: {
    color: COLORS.black,
    marginBottom: 1,
    borderBottomWidth: 1.2,
    borderBottomColor: COLORS.black,
    height: Platform.OS === 'ios' ? 40 : null,
  },
  dateInput: {
    width: '100%',
    height: 45,
    padding: 10,
    fontSize: 18,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 1.5,
    borderBottomColor: 'green',
  },
  datepicker: {width: '100%', height: 55, paddingTop: 10},
  error: {color: 'red', fontSize: 10, padding: 2},
  switchLable: {
    // paddingLeft: 10,
    // paddingTop: 15,
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 18,
    // width: '49%',
  },
  switch: {alignItems: 'center', marginLeft: 10},
  switchContainer: {
    // width: '95%',
    margin: 5,
    alignItems: 'center',
    // height: 55,
    flexDirection: 'row',
    // borderBottomWidth: 0.5,
    borderColor: Colors.black,
  },
});
export default connect(mapStateToProps)(VisitorUpdate);
