const defaultState = {
    VisitorList:[]
}
const VisitorsReducer = (state = {
    VisitorList:[]
}, action) => {
    switch (action.type) {
       
        case "VISITOR_LIST":
            return Object.assign({}, state, {
                VisitorList: action.VisitorList,
            });
       
        case "VISITOR_DETAILS":
            return Object.assign({}, state, {
                VisitorDetails: action.VisitorDetails,
            });
            case "USER_LOGOUT":
                return defaultState
        default:
            return state;
    }
}

export default VisitorsReducer;