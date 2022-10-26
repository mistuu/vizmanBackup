import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import Colors from '../../../Assets/Colors';
import { COLORS } from '../../../Assets';
import { Text } from 'react-native';
import Courier_Out from './Courier_Out'
import Courier_In from './Courier_In';

const Tabs = createMaterialTopTabNavigator();

const CourierScreen = () => {
    return (
        <Tabs.Navigator
            initialRouteName="Courier-In"

            tabBarOptions={{
                activeTintColor: Colors.white,
                labelStyle: { fontSize: 15, textTransform: 'none' },
                indicatorStyle: { borderColor: Colors.white },
                pressColor: Colors.primary,
                style: {
                    backgroundColor: [
                        COLORS.primary,
                        COLORS.third
                    ], borderBottomColor: [
                        COLORS.primary,
                        COLORS.third
                    ],
                },
            }}>
            <Tabs.Screen
                name="Courier-In"
                component={Courier_In}

            />
            <Tabs.Screen

                name="Courier-Out"
                component={Courier_Out}
            />
        </Tabs.Navigator>
    );
}

export default CourierScreen;