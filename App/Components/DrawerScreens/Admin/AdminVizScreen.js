import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import Colors from '../../../Assets/Colors';
import { COLORS } from '../../../Assets';
import { Text ,StyleSheet,View} from 'react-native';
import AdminVisitor from '../Admin/AdminVisitor'
import BlockedVisitor from '../Admin/BlockedVisitor';

const Tabs = createBottomTabNavigator();

const AdminVizScreen = () => {
    return (
        
        <Tabs.Navigator
            initialRouteName="AdminVisitor"

            tabBarOptions={{
                showLabel:false,
                activeBackgroundColor:Colors.primary,
                style: {
                   position:'absolute',
                   bottom:25,
                   left:20,
                   right:20,
                   elevation:0,
                   backgroundColor:Colors.white,
                   borderRadius:15,
                   height:50,
                   ...styles.shadow
                },
            }}>
            <Tabs.Screen
                name="AdminVisitor"
                component={AdminVisitor}
                options={{
                    tabBarIcon:({focused})=>(
                        <View style={{alignItems:'center',borderRadius:15}}>
                            <Text style={{fontSize:18, color:focused? Colors.white:Colors.graye00}}>All Visitors</Text>
                        </View>
                    )
                }}

            />
            <Tabs.Screen

                name="BlockedVisitor"
                component={BlockedVisitor}
                options={{
                    tabBarIcon:({focused})=>(
                        <View style={{alignItems:'center',borderRadius:15}}>
                            <Text style={{fontSize:18, color:focused? Colors.white:Colors.graye00}}>Blocked Visitors</Text>
                        </View>
                    )
                }}
            />
        </Tabs.Navigator>
    );
}
const styles=StyleSheet.create({
    shadow:{
        shadowColor:'#7F5DF0',
        shadowOffset:{
            height:0,
            width:0
        },
        shadowOpacity:0.25,
        shadowRadius:3.5,
        elevation:5,

    }
})
export default AdminVizScreen;