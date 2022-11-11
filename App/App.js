import {NavigationContainer} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import React, {Component} from 'react';
import {Alert, Platform} from 'react-native';
import PushNotification, {Importance} from 'react-native-push-notification';
import {connect} from 'react-redux';
import {ActivityLoader} from './Components/CusComponent';
import {Courier, Visitors} from './Components/DrawerScreens';
import CheckOutVisitorList from './Components/DrawerScreens/BuildingGatekeepr/CheckOutVisitorList';
import AddNewVisitor from './Components/DrawerScreens/BuildingGatekeepr/AddNewVisitor';
import Add_Courier from './Components/DrawerScreens/Courier/Add_Courier';
import Courier_Out from './Components/DrawerScreens/Courier/Courier_Out';
import Out_Courier from './Components/DrawerScreens/Courier/Out_Courier';
import UpdateCourier from './Components/DrawerScreens/Courier/UpdateCourier';

import VisitorListGatekeeper from './Components/DrawerScreens/BuildingGatekeepr/VisitorListGatekeeper';
import {
  ChangePassword,
  DrawerScreen,
  LoginScreen,
  NotificationScreen,
  Profile,
  ResetPassword,
  SplashScreen,
  VisitorForm,
} from './Components/Screens';
import VisitorDetails from './Components/Screens/VisitorDetails';
import {mapDispatchToProps, mapStateToProps} from './Reducers/ApiClass';
import {navigate, navigationRef} from './RootNavigation';
import VizDetails from './Components/Screens/VizDetails';
// import AdminDashboard from './Components/DrawerScreens/AdminDashboard';
import AdminDash from './Components/DrawerScreens/AdminDash';
import AdminDashBoardMain from './Components/DrawerScreens/AdminDashBoardMain';
import SettingScreen from './Components/DrawerScreens/Admin/SettingScreen';
import OrgDetails from './Components/DrawerScreens/Admin/OrgDetails';
import ApprovalScreen from './Components/DrawerScreens/Admin/ApprovalScreen';
import BadgeTemp from './Components/DrawerScreens/Admin/BadgeTemp';
import EmailSMS from './Components/DrawerScreens/Admin/EmailSMS';
import FieldSetting from './Components/DrawerScreens/Admin/FieldSetting';
import AdminEmployeDetails from './Components/DrawerScreens/Admin/AdminEmployeDetails';
import AdminNewEmploy from './Components/DrawerScreens/Admin/AdminNewEmploy';
import AdminVisitorDetails from './Components/DrawerScreens/Admin/AdminVisitorDetails';
import Registration from './Components/Screens/Registration';
import VisitorUpdate from './Components/DrawerScreens/VisitorUpdate';
import DateTimePickerBoth from './Components/Screens/DateTimePickerBoth';
import AdminVizScreen from './Components/DrawerScreens/Admin/AdminVizScreen';
import AdminViz from './Components/DrawerScreens/Admin/AdminViz';
import Reports from './Components/DrawerScreens/Reports/Reports';
import DetailsCourier from './Components/DrawerScreens/Courier/DetailsCourier';



// var PushNotification = require("react-native-push-notification");

const onRegistrationError = error => {
  Alert.alert(
    'Failed To Register For Remote Push',
    `Error (${error.code}): ${error.message}`,
    [
      {
        text: 'Dismiss',
        onPress: null,
      },
    ],
  );
};

const onRegistered = deviceToken => {
  console.log('IOS Device token: ', deviceToken);
  Alert.alert('Registered For Remote Push', `Device Token: ${deviceToken}`, [
    {
      text: 'Dismiss',
      onPress: null,
    },
  ]);
};
const Stack = createStackNavigator();
class App extends Component {
  constructor(props) {
    super(props);
    // global.this = this
    this.state = {};
    this.props.networkService();
  }

  onRemoteNotification = notification => {
    console.log('Noti: ', notification);
    const isClicked = notification.getData().userInteraction === 1;

    if (isClicked) {
      console.log('---- is click app ---');
      // Navigate user to another screen
    } else {
      console.log('---- do something app ---');
      // Do something else with push notification
    }
  };

  componentDidMount() {
    // if (Platform.OS === 'ios'){
    //     PushNotificationIOS.addEventListener('register', onRegistered);
    //     PushNotificationIOS.addEventListener(
    //       'registrationError',
    //       onRegistrationError,
    //     );
    //     PushNotificationIOS.addEventListener('notification', this.onRemoteNotification.bind(this));
    //     PushNotificationIOS.requestPermissions().then(console.log);
    // }

    // for iOS
    // PushNotification.configure({
    //     // Callback called when the token is generated
    //    onRegister: function (tokenData) {
    //      const {token} = tokenData;
    //      console.log(token);
    //    },
    //    // process the notification
    //    onNotification: function (notification) {
    //      console.log(notification);
    //      notification.finish(PushNotificationIOS.FetchResult.NoData);
    //    },
    //    permissions: {
    //      alert: true,
    //      badge: true,
    //      sound: true,
    //    },
    //  });

    PushNotification.configure({
      largeIcon: 'ic_launcher',
      smallIcon: 'ic_nt',
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('token ', token.token);
        //   Toast.show("token ", token)
        //   Toast.show("token ", JSON.stringify(token.token));
        if (Platform.OS === 'ios') {
          var myHeaders = new Headers();
          myHeaders.append(
            'Authorization',
            'Bearer AAAAHS3OsEw:APA91bHY3ljkDCoeYIxMCerFaCNbXbTjRrSVjAj68dN-TzqA4DOW4VFVkezMcCsXOOYVCnxJErET_rOr8Ewmx5GkpgRO6IwAca475Py4QFYtqnuwjyWFsr0W-UJK2zbn4j5Wk2e8SC98',
          );
          myHeaders.append('Content-Type', 'application/json');
          var raw = JSON.stringify({
            application: 'com.nbpl.vizman',
            sandbox: true,
            apns_tokens: [token.token],
          });
          var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow',
          };
          fetch('https://iid.googleapis.com/iid/v1:batchImport', requestOptions)
            .then(response => response.json())
            .then(result => {
              console.log('RESPONSE', result);

              if (result.results[0].status == 'OK') {
                console.log('result ', result.results[0].registration_token);
                global.token = result.results[0].registration_token;
                console.log('global ', global.token);
              }
            })
            .catch(error => console.log('error', error));
        } else {
          global.token = token.token;
        }
      },
      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        console.log('Notif ', notification);
        global.this.props.NotificationsListByuser(
          global.this.props.LoginDetails.empID +
            '/' +
            global.this.props.LoginDetails.userRoleId,
        );
        // global.this.getcontactList()

        if (notification.userInteraction == undefined) {
          navigate('NotificationScreen');
        }

        if (!notification.userInteraction) {
          if (Platform.OS == 'ios') {
            console.log('=====In Ios=====');
            // PushNotification.createChannel({
            //     channelId: "rn-push-notification-channel-id-4-default-300", // (required)
            //     channelName: "Vizman_Channel", // (required)
            //     soundName: 'vizmanbell.wav',
            //     playSound: true,
            //     importance: Importance.HIGH,
            //     vibrate: true,
            // }, (created) => {
            //     PushNotification.localNotification({
            //         /* Android Only Properties */
            //         // ticker: "My Notification Ticker", // (optional)
            //         // showWhen: true, // (optional) default: true
            //         // autoCancel: true, // (optional) default: true
            //         largeIcon: "ic_launcher", // (optional) default: "ic_launcher". Use "" for no large icon.
            //         // largeIconUrl: logo, // (optional) default: undefined
            //         smallIcon: "ic_nt", // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
            //         // bigText: "My big text that will be shown when notification is expanded", // (optional) default: "message" prop
            //         // subText: "This is a subText", // (optional) default: none
            //         // bigPictureUrl: notification.data.image, // (optional) default: undefined
            //         // color: "red", // (optional) default: system default
            //         vibrate: true, // (optional) default: true
            //         vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
            //         // tag: "some_tag", // (optional) add tag to message
            //         group: "group", // (optional) add group to message
            //         groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
            //         ongoing: false, // (optional) set whether this is an "ongoing" notification
            //         priority: notification.priority, // (optional) set notification priority, default: high
            //         // visibility: "private", // (optional) set notification visibility, default: private
            //         importance: "high", // (optional) set notification importance, default: high
            //         allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
            //         ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear)
            //         // shortcutId: "shortcut-id", // (optional) If this notification is duplicative of a Launcher shortcut, sets the id of the shortcut, in case the Launcher wants to hide the shortcut, default undefined
            //         channelId: "rn-push-notification-channel-id-4-default-300", // (optional) custom channelId, if the channel doesn't exist, it will be created with options passed above (importance, vibration, sound). Once the channel is created, the channel will not be update. Make sure your channelId is different if you change these options. If you have created a custom channel, it will apply options of the channel.
            //         onlyAlertOnce: true, //(optional) alert will open only once with sound and notify, default: false
            //         messageId: notification.id, // (optional) added as `message_id` to intent extras so opening push notification can find data stored by @react-native-firebase/messaging module.
            //         // actions: '["Yes", "No"]', // (Android only) See the doc for notification actions to know more
            //         invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true
            //         /* iOS only properties */
            //         // alertAction: "view", // (optional) default: view
            //         // category: "", // (optional) default: empty string
            //         /* iOS and Android properties */
            //         // id: notification.id, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
            //         title: notification.title, // (optional)
            //         message: notification.message, // (required)
            //         // userInfo: notification.data, // (optional) default: {} (using null throws a JSON value '<null>' error)
            //         //    playSound: true, // (optional) default: true
            //         //    soundName: 'vizmanbell.wav', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
            //         // number: 2, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
            //         // repeatType: "day",
            //     })
            // })
          }
          if (Platform.OS !== 'ios') {
            PushNotification.localNotification({
              /* Android Only Properties */
              // ticker: "My Notification Ticker", // (optional)
              // showWhen: true, // (optional) default: true
              // autoCancel: true, // (optional) default: true
              largeIcon: 'ic_launcher', // (optional) default: "ic_launcher". Use "" for no large icon.
              // largeIconUrl: logo, // (optional) default: undefined
              smallIcon: 'ic_nt', // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
              // bigText: "My big text that will be shown when notification is expanded", // (optional) default: "message" prop
              // subText: "This is a subText", // (optional) default: none
              // bigPictureUrl: notification.data.image, // (optional) default: undefined
              // color: "red", // (optional) default: system default
              vibrate: true, // (optional) default: true
              vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
              // tag: "some_tag", // (optional) add tag to message
              group: 'group', // (optional) add group to message
              groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
              ongoing: false, // (optional) set whether this is an "ongoing" notification
              priority: notification.priority, // (optional) set notification priority, default: high
              // visibility: "private", // (optional) set notification visibility, default: private
              importance: 'high', // (optional) set notification importance, default: high
              allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
              ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear)
              // shortcutId: "shortcut-id", // (optional) If this notification is duplicative of a Launcher shortcut, sets the id of the shortcut, in case the Launcher wants to hide the shortcut, default undefined
              channelId: 'rn-push-notification-channel-id-4-default-300', // (optional) custom channelId, if the channel doesn't exist, it will be created with options passed above (importance, vibration, sound). Once the channel is created, the channel will not be update. Make sure your channelId is different if you change these options. If you have created a custom channel, it will apply options of the channel.
              onlyAlertOnce: true, //(optional) alert will open only once with sound and notify, default: false
              messageId: notification.id, // (optional) added as `message_id` to intent extras so opening push notification can find data stored by @react-native-firebase/messaging module.
              // actions: '["Yes", "No"]', // (Android only) See the doc for notification actions to know more
              invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true
              /* iOS only properties */
              // alertAction: "view", // (optional) default: view
              // category: "", // (optional) default: empty string
              /* iOS and Android properties */
              // id: notification.id, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
              title: notification.title, // (optional)
              message: notification.message, // (required)
              // userInfo: notification.data, // (optional) default: {} (using null throws a JSON value '<null>' error)
              playSound: true, // (optional) default: true
              // soundName: "notisound.mp3", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
              // number: 2, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
              // repeatType: "day", // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
            });
          } else {
            if (notification.data.remote == undefined) {
              navigate('NotificationScreen');
            }
          }
        } else {
          navigate('NotificationScreen');
        }

        // process the notification
        // (required) Called when a remote is received or opened, or local notification is opened
        // notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        // process the action
      },
      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
        console.error('REG EROR: ', err.message, err);
      },
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: false,
        sound: true,
      },
      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,
      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
  }
  render() {
    return (
      // <Provider store={store}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="SplashScreen" headerMode="none">
        <Stack.Screen
            name="DateTimePickerBoth"
            component={DateTimePickerBoth}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              transitionSpec: {
                open: config,
                close: config,
              },
              gestureDirection: 'vertical',
            }}
          />
          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              transitionSpec: {
                open: config,
                close: config,
              },
              gestureDirection: 'vertical',
            }}
          />
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              transitionSpec: {
                open: config,
                close: config,
              },
              gestureDirection: 'vertical',
            }}
          />
          <Stack.Screen
            name="ResetPassword"
            component={ResetPassword}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              transitionSpec: {
                open: config,
                close: config,
              },
              gestureDirection: 'vertical',
            }}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              transitionSpec: {
                open: config,
                close: config,
              },
              gestureDirection: 'vertical',
            }}
          />
          <Stack.Screen
            name="ChangePassword"
            component={ChangePassword}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              transitionSpec: {
                open: config,
                close: config,
              },
              gestureDirection: 'vertical',
            }}
          />

          <Stack.Screen
            name="VisitorListGatekeeper"
            component={VisitorListGatekeeper}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              transitionSpec: {
                open: config,
                close: config,
              },
              gestureDirection: 'vertical',
            }}
          />
          <Stack.Screen
            name="AddNewVisitor"
            component={AddNewVisitor}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              transitionSpec: {
                open: config,
                close: config,
              },
              gestureDirection: 'vertical',
            }}
          />
          <Stack.Screen
            name="CheckOutVisitorList"
            component={CheckOutVisitorList}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              transitionSpec: {
                open: config,
                close: config,
              },
              gestureDirection: 'vertical',
            }}
          />
          <Stack.Screen
            name="DrawerScreen"
            component={DrawerScreen}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              transitionSpec: {
                open: config,
                close: config,
              },
              gestureDirection: 'vertical',
            }}
          />
          <Stack.Screen
            name="VisitorForm"
            component={VisitorForm}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              transitionSpec: {
                open: config,
                close: config,
              },
              gestureDirection: 'vertical',
            }}
          />
          <Stack.Screen
            name="NotificationScreen"
            component={NotificationScreen}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              transitionSpec: {
                open: config,
                close: config,
              },
              gestureDirection: 'vertical',
            }}
          />
          <Stack.Screen
            name="VisitorDetails"
            component={VisitorDetails}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              transitionSpec: {
                open: config,
                close: config,
              },
              gestureDirection: 'vertical',
            }}
          />
          <Stack.Screen
            name="Courier"
            component={Courier}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              transitionSpec: {
                open: config,
                close: config,
              },
              gestureDirection: 'vertical',
            }}
          />
          <Stack.Screen
            name="Add_Courier"
            component={Add_Courier}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              transitionSpec: {
                open: config,
                close: config,
              },
              gestureDirection: 'vertical',
            }}
          />
          <Stack.Screen
            name="Out_Courier"
            component={Out_Courier}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              transitionSpec: {
                open: config,
                close: config,
              },
              gestureDirection: 'vertical',
            }}
          />
          <Stack.Screen
            name="UpdateCourier"
            component={UpdateCourier}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              transitionSpec: {
                open: config,
                close: config,
              },
              gestureDirection: 'vertical',
            }}
          />
          <Stack.Screen
            name="Courier_Out"
            component={Courier_Out}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              transitionSpec: {
                open: config,
                close: config,
              },
              gestureDirection: 'vertical',
            }}
          />
          <Stack.Screen
            name="VizDetails"
            component={VizDetails}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              transitionSpec: {
                open: config,
                close: config,
              },
              gestureDirection: 'vertical',
            }}
          />
           <Stack.Screen
            name="Visitors"
            component={Visitors}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              transitionSpec: {
                open: config,
                close: config,
              },
              gestureDirection: 'vertical',
            }}
          />
          <Stack.Screen
            name="AdminDash"
            component={AdminDash}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              transitionSpec: {
                open: config,
                close: config,
              },
              gestureDirection: 'vertical',
            }}
          />
           <Stack.Screen
            name="AdminDashBoardMain"
            component={AdminDashBoardMain}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              transitionSpec: {
                open: config,
                close: config,
              },
              gestureDirection: 'vertical',
            }}
          />
           <Stack.Screen
            name="SettingScreen"
            component={SettingScreen}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              transitionSpec: {
                open: config,
                close: config,
              },
              gestureDirection: 'vertical',
            }}
          />
          <Stack.Screen
            name="OrgDetails"
            component={OrgDetails}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              transitionSpec: {
                open: config,
                close: config,
              },
              gestureDirection: 'vertical',
            }}
          />
           <Stack.Screen
            name="FieldSetting"
            component={FieldSetting}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              transitionSpec: {
                open: config,
                close: config,
              },
              gestureDirection: 'vertical',
            }}
          />
           <Stack.Screen
            name="BadgeTemp"
            component={BadgeTemp}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              transitionSpec: {
                open: config,
                close: config,
              },
              gestureDirection: 'vertical',
            }}
          />
           <Stack.Screen
            name="EmailSMS"
            component={EmailSMS}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              transitionSpec: {
                open: config,
                close: config,
              },
              gestureDirection: 'vertical',
            }}
          />
           <Stack.Screen
            name="ApprovalScreen"
            component={ApprovalScreen}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              transitionSpec: {
                open: config,
                close: config,
              },
              gestureDirection: 'vertical',
            }}
          />
          <Stack.Screen
            name="AdminEmployeDetails"
            component={AdminEmployeDetails}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              transitionSpec: {
                open: config,
                close: config,
              },
              gestureDirection: 'vertical',
            }}
          />
          <Stack.Screen
            name="AdminNewEmploy"
            component={AdminNewEmploy}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              transitionSpec: {
                open: config,
                close: config,
              },
              gestureDirection: 'vertical',
            }}
          />
          <Stack.Screen
            name="DetailsCourier"
            component={DetailsCourier}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              transitionSpec: {
                open: config,
                close: config,
              },
              gestureDirection: 'vertical',
            }}
          />
           <Stack.Screen
            name="Reports"
            component={Reports}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              transitionSpec: {
                open: config,
                close: config,
              },
              gestureDirection: 'vertical',
            }}
          />
          <Stack.Screen
            name="AdminViz"
            component={AdminViz}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              transitionSpec: {
                open: config,
                close: config,
              },
              gestureDirection: 'vertical',
            }}
          />
           <Stack.Screen
            name="AdminVizScreen"
            component={AdminVizScreen}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              transitionSpec: {
                open: config,
                close: config,
              },
              gestureDirection: 'vertical',
            }}
          />
           <Stack.Screen
            name="Registration"
            component={Registration}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              transitionSpec: {
                open: config,
                close: config,
              },
              gestureDirection: 'vertical',
            }}
          />
          <Stack.Screen
            name="VisitorUpdate"
            component={VisitorUpdate}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              transitionSpec: {
                open: config,
                close: config,
              },
              gestureDirection: 'vertical',
            }}
          />
          <Stack.Screen
            name="AdminVisitorDetails"
            component={AdminVisitorDetails}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              transitionSpec: {
                open: config,
                close: config,
              },
              gestureDirection: 'vertical',
            }}
          />
        </Stack.Navigator>
        <ActivityLoader />
      </NavigationContainer>
    );
  }
}
const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};
// const mapStateToProps = (state) => ({
//     network: state.NetworkReducer.network,
//     LoginDetails: state.CommanReducer.LoginDetails,
//     NotificationList: state.CommanReducer.NotificationList,
// });

// const mapDispatchToProps = (dispatch) => ({
//     networkService: () => dispatch(callNetworkservice()),
//     NotificationsListByuser: (empID, userRoleId) => dispatch(Fetch('Notification/NotificationsListByuser', 'GET', empID + "/" + userRoleId, serviceActionNotificationsListByuser)),
// })

// export const callNetworkservice = () => {
//     return dispatch => {
//     NetInfo.addEventListener(state => {
//         dispatch(serviceNetworkActionSuccess(state))
//     })
// }
// }

export default connect(mapStateToProps, mapDispatchToProps)(App);
