import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
// import StaticPackage from './static-packages';
// import Packages from './packages';
import Hotdeals from './deals';
import {Growl} from 'primereact/growl';

//import {backendUrlUser,backendUrlPackage,backendUrlBooking} from '../BackendURL';

class Home extends Component {
    state = {
            continent: "",
            packagePage: false,
            successMessage: "",
            homePage: "",
            emailId: ""
    };

    handleChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        this.setState({ [name]: value })
    }

    handleClick = (event) => {
        event.preventDefault();
        let emailIdRegex = /^[A-z]+[@][A-z]+[.][A-z]{2,3}$/
        if (!this.state.emailId || this.state.emailId === "") {
            
        } else if (!this.state.emailId.match(emailIdRegex)) {
            {this.growl.show({life: 5000, severity: 'error', summary: 'Please enter valid EmailId', detail: ''})}
            // this.setState({ successMessage: "Please enter valid EmailId" });
        } else {
            {this.growl.show({life: 5000, severity: 'success', summary: 'Thank you for subscribing. Updates will be sent to the subscribing Email ID', detail: ''})}
            // this.setState({ successMessage: "Thank you for subscribing. Updates will be sent to the subscribing Email ID" });
        }
        
    }

    getPackages = () => {
        sessionStorage.setItem('continent', this.state.continent);
        this.setState({ packagePage: true });
    }

    componentDidMount() {
        sessionStorage.setItem('continent', "");
    }

    load = () =>{
        return <Redirect path="/home"></Redirect>
    }

    render() {
        if (this.state.packagePage === true) return <Redirect to={'/packages/' + this.state.continent} />
        return (
            <div>
                <Growl ref={(el) => this.growl = el } position="topcenter" id="homepopup" />
                <header className="masthead book-page" id="page-top">
                    <div className="container d-flex h-100 align-items-center">
                        <div className="mx-auto text-center">
                            <h1 className="mx-auto my-0 text-uppercase">Wanderlust</h1>
                            <h2 className="text-white-50 mx-auto mt-2 mb-5">All that is gold does not glitter,
                    Not all those who wander are lost.</h2>
                            <div className="form-inline d-flex">
                                <input
                                    type="text"
                                    className="form-control-lg flex-fill"
                                    name="continent"
                                    value={this.state.continent}
                                    onChange={this.handleChange}
                                    id="continent"
                                    placeholder="Where?"
                                />&nbsp;
                    <button className="btn btn-primary mx-auto" style={{color:"white"}} onClick={this.getPackages}>Search</button>

                            </div>
                        </div>
                    </div>
                </header>

                <section id="about" className="about-section text-center">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8 mx-auto">
                                <h2 className="text-white mb-4">Unleash the traveller inside you</h2>
                                <p className="about-paragraph text-center">When someone makes a travel plan, the first few things they want to sort out, are flights, accommodation, and other amenities for a convenient holiday. 
                                To enjoy holidays, you want to have the basics taken care of, especially for family vacations and honeymoon trips. 
                                You want your accommodation, return flight bookings, meals of the days, and other traveling formalities sorted beforehand. 
                                At <Link to="/" onClick={this.load()}>Wanderlust</Link>, we take care of all the requirements to ensure that you get to enjoy the best of your holiday, exploring and experiencing the destination.</p>
                            </div>
                            
                        </div>
                    </div>
                    <section >
                            <Hotdeals />
                            </section>
                </section>
                
                <section id="signup" className="signup-section imgborder">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-10 col-lg-8 mx-auto text-center">
                                <h2 className="text-white mb-5">Subscribe to receive updates!</h2>
                                <form className="form-inline d-flex">
                                    <input
                                        type="email"
                                        className="form-control flex-fill mr-0 mr-sm-2 mb-3 mb-sm-0"
                                        id="inputEmail"
                                        name="emailId"
                                        value={this.state.emailId}
                                        onChange={this.handleChange}
                                        placeholder="Enter email address..."
                                    />
                                    <button
                                        type="submit"
                                        className="btn btn-primary mx-auto"
                                        onClick={this.handleClick}
                                    >
                                        Subscribe
                                    </button>
                                </form>
                            </div>
                        </div>
                        <br />
                        {this.state.successMessage ?
                            <span className="text-danger text-center">{this.state.successMessage}</span> :
                            null}
                    </div>
                </section>


                <section className="contact-section bg-black">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-4 mb-3 mb-md-0">
                                <div className="card py-4 h-100">
                                    <div className="card-body text-center">
                                        <h4 className="text-uppercase m-0">Address</h4>
                                        <hr className="my-4" />
                                        <div className="small text-black-50">Infosys, Mysuru</div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4 mb-3 mb-md-0">
                                <div className="card py-4 h-100">
                                    <div className="card-body text-center">
                                        <h4 className="text-uppercase m-0">Email</h4>
                                        <hr className="my-4" />
                                        <div className="small text-black-50"><Link to="/home" onClick={this.load()}>wanderlust@gamil.com</Link></div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4 mb-3 mb-md-0">
                                <div className="card py-4 h-100">
                                    <div className="card-body text-center">
                                        <h4 className="text-uppercase m-0">Phone</h4>
                                        <hr className="my-4" />
                                        <div className="small text-black-50">+91 9999999999</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div >
        )
    }
}

export default Home;