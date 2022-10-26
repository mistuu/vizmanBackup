import NetInfo from '@react-native-community/netinfo';
import Fetch from '../utility/apiConnection.js';
import {
  LogOut,
  VisitorDetails,
  serviceActionEmployeeList,
  VisitorList,
  courierId,
  serviceActionGetAllSettings,
  serviceActionLoginDetail,
  serviceActionNotificationsListByuser,
  serviceActionReceptionData,
  serviceActionReceptionList,
  serviceActionSubscriptionLimit,
  serviceActionUpdate,
  serviceActionUserDetail,
  serviceActionVisitors,
  serviceActionWhoomToMeet,
  serviceNetworkActionSuccess,
  mobileNo,
  BlockedViz,
  adminSwitch,
} from './Actions/index.js';
export const mapStateToProps = state => ({
  isLoading: state.CommanReducer.isLoading,
  network: state.NetworkReducer.network,
  // error: state.CommanReducer.error,
  Visitorlist: state.CommanReducer?.Visitorlist,
  Update: state.CommanReducer.Update,
  visitorDetails: state.CommanReducer?.visitorDetails,
  MobileNo: state.CommanReducer?.MobileNo,
  AdminSwitch: state.CommanReducer?.AdminSwitch,
  courierID: state.CommanReducer?.courierID,
  SubscriptionLimit: state.CommanReducer.SubscriptionLimit,
  UserDetails: state.CommanReducer?.UserDetails,
  Blockedviz: state.CommanReducer?.Blockedviz,

  LoginDetails: state.CommanReducer?.LoginDetails,
  ReceptionData: state.CommanReducer?.ReceptionData,
  VisitorList: state.VisitorsReducer?.VisitorList,
  EmployeeList: state.EmployeReducer?.EmployeeList,
  ReceptionList: state.CommanReducer?.ReceptionList,
  AllSettings: state.CommanReducer?.AllSettings,
  WhoomToMeet: state.CommanReducer?.WhoomToMeet,
  NotificationList: state.CommanReducer.NotificationList,
});
export const mapDispatchToProps = dispatch => ({
  courierId: payload => dispatch(courierId(payload)),
  adminSwitch: payload => dispatch(adminSwitch(payload)),
  
  BlockedViz: payload => dispatch(BlockedViz(payload)),
 
  VisitorList: payload => dispatch(VisitorList(payload)),
  mobileNo: payload => dispatch(mobileNo(payload)),
  VisitorDetails: payload => dispatch(VisitorDetails(payload)),
  GetRecpDashboard: param =>
    dispatch(
      Fetch('Users/GetRecpDashboard', 'GET', param, serviceActionReceptionData),
    ),
    GetAdminDashboard: (userID,onSuccess) => dispatch(Fetch('Users/GetAdminDashboard', 'GET', userID, undefined,onSuccess,false)),

  EmpVisitorList: (userID, empID, onSuccess) =>
    dispatch(
      Fetch(
        'Visitor/EmpVisitorList',
        'GET',
        userID + '/' + empID,
        serviceActionVisitors,
        onSuccess,
      ),
    ),
    GetUsersList: (param,onSuccess) => dispatch(Fetch('Users/GetUsersList', 'GET', param, undefined,onSuccess,false)),
  GetVisitorForGateKeeper: (userID, onSuccess) =>
    dispatch(
      Fetch(
        'Visitor/GetVisitorForGateKeeper',
        'GET',
        userID,
        serviceActionVisitors,
        onSuccess,
      ),
    ),
    GetVisitorDtlsForAdmin: (userID,onSuccess) => dispatch(Fetch('Visitor/GetVisitorDtlsForAdmin', 'GET', userID, undefined,onSuccess,false)),
    DeleteUser: (param,onSuccess) => dispatch(Fetch('Users/DeleteUser/'  + param, 'POST', undefined, undefined,onSuccess,false)),
    GetEmpTodayInoutHistory: (param,onSuccess) => dispatch(Fetch('Users/GetEmpTodayInoutHistory', 'GET', param, undefined,onSuccess,false)),
    GetVisitorAll: (userID,onSuccess) => dispatch(Fetch('Visitor/GetVisitorAll', 'GET', userID, undefined,onSuccess,false)),
    GetBlockedVisitorAll: (userID,onSuccess) => dispatch(Fetch('Visitor/BlockedVisitors', 'GET', userID, undefined,onSuccess,false)),

  GetVisitorForReception: (userID, onSuccess) =>
    dispatch(
      Fetch(
        'Visitor/GetVisitorForReception',
        'GET',
        userID,
        serviceActionVisitors,
        onSuccess,
      ),
    ),
  GetVisitorForReceptionUPcomming: (userID, onSuccess) =>
    dispatch(
      Fetch(
        'Visitor/GetVisitorForReceptionUPcomming',
        'GET',
        userID,
        serviceActionVisitors,
        onSuccess,
      ),
    ),
  GetVisitorForReceptionCompleted: (userID, onSuccess) =>
    dispatch(
      Fetch(
        'Visitor/GetVisitorForReceptionCompleted',
        'GET',
        userID,
        serviceActionVisitors,
        onSuccess,
      ),
    ),
  GetVisitorForReceptionWaiting: (userID, onSuccess) =>
    dispatch(
      Fetch(
        'Visitor/GetVisitorForReceptionWaiting',
        'GET',
        userID,
        serviceActionVisitors,
        onSuccess,
      ),
    ),
  GetEmpCheckInList: (param, onSuccess) =>
    dispatch(
      Fetch(
        'Users/GetEmpCheckInList',
        'GET',
        param,
        serviceActionEmployeeList,
        onSuccess,
      ),
    ),
  GetAllSettings: userID =>
    dispatch(
      Fetch(
        'Settings/GetAllSettings',
        'GET',
        userID,
        serviceActionGetAllSettings,
        undefined,
        true,
      ),
    ),
  CheckOut: (inoutid, onSuccess) =>
    dispatch(
      Fetch('Visitor/CheckOut/' + inoutid, 'POST', undefined, onSuccess),
    ),
  Update: Update => dispatch(serviceActionUpdate(Update)),
  SaveNotification: param =>
    dispatch(Fetch('Notification/SaveNotification', 'POST', param)),
  GetReceptionList: userID =>
    dispatch(
      Fetch(
        'Users/GetReceptionList',
        'GET',
        userID,
        serviceActionReceptionList,
      ),
    ),
  EmpCheckOut: (param, onSuccess) =>
    dispatch(Fetch('Users/EmpCheckOut', 'POST', param, undefined, onSuccess)),
  EmpCheckIn: (param, onSuccess) =>
    dispatch(Fetch('Users/EmpCheckIn', 'POST', param, undefined, onSuccess)),
  ChkSubscriptionLimit: userID =>
    dispatch(
      Fetch(
        'Visitor/ChkSubscriptionLimit',
        'GET',
        userID,
        serviceActionSubscriptionLimit,
        undefined,
        true,
      ),
    ),

  CheckinWithPhoto: (param, onSuccess) =>
    dispatch(
      Fetch('Visitor/CheckinWithPhoto', 'POST', param, undefined, onSuccess),
    ),
  CheckIn: (param, onSuccess) =>
    dispatch(
      Fetch(
        'Visitor/CheckIn/' + param,
        'POST',
        undefined,
        undefined,
        onSuccess,
      ),
    ),
  CheckOut: (inoutid, onSuccess) =>
    dispatch(
      Fetch('Visitor/CheckOut/' + inoutid, 'POST', undefined, onSuccess),
    ),

  VizReschedule: (param, onSuccess) =>
    dispatch(
      Fetch('Visitor/VizReschedule', 'POST', param, undefined, onSuccess),
    ),
  VizApprove: (param, onSuccess) =>
    dispatch(
      Fetch(
        'Visitor/VizApprove/' + param,
        'POST',
        undefined,
        undefined,
        onSuccess,
      ),
    ),
  VizRejected: (param, onSuccess) =>
    dispatch(
      Fetch(
        'Visitor/VizRejected/' + param,
        'POST',
        undefined,
        undefined,
        onSuccess,
      ),
    ),
  MeetingOut: (param, onSuccess) =>
    dispatch(Fetch('Visitor/MeetingOut', 'POST', param, undefined, onSuccess)),
  //Login
  accountLogin: (params, onSuccess) =>
    dispatch(
      Fetch(
        'Account/AccountLogin',
        'POST',
        params,
        serviceActionLoginDetail,
        onSuccess,
      ),
    ),
  GetUsersDetails: (empId, onSuccess) =>
    dispatch(
      Fetch(
        'Users/GetUsersDetails',
        'GET',
        empId,
        serviceActionUserDetail,
        onSuccess,
      ),
    ),
  saveToken: (empId, onSuccess) =>
    dispatch(
      Fetch(
        'Notification/SaveNotifyToken',
        'GET',
        empId + '/' + global.token,
        undefined,
        onSuccess,
      ),
    ),
  //splash
  saveData: data => dispatch(serviceActionLoginDetail(data)),
  GetUsersDetails: (empId, onSuccess) =>
    dispatch(
      Fetch(
        'Users/GetUsersDetails',
        'GET',
        empId,
        serviceActionUserDetail,
        onSuccess,
        false,
      ),
    ),
  //Employer
  GetEmpDateVizList: (userID, date, empID, onSuccess) =>
    dispatch(
      Fetch(
        'Users/GetEmpDateVizList',
        'GET',
        userID + '/' + date + '/' + empID,
        undefined,
        onSuccess,
      ),
    ),
  GetEmpDashboard: (userID, userRoleId, empID, onSuccess) =>
    dispatch(
      Fetch(
        'Users/GetEmpDashboard',
        'GET',
        userID + '/' + userRoleId + '/' + empID,
        undefined,
        onSuccess,
      ),
    ),
  GetVisitorDtls: (inOutId, onSuccess) =>
    dispatch(
      Fetch('Visitor/GetVisitorDtls', 'GET', inOutId, undefined, onSuccess),
    ),
  //VisitorForm
  GetWhoomToMEet: (userID, onSuccess) =>
    dispatch(
      Fetch(
        'Users/GetWhoomToMEet',
        'GET',
        userID,
        serviceActionWhoomToMeet,
        onSuccess,
        true,
      ),
    ),
  // GetVisitorDtls: (inOutId) => dispatch(Fetch('Visitor/GetVisitorDtls', 'GET', inOutId, serviceActionVisitorDtls)),
  GetUsersDetails1: (empID, onSuccess) =>
    dispatch(
      Fetch('Users/GetUsersDetails', 'GET', empID, undefined, onSuccess),
    ),
  GetVisitorByMobile: (mobile, onSuccess) =>
    dispatch(
      Fetch(
        'Visitor/GetVisitorByMobile',
        'GET',
        mobile ,
        undefined,
        onSuccess,
      ),
    ),
  SaveVisitor: (param, onSuccess) =>
    dispatch(Fetch('Visitor/SaveVisitor', 'POST', param, undefined, onSuccess)),
  //gateKeepar
  GetVisitorByInviteCode: (inviteCode, onSuccess) =>
    dispatch(
      Fetch(
        'Visitor/GetVisitorByInviteCode',
        'GET',
        inviteCode,
        undefined,
        onSuccess,
        true,
      ),
    ),
  //resetPassword
  loginReset: (params, onSuccess, isLoading) =>
    dispatch(
      Fetch(
        'Account/ResetPassword',
        'GET',
        params,
        undefined,
        onSuccess,
        isLoading,
      ),
    ),
  //DrawerScreen
  LogOut: () => dispatch(LogOut),
  //appChangePassword
  CheckOldPwd: (params, onSuccess) =>
    dispatch(
      Fetch('Account/CheckOldPwd', 'POST', params, undefined, onSuccess, false),
    ),
  ChangePassword: (params, onSuccess) =>
    dispatch(
      Fetch(
        'Account/ChangePassword',
        'POST',
        params,
        undefined,
        onSuccess,
        false,
      ),
    ),
  //Header
  NotificationsListByuser: (params, onSuccess) =>
    dispatch(
      Fetch(
        'Notification/NotificationsListByuser',
        'GET',
        params,
        serviceActionNotificationsListByuser,
        onSuccess,
        false,
      ),
    ),
  //ChangePassword
  forgotPasswordSet: (params, onSuccess, isLoading) =>
    dispatch(
      Fetch(
        'Account/ChangePassword',
        'POST',
        params,
        undefined,
        onSuccess,
        isLoading,
      ),
    ),
  //NotificationList
  // NotificationsListByuser: (empID, userRoleId) => dispatch(Fetch('Notification/NotificationsListByuser', 'GET', empID + "/" + userRoleId, serviceActionNotificationsListByuser)),
  ReadSingleMsg: (param, onSuccess) =>
    dispatch(
      Fetch(
        'Notification/ReadSingleMsg/' + param,
        'POST',
        undefined,
        undefined,
        onSuccess,
      ),
    ),
  // ReadAllMsg: (param, onSuccess) => dispatch(Fetch('Notification/ReadAllMsg/' + param, 'POST', undefined, undefined, onSuccess)),

  //Profile
  updateProfileDetails: (param, onSuccess) =>
    dispatch(
      Fetch('Users/UpdateEmpProFile', 'POST', param, undefined, onSuccess),
    ),
  // GetUsersDetails: (empId, onSuccess,) => dispatch(Fetch('Users/GetUsersDetails', 'GET', empId, serviceActionUserDetail, onSuccess, isLoading)),
  //App
  networkService: () =>
    NetInfo.addEventListener(state =>
      dispatch(serviceNetworkActionSuccess(state)),
    ),
  NotificationsListByuser: (empID, userRoleId) =>
    dispatch(
      Fetch(
        'Notification/NotificationsListByuser',
        'GET',
        empID + '/' + userRoleId,
        serviceActionNotificationsListByuser,
      ),
    ),
  GetVisitorList: (userID, onSuccess) =>
    dispatch(
      Fetch('Visitor/GetVisitorList', 'GET', userID, undefined, onSuccess),
    ),
  GetVisitorReportbyEmp: (userID, starDate, endDate, EmpId, onSuccess) =>
    dispatch(
      Fetch(
        'Visitor/GetVisitorReportbyEmp',
        'GET',
        userID + '/' + starDate + '/' + endDate + '/' + EmpId,
        undefined,
        onSuccess,
      ),
    ),
    GetCompany: (userID,onSuccess) => dispatch(Fetch('VizOrganization/GetCompany', 'GET', userID, undefined,onSuccess,false)),
    GetActivePlan: (userID,onSuccess) => dispatch(Fetch('VizOrganization/GetActivePlan', 'GET', userID, undefined,onSuccess,false)),
    GetEmpTotalSubscriptionLimit: (userID,onSuccess) => dispatch(Fetch('Users/GetEmpTotalSubscriptionLimit', 'GET', userID, undefined,onSuccess,false)),
    VisitorUpdate: (param,onSuccess) => dispatch(Fetch('Visitor/VisitorUpdate', 'POST', param, undefined,onSuccess,false)),
    UpdateUser: (param,onSuccess) => dispatch(Fetch('Users/UpdateUser', 'POST',param, undefined,onSuccess,false)),
    SaveUser: (param,onSuccess) => dispatch(Fetch('Users/SaveUser', 'POST',param, undefined,onSuccess,false)),
    GetAllSettings123: (userID,onSuccess) => dispatch(Fetch('Settings/GetAllSettings', 'GET', userID, undefined,onSuccess,true)),
    UpdateSetting: (param,onSuccess) => dispatch(Fetch('Settings/UpdateSetting', 'POST', param, undefined,onSuccess,true)),
    ColUpdateSetting: (param,onSuccess) => dispatch(Fetch('Settings/UpdateColomMapping', 'POST', param, undefined,onSuccess,true)),
    UpdateOrganization: (param,onSuccess) => dispatch(Fetch('VizOrganization/UpdateOrganization', 'POST', param, undefined,onSuccess,true)),
    GetInvitedVisitors: (userID,startDate,endDate,empId,isInvite,onSuccess) => dispatch(Fetch('Visitor/GetInvitedVisitors', 'GET', userID+"/"+startDate+"/"+endDate+"/"+empId+"/"+isInvite, undefined,onSuccess,false)),
    GetEmployeesInOut: (userID,startDate,endDate,empId,onSuccess) => dispatch(Fetch('Users/GetEmployeesInOut', 'GET', userID+"/"+startDate+"/"+endDate+"/"+empId, undefined,onSuccess,false)),

  });
