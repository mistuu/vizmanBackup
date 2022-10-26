
import React from 'react';
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export function EmployListRenderItem(props) {
    return (
        <TouchableOpacity style={{ paddingVertical: 10, marginLeft: "1%", marginRight: "1%", width: '98%', borderRadius: 10, marginTop: 5, backgroundColor: COLORS.white }}
            onPress={() => { }} disabled={true}>

            <View style={{ flexDirection: "row", backgroundColor: COLORS.white, borderRadius: 10, overflow: 'hidden', }}>
                <View style={{ paddingLeft: 5, paddingRight: 2, width: '25%', }} >
                    <Text numberOfLines={1} style={{ width: '100%', paddingLeft: 10, color: '#6a7989', fontWeight: 'bold', fontSize: RFValue(7.2, Dimensions.get('screen').width) }}>
                        {props.item.fullName}
                    </Text>
                </View>
                <View style={{ paddingLeft: 2, alignItems: "center", paddingRight: 2, width: '25%' }}>
                    <Text numberOfLines={1} style={{ width: '100%', color: '#6a7989', fontWeight: 'bold', fontSize: RFValue(7.2, Dimensions.get('screen').width) }}>
                        {props.item.mobile}
                    </Text>
                </View>
                <View style={{ paddingLeft: 2, alignItems: "center", paddingRight: 2, width: '25%' }}>

                    <Text numberOfLines={1} style={{ width: '100%', color: '#6a7989', fontWeight: 'bold', fontSize: RFValue(7.2, Dimensions.get('screen').width) }}> {props.item.roleName}  </Text>
                </View>
                <View style={{ paddingLeft: 2, alignItems: "center", paddingRight: 2, width: '25%' }}>
                    <TouchableOpacity onPress={props.onPress} style={{ paddingVertical: 2, paddingHorizontal: 4, borderRadius: 5, backgroundColor: !props.item.isCheckIN ? COLORS.skyBlue : COLORS.tempYellow }}>
                        <Text numberOfLines={1} style={{ textAlign: 'center', color: COLORS.white, fontSize: RFValue(7.2, Dimensions.get('screen').width) }}>{!props.item.isCheckIN ? 'Check In' : 'Check Out'}</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </TouchableOpacity>
    )
}