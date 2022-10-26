import React, { Component } from 'react';
import { Image, Modal, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { mapStateToProps } from '../../Reducers/ApiClass';



class ActivityLoader extends Component {

    componentDidMount() {

    }
    render() {
        return (
            <Modal
                visible={this.props.isLoading}
                transparent={true}
            >
                {this.props.isLoading ? <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%', backgroundColor: 'rgba(52, 52, 52, 0.8)' }}>
                    <Image
                        source={require('../../../images/progress.gif')}
                        style={{ width: 95, height: 95 }}
                    />
                </View> : null}
            </Modal>
        );
    }
}

const styles = StyleSheet.create({


    centering: {
        alignItems: 'center',
        justifyContent: 'center',


    },
});
// const mapStateToProps = (state) => ({
//     isLoading: state.CommanReducer.isLoading
// });

export default connect(mapStateToProps)(ActivityLoader)
