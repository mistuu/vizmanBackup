
import { Text, View, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Moment from 'moment';

import React, { Component } from 'react';

export default class DateTimePickerBoth extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            time: new Date(),
            mode: 'date',
            show: false,
        };
    }
    onChange = (event, selectedValue) => {
        console.log(selectedValue);
        this.setState({ show: Platform.OS == 'ios' })
        if (this.state.mode == 'date') {
            const currentDate = selectedValue || new Date();
            this.setState({ date: currentDate, mode: 'time', show: Platform.OS != 'ios' })
            console.log(currentDate);

        } else {
            const selectedTime = selectedValue || new Date();
            this.setState({ time: selectedTime, mode: 'date', show: Platform.OS == 'ios' })

            console.log("Time=", selectedTime);
        }
    };

    showMode = currentMode => {
        this.setState({ show: true, mode: currentMode })

    };

    showDatepicker = () => {
        this.showMode('date');
    };
    render() {
        return (
            <View>
                <TouchableOpacity onPress={() => this.showDatepicker()}>
                    {console.log("time==    ", this.state.time)}
                    <Text style={{ fontSize: 18 }}>{Moment(this.state.date).format("DD-MM-YYYY") + "  " + Moment(this.state.time).format('hh:mm')}</Text>
                </TouchableOpacity>
                {this.state.show && (
                    <DateTimePicker
                        testID='dateTimePicker'
                        style={{ width: '100%', height: 55, paddingTop: 10 }}
                        timeZoneOffsetInMinutes={0}
                        value={this.state.date}
                        mode={this.state.mode}
                        is24Hour={true}
                        display='default'
                        onChange={this.onChange}
                    />
                )}
            </View>
        );
    }
}

