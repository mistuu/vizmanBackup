import { connect } from "react-redux";
const defaultState = {
    EmployeeList:[]
}
const EmployeReducer = (state = defaultState, action) => {
    switch (action.type) {
       
        case "EMPLOYEE_LIST":
            return Object.assign({}, state, {
                EmployeeList: action.EmployeeList,
            });
        case "USER_LOGOUT":
                return defaultState
        default:
            return state;
    }
}

export default EmployeReducer;