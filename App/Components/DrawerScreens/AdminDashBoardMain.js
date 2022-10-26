import React, { Component } from 'react';
import { View, Text } from 'react-native';
import AdminDash from './AdminDash';
import { Header } from "../CusComponent";
import { COLORS } from '../../Assets';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from '../../Reducers/ApiClass';
import AdminEmp from './AdminEmp';

 class AdminDashBoardMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
          <View style={{ flex: 1, backgroundColor: COLORS.whitef4 }}>
        <View style={{ width: "100%" }}>
          <Header title={"Dashboard"} navigation={this.props.navigation} /></View>
        {
            !this.props.AdminSwitch ?
            <AdminDash navigation={this.props.navigation}/>:
            <AdminEmp navigation={this.props.navigation}/>
        }
      </View>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(AdminDashBoardMain);
