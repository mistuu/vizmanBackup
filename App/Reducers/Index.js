import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import CommanReducer from './CommanReducer';
import EmployeReducer from './EmployeReducer';
import NetworkReducer from './NetworkReducer';
import VisitorsReducer from './VisitorsReducer';


const AppReducers = combineReducers({
    NetworkReducer,CommanReducer,VisitorsReducer,EmployeReducer
});

const rootReducer = (state, action) => {
	return AppReducers(state,action);
}

// const logger = createLogger();

let store = createStore(rootReducer, compose(applyMiddleware(thunk)));

export default store;