import React, { Component } from 'react';
import axios from 'axios';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputSwitch } from 'primereact/inputswitch';
import { Redirect } from 'react-router-dom';
import {ScrollPanel} from 'primereact/scrollpanel';
import "bootstrap/dist/css/bootstrap.css";
import '../index.css';

//import Book from './book';

import {backendUrlUser,backendUrlPackage,backendUrlBooking} from '../BackendURL';



class Packages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookingForm: {
                noOfPersons: 1,
                date: "",
                flights: false
            },
            bookingFormErrorMessage: {
                noOfPersons: "",
                date: ""
            },
            bookingFormValid: {
                noOfPersons: false,
                date: false,
                buttonActive: false
                
            },
            bookingPage: false,
            show: false,
            showItinerary: false,
            buttonact:false,
            packages: [],
            errorMessage: "",
            successMessage: "",
            totalCharges: "",
            continent: "",
            dealId: "",
            index: "",
            deal: "",
            packagePage: false,
            checkOutDate: new Date(),
            visibleRight: false,
        }
    }

    getPackages = (continent) => {
        axios.get("http://localhost:4000/user/packages/"+continent)
            .then((response) => {
                console.log(response)
                this.setState({ packages: response.data, show: false })
                if (this.state.packages.length === 0) this.setState({ errorMessage: "some error occured" })
            }).catch(error => {
                this.setState({ errorMessage: error.message, packages: [] })
            })
    }

    getHotDeals = () => {
        axios.get(backendUrlUser+"/hotDeals")
            .then((response) => {
                this.setState({ packages: response.data, show: false, errorMessage: null })
            })
            .catch((error) => {
                this.setState({ errorMessage: error.message, packages: null })
            })
    }

    componentDidMount() {
        window.scrollTo(0, 0)
        this.getHotDeals(this.state.continent);
    }

    handleChange = (event) => {
        const target = event.target;
        const name = target.name;
        if(target.checked) {
            var value = target.checked;
        } else {
            value = target.value;
        }
        const { bookingForm } = this.state;
        this.setState({
            bookingForm: { ...bookingForm, [name]: value }
        });
    
        this.validateField(name, value);

    }

    validateField = (fieldname, value) => {
        let fieldValidationErrors = this.state.bookingFormErrorMessage;
        let formValid = this.state.bookingFormValid;
        switch (fieldname) {
            case "noOfPersons":
                if (value === "") {
                    fieldValidationErrors.noOfPersons = "This field can't be empty!";
                    formValid.noOfPersons = false;
                } else if (value < 1) {
                    fieldValidationErrors.noOfPersons = "No. of persons can't be less than 1!";
                    formValid.noOfPersons = false;
                } else if (value > 5) {
                    fieldValidationErrors.noOfPersons = "No. of persons can't be more than 5.";
                    formValid.noOfPersons = false;
                } else {
                    fieldValidationErrors.noOfPersons = "";
                    formValid.noOfPersons = true;
                }
                break;
            case "date":
                if (value === "") {
                    fieldValidationErrors.date = "This field can't be empty!";
                    formValid.date = false;
                } else {
                    let checkInDate = new Date(value);
                    let today = new Date();
                    if (today.getTime() > checkInDate.getTime()) {
                        fieldValidationErrors.date = "Check-in date cannot be a past date!";
                        formValid.date = false;
                    } else {
                        fieldValidationErrors.date = "";
                        formValid.date = true;
                    }
                }
                break;
            default:
                break;
        }
     
        formValid.buttonActive = formValid.noOfPersons && formValid.date;
        this.setState({
            loginformErrorMessage: fieldValidationErrors,
            loginformValid: formValid,
            successMessage: ""
        });
    }

    calculateCharges = () => {
        this.setState({ totalCharges: 0 });
        let oneDay = 24 * 60 * 60 * 1000;
        let checkInDate = new Date(this.state.bookingForm.date);
        let checkOutDateinMs = Math.round(Math.abs((checkInDate.getTime() + (this.state.deal.noOfNights) * oneDay)));
        let finalCheckOutDate=new Date(checkOutDateinMs);
        this.setState({ checkOutDate: finalCheckOutDate.toDateString() });
        if (this.state.bookingForm.flights) {
            let totalCost = (-(-this.state.bookingForm.noOfPersons)) * this.state.deal.chargesPerPerson + this.state.deal.flightCharges;
            this.setState({ totalCharges: totalCost.toFixed(2),buttonact:true });
        } else {
            let totalCost = (-(-this.state.bookingForm.noOfPersons)) * this.state.deal.chargesPerPerson;
            this.setState({ totalCharges: totalCost.toFixed(2),buttonact:true });
        }
    }

    getitinerary = (selectedPackage) => {
        this.setState({ index: 0, deal: selectedPackage, showItinerary: true })
    }

    openBooking = (selectedPackage) => {
        this.setState({ index: 2, deal: selectedPackage, showItinerary: true })
    }

    loadBookingPage = (dealId) => {
        console.log(dealId)
        console.log(":here");
        this.setState({ visibleRight: false });
        sessionStorage.setItem('noOfPersons', this.state.bookingForm.noOfPersons);
        sessionStorage.setItem('checkInDate', this.state.bookingForm.date);
        sessionStorage.setItem('flight', this.state.bookingForm.flights);
        sessionStorage.setItem('dealId', dealId);
        this.setState({ show:true, bookingPage: true, showItinerary: false, dealId: dealId })
    }

    displayPackages = () => {
        if (!this.state.errorMessage) {
            let packagesArray = [];
            for (let mypackage of this.state.packages) {
                // let name = mypackage.imageUrl.split("/")[2]
                let cost = mypackage.chargesPerPerson.toFixed(2)
                let element = (
                    <div className="card bg-light text-dark package-card" key={mypackage.destinationId}>
                        <div className="card-body row">
                            <div className="col-md-4">
                                <img className="package-image" src={mypackage.imageUrl} alt="destination comes here" />
                            </div>
                            <div className="col-md-5">
                                <div className="featured-text text-center text-lg-left" id="divider">
                                    <h4>{mypackage.name}</h4>
                                    <div className="badge badge-info">{mypackage.noOfNights}<em> Nights</em></div>
                                    {mypackage.discount ? <div className="discount text-danger">{mypackage.discount}% Instant Discount</div> : null}
                                    <p className="text-dark mb-0">{mypackage.details.about}</p>
                                </div>
                                <br />

                            </div>
                            <div className="col-md-3">
                                <h4>Prices Starting From:</h4>
                                <div className="text-center text-success"><h6>${cost}</h6></div><br /><br />
                                <div><button className="btn btn-primary btn-block " onClick={() => this.getitinerary(mypackage)}>View Details</button></div><br />
                                <div><button className="btn btn-primary btn-block " onClick={() => this.openBooking(mypackage)}>Book </button>  </div>
                            </div>
                        </div>
                    </div>
                )
                packagesArray.push(element);
            }
            return packagesArray;
        } else {
            let element = (
                <div className="offset-md-2">
                    <h2>Sorry we don't operate in this Destination.</h2><br />
                    <a href="#hotDeals" className="btn btn-success">Click Here to checkout our Hot Deals</a>
                </div>
            )
            return element;
        }

    }

    displayPackageInclusions = () => {
        const packageInclusions = this.state.deal.details.itinerary.packageInclusions;
        if(this.state.deal) {
            return packageInclusions.map((pack,index)=> (<li key={index} className="text-left">{pack}</li>) )
        }
        else {
            return null;
        }
    }

    displayPackageHighlights = () => {
        let packageHighLightsArray = [];
        let firstElement = (
            <div key={0} className="text-left">
                <h3>Day Wise itinerary</h3><br />
                <h5>Day 1</h5>
                {this.state.deal ? <div>{this.state.deal.details.itinerary.dayWiseDetails.firstDay}</div> : null}
            </div>
        );
        packageHighLightsArray.push(firstElement);
        if (this.state.deal) {
            this.state.deal.details.itinerary.dayWiseDetails.restDaysSightSeeing.map((packageHighlight,index)=>{
                    let element=(
                        <div key={index+1} className="text-left"><br />
                        <h5>Day {this.state.deal.details.itinerary.dayWiseDetails.restDaysSightSeeing.indexOf(packageHighlight) + 2}</h5>
                        <div>{packageHighlight}</div>
                    </div>
                    );
                    packageHighLightsArray.push(element)
                });
            let lastElement = (
                <div key={666} className="text-left"><br />
                    <h5>Day {this.state.deal.details.itinerary.dayWiseDetails.restDaysSightSeeing.length + 2}</h5>
                    {this.state.deal.details.itinerary.dayWiseDetails.lastDay}
                    <div className="text-danger"><br />
                        **This itinerary is just a suggestion, itinerary can be modified as per requirement. <a
                            href="/home">Contact us</a> for more details.
                        </div>
                </div>
            );
            packageHighLightsArray.push(lastElement);
            return packageHighLightsArray;
        } else {
            return null;
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.calculateCharges();
    }

    render() {
        if(this.state.bookingPage==true){
            if(sessionStorage.getItem('userName')){
                return <Redirect to={{
                    pathname:'/book/'+this.state.dealId,
                    state:{selectedDeal:this.state.deal,formDate:this.state.bookingForm,
                        checkOutDate:this.state.checkOutDate,totalcharges:this.state.totalCharges}
                }}></Redirect>
            }
            else{
                if(window.confirm('Please login to continue')){
                    return <Redirect to='/login'></Redirect>
                }
            }
        }
        return (
            <div>
                    {/* {this.state.show ?
                        <div id="details" className="details-section">

                            <div className="text-center">
                                <ProgressSpinner></ProgressSpinner>
                            </div>
                        </div> : null} */}

                    {this.state.packages.length>0 ?<div className="masth">{this.displayPackages()}</div>:
                         <div id="details" className="details-section">
                      <div className="text-center">
                                 <ProgressSpinner disabled={!this.state.show}></ProgressSpinner>
                             </div>
                         </div>}
                {
                    !this.state.packagePage ?
                        (
                            <div>
                                {/* {this.displayPackages()} */}
                                {
                                    this.state.errorMessage ?
                                        (
                                            <div className="offset-md-2">
                                                <h2>Sorry we don't operate in this Destination.</h2><br />
                                                <a href="#hotDeals" className="btn btn-success">Click Here to checkout our Hot Deals</a>
                                            </div>
                                        )
                                        : null
                                }
                            </div>
                        ) : null
                }
                <Sidebar visible={this.state.showItinerary} baseZIndex="1" position="right" className="p-sidebar-lg " onHide={(e) => this.setState({ showItinerary: false })}>
                    <h2>{this.state.deal.name}</h2>
                    <TabView activeIndex={Number(this.state.index)} onTabChange={(e) => this.setState({ index: e.index })}>
                        <TabPanel header="Overview">
                            <div className="row">
                                {this.state.deal ?
                                    <div className="col-md-6 text-center">
                                        <img className="package-image" src={ this.state.deal.imageUrl} alt="destination comes here" />
                                    </div> : null}

                                <div className="col-md-6">
                                    <h4>Package Includes:</h4>
                                    <ul>
                                        {this.state.showItinerary ? this.displayPackageInclusions():null}
                                    </ul>
                                </div>
                            </div>
                            <div className="text-justify itineraryAbout">
                                <h4>Tour Overview:</h4>
                                {this.state.deal ? this.state.deal.details.about : null}
                            </div>
                        </TabPanel>
                        <TabPanel header="Itinerary">
                        <ScrollPanel style={{width: '100%', height: '500px'}} className="custombar1">{this.displayPackageHighlights()}</ScrollPanel>
                        </TabPanel>
                        <TabPanel header="Book">
                            <h4 className="itenaryAbout  text-left">**Charges per person: $ {this.state.deal.chargesPerPerson}.00</h4>
                            <form onSubmit={this.handleSubmit}>
                                <div className="form-group text-left">
                                    <label htmlFor="noOfPersons">Number of Travelers:</label>
                                    <input
                                        type="number"
                                        id="noOfPersons"
                                        className="form-control"
                                        name="noOfPersons"
                                        value={this.state.bookingForm.noOfPersons}
                                        onChange={this.handleChange}
                                    />
                                    {this.state.bookingFormErrorMessage.noOfPersons ?
                                        <span className="text-danger">{this.state.bookingFormErrorMessage.noOfPersons}</span>
                                        : null}
                                </div>
                                <div className="form-group text-left">
                                    <label htmlFor="date">Trip start Date:</label>
                                    <input
                                        type="date"
                                        id="date"
                                        className="form-control"
                                        name="date"
                                        value={this.state.bookingForm.date}
                                        onChange={this.handleChange}
                                    />
                                    {this.state.bookingFormErrorMessage.date ?
                                        <span className="text-danger">{this.state.bookingFormErrorMessage.date}</span>
                                        : null}
                                </div>
                                <div className="form-group text-left">
                                    <label>Include Flights:</label>&nbsp;
                                    <InputSwitch name="flights" id="flights"
                                        checked={this.state.bookingForm.flights}
                                        onChange={this.handleChange} />
                                </div>
                                <div className="form-group text-left">
                                    <button id="buttonCalc" className="btn btn-primary" type="submit" disabled={!this.state.bookingFormValid.buttonActive}>Calculate Charges</button>&nbsp;
                                </div>
                            </form>
                            <div className="text-left">
                            {!this.state.totalCharges ?
                                (
                                    <React.Fragment><left><span>**Charges Exclude flight charges.</span></left><br/></React.Fragment>
                                )
                                :
                                (
                                    <h4 className="text-success">
                                        Your trip ends on {this.state.checkOutDate} and
                                        you will pay ${this.state.totalCharges}
                                    </h4>
                                )
                            }
                            </div><br />

                            <div className="text-center">
                                <button type="button" disabled={!this.state.buttonact} className="btn btn-primary" onClick={() => this.loadBookingPage(this.state.deal.destinationId)}>Book</button>
                                &nbsp; &nbsp; &nbsp;
                                <button type="button" className="btn btn-primary" onClick={(e) => this.setState({showItinerary:false})}>Cancel</button>
                            </div>
                        </TabPanel>
                    </TabView>
                </Sidebar>
                
            </div >
        )
    }
}
// <Redirect to="/book" />
export default Packages;