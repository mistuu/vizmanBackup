import React, { Component } from 'react';
import { View, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Header } from '../CusComponent';
import CourierScreen from './Courier/CourierScreen';

class Courier extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount() {
        // console.log("Hello");
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: COLORS.whitef4 }}>
                <View style={{ width: "100%" ,marginTop:Platform.OS=="ios"?-20:0}}>
                    <Header title={"Courier"} navigation={this.props.navigation} />
                </View>
                <LinearGradient
                    style={{ width: '100%', height: "100%", }}
                    colors={[
                        COLORS.primary,
                        COLORS.third
                    ]}>
                    <CourierScreen />
                </LinearGradient>
            </View>
        );
    }
}

export default Courier;
