import React, { Component } from "react";
import axios from "axios";
import {backendUrlUser} from '../BackendURL';
import { Link } from 'react-router-dom';
// import {Password} from 'primereact/password';
import "bootstrap/dist/css/bootstrap.css";
import '../index.css';
import { InputText } from 'primereact/inputtext';
// import { Button } from 'primereact/button';


class register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            registerform: {
                contactNo: "",
                password: "",
                name:"",
                emailId:""
            },
            registerformErrorMessage: {
                contactNo: "",
                password: "",
                name:"",
                emailId:""
            },
            registerformValid: {
                contactNo: false,
                password: false,
                name:false,
                emailId:false,
                buttonActive: false
            },
            successMessage: "",
            errorMessage: "",
            
        }
    }

    handleClick = () => {
        
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const { registerform } = this.state;
        this.setState({
            registerform: { ...registerform, [name]: value }
        });
        this.validateField(name, value);
        // console.log(this.state.registerform[name], name);
    }

    register = () => {
        const { registerform } = this.state;
        this.setState({successMessage:"",errorMessage:""});
        axios.post(backendUrlUser+'/register', registerform)
            .then(response => {
                this.setState({successMessage:response.data.message,errorMessage:""})
            }).catch(error => {
                this.setState({errorMessage:error.response.data.message,successMessage:""})
            })
        // console.log(this.state.registerform.contactNo, this.state.registerform.password);
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.register();
    }


    validateField = (fieldName, value) => {
        let fieldValidationErrors = this.state.registerformErrorMessage;
        let formValid = this.state.registerformValid;
        switch (fieldName) {
            case "name":
                let nameRegex = /^[A-z][A-z \s]+[A-z]$/
                if (!value || value === "") {
                    fieldValidationErrors.name = "field required";
                    formValid.name = false;
                } else if (!value.match(nameRegex)) {
                    fieldValidationErrors.name = "Name can contain only alphabets and spaces. Name should not start or end with a space";
                    formValid.name = false;
                } else {
                    fieldValidationErrors.name = "";
                    formValid.name = true;
                }
                break;
            
            case "emailId":
            let emailIdRegex = /^[A-z]+[@][A-z]+[.][A-z]{2,3}$/
            if (!value || value === "") {
                fieldValidationErrors.emailId = "field required";
                formValid.emailId = false;
            } else if (!value.match(emailIdRegex)) {
                fieldValidationErrors.emailId = "Please enter valid EmailId";
                formValid.emailId = false;
            } else {
                fieldValidationErrors.emailId = "";
                formValid.emailId = true;
            }
            break;

            case "contactNo":
                let cnoRegex = /^[1-9]\d{9}$/
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
                    } else if (!(value.match(/[A-Z]/) && value.match(/\d/) &&value.match(/[!, @, #, $, %, ^, &, * ]/) && value.match(/[a-z]/)&& value.length>=7 && value.length<=20 )) {
                        fieldValidationErrors.password = "The password must contain length of 7 to 20 character (both inclusive) with atleast one uppercase,lowercase,digit and special character"
                        formValid.password = false;
                } else {
                    fieldValidationErrors.password = "";
                    formValid.password = true;
                }
                break;
            default:
                break;
        }
        formValid.buttonActive = formValid.contactNo && formValid.password && formValid.emailId && formValid.name;
        this.setState({
            registerformErrorMessage: fieldValidationErrors,
            registerformValid: formValid,
            successMessage: ""
        });
    }

    render() {
        return (
            <div className="regback">
                <section id="registerPage" className="registerSection">    {/* *ngIf="!registerPage"  */}
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-4 offset-4 "align="left">
                                {this.state.successMessage.length===0?(
                                <div><h1><center>Join Us</center></h1>
                                <form className="form" onSubmit={this.handleSubmit}> {/* [formGroup]="registerForm" (ngSubmit)="register()" */}
                                    <div className="form-group">
                                        <label htmlFor="name">Name<span className="text-danger">*</span></label>
                                        <InputText
                                            type="text"
                                            value={this.state.registerform.name}
                                            onChange={this.handleChange}
                                            id="name"
                                            name="name"
                                            className="form-control line"
                                            tooltip="Enter UserName Eg:John"
                                        />
                                    </div>
                                    {this.state.registerformErrorMessage.name ? (<span name="registernameErrorMessage" className="text-danger">
                                        {this.state.registerformErrorMessage.name}
                                    </span>)
                                        : null}

                                    <div className="form-group">
                                        <label htmlFor="emailId">Email Id<span className="text-danger">*</span></label>
                                        <InputText
                                            type="email"
                                            value={this.state.registerform.emailId}
                                            onChange={this.handleChange}
                                            id="emailId"
                                            name="emailId"
                                            className="form-control line"
                                            tooltip="Enter Email Id  Eg:john@infy.com"
                                        />
                                    </div>
                                    {this.state.registerformErrorMessage.emailId ? (<span name="registeremailIdErrorMessage" className="text-danger">
                                        {this.state.registerformErrorMessage.emailId}
                                    </span>)
                                        : null}

                                    <div className="form-group">
                                        <label htmlFor="uContactNo">Contact Number<span className="text-danger">*</span></label>
                                        <InputText
                                            type="number"
                                            value={this.state.registerform.contactNo}
                                            onChange={this.handleChange}
                                            id="uContactNo"
                                            name="contactNo"
                                            className="form-control line"
                                            max="9999999999"
                                            min="6000000000"
                                            tooltip="Enter Contact No  Eg:99999-99999"
                                        />
                                    </div>
                                    {this.state.registerformErrorMessage.contactNo ? (<span name="registercontactNoErrorMessage" className="text-danger">
                                        {this.state.registerformErrorMessage.contactNo}
                                    </span>)
                                        : null}

                                    <div className="form-group">
                                        <label htmlFor="uPass">Password<span className="text-danger">*</span></label>
                                        <InputText
                                            type="password"
                                            value={this.state.registerform.password}
                                            onChange={this.handleChange}
                                            id="uPass"
                                            name="password"
                                            className="form-control line"
                                            tooltip="Enter a strong Password"
                                        />
                                        {/* <Password className="form-control"></Password> */}
                                    </div>
                                    {this.state.registerformErrorMessage.password ? (<span name="registerpasswordErrorMessage" className="text-danger">
                                        {this.state.registerformErrorMessage.password}
                                    </span>)
                                        : null}
                                    <br/>
                                    <span><span className="text-danger">*</span> marked fields are mandatory</span>
                        
                                    {/* <div class="form-group">
                                        <div class="text-danger">
                                            <h6>{{ errorMessage }}</h6>
                                        </div>
                                    </div> */}
                                    <br/><br/>
                                    <button
                                        type="submit"
                                        disabled={!this.state.registerformValid.buttonActive}
                                        className="btn btn-primary btn-block"
                                    >
                                        Register
                                    </button>
                                    <span>{this.state.successMessage}</span>
                                    <span>{this.state.errorMessage}</span>
                                </form></div>):(<div className="text-center"><h2><span className="text-success">{this.state.successMessage}</span></h2>
                                <br/>
                                <Link to="/login"><h4>Click here to Login</h4></Link></div>)}
                                <br />
                                {/* <!--can be a button or a link based on need -->
                                <button className="btn btn-primary" onClick={this.handleClick} >Click here to Register</button> */}
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

        )
    }
}

export default register;