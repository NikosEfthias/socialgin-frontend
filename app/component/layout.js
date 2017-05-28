import React from "react";
import { connect } from "react-redux";

import Config from "./../config";

import Topbar from "./partials/topbar";
import Sidebar from "./partials/sidebar";
import Menu from "./partials/menu";

import Pages from "./pages/index";
import Loading from "./pages/loading";

import {fetchAccounts, userName, avatar} from "./../actions/accountActions";

@connect(store=>{
    return {
        list : store.User.list
    }
})
export default class Layout extends React.Component{
    constructor(){
        super();
        this.state = {
            mobilSidebar : false,
            mobilMenu : false,
            page_load : false
        }
    }
    mobil_sidebar(){
        const that = this;
        that.setState({
            mobilSidebar : !that.state.mobilSidebar
        })
    }
    mobil_menu(){
        const that = this;
        that.setState({
            mobilMenu : !that.state.mobilMenu
        })
    }
    componentWillMount(){
        const that = this;
        const user_data = localStorage.getItem("socialgin_user_data");
        if(!user_data) return window.location.href = "/";
        const ajax = new XMLHttpRequest()
        ajax.open("POST", Config.api_url + Config.authorize, true);
        ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        ajax.onload = function () {
            const data = JSON.parse(ajax.response);
            if(data.error) return window.location.href = "/";
            const xhr = new XMLHttpRequest()
            xhr.open("GET", Config.api_url + Config.getUserData + `?token=${encodeURIComponent(data.data)}`, true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onload = function () {
                let res = JSON.parse(xhr.response);
                if(res.error) return console.log(res);
                /**
                    const allAccounts = [...res.tw_accounts || [], ...res.fb_accounts || []]
                    that.props.dispatch({
                        type : "FETCH_ACCOUNT",
                        payload : allAccounts
                    })
                 */
                that.props.dispatch({
                    type : "USER_NAME",
                    payload : res.name + " " + res.surname
                })
                that.props.dispatch({
                    type : "AVATAR",
                    payload : res.profile_picture
                })
                that.setState({page_load : true})
            }
            xhr.send()
        }
        ajax.send(`authenticationtoken=${encodeURIComponent(user_data)}`)
    }
    render(){
        return (
            <div class="wrapper">
                {(_=>{
                    if(this.state.page_load){
                        return (<div><Topbar mobil_menu={this.mobil_menu.bind(this)} mobilSidebar={this.state.mobilSidebar} mobil_sidebar={this.mobil_sidebar.bind(this)} />
                <div className="contents">
                    <div className="container">
                        <Sidebar mobilSidebar={this.state.mobilSidebar} />
                        <div className="page-contents">
                            <Menu mobilMenu={this.state.mobilMenu} />
                            <Pages />
                        </div>
                    </div>
                </div></div>)
                    }
                })()}
                {(_=>{
                    if(!this.state.page_load){
                        return <Loading />
                    }
                })()}
            </div>
        )
    }
}