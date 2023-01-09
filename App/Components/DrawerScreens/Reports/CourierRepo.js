import React, {Component} from 'react';
import {Text, TouchableHighlight,TouchableOpacity,Image,TextInput, View, Linking, BackHandler} from 'react-native';
import {Header} from '../../CusComponent';
import ReportTab from './ReportTab';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {axiosAuthGet} from '../../../utility/apiConnection';
import {connect} from 'react-redux';
import {mapStateToProps} from '../../../Reducers/ApiClass';
import DropDownPicker from 'react-native-dropdown-picker';
import Moment from 'moment';
import {RFPercentage} from 'react-native-responsive-fontsize';
import DateTimePicker from '@react-native-community/datetimepicker';
import Images from '../../../Assets/Images';
import Colors from '../../../Assets/Colors';
import moment from 'moment';
import {COLORS, IMAGES} from '../../../Assets';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import { Dirs, FileSystem } from 'react-native-file-access';
import FileViewer from "react-native-file-viewer";
import DocumentPicker from "react-native-document-picker";
import Toast from 'react-native-simple-toast'
import LinearGradient from 'react-native-linear-gradient';
// const { uri: localUri } = await FileSystem.downloadAsync(remoteUri, FileSystem.documentDirectory + 'All Visitor1111.pdf');
class CourierRepo extends Component {
    createPDF=async()=> {
     
    let options = {
      html: this.html(),
      fileName: 'Courier Report',
      directory: 'documents',
      base64:true,
    };

    let file = await RNHTMLtoPDF.convert(options);
    
    var decodedURL = decodeURIComponent(file.filePath)
    console.log(decodedURL);
    RNFS.moveFile(decodedURL, RNFS.DownloadDirectoryPath+"/Courier Report.pdf")
    Toast.show("Download Complete")
  }
  
  html=()=>{
return(

  `<html>
<header></header>
<title></title>
<style>
table {
  border-collapse: collapse;
 width: 100%;
},

th, td {
  text-align: left;
  padding: 8px;
},

tr:nth-child(even) {
  background-color: #D6EEEE;
}

</style>
<body>
<div style="overflow-x:auto;">
   <table style="width:100%">
   <th style="width:100%;text-align: center; border: 1px solid #000000; colspan="23"">Courier</th>
   <tr style= "background-color: #154c79">
        <td style="color:#ffffff; border: 1px solid #000000;text-align: center;padding: 8px">To</td>
        <td style="color:#ffffff; border: 1px solid #000000;text-align: center;padding: 8px">From</td>
        <td style="color:#ffffff; border: 1px solid #000000;text-align: center;padding: 8px">Date</td>
        <td style="color:#ffffff; border: 1px solid #000000;text-align: center;padding: 8px">Docket No</td>
        <td style="color:#ffffff; border: 1px solid #000000;text-align: center;padding: 8px">Courier Company</td>
        <td style="color:#ffffff; border: 1px solid #000000;text-align: center;padding: 8px">Courier Executive</td>
        <td style="color:#ffffff; border: 1px solid #000000;text-align: center;padding: 8px">Mobile</td>
        <td style="color:#ffffff; border: 1px solid #000000;text-align: center;padding: 8px">Remarks</td>
        <td style="color:#ffffff; border: 1px solid #000000;text-align: center;padding: 8px">Type</td>
        <td style="color:#ffffff; border: 1px solid #000000;text-align: center;padding: 8px">Urgent</td>
        
        ${this.htmltable()}
    </tr>

      
   </table>
  </div>
</body>
</html>`
)
  }
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
    this.state = {
      show:false,
      hide:false,
      data: null,
      startDate: new Date(),
      endDate: new Date(),
    };
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

    // this.getData();
  }
  handleBackButtonClick() {
    this.props.navigation.goBack()
    return true;
  }
  getData = async () => {
    
    try {
      let response = await axiosAuthGet(
        'Courier/GetCourierReport/' +
          this.props.LoginDetails.userID +
          '/' +
          this.props.LoginDetails.empID+
          '/' +
          Moment(this.state.startDate).format('MM-DD-YYYY')+
          '/' +
          Moment(this.state.endDate).format('MM-DD-YYYY')+
          '/'+0
      );
   
      console.log("data===",response.courierData[0]);
      this.setState({data:response.courierData})
      this.createPDF()
      
    } catch (error) {}
  };
   htmltable = () => {
    let t = '';
    
    for (let i in this.state.data) {
      const item = this.state.data[i];
     
      
      t = t +
       `
        <tr>
        <td>${item.type==true?item.employeeName:item.name}</td>
        <td>${item.type!=true?item.employeeName:item.name}</td>
        <td>${moment(item?.courierDate).format("DD/MM/YYYY")}</td>
        <td>${item.docket_No!=""?item.docket_No:""}</td>
        <td>${item.courierCompany!=""?item.courierCompany:""}</td>
        <td>${item?.courierEmployeeName!=""?item?.courierEmployeeName:""}</td>
        <td>${item?.courierMobile!=""?item?.courierMobile:""}</td>
        <td>${item?.remark!=""?item?.remark:""}</td>
        <td>${item?.type==true?"Inword":"Outword"}</td>
        <td>${item?.is_IMP==true ?"Yes":"No"}</td>

        </tr>
        `
    }
    return t;
 }
  
  render() {
    return (
      <View style={{flex:1}}>
        <LinearGradient
          style={{
            height: Platform.OS == 'ios' ? '12%' : '10%',
            paddingTop: 25,
            width: '100%',
            justifyContent: 'center',
          }}
          colors={[COLORS.primary, COLORS.third]}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: Platform.OS == 'ios' ? 17 : 5,
            }}>
            <TouchableOpacity
              style={{
                marginLeft: 10,
                padding: 10,
                height: 50,
                width: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => this.handleBackButtonClick()}>
              <Image source={IMAGES.back} style={{height: 22, width: 22}} />
            </TouchableOpacity>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                paddingLeft: 20,
                padding: 5,
                fontSize: 22,
              }}>
              Time Spent
            </Text>
          </View>
        </LinearGradient>
       
        <View style={{marginTop: 15,justifyContent:'center',flex:1}}>
          <View
            style={{
              width: '100%',
              marginBottom: 10,
              alignItems:'center',
              justifyContent: 'space-between',
              // flexDirection: 'row',
            }}>
            <View style={{width: '50%'}}>
              <Text style={{fontWeight: 'bold', fontSize: 18}}>From</Text>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: 5,
                  marginTop: 10,
                  marginBottom: 5,
                }}
                onPress={() => this.setState({show: true})}>
                <TextInput
                  editable={false}
                  style={{
                    flexGrow: 1,
                    borderBottomColor: Colors.primary,
                    borderBottomWidth: 1,
                    marginRight: 10,
                    color: Colors.graye00,
                  }}
                  placeholderTextColor={Colors.primary}
                  value={Moment(this.state.startDate).format('DD-MM-YYYY')}
                />
                {this.state.show && (
                  <DateTimePicker
                   
                    timeZoneOffsetInMinutes={0}
                    value={this.state.startDate}
                    mode={'date'}
                    is24Hour={true}
                    display="default"
                    onChange={(event, date) => {
                      this.setState({startDate: date, show: false});
                    }}
                  />
                )}

                <Image
                  source={Images.date_icon}
                  style={{height: 28, width: 32}}
                />
              </TouchableOpacity>
            </View>
            <View style={{width: '50%'}}>
              <Text style={{fontWeight: 'bold', fontSize: 18}}>To</Text>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: 5,
                  marginTop: 10,
                  marginBottom: 5,
                }}
                onPress={() => this.setState({hide: true})}>
                <TextInput
                  editable={false}
                  style={{
                    flexGrow: 1,
                    borderBottomColor: Colors.primary,
                    borderBottomWidth: 1,
                    marginRight: 10,
                    color: Colors.graye00,
                  }}
                  placeholderTextColor={Colors.primary}
                  value={Moment(this.state.endDate).format('DD-MM-YYYY')}
                />
                {this.state.hide && (
                  <DateTimePicker
                    //   testID="dateTimePicker"
                    // style={{width: '100%', backgroundColor: 'white'}} //add this
                    // style={{ height: 55, paddingTop: 10 }}
                    timeZoneOffsetInMinutes={0}
                    value={this.state.endDate}
                    //   minimumDate={this.state.startDate}
                    // maximumDate={Moment().add(2, 'month')}
                    mode={'date'}
                    is24Hour={true}
                    display="default"
                    onChange={(event, date) => {
                      this.setState({endDate: date, hide: false});
                    }}
                  />
                )}

                <Image
                  source={Images.date_icon}
                  style={{height: 28, width: 32}}
                />
              </TouchableOpacity>
            </View>
            <View style={{justifyContent: 'flex-end', alignItems: 'center'}}>
              <TouchableOpacity onPress={() => this.getData()}
              style={{backgroundColor:Colors.primary,paddingHorizontal:10,paddingVertical:5,borderRadius:7,marginTop:10}}>
                <Text
                  style={{
                    color: COLORS.white,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: 18,
                  }}>
                  Download
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* <ReportTab /> */}
      </View>
    );
  }
}
export default connect(mapStateToProps)(CourierRepo);
