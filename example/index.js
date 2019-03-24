import React from 'react'
import {View, SafeAreaView, ScrollView, StatusBar, Animated} from 'react-native'
import VideoPlayer from '../videoPlayer'
// import Orientation from 'react-native-orientation'
import SplashScreen from "react-native-splash-screen";
SplashScreen.hide();


export default class extends React.Component {
    constructor(props){
        super(props);
        this.state={

        }
    }

    render(){
        return (
            <SafeAreaView style={{flex:1,backgroundColor:'#000000'}}>
                <StatusBar barStyle={'light-content'} translucent/>
                <VideoPlayer
                    renderTopMenus={(a)=>{
                        return (
                            <View style={{flex:1,height:20,backgroundColor:'green'}}></View>
                        )
                    }}
                    renderBottomMenus={()=>{
                        return (
                            <View style={{flex:1,height:20,backgroundColor:'green'}}></View>
                        )
                    }}
                />
                <View style={{flex:1,backgroundColor:'#FFFFFF'}}>
                    {/****** user ******/}
                    <View style={{padding:20,flexDirection: 'row',justifyContent: 'space-between'}}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{backgroundColor:'#ccc',width:50,height:50,borderRadius:25}}/>
                            <View style={{justifyContent:'space-between',marginLeft: 10}}>
                                <View style={{backgroundColor:'#ccc',width:80,height:20}}/>
                                <View style={{backgroundColor:'#ccc',width:100,height:20}}/>
                            </View>
                        </View>
                        <View style={{backgroundColor:'#ccc',width:80,height:35,alignSelf: 'center'}}/>
                    </View>

                    {/****** video description ******/}
                    <View style={{flex:1,justifyContent:'space-around',padding:20}}>
                        <View style={{backgroundColor:'#ccc',flex:1,marginBottom: '2%'}}/>
                        <View style={{backgroundColor:'#ccc',flex:1,width:'80%',marginBottom: '2%'}}/>
                        <View style={{flex:1,flexDirection:'row',width:'60%'}}>
                            {Array.apply(null,Array(4)).map((a,i)=>{
                                return (
                                    <View key={i} style={{backgroundColor:'#ccc',flex:1,marginRight:10}}/>
                                )
                            })}
                        </View>
                    </View>

                    {/****** recommended list ******/}
                    <View style={{flex:4,justifyContent:'space-around',padding:10}}>
                        {Array.apply(null,Array(3)).map((a,i)=>{
                            return (
                                <View key={i} style={{height:'30%',flexDirection:'row',justifyContent:'space-around'}}>
                                    <View style={{backgroundColor:'#ccc',width:'40%',height:'100%'}}/>
                                    <View style={{width:'55%',height:'100%',justifyContent:'space-between'}}>
                                        <View style={{backgroundColor:'#ccc',width:'80%',height:'20%'}}/>
                                        <View style={{backgroundColor:'#ccc',width:'30%',height:'20%'}}/>
                                        <View style={{backgroundColor:'#ccc',width:'40%',height:'20%'}}/>
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}
