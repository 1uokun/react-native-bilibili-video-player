import React, { Component } from 'react';
import Video from 'react-native-video';
import {
    Animated,
    View,
    Dimensions,
    StyleSheet,
    Image,
    Text,
    TouchableWithoutFeedback
} from 'react-native'
import AnimatedComponent from './lib/AnimatedComponent'
import TouchView from './lib/TouchView'
import SeekBar from "./lib/Seekbar";
import {formatTime} from './lib/util'

// context
const MenusContext = React.createContext({});

// timer
let centerMenusTimer;

export default class VideoPlayer extends Component {
    static defaultProps = {
        volume:                     100,
        paused:                     false,
        renderTopMenus:             null,
        renderBottomMenus:          null,
    };

    constructor(props){
        super(props);
        this.state={
            //page props
            visible:true,
            orientation:'PORTRAIT',
            isTouched:false,

            //video props
            volume:this.props.volume,
            paused:this.props.paused,
            duration:100,
            currentTime:50,
            playableDuration:70
        };
    }

    componentDidMount() {
        {/******* listen orientation *******/}
        Dimensions.addEventListener('change',(e)=>{
            const {width,height} = e.window;
            if(width>height){
                this.setState({orientation:'LANDSCAPE'})
            }else {
                this.setState({orientation:'PORTRAIT'})
            }
        });

        setInterval(()=>{
            let currentTime = this.state.currentTime;
            currentTime+=1;
            this.setState({currentTime:currentTime})
        },1000)
    }

    /******* right touchMove event *******/
    handleUpAndDownMoveInRight=(offset)=>{
        let volume = this.state.volume;
        volume+=offset;
        if( volume<0){
            this.setState({volume:0})
        }else if(volume>100){
            this.setState({volume:100})
        }else {
            this.setState({volume:volume})
        }
    };

    /******* left touchMove event *******/
    handleUpAndDownMoveInLeft=(offset)=>{
        //need your pull request to complete control the root light
    };

    toggleMenus=()=>{
        let visible = this.state.visible;
        this.setState({visible:!visible})
    };

    handleDoubleTouch=()=>{
        let paused = this.state.paused;
        this.setState({paused:!paused})
    };


    render(){
        return (
            <MenusContext.Provider value={{state:this.state,props:this.props}}>
                <View style={[styles[this.state.orientation],styles.container]}>
                    {/************** VIDEO **************/}
                    <Video
                        // source={{uri: "https://luokun.oss-cn-hangzhou.aliyuncs.com/test.mp4"}}
                           style={{width:'100%',height:'100%',position:'absolute'}}
                           volume={this.state.volume}
                           paused={this.state.paused}
                           onLoadStart={ this.onLoadStart }
                           onLoad={  this.onLoad }
                           onProgress={  this.onProgress }
                        // onError={  (e)=>{console.log('onError',e)} }
                        // onEnd={  (e)=>{console.log('onEnd',e)} }
                    />
                    <TouchView style={{flex:1,backgroundColor:'transparent',justifyContent:'space-between'}}
                               handleSingleTouch={this.toggleMenus}
                               handleUpAndDownMoveInRight={this.handleUpAndDownMoveInRight}
                               handleDoubleTouch={this.handleDoubleTouch}
                    >
                        {/******* top menus *******/}
                        <TopMenus/>

                        {/******* center menus *******/}
                        <CenterMenus />

                        {/******* bottom menus *******/}
                        <BottomMenus/>

                    </TouchView>
                </View>
            </MenusContext.Provider>
        )
    }

    onLoadStart=(e)=>{
    };

    onLoad=async (e)=>{
        await this.setState({
            duration:e.duration,
        })
    };
    onProgress=(e)=>{
        this.setState({
            currentTime:e.currentTime,
            playableDuration:e.playableDuration
        })
    }
}

class TopMenus extends AnimatedComponent {
    render(){
        return (
            <MenusContext.Consumer>
                {({state,props})=>
                    <Animated.View onStartShouldSetResponder={()=>{return true}} style={[this.state.topMenusTranslate,state.visible?this.Appear:this.Disappear,{flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center',backgroundColor:'yellow'}]}>
                        {typeof props.renderTopMenus === 'function'?
                            <React.Fragment>
                                {props.renderTopMenus()}
                            </React.Fragment>:
                            <React.Fragment>
                                <TouchableWithoutFeedback>
                                    <Image source={require('./assets/icon.png')} />
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback>
                                    <Image source={require('./assets/icon.png')} />
                                </TouchableWithoutFeedback>
                            </React.Fragment>
                        }
                    </Animated.View>
                }
            </MenusContext.Consumer>
        )
    }
}
class BottomMenus extends AnimatedComponent {
    render(){
        return (
            <MenusContext.Consumer>
                {({state,props})=>
                    <Animated.View onStartShouldSetResponder={()=>{return true}} style={[this.state.bottomMenusTranslate,state.visible?this.Appear:this.Disappear,{flexDirection:'row',alignItems:'center'}]}>
                        {typeof props.renderBottomMenus === 'function' ?
                            <React.Fragment>
                                {props.renderBottomMenus()}
                            </React.Fragment> :
                            <React.Fragment>
                                <TouchableWithoutFeedback>
                                    <Image source={require('./assets/icon.png')}
                                           style={{width: 15, marginHorizontal: 10}} resizeMode={'contain'}/>
                                </TouchableWithoutFeedback>
                                {/******* seek bar *******/}
                                <SeekBar
                                    duration={state.duration}
                                    currentTime={state.currentTime}
                                    playableDuration={state.playableDuration}
                                >
                                    <View style={{width: 10, height: 10, borderRadius: 5, backgroundColor: 'red'}}/>
                                </SeekBar>
                                {/******* seek timer *******/}
                                {/******* seek timer *******/}
                                <View style={{marginLeft:10,width:80,flexDirection:'row',alignItems:'center',paddingHorizontal: 10}}>
                                    <Text style={{color:'white'}}>{formatTime(state.currentTime)}</Text>
                                    <Text style={{color:'white'}}>/</Text>
                                    <Text style={{color:'white'}}>{formatTime(state.duration)}</Text>
                                </View>
                            </React.Fragment>
                        }
                    </Animated.View>
                }
            </MenusContext.Consumer>
        )
    }
}

class CenterMenus extends AnimatedComponent {
    state={
        visible:false
    };

    //overload
    animate(){}

    async componentWillReceiveProps(nextProps,nextContext){
        if(this.context.state.volume!==nextContext.state.volume){
            await clearTimeout(centerMenusTimer);
            centerMenusTimer = setTimeout(()=>{
                this.setState({visible:false})
            },1500);
            !this.state.visible&&this.setState({visible:true})
        }
    }

    render(){
        return (
            <MenusContext.Consumer>
                {({state,props}) =>
                    <Animated.View style={[this.state.visible?this.Disappear:this.Appear,styles.modal]}>
                        <View style={[styles.modal, {opacity: 0.5, position: 'absolute', backgroundColor: '#000000'}]}/>
                        <Image source={require('./assets/icon.png')} style={{width: 20, marginHorizontal: 10}}
                               resizeMode={'contain'}/>
                        <View style={styles.progress}>
                            <View style={[styles.readProgress, {width: state.volume+'%'}]}/>
                        </View>
                    </Animated.View>
                }
            </MenusContext.Consumer>
        )
    }
}

TopMenus.contextType = MenusContext;
BottomMenus.contextType = MenusContext;
CenterMenus.contextType = MenusContext;

const styles = StyleSheet.create({
    container:{
        backgroundColor: '#000000',
        justifyContent:'space-between'
    },
    PORTRAIT:{
        width:'100%',
        height:'30%',
        minHeight: 220,
    },
    LANDSCAPE:{
        width:'100%',
        height:'100%',
    },
    modal:{
        alignSelf:'center',
        position:'absolute',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-around',
        width:120,
        height:40,
        borderRadius:5,
        backgroundColor:'transparent',
        // opacity:0
    },
    progress:{
        flex:1,
        marginRight:10,
        height:2,
        backgroundColor:'white'
    },
    readProgress:{
        position:'absolute',
        height:2,
        backgroundColor:'pink'
    }
});
