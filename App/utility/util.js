/* USE GLOBALLY MULTISELECTION AND SINGLE SELECTION */
//  const BASEURL="http://api.vizman.co.in/api/"
import { Dimensions } from "react-native";

const IMAGEURL = "http://192.168.1.176:82"
const BASEURL="http://192.168.1.176:82/api/"
const GateIMAGEURL = "https://dashboard.vizman.app"

// const IMAGEURL = "https://api.vizman.app"
// const BASEURL="https://api.vizman.app/api/"
// const GateIMAGEURL = "https://dashboard.vizman.app"

// const IMAGEURL = "https://nblapi.vizman.app"
// const GateIMAGEURL = "https://nblapp.vizman.app"
// const BASEURL = "https://nblapi.vizman.app/api/"
//  const IMAGEURL = "http://192.168.29.114:9571"
//  const BASEURL="http://192.168.29.114:9571/api/"
function multiselect(array, type, index, multiselect) {
    if (multiselect)
        array[index][type] = !array[index][type]
    else
        for (let i = 0; i < array.length; i++)
            if (i == index)
                array[i][type] = true
            else
                array[i][type] = false
    return array
}
// var array = multiselect(arraydata, "isSelected", 0, true)
// console.log("array", array)
/* Add key value pair to all objects in array */
// const initialArr = [
//     { name: 'eve' },
//     { name: 'john' },
//     { name: 'jane' }
// ]

// const newArr1 = initialArr.map(v => ({ ...v, isSelected: true }))
// const newArr2 = initialArr.map(v => Object.assign(v, { isActive: true }))
// console.log("newArr1", newArr1)

/* date formating */
function getDate(formate, Date1) {
    if (Date1 != undefined) {
        var date = new Date(Date1).getDate(); //Current Date
        var month = new Date(Date1).getMonth(); //Current Month
        var year = new Date(Date1).getFullYear(); //Current Year
        var hours = new Date(Date1).getHours(); //Current Hours
        var min = new Date(Date1).getMinutes(); //Current Minutes
        var sec = new Date(Date1).getSeconds(); //Current Seconds

    } else {

        var date = new Date().getDate(); //Current Date
        var month = new Date().getMonth(); //Current Month
        var year = new Date().getFullYear(); //Current Year
        var hours = new Date().getHours(); //Current Hours
        var min = new Date().getMinutes(); //Current Minutes
        var sec = new Date().getSeconds(); //Current Seconds
    }
    //  formate.replace("DD",addZero(date))
    //  formate.replace("MM",addZero(month))
    if (formate.indexOf("MMMM") > -1) {
        var mL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return formate.replace("DD", addZero(date)).replace("MMMM", mL[month]).replace("YYYY", year).replace("HH", addZero(hours)).replace("mm", addZero(min)).replace("ss", addZero(sec))
    } else if (formate.indexOf("MMM") > -1) {
        var mS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        return formate.replace("DD", addZero(date)).replace("MMM", mS[month]).replace("YYYY", year).replace("HH", addZero(hours)).replace("mm", addZero(min)).replace("ss", addZero(sec))
    } else {
        return formate.replace("DD", addZero(date)).replace("MM", addZero(month)).replace("YYYY", year).replace("HH", addZero(hours)).replace("mm", addZero(min)).replace("ss", addZero(sec))
    }
    // if (formate == "DD/MM/YYYY") {
    //     return date + '-' + month + '-' + year
    // }
}
function addZero(no) {
    if (no.toString().length == 1) {
        return "0" + no
    } else {
        return no
    }
}

// const BaseIp= "https://api.vizman.co.in/api/"

// Subscribe
const getOrientation = () => {

    {
        if (Dimensions.get('window').width < Dimensions.get('window').height) {
            return 'portrait'
        }
        else {
            return 'landscape'
        }

    }
}
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
module.exports = {
    getDate,
    multiselect,
    makeid,
    getOrientation,
    BASEURL,
    IMAGEURL,
    GateIMAGEURL,
};
// console.log("getCurrentDate", getDate("MM-DD-YYYY","2019-05-10T05:01:54.887Z"))
// console.log("getCurrentDate", new Date("2020-09-02T05:01:54.887Z"))
