import PropTypes from "prop-types";
import React from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { ICONS } from '../../Assets';

export default class CusAlert extends React.Component {

    onNegativeButtonPress = () => {
        this.props.onPressNegativeButton();
    };

    onPositiveButtonPress = () => {
        this.props.onPressPositiveButton();
    };

    render() {
        return (
            <Modal
                visible={this.props.displayAlert}
                transparent={true}
                onRequestClose={()=> this.props.closable &&  this.props.openClose()}
                animationType={"fade"}>

                <View style={styles.mainOuterComponent}>
                    <TouchableWithoutFeedback disabled={!this.props.closable} onPress={() => {
                     this.props.openClose()
                    }} >
                        <View style={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            flex: 1,
                        }}></View>
                    </TouchableWithoutFeedback>
                    <View style={styles.mainContainer}>
                        {this.props.iconInternet ? <Image
                            source={ICONS.cusAlertImage}
                            style={{ width: 45, marginTop: 15, tintColor: 'red', height: 45, resizeMode: 'contain' }}
                        />
                            : <Image
                                source={ICONS.cusAlertImage}
                                style={{ width: 45, tintColor: '#f8bb86', height: 45, resizeMode: 'contain' }}
                            />}
                        <View style={styles.topPart}>
                            {this.props.alertTitleText ? <Text style={styles.alertTitleTextStyle}>
                                {`${this.props.alertTitleText}`}
                            </Text> : null}
                        </View>
                        <View style={styles.middlePart}>
                            <Text style={styles.alertMessageTextStyle}>
                                {`${this.props.alertMessageText}`}
                            </Text>
                        </View>
                        <View style={styles.bottomPart}>
                            {
                                this.props.displayPositiveButton
                                &&
                                <TouchableOpacity
                                    onPress={this.onPositiveButtonPress}
                                    style={styles.alertMessageButtonStyle} >
                                    <Text style={styles.alertMessageButtonTextStyle}>{this.props.positiveButtonText}</Text>
                                </TouchableOpacity>
                            }
                            {
                                this.props.displayNegativeButton
                                &&
                                <TouchableOpacity
                                    onPress={this.onNegativeButtonPress}
                                    style={styles.alertMessageNavStyle}>
                                    <Text style={styles.alertMessageButtonTextStyle}>{this.props.negativeButtonText}</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

CusAlert.propTypes = {

    closable: PropTypes.bool,
    displayAlert: PropTypes.bool,
    displayAlertIcon: PropTypes.bool,
    iconInternet: PropTypes.bool,
    alertTitleText: PropTypes.string,
    alertMessageText: PropTypes.string,
    displayPositiveButton: PropTypes.bool,
    positiveButtonText: PropTypes.string,
    displayNegativeButton: PropTypes.bool,
    negativeButtonText: PropTypes.string,
    onPressPositiveButton: PropTypes.func,
    onPressNegativeButton: PropTypes.func,
    openClose: PropTypes.func,
}


const styles = StyleSheet.create({
    mainOuterComponent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00000088'
    },
    mainContainer: {
        flexDirection: 'column',
        width: '85%',

        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 4,
    },
    topPart: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',

        paddingHorizontal: 2,
        paddingVertical: 4
    },
    middlePart: {
        width: '100%',
        padding: 4,
        color: '#FFFFFF',
        fontSize: 16,

        marginVertical: 2
    },
    bottomPart: {
        width: '100%',
        flexDirection: 'row',
        padding: 4,
        alignContent: 'center',
        justifyContent: 'space-evenly'
    },
    alertIconStyle: {

        height: 35,
        width: 35,
    },
    alertTitleTextStyle: {
        flex: 1,
        textAlign: 'center',
        color: "#595959",
        fontSize: 19,
        fontWeight: 'bold',
        padding: 2,
        marginHorizontal: 2
    },
    alertMessageTextStyle: {
        textAlign: 'center',
        color: "#595959",
        fontSize: 17,
        marginBottom: 10,

        padding: 2,
        marginHorizontal: 2
    },
    alertMessageButtonStyle: {
        width: '50%',

        padding: 10,
        marginRight: 8,
        marginLeft: 8,
        borderRadius: 5,
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: 'rgb(48, 133, 214)',

    },
    alertMessageNavStyle: {
        width: '40%',
        padding: 10,
        marginRight: 8,
        marginLeft: 8,
        borderRadius: 5,
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: 'rgb(221, 51, 51)',

    },
    alertMessageButtonTextStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center'
    },

});