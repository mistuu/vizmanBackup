import AsyncStorage from '@react-native-async-storage/async-storage';

const AsyncKeys = {
    userData: "user_data",
    touchId: "touchId"

}

const storeItem = async (item, value) => {
    const isDataStored = await AsyncStorage.setItem(item, JSON.stringify(value))
        .then(response => true)
        .catch(err => false)
    return isDataStored;
};

const getItem = async item => {
    const storedData = await AsyncStorage.getItem(item)
        .then(response => JSON.parse(response))
        .catch(err => false);
    if (storedData == null) {
        return false
    }
    return storedData;
};

const removeItem = async (item) => {
    const isDataRemoved = await AsyncStorage.removeItem(item)
        .then(response => true)
        .catch(err => false)
    return isDataRemoved;
};

const clearStorage = async () => {
    const clearData = await AsyncStorage.clear()
        .then(response => true)
        .catch(err => false);
    return clearData;
};

export { AsyncKeys, storeItem, getItem, clearStorage, removeItem };
