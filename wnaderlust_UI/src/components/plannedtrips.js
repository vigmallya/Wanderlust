import React, { Component } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';
import {backendUrlUser } from '../BackendURL';
import axios from 'axios';
import '../index.css';
import "bootstrap/dist/css/bootstrap.css";
import {Link } from "react-router-dom";
import {Growl} from 'primereact/growl';

class Plannedtrips extends Component {
    state = { 
        booking:[],
        deleteId:'',
        errormessage:"",
        visible:false,
        dialog_visible:false,
        pop:false,
        successMessage:"",
        errorMessage:"" }
    
    viewbooking = () => {
    let uId = sessionStorage.getItem("userId")
    axios.get(backendUrlUser+'/book/'+uId)
    .then((response)=>{console.log("inside then");this.setState({booking:response.data,errorMessage:"",visible:true})})
    .catch(error => {
        // this.setState({errorMessage:error.response,booking:[],visible:true})
        console.log("inside catch")
    })
   }

   componentDidMount() {
       this.viewbooking();
   }

    onClick = (event) => {
        this.setState({ dialog_visible: true })
      }
    
    onHide = (event) => {
        this.setState({ dialog_visible: false });
    }

    cancel = () => {
       
        let bookId = this.state.deleteId.bookingId;
        let destid = this.state.deleteId.destId;
        {this.growl.show({life: 5000, severity: 'info', summary: 'Successfully deleted the booking with id '+bookId, detail: ''})}
        console.log(this.state.dialog_visible);
        this.setState({ dialog_visible: false });
        // sessionStorage.clear();
        // this.setState({ logged_out: true });
        // window.location.reload();
        axios.delete(backendUrlUser+'/cancelBooking/'+bookId+'/'+destid)
        .then((response)=>{window.location.reload();console.log("cancle then");this.setState({successMessage:response.data.message,errorMessage:"",pop:true})})
        .catch((err)=>{this.setState({successMessage:"",errorMessage:err.response.data.message,pop:false})})
        // window.location.reload();
    }

    cancellation = (details) => {
        this.setState({ dialog_visible: true, deleteId:details });

    }

    displaybooking = () => {
        let {booking} = this.state;
        return(
            booking.map(details => {
                return <React.Fragment>
                    <div  className="col-md-8 offset-2" key={details.bookingId}>
                        <div className="card">
                            <div className="card-header"><h3>Booking ID: {details.bookingId}</h3></div>
                            <div className="card-body">
                                <div className=""><h4>{details.destinationName}</h4></div><br />
                                <div className="row">
                                    <div className="col-md-8 text-left">
                                        <div className="btext tripalign">Trip starts on: {new Date(details.checkInDate).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</div>
                                        <div className="btext tripalign">Trip ends on: {new Date(details.checkOutDate).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</div>
                                        <div className="btext tripalign">Travellers: {details.noOfPersons}</div>
                                    </div>
                                    <div className="col-md-4 text-left">
                                        <div >Fare Details</div>
                                        <div >${details.totalCharges}.00</div>
                                        <div ><a href="#" onClick={()=>{this.cancellation(details)}}>Claim Refund</a></div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer"></div>
                        </div>
                    </div>
                </React.Fragment>
            })
        )
    }

    popup =()=>{
        {this.growl.show({life: 5000, severity: 'info', summary: 'Error Message', detail: 'Validation failed'})}
    }
        

    

    render() {
        let sdate = new Date(this.state.deleteId.checkInDate).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
        let edate = new Date(this.state.deleteId.checkOutDate).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
        const footer = (
            <div>
                <button className="btn btn-primary btn-large" onClick={this.onHide}>BACK</button>
                <button className="btn btn-primary btn-large" onClick={this.cancel}>CONFIRM CANCELLATION</button>
            </div>
        )
        
        return (
            <React.Fragment>
            <Growl ref={(el) => this.growl = el } position="topcenter" id="popup" />
            
            <section id="loginPage" className="trip bookimg">
                <div className="container-fluid">
                    <div className="row">
                        {!this.state.visible?(<ProgressSpinner/>):
                    (this.state.booking.length>0?(this.displaybooking()):
                    <div className="offset-3 text-center">
                        <h2>Sorry You have not planned any trips with us yet!</h2><br />
                        <Link to="/home" className="btn btn-success">CLICK HERE TO START BOOKING</Link>
                    </div>)}
                    </div>
                </div>
            </section>
            <div className="content-section implementation">
                <Dialog 
                    header="Confirmation"
                    visible={this.state.dialog_visible}
                    style={{ width: '50vw' }}
                    footer={footer}
                    onHide={this.onHide}
                    maximizable >
                        <div className="text-danger">Are you sure want to cancel your trip to {this.state.deleteId.destinationName} ?</div>
                        <div>Trip starts on: {sdate}</div>
                        <div>Trip ends on: {edate}</div>
                        <div>Refund Amount: ${this.state.deleteId.totalCharges}</div>
                </Dialog>
            </div>
            </React.Fragment>
        );
    }
}

export default Plannedtrips;



