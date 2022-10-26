import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {Header} from '../../CusComponent';
import ReportTab from './ReportTab';

export default class Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View>
        <View style={{width: '100%'}}>
          <Header title={'All Reports'} navigation={this.props.navigation} />
        </View>
        <ReportTab />
      </View>
    );
  }
}
