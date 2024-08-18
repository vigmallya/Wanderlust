import React, { Component } from "react";
import axios from "axios";
import { Redirect } from 'react-router-dom';
import {backendUrlUser} from '../BackendURL';
import { InputText } from 'primereact/inputtext';
// import { Button } from 'primereact/button';
import "bootstrap/dist/css/bootstrap.css";
import '../index.css';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginform: {
                contactNo: "",
                password: ""
            },
            loginformErrorMessage: {
                contactNo: "",
                password: ""
            },
            loginformValid: {
                contactNo: false,
                password: false,
                buttonActive: false
            },
            successMessage: "",
            errorMessage: "",
            loadHome: false,
            loadRegister: false,
            userId: ""
        }
    }

    handleClick = () => {
        this.setState({ loadRegister: true })
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const { loginform } = this.state;
        this.setState({
            loginform: { ...loginform, [name]: value }
        }); 
        this.validateField(name, value);
        // console.log(this.state.loginform[name], name);
    }

    login = () => {
        const { loginform } = this.state;
        axios.post(backendUrlUser+'/login', loginform)
            .then(response => {
                console.log(response);
                let userId = response.data.userId;
                sessionStorage.setItem("contactNo", response.data.contactNo);
                sessionStorage.setItem("userId", userId);
                sessionStorage.setItem("userName", response.data.name);
                this.setState({ loadHome: true, userId: userId });
                window.location.reload()

            }).catch(error => {
                console.log(error);
                // this.errorMessage = error.message;
                this.setState({errorMessage:error.response.data.message});
                sessionStorage.clear();
            })
        // console.log(this.state.loginform.contactNo, this.state.loginform.password);
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.login();
    }

    validateField = (fieldName, value) => {
        let fieldValidationErrors = this.state.loginformErrorMessage;
        let formValid = this.state.loginformValid;
        switch (fieldName) {
            case "contactNo":
                let cnoRegex = /^[6-9]\d{9}$/
                if (!value || value === "") {
                    fieldValidationErrors.contactNo = "Please enter your contact Number";
                    formValid.contactNo = false;
                } else if (!value.match(cnoRegex)) {
                    fieldValidationErrors.contactNo = "Contact number should be a valid 10 digit number";
                    formValid.contactNo = false;
                } else {
                    fieldValidationErrors.contactNo = "";
                    formValid.contactNo = true;
                }
                break;
            case "password":
                if (!value || value === "") {
                    fieldValidationErrors.password = "Password is manadatory";
                    formValid.password = false;
                    } 
                else if (!((value.match(/[A-Za-z]{1,}/)) && (value.match(/[0-9]{1,}/)) && (value.match(/[!@#$%^&*]/)) && (String(value).length<21) && (String(value).length>6)))
                {
                    fieldValidationErrors.password = "Please Enter a valid password"
                    formValid.password = false;
                } else {
                    fieldValidationErrors.password = "";
                    formValid.password = true;
                }
                break;
            default:
                break;
        }
        formValid.buttonActive = formValid.contactNo && formValid.password;
        this.setState({
            loginformErrorMessage: fieldValidationErrors,
            loginformValid: formValid,
            successMessage: ""
        });
    }

    render() {
        if (this.state.loadHome === true) return <Redirect to={'/home/' + this.state.userId} />
        if (this.state.loadRegister === true) return <Redirect to={'/register'} />
        return (
            <div >
                <div className="logimg">
                <section id="loginPage" className="loginSection">    {/* *ngIf="!registerPage"  */}
                    <div className="container-fluid">
                        <div className="row">
                        {/* <div className="col-md-5 offset-1">
                            <img src="../assets/india.jpg" className="logimg "></img>
                            <div className="textover">
                                <h2>Welcome to Wanderlust!!</h2>
                            
                            </div>
                        </div> */}
                            <div className="col-md-4 text-left offset-4 "><br /> 
                            {/* logborder */}
                                <h1><center><b>Login</b></center></h1><br/>
                                <form className="form" onSubmit={this.handleSubmit}> {/* [formGroup]="loginForm" (ngSubmit)="login()" */}
                                    <div className="form-group">
                                        <label htmlFor="uContactNo"><b>Contact Number</b><span className="text-danger">*</span></label>
                                        <InputText
                                            type="number"
                                            value={this.state.loginform.contactNo}
                                            onChange={this.handleChange}
                                            id="uContactNo"
                                            name="contactNo"
                                            className="form-control line"
                                            tooltip="Enter Contact No"
                                        />
                                    </div>
                                    {this.state.loginformErrorMessage.contactNo ? (<span name="logincontactNoError" className="text-danger">
                                        {this.state.loginformErrorMessage.contactNo}
                                    </span>)
                                        : null}
                                    <div className="form-group">
                                        <label htmlFor="uPass"><b>Password</b><span className="text-danger">*</span></label>
                                        <InputText
                                            type="password"
                                            value={this.state.loginform.password}
                                            onChange={this.handleChange}
                                            id="uPass"
                                            name="password"
                                            className="form-control line"
                                            tooltip="Enter Password"
                                        />
                                    </div>
                                    {this.state.loginformErrorMessage.password ? (<span name="loginpasswordError" className="text-danger">
                                        {this.state.loginformErrorMessage.password}
                                    </span>)
                                        : null}<br />
                                    <span className="textcolo"><span className="text-danger">*</span><b> marked fields are mandatory</b></span>
                                    <br />
                                    <div class="form-group">
                                        <div class="text-danger">
                                            <h6>{ this.state.errorMessage }</h6>
                                        </div>
                                    </div>

                                    <button type="submit" disabled={!this.state.loginformValid.buttonActive}
                                    className="btn btn-primary btn-block">Login
                                    </button>
                                </form>
                                <br />
                                {/* <!--can be a button or a link based on need --> */}
                                <button className="btn btn-primary btn-block" onClick={this.handleClick} >Click here to Register</button>
                            </div>
                        </div>
                    </div>
                </section>
                {/* <div * ngIf= "!registerPage" >
            <router-outlet></router-outlet>
            </div > */}
                {/* *ngIf="!registerPage" */}
                {/* </div > */}
            </div>
            </div>

        )
    }
}

export default Login;


// using for Each 
function removeDuplicates (arr) { 
    let uniqueArray = []; 
    arr.forEach(ele => { 
        if(!uniqueArray.includes(ele)) { 
            uniqueArray.push(ele) 
        } }) 
    return uniqueArray;
}