
import { serviceActionError, serviceActionLoadingSuccess, serviceActionPending } from '../Reducers/Actions'
import { replace } from '../RootNavigation'
import { removeItem } from './AsyncConfig'
import { BASEURL } from './util'
import axios from "axios";

export const axiosAuthGet = async (url) => {
    try {
        let { data: response } = await axios.get(BASEURL + url);

        //   console.log("Axios responses=====:",response);
        //   if (response.ResponseCode !== 200)r
        //     store.dispatch(errorHandler(response.message));
        //   store.dispatch(errorEmpty());
        if (response.data)
            return response.data;
        else
            return response
    } catch (error) {
        console.log(error);
    }
};
export const axiosPost = async (url, payload) => {
    try {
        let { data: response } = await axios.post(
            BASEURL + url,
            payload
        );
        if (response.data)
            return response.data;
        else
            return response
    } catch (error) {
        console.log(error);
    }
};
// const u = "https://partnerapi.naapbooks.com/api/"

export const axPost = async (url) => {
    try {
        let { data: response } = await axios.post(
            BASEURL + url
        );
        if (response.data)
            return response.data;
        else
            return response
    } catch (error) {
        console.log(error);
    }
};
function Fetch(apiurl, type, params, Action, onSucess, isLoading) {
    const requestOption = {
        method: type,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',

        },
        body: type == "POST" ? JSON.stringify(params) : undefined
    }
    let URL
    if (type == "GET") {
        URL = BASEURL + apiurl + '/' + params
    } else {
        URL = BASEURL + apiurl
    }
    // console.log("requestOption", requestOption)
    console.log("URL", URL)
    return dispatch => {
        isLoading == undefined ? dispatch(serviceActionPending()) : null
        fetch(URL, requestOption)
            .then((res) => {
                dispatch(serviceActionLoadingSuccess())

                // console.log("res", res)
                if (res.status == 200)
                    return res.json()
            })
            .then(response => {

                // if (apiurl == 'Users/GetUsersDetails' || apiurl == 'Account/AccountLogin' || apiurl == 'Notification/SaveNotifyToken')
                //     console.log("FetchRes:*** ", response)
                // console.log("response@@@ ", response)
                if (Action != undefined) {
                    dispatch(Action(response))
                }
                if (onSucess != undefined) {
                    onSucess(response)
                }
            })
            .catch(error => {
                console.log("Fetcherror", error)
                dispatch(serviceActionLoadingSuccess())
                dispatch(serviceActionError(error))
            })
    }
}





export default Fetch;

