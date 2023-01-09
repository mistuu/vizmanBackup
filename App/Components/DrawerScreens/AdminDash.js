import React from 'react';
import {
  View,
  Text,
  Animated,
  ScrollView,
  Dimensions,
  StyleSheet,
  Image,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {BASEURL} from '../../utility/util'
import {Header} from '../CusComponent';
import {connect} from 'react-redux';
import {COLORS, IMAGES} from '../../Assets';
import {mapDispatchToProps, mapStateToProps} from '../../Reducers/ApiClass';
import LinearGradient from 'react-native-linear-gradient';
import {PieChart} from 'react-native-svg-charts';
import Moment from 'moment';
import Colors from '../../Assets/Colors';
import {Circle, G, Line} from 'react-native-svg';
import Toast from 'react-native-simple-toast';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {LineChart} from 'react-native-chart-kit';
import moment from 'moment';
import { axiosAuthGet } from '../../utility/apiConnection';
import axios from 'axios';
const labels = [
  'Label 1',
  'Label 2',
  'Label 3',
  'Label 4',
  'Label 5',
  'Label 6',
];

const data = [
  Math.random() * 100,
  Math.random() * 100,
  Math.random() * 100,
  Math.random() * 100,
  Math.random() * 100,
  Math.random() * 100,
];

class AdminDash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curY: new Animated.Value(0),
      refreshing: false,
      labelArray: [],
      dataArry: [],
      height: 0,
      SelecteValu: '',
      dateView: '',
      adminDash: [],
      pieChart: [],
      selectedSlice: {
        label: '',
        value: 0,
      },
      dateArray: [],
      typeField: [
        {name: 'Daily', id: 1},
        {name: 'Weekly', id: 2},
        {name: 'Monthly', id: 3},
        {name: 'Quarterly', id: 4},
        {name: 'Yearly', id: 5},
      ],
      selectedValue: ["Daily"],
      currentDate: null,
      lastDay: null,
      lastThreeMonth: null,
      yearly: null,
      firsdate:null,
      weekDate:null
    };
  }

 async componentDidMount() {
    // var t = ["2021-2-2", "2021-2-3", "2021-2-3", "2021-2-8", "2021-2-3", "2021-2-6", "2021-2-6", "2021-2-6", "2021-2-6", "2021-2-6", "2021-2-6", "2021-2-6"]
   this.getdata()
  }
 async getdata(){
    var t = ['02-02-2021', '03-02-2021', '08-02-2021', '06-02-2021'];
    // var numArray = [140000, 104, 99];
    t.sort(function (a, b) {
      return new Date(a) - new Date(b);
    });

   
    var date = new Date();
    var firstDay =moment(date).format('DD-MM-YYYY HH:MM:SS');
    var lastDay = moment(moment().subtract(30, 'days')).format('DD-MM-YYYY HH:MM:SS');
    var l = moment(moment().subtract(7, 'days')).format('DD-MM-YYYY HH:MM:SS');
    var s = moment(moment().subtract(1, 'days')).format('DD-MM-YYYY HH:MM:SS');
    
    
    // this.props.GetAdminDashboard(
    //   this.props.LoginDetails.userID +
    //     '/' +
    //     s +
    //     '/' +
    //     firstDay,
    //   this.responseAdminDsh,
    // );
    let response;
    console.log("print id",this.props.LoginDetails.userID +
    '/' +
    s +
    '/' +
    firstDay);
    try {
      axios
      .get( BASEURL+ "Users/GetAdminDashboard/"+this.props.LoginDetails.userID +
      '/' +
      s +
      '/' +
      firstDay)
      .then((result) => {
        console.log(result);
      this.responseAdminDsh(result.data)
        // document.title = result.data[0].Name;
        // setItem(result.data);
      }) .catch(function (error) {
        // handle error
        console.log("error==",error);
      });

      //  response=await axiosAuthGet()
      // console.log("response==",response);
    } catch (error) {
      console.log("error==",error);
    }
      
      this.setState({refreshing: false});
    
    //last 3 month
    var d = new Date();
    
    d.setMonth(d.getMonth() - 3);

    //last year
    var y = new Date();
    
    y.setMonth(y.getMonth() - 12);

    
    
  
  var today = new Date();
    this.setState({
      currentDate: firstDay,
      lastThreeMonth: moment(d.toLocaleDateString()).format('DD-MM-YYYY HH:MM:SS'),
      yearly: moment(y.toLocaleDateString()).format('DD-MM-YYYY HH:MM:SS'),
      lastDay: lastDay,
      firsdate:s,
      weekDate:l,

    });
  }
  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getdata()
  }
  onSelectChange = val => {
   
    this.setState({selectedValue: val});
    var now = moment();
    const fifthMonth = this.getStartAndEndDate(now.month(), now.year());
    
    const fourthMonth = this.getStartAndEndDate(
      fifthMonth.date.month(),
      fifthMonth.date.year(),
    );
    
    var thirdMonth = this.getStartAndEndDate(
      fourthMonth.date.month(),
      fourthMonth.date.year(),
    );
    
    if (val[0] == "Monthly") {
      this.props.GetAdminDashboard(
        this.props.LoginDetails.userID +
          '/' +
          this.state.lastDay +
          '/' +
          this.state.currentDate,
        this.responseAdminDsh,
      );
    } else if (val[0] == "Quarterly") {
      this.props.GetAdminDashboard(
        this.props.LoginDetails.userID +
          '/' +
          this.state.lastThreeMonth +
          '/' +
          this.state.currentDate,
        this.responseAdminDsh,
      );
    } else if (val[0] == "Yearly") {
      this.props.GetAdminDashboard(
        this.props.LoginDetails.userID +
          '/' +
          this.state.yearly +
          '/' +
          this.state.currentDate,
        this.responseAdminDsh,
      );

    }
    else if (val[0] == "Daily") {
      this.props.GetAdminDashboard(
        this.props.LoginDetails.userID +
          '/' +
          this.state.firsdate +
          '/' +
          this.state.currentDate,
        this.responseAdminDsh,
      );
      
    }else if (val[0] == "Weekly") {
      this.props.GetAdminDashboard(
        this.props.LoginDetails.userID +
          '/' +
          this.state.weekDate +
          '/' +
          this.state.currentDate,
        this.responseAdminDsh,
      );
      
    }
  };

  getStartAndEndDate(month, year) {
    month = month - 1;
    year = month === -1 ? year - 1 : year;
    const lastDate = moment().date(1).month(month).daysInMonth();

    return {
      startDate: moment().date(1).month(month).year(year).format('DD-MM-YYYY HH:MM:SS'),
      endDate: moment()
        .date(lastDate)
        .month(month)
        .year(year)
        .format('DD-MM-YYYY HH:MM:SS'),
      date: moment().date(1).month(month).year(year),
    };
  }
  responseAdminDsh = adminDash => {
    
    var d = Moment().format('DD');
    const tempticket = [];
    let i;
    let k = 1;
    let x;
    for (i = 2; i <= d; i++) {
      k++;
      if (i < d) {
        x = i;
      }
     
      tempticket.push(i);
    }

    const temp2 = [];
    adminDash.linedata.forEach(element => {
      temp2.push(element.a);
    });

    var te = adminDash.linedata.map(v => ({x: v.y, y: v.a}));
    this.setState({
      adminDash,
      dateArray: adminDash.linedata,
      labelArray: tempticket,
      dataArry: temp2,
      linedata: te,
      pieChart: adminDash.piechartData,
      selectedSlice: {
        label: adminDash.piechartData[2].label,
        value: adminDash.piechartData[2].value,
      },
    });
  };

  render() {
    const headerDistance = Animated.diffClamp(
      this.state.curY,
      0,
      this.state.height + 70,
    ).interpolate({
      inputRange: [0, 1],
      outputRange: [0, -1],
      extrapolate: 'clamp',
    });
    let time = this.state.adminDash.dailyPing;
    var Hours = Math.floor(time / 60);
    var minutes = time % 60;
    var h1;
    var m1;
    if (Hours < 9) {
      h1 = '0' + Hours;
    } else {
      h1 = Hours;
    }
    if (minutes < 9) {
      m1 = '0' + minutes;
    } else {
      m1 = minutes;
    }
    const {selectedSlice} = this.state;
    const {label, value} = selectedSlice;
    const keys1 = ['Total Visited', 'Total Resheduled', 'Total Rejected'];
    const values1 = [
      this.state.pieChart[2]?.value,
      this.state.pieChart[1]?.value,
      this.state.pieChart[0]?.value,
    ];
    const colors1 = ['#ff9214', '#df8109', '#f0d043'];
    const data1 = keys1.map((key, index) => {
      return {
        key,
        value: values1[index],
        svg: {fill: colors1[index]},
        arc: {padAngle: 0.02, innerRadius: label === key ? '65%' : '70%'},

        onPress: () =>
          this.setState({selectedSlice: {label: key, value: values1[index]}}),
      };
    });
    
    return (
      <View style={{flex: 1, backgroundColor: COLORS.whitef4}}>
        <View style={{width: '100%',marginTop:Platform.OS=="ios"?-20:0, zIndex: 99}}>
          <Header title={'Dashboard'} navigation={this.props.navigation} />
        </View>
      

        <Animated.View
          onLayout={({nativeEvent}) =>
            this.setState({height: nativeEvent.layout.height})
          }
          style={{
            transform: [
              {
                translateY: headerDistance,
              },
            ],
            width: '99.8%',
            marginVertical: 2,
            marginTop: 15,
          }}>
          <View
            style={{
              marginTop: Platform.OS === 'ios' ? 5 : 2,
              backgroundColor: COLORS.whitef4,
              alignItems: 'center',
              width: '100%',
              height: 70,
              flexDirection: 'row',
            }}>
            <LinearGradient
              style={[styles.box, {marginLeft: 5}]}
              colors={[COLORS.primary, COLORS.third]}>
              <View style={styles.headerWrapper}>
                <Text numberOfLines={2} style={styles.boxText}>
                  {'Total Knocks'}
                </Text>
              </View>
              <Text
                style={{
                  color: COLORS.white,
                  fontSize: 16,
                  alignSelf: 'center',
                  marginTop: Platform.OS === 'ios' ? 5 : null,
                }}>
                {this.state.adminDash.totalKnocks}
              </Text>
            </LinearGradient>
            <LinearGradient
              style={styles.box}
              colors={[COLORS.primary, COLORS.third]}>
              <View style={styles.headerWrapper}>
                <Text numberOfLines={2} style={styles.boxText}>
                  {'Avg Time Spent'}
                </Text>
              </View>
             
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  alignSelf: 'center',
                  marginTop: Platform.OS === 'ios' ? 5 : null,
                }}>
                {h1}:{m1}
              </Text>
            </LinearGradient>
            <LinearGradient
              style={styles.box}
              colors={[COLORS.primary, COLORS.third]}>
              <View style={styles.headerWrapper}>
                <Text numberOfLines={2} style={styles.boxText}>
                  {'The Chatterbox'}
                </Text>
              </View>
              <Text
                style={{
                  color: COLORS.white,
                  fontSize: 12,
                  alignSelf: 'center',
                  marginTop: Platform.OS === 'ios' ? 5 : null,
                }}>
                {this.state.adminDash.chatterBox}
              </Text>
            </LinearGradient>
            <LinearGradient
              style={styles.box}
              colors={[COLORS.primary, COLORS.third]}>
              <View style={styles.headerWrapper}>
                <Text numberOfLines={2} style={styles.boxText}>
                  {'The Interactive Gun'}
                </Text>
              </View>
              <Text style={{color: COLORS.white, fontSize: 12}}>
                {this.state.adminDash.intrector}
              </Text>
            </LinearGradient>
          </View>
        </Animated.View>
       
        <ScrollView  refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        } style={{flexGrow: 1, marginBottom: 15}}>
          <View
            style={{
              width: '95%',
              marginLeft: 10,
              borderWidth: 1,
              borderColor: Colors.graye3,
              backgroundColor: Colors.white,
              borderRadius: 8,
            }}>
            <SectionedMultiSelect
              items={this.state.typeField}
              searchPlaceholderText="Search"
              IconRenderer={Icon}
              styleDropdownMenu={{height: 50}}
              uniqueKey="name"
              selectText="Type"
              showDropDowns={true}
              single={true}
              onSelectedItemsChange={value => this.onSelectChange(value)}
              selectedItems={this.state.selectedValue}
              hideConfirm={true}
            />
          </View>
          <View
            style={{
              borderRadius: 10,
              width: '98%',
              alignSelf: 'center',
              marginTop: 15,
              backgroundColor: COLORS.white,
            }}>
            <View style={{padding: 10}}>
              <View style={{marginTop: 5, flexDirection: 'row'}}>
                <Image
                  source={IMAGES.circle}
                  style={{width: 20, tintColor: '#ff9214', height: 20}}
                />
                <Text style={{marginLeft: 5}}>Total Visited</Text>
              </View>
              <View style={{marginTop: 5, flexDirection: 'row'}}>
                <Image
                  source={IMAGES.circle}
                  style={{width: 20, tintColor: '#df8109', height: 20}}
                />
                <Text style={{marginLeft: 5}}>Total Resheduled</Text>
              </View>
              <View style={{marginTop: 5, flexDirection: 'row'}}>
                <Image
                  source={IMAGES.circle}
                  style={{width: 20, tintColor: '#f0d043', height: 20}}
                />
                <Text style={{marginLeft: 5}}>Total Rejected</Text>
              </View>
            </View>
            <View
              style={{
                right: 15,
                position: 'absolute',
                alignSelf: 'flex-end',
                padding: 4,
                borderRadius: 12,
                marginTop: 10,
                backgroundColor: COLORS.primary,
              }}>
              <Text style={{fontSize: 15, color: COLORS.white}}>
                {this.state.selectedValue}
              </Text>
            </View>
            <View style={{justifyContent: 'center'}}>
              <PieChart
                style={{height: 350}}
                outerRadius={'90%'}
                innerRadius={'70%'}
                data={data1}></PieChart>
              <Text
                style={{
                  position: 'absolute',
                  width: '100%',
                  fontSize: 18,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                {`${label} \n ${value}`}
              </Text>
            </View>
            <Text
              style={{
                marginBottom: 30,
                textAlign: 'center',
                color: COLORS.graye00,
                fontSize: 18,
                fontWeight: 'bold',
              }}>
              Status wise visitors
            </Text>
          </View>
          <View
            style={{
              borderRadius: 10,
              width: '98%',
              alignSelf: 'center',
              marginTop: 15,
              backgroundColor: COLORS.white,
            }}>
            <View style={{padding: 10}}>
              <View style={{marginTop: 5, flexDirection: 'row'}}>
                <Image
                  source={IMAGES.circle}
                  style={{width: 20, tintColor: '#ff9214', height: 20}}
                />
                <Text style={{marginLeft: 5}}>Visitor</Text>
              </View>
            </View>
            <View
              style={{
                right: 15,
                position: 'absolute',
                alignSelf: 'flex-end',
                padding: 4,
                borderRadius: 12,
                marginTop: 10,
                backgroundColor: COLORS.primary,
              }}>
              <Text style={{fontSize: 15, color: COLORS.white}}>
                {this.state.selectedValue}
              </Text>
            </View>
            <View style={{alignItems: 'center'}}>
              {
              // this.state.labelArray.length > 0 &&
              this.state.dataArry.length > 0 ? (
                <LineChart
                  data={{
                    labels: this.state.dataArry,
                    datasets: [
                      {
                        data: this.state.dataArry,
                        date2: this.state.dateArray,
                      },
                    ],
                  }}
                  width={Dimensions.get('window').width - 50}
                  height={220}
                  onDataPointClick={(data1, index) => {
                    Toast.show(
                      'Date : ' +
                        Moment(data1.dataset.date2[data1.index].y).format(
                          'DD-MM-YYYY',
                        ) +
                        ' Total Visitor : ' +
                        data1.value,
                      Toast.LONG,
                    );
                  }}
                  decorator={() => {
                    return (
                      <View
                        style={{
                          flex: 1,
                        }}></View>
                    );
                  }}
                  withVerticalLines={false}
                  withHorizontalLines={true}
                  chartConfig={{
                    backgroundColor: COLORS.primary,
                    backgroundGradientFrom: '#FFFF',
                    backgroundGradientTo: '#FFF',
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => COLORS.primary,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                    propsForDots: {
                      r: '4',
                      strokeWidth: '8',
                      stroke: COLORS.primary,
                    },
                  }}
                  withDots
                  bezier
                  style={{
                    marginVertical: 5,
                    borderRadius: 15,
                  }}
                />
              ) : null}
              <Text
                style={{
                  marginBottom: 30,
                  textAlign: 'center',
                  color: COLORS.graye00,
                  fontSize: 18,
                  fontWeight: 'bold',
                }}>
                No of visitors
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 5,
    flex: 1,
    marginRight: 5,
  },
  headerWrapper: {
    borderBottomColor: COLORS.white,
    height: 32,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  boxText: {
    color: COLORS.white,
    fontSize: 12,
    textAlign: 'center',
    alignSelf: 'center',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminDash);
