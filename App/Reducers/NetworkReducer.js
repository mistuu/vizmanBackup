

const NetworkReducer = (state = {  network: {isConnected:true} }, action) => {
    switch (action.type) {
        case "NETWORK":
            return Object.assign({}, state, {
                network: action.network
            }); 
        default:
            return state;
    }
}

export default NetworkReducer;