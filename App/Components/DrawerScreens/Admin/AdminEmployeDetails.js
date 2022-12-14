import React from 'react';
import {
    BackHandler, StatusBar,
    Image, Modal, Platform, SafeAreaView, Animated,
    ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback,

    View
} from 'react-native';
import Moment from 'moment';
import LinearGradient from "react-native-linear-gradient";
import { connect } from 'react-redux';
import { COLORS, IMAGES } from '../../../Assets';
import { mapDispatchToProps, mapStateToProps } from '../../../Reducers/ApiClass';
import { RFPercentage } from "react-native-responsive-fontsize";
const colors = [
    COLORS.primary,
    COLORS.primary
]

class AdminEmployeDetails extends React.Component {
    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            employDetails: this.props.route.params.EmplDtls,
            elevation: 7,
            imageR: '', imageRes: {}, open: true, imageShow: '',
            visibleModal: false, historyList: [], isRefreshing: false,
        }


    }
    componentDidMount() {
        this.props.GetEmpTodayInoutHistory(this.props.route.params.UserId, this.visitorListSuccess)
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    visitorListSuccess = (res) => (this.afterVisitorListSuccess(res))
    afterVisitorListSuccess(historyList) {
        this.setState({
            historyList
        });
    }
    handleBackButtonClick() {
        this.props.navigation.goBack()
        return true;
    }
    onRefresh() {
        this.setState({ isRefreshing: true, });
        setTimeout(() => {
            this.componentDidMount()
            this.setState({ isRefreshing: false });
        }, 3000);
    }

    render() {
        // if (this.props.route.params.tag == "View") {
        //     var Img = ""
        //     var tag
        //     if (this.state.employDetails?.photoUrl != "" && this.state.employDetails?.photoUrl != undefined && this.state.employDetails?.photoUrl != null) {
        //         if (Platform.OS == "android") {
        //             if (this.state.employDetails?.photoUrl.indexOf("content://") > -1 || this.state.employDetails?.photoUrl.indexOf("file://") > -1) {
        //                 tag = 1
        //                 Img = this.state.employDetails?.photoUrl
        //                 console.log("Img1: ", Img)
        //             }
        //             else {
        //                 tag = 1
        //                 Img = IMAGEURL + this.state.employDetails?.photoUrl
        //                 console.log("Img3: ", Img)
        //             }
        //         }

        //         else {
        //             if (this.state.employDetails?.photoUrl.indexOf("file://") > -1) {
        //                 console.log("11 : ", this.state.employDetails?.photoUrl);
        //                 tag = 1
        //                 Img = this.state.employDetails?.photoUrl
        //                 // console.log("Img2: ", Img)
        //             }
        //             else {
        //                 tag = 1
        //                 Img = IMAGEURL + this.state.employDetails?.photoUrl.replace("/", "")
        //             }
        //         }
        //     } else {
        //         tag = 2
        //         Img = IMAGEURL + "/ImageFiles/defaultuser.png"
        //         // Img = {uri:IMAGEURL+"ImageFiles/defaultuser.png"}
        //     }
        //     return (
        //         <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.whitef4 }}>
        //             <LinearGradient style={{
        //                 height: 75, paddingTop: 25,
        //                 width: '100%',
        //                 justifyContent: 'center'
        //             }}
        //                 colors={colors}
        //             >
        //                 <StatusBar barStyle={'dark-content'} backgroundColor='transparent' translucent={true} />
        //                 <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        //                     <TouchableOpacity style={{ height: 30, width: 30, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.props.navigation.goBack()}>
        //                         <Image source={IMAGES.back}
        //                             style={{ height: 22, width: 22, left: 10 }} />
        //                     </TouchableOpacity>
        //                     <View style={{ width: '100%', flexDirection: "row", paddingLeft: 20 }}>
        //                         <Text style={{ color: "white", textAlign: "center", padding: 5, fontSize: 22 }}>User Details</Text>
        //                     </View>
        //                 </View>
        //             </LinearGradient>
        //             <ScrollView style={{ flexGrow: 1 }}>
        //                 <View>
        //                     {tag == 1 ?
        //                         <TouchableOpacity disabled={true} onPress={() => this.setState({ visibleModal: true })} style={{ zIndex: 1, elevation: this.state.elevation, marginTop: 15, borderRadius: 170 / 2, height: 170, width: 170, alignSelf: "center" }}>
        //                             <Image
        //                                 source={{ uri: Img }}
        //                                 style={{ width: 170, height: 170, borderRadius: 170 / 2, }}
        //                             />
        //                         </TouchableOpacity>
        //                         :
        //                         <TouchableOpacity disabled={true} onPress={() => this.setState({ visibleModal: true })} style={{ zIndex: 1, elevation: this.state.elevation, marginTop: 15, borderRadius: 170 / 2, height: 170, width: 170, alignSelf: "center" }}>

        //                             <Image
        //                                 source={{ uri: Img }}
        //                                 style={{ width: 170, height: 170, borderRadius: 170 / 2, }}
        //                             />
        //                         </TouchableOpacity>
        //                     }


        //                 </View>

        //                 <View style={{ margin: 10, }}>

        //                     <Hoshi
        //                         style={[styles.textInputStyle]}
        //                         borderHeight={0}
        //                         editable={false}
        //                         value={this.state.employDetails?.fullName} label="Full Name"
        //                     />
        //                     <Hoshi
        //                         style={[styles.textInputStyle]}
        //                         borderHeight={0}
        //                         editable={false}
        //                         value={this.state.employDetails?.mobile} label="Mobile No"
        //                     />
        //                     <Hoshi
        //                         style={[styles.textInputStyle]}
        //                         borderHeight={0}
        //                         editable={false}
        //                         value={this.state.employDetails?.userRole} label="User Role"
        //                     />
        //                     <Hoshi
        //                         style={[styles.textInputStyle]}
        //                         borderHeight={0}
        //                         editable={false}
        //                         value={this.state.employDetails?.emailId} label="Email"
        //                     />
        //                     <Hoshi
        //                         style={[styles.textInputStyle]}
        //                         borderHeight={0}
        //                         editable={false}
        //                         value={this.state.employDetails?.department} label="Department"
        //                     />
        //                     <Hoshi
        //                         style={[styles.textInputStyle]}
        //                         borderHeight={0}
        //                         editable={false}
        //                         value={this.state.employDetails?.designation} label="Designation"
        //                     />
        //                     <Hoshi
        //                         style={[styles.textInputStyle]}
        //                         borderHeight={0}
        //                         editable={false}
        //                         value={this.state.employDetails?.status == 1 ? "Verified" : "UnVerified"} label="Login Status"
        //                     />



        //                 </View>

        //             </ScrollView>
        //         </SafeAreaView>

        //     )
        // } else {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.whitef4 }}>
                <LinearGradient style={{
                    height: 75, paddingTop: 25,
                    width: '100%',
                    justifyContent: 'center'
                }}
                    colors={colors}
                >
                    <StatusBar barStyle={'dark-content'} backgroundColor='transparent' translucent={true} />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity style={{ height: 30, width: 30, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.props.navigation.goBack()}>
                            <Image source={IMAGES.back}
                                style={{ height: 22, width: 22, left: 10 }} />
                        </TouchableOpacity>
                        <View style={{ width: '100%', flexDirection: "row", paddingLeft: 20 }}>
                            <Text style={{ color: "white", textAlign: "center", padding: 5, fontSize: 22 }}>Employee In Out Today History</Text>
                        </View>
                    </View>
                </LinearGradient>
                <View style={{ flex: 1, alignSelf: 'center' }} >
                    <Animated.FlatList
                        style={{ flex: 1, }}
                        scrollEventThrottle={16}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: this.state.curY } } }],
                            { useNativeDriver: true }
                        )}
                        stickyHeaderIndices={[0]}
                        contentContainerStyle={{ flexGrow: 1, }}
                        data={this.state.historyList}
                        ref={r => this.refs = r}
                        refreshing={this.state.isRefreshing}
                        onRefresh={() => this.onRefresh()}
                        ListHeaderComponent={<View style={{ marginTop: 5, backgroundColor: COLORS.whitef4 }}>
                            <View style={{ alignSelf: 'center', justifyContent: 'center' }}>
                                <View style={{ flexDirection: 'row', backgroundColor: COLORS.placeholderColor, borderRadius: 10, paddingVertical: 5, justifyContent: 'center', marginLeft: "1%", marginRight: "1%", width: '98%', elevation: 0.5, alignSelf: 'center' }}>
                                    <View style={{ width: '33%' }}>
                                        <Text style={{ textAlign: 'center', fontWeight: 'bold', flex: 1, }}>
                                            Date
                                        </Text>
                                    </View>

                                    <View style={{ width: '33%' }}>
                                        <Text style={{ textAlign: 'center', fontWeight: 'bold', flex: 1, }}>
                                            CheckIn Time
                                        </Text>
                                    </View>
                                    <View style={{ width: '33%' }}>
                                        <Text style={{ textAlign: 'center', fontWeight: 'bold', flex: 1, }}>
                                            CheckOut Time
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        }
                        renderItem={({ item, key }) => {
                            return (
                                <View style={{ height: null,paddingBottom:5, paddingTop: 5, marginLeft: "1%", marginRight: "1%", width: '98%', borderRadius: 10, marginTop: 5, backgroundColor: COLORS.white, elevation: 0.5 }}>
                                    {/* <View style={{ flexDirection: "row", justifyContent: "space-between", paddingBottom: 5, alignSelf: 'center', width: "99%" }}> */}
                                        
                                        {/* <Text numberOfLines={1} style={{ paddingRight: 15, textAlign: 'right', color: '#6a7989', fontWeight: 'bold', fontSize: RFPercentage(1.7) }} numberOfLines={1} >
                                            Is Arogyasetu : {item.isArogyaSetu ? "Yes" : "No"}
                                        </Text> */}
                                    {/* </View> */}
                                    <View style={{ paddingLeft: 5, paddingRight: 2,flexDirection:'row' }} >
                                    <Text  style={{ paddingLeft: 15, textAlign: 'left', color: '#6a7989', fontWeight: 'bold', fontSize: RFPercentage(1.7) }}  >
                                            {Moment(item.date).format('DD-MMM-yyyy')}
                                        </Text>
                                        <View style={{ paddingLeft: 5, paddingRight: 2,  }} >
                                            <Text numberOfLines={1} style={{ width: '100%', paddingLeft: 10, textAlign: 'left', color: '#6a7989', fontWeight: 'bold', fontSize: RFPercentage(1.7) }}>
                                                {item.empTemp}
                                            </Text>
                                        </View>
                                        <View style={{ paddingLeft: 2, alignItems: "center", paddingRight: 2, width: '33%', color: '#6a7989', fontWeight: 'bold', }}>
                                            <Text numberOfLines={1} style={{ textAlign: 'center', width: '100%', color: '#6a7989', fontWeight: 'bold', fontSize: RFPercentage(1.7) }}>
                                                {item.checkInTime == null ? "" :
                                                    Moment(item.checkInTime).format('HH:mm')}
                                            </Text>
                                        </View>
                                        <View style={{ paddingRight: 5, paddingLeft: 2, width: '33%', }} >
                                            <Text numberOfLines={1} style={{ width: '100%', paddingRight: 10, textAlign: 'right', color: '#6a7989', fontWeight: 'bold', fontSize: RFPercentage(1.7) }}> {item.checkOutTime == null ? "" :
                                                Moment(item.checkOutTime).format('HH:mm')}</Text>
                                        </View>
                                    </View>

                                </View>

                            )
                        }}
                        keyExtractor={(item, index) => index.toString()}
                        ListEmptyComponent={<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: COLORS.placeholderColor, fontSize: 20 }}>No in out History</Text></View>}
                    />
                </View>
            </SafeAreaView>
        )
        // }
    }

}
const styles = StyleSheet.create({
    textInputStyle: {
        color: COLORS.black,
        marginBottom: 1,
        backgroundColor: '#EEEEEE',
        // borderBottomWidth: 1.2,
        // borderBottomColor: COLORS.black,
        height: (Platform.OS === 'ios' ? 40 : null)
    },
})


export default connect(mapStateToProps, mapDispatchToProps)(AdminEmployeDetails);