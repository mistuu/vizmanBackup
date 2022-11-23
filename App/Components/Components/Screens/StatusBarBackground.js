'use strict'
import React, { Component } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { COLORS, IMAGES } from '../../Assets';

class StatusBarBackground extends Component{
  render(){
    return(
       
      <View style={[styles.statusBarBackground]}>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  statusBarBackground: {
    height: (Platform.OS === 'ios') ? 28 : 0, //this is just to test if the platform is iOS to give it a height of 18, else, no height (Android apps have their own status bar)
    backgroundColor: COLORS.primary,
  }

})

module.exports= StatusBarBackground