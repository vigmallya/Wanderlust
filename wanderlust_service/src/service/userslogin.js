const userDB = require( '../model/userslogin' );
// const bookDb = require('../model/usersBooking');

const userService = {}

//login a user
userService.login = ( contactNo, userPassword ) => {
    return userDB.checkUser( contactNo ).then( ( user ) => {
        if( user == null ) {
            let err = new Error( "Enter registered contact number! If not registered, please register" );
            err.status = 404;
            throw err;
        }
        else{
            return userDB.getPassword( contactNo ).then( ( password ) => {
                if( password != userPassword ) {
                    let err = new Error( "Incorrect password" );
                    err.status = 406;
                    throw err;
                }
                else{
                    return user;
                }
            } )
        }
    } )
}


//user register
userService.register = ( userdetail )=>{
    return userDB.checkUser( userdetail.contactNo ).then( ( user ) => {
        if( user ) {
            let err = new Error( "This contact number is already registered.Use another contact number" );
            err.status = 404;
            throw err;
        }
        else{
            return userDB.registerUser( userdetail )
        }
    } )
}


//get packages in hotdeals collection

userService.hotdeals = () =>{
    return userDB.hotdeals().then( ( data )=>{
        if( data ){
            return data;
        }
        else{
            return null;
        }
    } )
}

//get packages in destination collection

userService.destination=( dest )=>{
    return userDB.destination( dest ).then( ( data )=>{
        if( data ){
            return data;
        }
        else{
            return null;
        }
    } )
}


userService.GetBookingbyuserId=( userId )=>{
    // console.log("ser")
    return userDB.getBookingById( userId ).then( ( data )=>{
        if( data ){
            return data;
        }
        else{
            return null;
        }
    } )
}


// userService.getBookingbyBookId("B1001");
// let obj={userId:"U1001",destId:"D1001",destinationName:"A Week in Greece: Athens, Mykonos & Santorini",checkInDate:"2018-12-09",checkOutDate:"2018-12-16",noOfPersons:2 ,totalCharges:5998,timeStamp:new Date().getTime().toString()}


// bookpackage

userService.book=( userId,destId,obj )=>{
    return userDB.checkbook( userId ).then( ( data )=>{    //it will get checkoutdate
        // console.log(data.checkOutDate)
        // console.log(obj.checkInDate)
        if( data==null ){
            console.log( "if" )
            return userDB.getdestination( destId ).then( ( data )=>{  //availability from destination
                // data.userId=userId;
                // data.checkInDate=obj.checkInDate;
                // data.noOfPersons=obj.noOfPersons;
                // data.totalCharges=obj.totalCharges;
                // console.log(data)
                // console.log(data.availability)
                if( data.availability>obj.noOfPersons ){   //check availability to noofpersons
                    if( destId.length==5 ){                // check destid ("HD1001") from hotdeals ("D1001") from destination
                        // console.log("pamodel")
                        return userDB.packagebook( userId,destId,obj ).then( ( data )=>{
                            // console.log(data);
                            return data;
                        } )
                    }
                    else{
                        // console.log("kmodel")
                        return userDB.hotdealsbook( userId,destId,obj ).then( ( data )=>{
                            // console.log(data);
                            return data;
                        } )
                    }
                   
                }
                else{
                    // console.log("pack")
                    let err=new Error( "Entered number of seats is not available" );
                    err.status=500;
                    throw err;
                    // return null;
                }
            } )
        } else{
        let odate = new Date( data.checkOutDate )
        let idate = new Date( obj.checkInDate )
        // console.log(idate,odate)
        if( odate<idate ){                 // check book date 
            // console.log("if")
            return userDB.getdestination( destId ).then( ( data )=>{
                // data.userId=userId;
                // data.checkInDate=obj.checkInDate;
                // data.noOfPersons=obj.noOfPersons;
                // data.totalCharges=obj.totalCharges;
                // console.log(data)
                // console.log(data.availability)
                if( data.availability>obj.noOfPersons ){
                    if( destId.length==5 ){
                        // console.log("pamodel")
                        return userDB.packagebook( userId,destId,obj ).then( ( data )=>{
                            // console.log(data);
                            return data;
                        } )
                    }
                    else{
                        // console.log("kmodel")
                        return userDB.hotdealsbook( userId,destId,obj ).then( ( data )=>{
                            // console.log(data);
                            return data;
                        } )
                    }
                   
                }
                else{
                    // console.log("pack")
                    let err=new Error( "Entered number of seats is not available" );
                    err.status=500;
                    throw err;
                    // return null;
                }
            } )
        }
        else{
            // console.log("else")
            let err=new Error( "A user can only book one package in a particular duration" );
            err.status=500;
            throw err;
        }
    }
    } )
    
    
}
// userService.book("U1001","HD1001",obj);


// cancle booking

userService.deleteBooking=( bookingId,destId )=>{
    // console.log(bookingId)
    // console.log(destId)
    if( destId.length==5 ){
        // console.log("pack")
        return userDB.availabilitycheckdest( bookingId ).then( ( data )=>{
            if( data ){
                return userDB.deleteBooking( bookingId )
            }
            else{
                return null;
            }
        } )
    }
    else{
        // console.log("deals")
       return userDB.availabilitycheckhotdeals( bookingId ).then( ( data )=>{
            if( data ){
                return userDB.deleteBooking( bookingId )
            }
            else{
                return null;
            }
        } )
    }
    
}
// userService.GetBookingbyBookId("B1001");
// userService.destination("Kyoto")

module.exports = userService
