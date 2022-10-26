import {AllSettingEmpty} from '../utility/emptyClass';
const defaultState = {
  isLoading: false,
  error: '',
  Update: false,
  LoginDetails: null,
  UserDetails: null,
  SubscriptionLimit: 0,
  NotificationList: [],
  WhoomToMeet: [],
  AllSettings: AllSettingEmpty,
  ReceptionList: [],
  ReceptionData: null,
  courierID: null,
  Visitorlist: null,
  visitorDetails: null,
  MobileNo: null,
  AdminSwitch: false,
  Blockedviz: {blockedId:0,status:null},
};
const CommanReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'PENDING':
      return Object.assign({}, state, {
        isLoading: true,
      });
    case 'ERROR':
      return Object.assign({}, state, {
        isLoading: false,
        error: action.error,
      });
    case 'SUCCESS':
      return Object.assign({}, state, {
        isLoading: false,
      });
    case 'courierId':
      console.log('Action', action.payload);
      return Object.assign({}, state, {
        courierID: action.payload,
      });
    case 'mobileNo':
      console.log('Mobile no', action.payload);
      return Object.assign({}, state, {
        MobileNo: action.payload,
      });
    case 'adminSwitch':
      console.log('Admin Switch:', action.payload);
      return Object.assign({}, state, {
        AdminSwitch: action.payload,
      });
    case 'VisitorList':
      console.log('Action', action.payload);
      return Object.assign({}, state, {
        Visitorlist: action.payload,
      });
    case 'BlockedViz':
      console.log('Action', action.payload);
      return Object.assign({}, state, {
        Blockedviz: action.payload,
      });
    case 'VisitorDetails':
      console.log('Action==', action.payload);
      return Object.assign({}, state, {
        visitorDetails: action.payload,
      });
    case 'USER_DETAILS':
      return Object.assign({}, state, {
        UserDetails: action.UserDetails,
      });
    case 'LOGIN_DETAILS':
      return Object.assign({}, state, {
        LoginDetails: action.LoginDetails,
      });
    case 'SUBSCRIPTION_LIMIT':
      return Object.assign({}, state, {
        SubscriptionLimit: action.SubscriptionLimit,
      });
    case 'NOTIFICATION_LIST':
      return Object.assign({}, state, {
        NotificationList: action.NotificationList,
      });

    case 'WHOOM_TO_MEET':
      return Object.assign({}, state, {
        WhoomToMeet: action.WhoomToMeet,
      });

    case 'SETTINGS':
      return Object.assign({}, state, {
        AllSettings: action.AllSettings,
      });
    case 'RECEPTION_LIST':
      return Object.assign({}, state, {
        ReceptionList: action.ReceptionList,
      });
    case 'UPDATE':
      return Object.assign({}, state, {
        Update: action.Update,
      });
    case 'RECEPTION_DATA':
      return Object.assign({}, state, {
        ReceptionData: action.ReceptionData,
      });
    case 'USER_LOGOUT':
      return defaultState;

    default:
      return state;
  }
};

export default CommanReducer;
