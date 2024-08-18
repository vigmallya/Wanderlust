import React, { Component } from 'react';
import {Fieldset} from 'primereact/fieldset';
import { InputSwitch } from 'primereact/inputswitch';
import axios from "axios";
import {backendUrlUser} from '../BackendURL';
import {Link,Redirect} from "react-router-dom";
import {Accordion,AccordionTab} from 'primereact/accordion';
import { ProgressSpinner } from 'primereact/progressspinner';



class book extends Component {
     constructor(props) {
        super(props);
        this.state = {
            bookingForm: {
                noOfPersons: this.props.location.state.formDate.noOfPersons,
                checkInDate: this.props.location.state.formDate.date,
                flights: false,
                checkOutDate: this.props.location.state.checkOutDate,
                totalCharges: this.props.location.state.totalcharges,
                deal:this.props.location.state.selectedDeal,
                destinationName:this.props.location.state.selectedDeal.name
            },
            bookingFormErrorMessage: {
                noOfPersons: "",
                checkInDate: ""
            },
            bookingFormValid: {
                noOfPersons: false,
                checkInDate: false,
                buttonActive: true
            },
            errorMessage: "",
            successMessage: "",
            index: "",
            show:"",
            deal: "",
            detailsbook:[],
            packagePage: false,
            visibleRight: false,
            destinationName:this.props.location.state.selectedDeal.name,
            overview:this.props.location.state.selectedDeal.details.about,
            packageInclusions:this.props.location.state.selectedDeal.details.itinerary.packageInclusions,
            // bookingForm:this.props.location.state.formDate
        }
    }




    book = () => {
        this.setState({show:true})
        const { bookingForm } = this.state;
        let userid =sessionStorage.getItem("userId");
        axios.post(backendUrlUser+'/book/'+userid+'/'+this.state.bookingForm.deal.destinationId, bookingForm)
        .then(response => {
            this.setState({detailsbook:response.data,errorMessage:"",show:false})
        }).catch(error => {
            this.setState({errorMessage:error.response.data.message,detailsbook:[],show:false})
        })
        // console.log(this.state.loginform.contactNo, this.state.loginform.password);
    }


    handleSubmit = (event) => {
        event.preventDefault();
        this.book();
    }

     displayPackageHighlights = () => {
        let packageHighLightsArray = [];
        let firstElement = (
            <div key={0} className="text-left">
                <h3>Day Wise itinerary</h3>
                <h5>Day 1</h5>
                {this.state.destinationName ? <div>{this.props.location.state.selectedDeal.details.itinerary.dayWiseDetails.firstDay}</div> : null}
            </div>
        );
        packageHighLightsArray.push(firstElement);
        if (this.state.destinationName) {
            this.props.location.state.selectedDeal.details.itinerary.dayWiseDetails.restDaysSightSeeing.map((packageHighlight,index)=>{
                    let element=(
                        <div key={index+1} className="text-left">
                        <h5>Day {this.props.location.state.selectedDeal.details.itinerary.dayWiseDetails.restDaysSightSeeing.indexOf(packageHighlight) + 2}</h5>
                        <div>{packageHighlight}</div>
                    </div>
                    );
                    packageHighLightsArray.push(element)
                });
            let lastElement = (
                <div key={666} className="text-left">
                    <h5>Day {this.props.location.state.selectedDeal.details.itinerary.dayWiseDetails.restDaysSightSeeing.length + 2}</h5>
                    {this.props.location.state.selectedDeal.details.itinerary.dayWiseDetails.lastDay}
                    <div className="text-danger">
                        **This itinerary is just a suggestion, itinerary can be modified as per requirement. <a
                            href="#contact-us">Contact us</a> for more details.
                        </div>
                </div>
            );
            packageHighLightsArray.push(lastElement);
            return packageHighLightsArray;
        } else {
            return null;
        }
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
        let booking = this.state.bookingForm;
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
                    booking.noOfPersons=value;
                    if (booking.flights) {
                        let totalCost = (-(-booking.noOfPersons)) * booking.deal.chargesPerPerson +booking.deal.flightCharges;
                        booking.totalCharges=totalCost.toFixed(2);
                    } else {
                        let totalCost = (-(-booking.noOfPersons)) * booking.deal.chargesPerPerson;
                        booking.totalCharges=totalCost.toFixed(2);
                    }
                }
                break;
            case "checkInDate":
                if (value === "") {
                    fieldValidationErrors.checkInDate = "This field can't be empty!";
                    formValid.checkInDate = false;
                } else {
                    let checkInDate = new Date(value);
                    let today = new Date();
                    if (today.getTime() > checkInDate.getTime()) {
                        fieldValidationErrors.checkInDate = "Check-in date cannot be a past date!";
                        formValid.checkInDate = false;
                    } else {
                        fieldValidationErrors.checkInDate = "";
                        formValid.checkInDate = true;
                        booking.checkInDate=value;
                        let oneDay = 24 * 60 * 60 * 1000;
                        let checkInDate = new Date(booking.checkInDate);
                        let checkOutDateinMs = Math.round(Math.abs((checkInDate.getTime() + (booking.deal.noOfNights) * oneDay)));
                        let finalCheckOutDate=new Date(checkOutDateinMs);
                        booking.checkOutDate=finalCheckOutDate;
                    }

                }
                break;
            case "flights":
                    booking.flights=value;
                    if (booking.flights) {
                        let totalCost = (-(-booking.noOfPersons)) * booking.deal.chargesPerPerson +booking.deal.flightCharges;
                        booking.totalCharges=totalCost.toFixed(2);
                    } else {
                        let totalCost = (-(-booking.noOfPersons)) * booking.deal.chargesPerPerson;
                        booking.totalCharges=totalCost.toFixed(2);
                    }
                    break;
            default:
                break;
        }
     
        formValid.buttonActive = formValid.noOfPersons;
        this.setState({
            bookingForm:booking,
            loginformErrorMessage: fieldValidationErrors,
            loginformValid: formValid,
            successMessage: ""
        });
    }

    calculateCharges = () => {
        this.setState({ totalCharges: 0 });
        let oneDay = 24 * 60 * 60 * 1000;
        let checkInDate = new Date(this.state.bookingForm.checkInDate);
        let checkOutDateinMs = Math.round(Math.abs((checkInDate.getTime() + (this.props.location.state.selectedDeal.noOfNights) * oneDay)));
        let finalCheckOutDate=new Date(checkOutDateinMs);
        this.setState({ checkOutDate: finalCheckOutDate});
        if (this.state.bookingForm.flights) {
            let totalCost = (-(-this.state.bookingForm.noOfPersons)) * this.state.deal.chargesPerPerson + this.state.deal.flightCharges;
            this.setState({ totalCharges: totalCost });
        } else {
            let totalCost = (-(-this.state.bookingForm.noOfPersons)) * this.state.deal.chargesPerPerson;
            this.setState({ totalCharges: totalCost });
        }
    }

    render() {
        let date = new Date(this.state.bookingForm.checkOutDate)
        let date1 = new Date(this.state.bookingForm.checkInDate)
        let op= date.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})
        let ip= date1.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})
        return (
            <React.Fragment>
                {this.state.show==true? (<div id="details" className="details-section masth">
                      <div className="text-center">
                            <ProgressSpinner disabled={!this.state.show}></ProgressSpinner>
                        </div>
                    </div>) :null}
            {this.state.detailsbook==0 ?
            (<div className="bookimg">
                <section id="bookingPage" className="bookingSection">
                <div className="container-fluid">
                    <div className="row">
                    <div className="col-md-6 offset-1" align="left">
                        <h2>{this.state.destinationName}</h2>
                        {/* <Fieldset legend="Overview" toggleable="true" collapsed="true">
                            {this.state.overview}
                        </Fieldset>
                        <Fieldset legend="Package Inclusions" toggleable="true" collapsed="true">
                            {this.state.packageInclusions.map((pack,index)=> (<li key={index}>{pack}</li>) )}
                        </Fieldset>
                        <Fieldset legend="Itinerary" toggleable="true" collapsed="true">
                            {this.displayPackageHighlights()}
                        </Fieldset> */}
                                                
                        <Accordion multiple={true} >
                            <AccordionTab header="Overview" >
                            {this.state.overview}
                            </AccordionTab>
                            <AccordionTab header="Package Inclusions">
                            {this.state.packageInclusions.map((pack,index)=> (<li key={index}>{pack}</li>) )}
                            </AccordionTab>
                            <AccordionTab header="Itinerary">
                            {this.displayPackageHighlights()}
                            </AccordionTab>
                        </Accordion>
                    </div>
                    <div className="col-md-4" align="left">
                        <div className="card">
                        <div className="card-body">
                        <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                                        <label htmlFor="noOfPersons">Number of Travelers</label>
                                        <input
                                            type="number"
                                            // value={this.state.bookingForm.noOfPersons}
                                            onChange={this.handleChange}
                                            id="noOfPersons"
                                            name="noOfPersons"
                                            className="form-control"
                                            defaultValue={this.state.bookingForm.noOfPersons}
                                        />
                                 {this.state.bookingFormErrorMessage.noOfPersons ?
                                        <span className="text-danger">{this.state.bookingFormErrorMessage.noOfPersons}</span>
                                        : null}
                        </div>
                        <div className="form-group text-left">
                                    <label htmlFor="checkInDate">Trip start Date</label>
                                    <input
                                        type="date"
                                        id="checkInDate"
                                        className="form-control"
                                        name="checkInDate"
                                        value={this.state.bookingForm.checkInDate}
                                        onChange={this.handleChange}
                                        // defaultValue={this.props.location.state.checkOutDate}
                                    />
                                    {this.state.bookingFormErrorMessage.checkInDate ?
                                        <span className="text-danger">{this.state.bookingFormErrorMessage.checkInDate}</span>
                                        : null}
                            </div>
                            <div className="form-group text-left">
                            <label>Include Flights:</label>&nbsp;
                            <InputSwitch name="flights" id="flights"
                                checked={this.state.bookingForm.flights}
                                onChange={this.handleChange} 
                                />
                        </div>
                        <div>
                        <h6>
                            Your trip ends on: {op}</h6>
                            <h5><b>you pay: ${this.state.bookingForm.totalCharges}</b>
                        </h5>
                        </div>
                        

                        <button type="submit" className="btn btn-primary" >CONFIRM BOOKING</button>&nbsp;
                        <Link to="/home" className="btn btn-primary">GOBACK</Link><br />
                        <span className="text-danger">{this.state.errorMessage}</span>
                        </form>
                        
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </section>
            </div>):(<div className="bookimg">
                <section id="loginPage" className="loginSection text-center">    {/* *ngIf="!registerPage"  */}
                    <div className="container-fluid">
                    
                        <div className="text-center">
                            <h2>Booking Confirmed!!</h2><br/>
                            <br />
                            <div className="text-success text-center">
                                <h3>Congratulations! Trip Planned to {this.state.destinationName} </h3><br />
                            </div>
                            <h5>Trip Starts on:{ip}</h5><br />
                            <h5>Trip Ends on:{op}</h5><br />
                            <Link to="/viewBookings"><h6>Click here to view your Bookings</h6></Link>
                        </div>     
                    </div>
            
                    </section>
                    {/* <h3>successfully booked!</h3> */}
                </div>)}
            </React.Fragment>
        );
    }
}

export default book;