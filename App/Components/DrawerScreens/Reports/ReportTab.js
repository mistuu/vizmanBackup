import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import Colors from '../../../Assets/Colors';
import {COLORS} from '../../../Assets';
import {Text} from 'react-native';
import AllVizRepo from './AllVizRepo';
import InvitedVIzRepo from './InvitedVIzRepo';
import DirectVizRepo from './DirectVizRepo';
import TimeSpentRepo from './TimeSpentRepo';
import AttendRepo from './AttendRepo';
import CourierRepo from './CourierRepo';

const Tabs = createMaterialTopTabNavigator();

const ReportTab = () => {
  return (
    <Tabs.Navigator
      initialRouteName="All Visitors"
      tabBarOptions={{
        activeTintColor: Colors.primary,
    
      }}>
      <Tabs.Screen name="All Visitors" component={AllVizRepo} />
      <Tabs.Screen name="Invited Visitors" component={InvitedVIzRepo} />
      {/* <Tabs.Screen name="Direct Visitors" component={DirectVizRepo} />
      <Tabs.Screen name="Time Spent" component={TimeSpentRepo} />
      <Tabs.Screen name="Attendance Master" component={AttendRepo} />
      <Tabs.Screen name="Courier" component={CourierRepo} /> */}
    </Tabs.Navigator>
  );
};

export default ReportTab;
