import React, {Component} from 'react';
import {View, Text, Image} from 'react-native';
import AdminDash from '../AdminDash';
import {RNSlidingButton, SlideDirection} from 'rn-sliding-button';
import {COLORS} from '../../../Assets';
import Images from '../../../Assets/Images';
import {connect} from 'react-redux';
import {mapDispatchToProps, mapStateToProps} from '../../../Reducers/ApiClass';
import AdminEmp from '../AdminEmp';

class AdminTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: false,
      name:"Employee"
    };
  }
  setLoginDetails = async => {
    const{status}=this.state;
    this.props.adminSwitch(!status);
    this.setState({name:status?"Employee":"Admin",status:!status});

    
    console.log('Hello',this.state.status);
  };
  render() {
    return (
      <View style={{flex: 1, backgroundColor: COLORS.whitef4}}>
        <View style={{height:"100%"}}>
          {this.state.status == false && (
            <AdminDash navigation={this.props.navigation} />
          )}
          {this.state.status == true && (
            <AdminEmp navigation={this.props.navigation} />
          )}
        </View>
            <View style={{ marginTop:-70,bottom:10}}>
          <RNSlidingButton
            style={{
              width: '50%',
            //   marginTop: 10,
              borderRadius: 13,
              marginRight: 0,
              alignSelf: 'center',
              backgroundColor: COLORS.primary,
            }}
            height={50}
            onSlidingSuccess={() => this.setLoginDetails()}
            slideDirection={SlideDirection.RIGHT}>
            <View
              style={{
                flexDirection: 'row',
                // borderTopLeftRadius: 13,
                padding: 5,
                borderBottomLeftRadius: 13,
                backgroundColor: COLORS.primary,
                alignItems: 'center',
                justifyContent:'center'
              }}>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: 'normal',
                  // textAlign: 'center',
                  color: COLORS.white,
                  marginLeft: 10,
                }}>
                {this.state.name}
              </Text>
              <Image
                source={Images.right}
                style={{
                  width: 50,
                  height: 30,
                //   marginLeft: 5,
                  tintColor: COLORS.white,
                //   borderRadius: 13,
                }}
              />
            </View>
          </RNSlidingButton>
        </View>
      
      </View>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(AdminTab);
