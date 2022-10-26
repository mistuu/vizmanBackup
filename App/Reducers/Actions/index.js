export const serviceActionLoginDetail = (data) => ({
    type: "LOGIN_DETAILS",
    LoginDetails: data
})
export const serviceActionUserDetail = (UserDetails) => ({
    type: "USER_DETAILS",
    UserDetails
})

export const serviceNetworkActionSuccess = (network) => ({
    type: "NETWORK",
    network
})
export const serviceActionError = (error) => ({
    type: "ERROR",
    error: error
})

export const serviceActionPending = () => ({
    type: "PENDING"
})

export const serviceActionLoadingSuccess = () => ({
    type: "SUCCESS",
})
export const courierId = (value) => ({
    type: "courierId",
    payload: value
})
export const VisitorList = (value) => ({
    type: "VisitorList",
    payload: value
})
export const mobileNo = (value) => ({
    type: "mobileNo",
    payload: value
})
export const adminSwitch = (value) => ({
    type: "adminSwitch",
    payload: value
})
export const BlockedViz = (value) => ({
    type: "BlockedViz",
    payload: value
})
export const VisitorDetails = (value) => ({
    type: "VisitorDetails",
    payload: value
})
export const serviceActionUpdate = (Update) => ({
    type: "UPDATE",
    Update,
})

export const serviceActionVisitors = (VisitorList) => ({
    type: "VISITOR_LIST",
    VisitorList
})
export const serviceActionEmployeeList = (EmployeeList) => ({
    type: "EMPLOYEE_LIST",
    EmployeeList,
})
export const serviceActionSubscriptionLimit = (SubscriptionLimit) => ({
    type: "SUBSCRIPTION_LIMIT",
    SubscriptionLimit,
})
export const serviceActionNotificationsListByuser = (NotificationList) => ({
    type: "NOTIFICATION_LIST",
    NotificationList,
})
export const serviceActionWhoomToMeet = (WhoomToMeet) => ({
    type: "WHOOM_TO_MEET",
    WhoomToMeet,
})
export const serviceActionGetAllSettings = (AllSettings) => ({
    type: "SETTINGS",
    AllSettings,
})
export const serviceActionVisitorDtls = (VisitorDetails) => ({
    type: "VISITOR_DETAILS",
    VisitorDetails,
})
export const serviceActionReceptionList = (ReceptionList) => ({
    type: "RECEPTION_LIST",
    ReceptionList,
})
export const serviceActionReceptionData = (ReceptionData) => ({
    type: "RECEPTION_DATA",
    ReceptionData,
})
export const LogOut = () => ({
    type: "USER_LOGOUT"

})
