import React, { Component } from 'react';
import { View, Text } from 'react-native';
import {Header} from '../../CusComponent';
import {COLORS, IMAGES} from '../../../Assets';
import AdminVizScreen from './AdminVizScreen'
export default class AdminViz extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
        <View
        style={{
flex:1,
          backgroundColor: COLORS.whitef4,
        }}>
        <View style={{width: '100%'}}>
          <Header title={'Visitors'} navigation={this.props.navigation} />
        </View>
        <AdminVizScreen/>
        </View>
    );
  }
}
