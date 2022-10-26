/**
 * @format
 */
 import React from 'react';

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import { Provider } from 'react-redux';
import App from './App/App';
import store from './App/Reducers/Index';
function App1() {
    
        return (
            <Provider store={store}>
                <App />
            </Provider>
        )
}
AppRegistry.registerComponent(appName, () => App1);
