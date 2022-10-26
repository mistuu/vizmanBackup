import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList,ListView, Image, ActivityIndicator } from 'react-native';


export default class ServiceComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dataSource:this.props.data
        }
    }

    componentDidMount() {
        this.props.callService()
    }

    renderCell = (rowData) => {
        return(
        <View style={styles.containerList}>
            {/* <Image source={{ uri: rowData.data.preview.images.source.uri }} style={styles.photo} /> */}
            <Text style={styles.text}>
                {rowData.item.text}
            </Text>
        </View>
    )};

    render() {
        const { dataSource, isLoading } = this.state;
        return (
            <View style={styles.container}>
               {!this.props.isLoading ?<FlatList
                    // style={{ marginTop: 30, flex: 1 }}
                    data={this.props.data.all}
                    keyExtractor={(item,index)=>index.toString()}
                    renderItem={(item) => this.renderCell(item)}
                />:
                <ActivityIndicator
                    animating={this.props.isLoading}
                    style={[styles.centering, {flex:1 }]}
                    size="large"
                    color="#0000ff"
                />}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF'
    },
    containerList: {
        flex: 1,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        marginLeft: 12,
        fontSize: 16,
        color:"#000"
    },
    photo: {
        height: 80,
        width: 80,
        borderRadius: 20,
        backgroundColor: '#000000'
    },

    centering: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,

    },
});
