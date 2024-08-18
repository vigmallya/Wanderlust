const userDetails = require( './beanClasses/users' );
const connection = require( "../utilities/connections" );

const usersDB = {}


usersDB.checkUser = ( contactNo ) => {
    return connection.getUserCollection().then( ( collection ) => {
        return collection.findOne( { "contactNo": contactNo } ).then( ( customerContact ) => {
            if( customerContact ) {
                return new userDetails( customerContact );
            }
            else return null;
        } )
    } )
}

usersDB.getPassword = ( contactNo ) => {
    return connection.getUserCollection().then( ( collection ) => {
        return collection.find( { "contactNo": contactNo }, { _id: 0, password: 1 } ).then( ( password ) => {
            if( password.length != 0 )
                return password[0].password;
            else
                return null;
        } )
    } )
}

usersDB.generateid = ()=>{
    return connection.getUserCollection().then( ( model )=>{
        return model.distinct( "userId" ).then( ( data )=>{
            // console.log(data)
            let maximum = data[data.length-1]
            let num = maximum.slice( 1,5 )
            // console.log(data[l])
            // console.log(b)
            let uid = Number( num )+1
            let usersid="U"+String( uid )
            return usersid
        } )
    } )
}

usersDB.generateBid = ()=>{
    return connection.getBookingCollection().then( ( model )=>{
        return model.distinct( "bookingId" ).then( ( data )=>{
            // console.log(data)
            let maximum = data[data.length-1]
            let num = maximum.slice( 1,5 )
            // console.log(data[l])
            // console.log(b)
            let bookId = Number( num )+1
            let bookid="B"+String( bookId )
            return bookid
        } )
    } )
}

usersDB.registerUser = ( userdata )=>{
    return connection.getUserCollection().then( ( model )=>{
        return usersDB.generateid().then( ( id )=>{
            userdata.userId=id;
            // console.log(id)
            // console.log(userdata)
            return model.insertMany( userdata ).then( ( data )=>{
                // console.log(data)
                if( data ){
                    return data;
                }
                else{
                    let err= new Error( "Registration failed! Please try again" );
                    err.status=404;
                    throw err;
                }
            } )
        } )
    } )
}


usersDB.hotdeals = () =>{
    return connection.getHotdealsCollection().then( ( model )=>{
        return model.find().then( ( data )=>{
            // console.log(data)
            if( data ){
                return data;
            }
            else{
                let err= new Error( "error" );
                err.status=404;
                throw err;
            }
        } )
    } )
}



usersDB.destination = ( dest ) =>{
    return connection.getDestinationCollection().then( ( model )=>{
        return model.find( {$or: [{continent: {'$regex': dest,$options: 'i'}},{'details.itinerary.tourHighlights': {'$regex': dest,$options: 'i'}}]} )
        .then( ( data )=>{
            // console.log(data)
            if( data ){
                // console.log(data);
                return data;
            }
            else{
                return null
            }
        } )
    } )
}
// usersDB.destination("D1002");
// let obj={userId:"U1001",destId:"D1001",destinationName:"A Week in Greece: Athens, Mykonos & Santorini",checkInDate:"2018-12-09",checkOutDate:"2018-12-16",noOfPersons:2 ,totalCharges:5998,timeStamp:new Date().getTime().toString()}
usersDB.packagebook=( userId,destId,bookObj )=>{
    return connection.getDestinationCollection().then( ( booking )=>{
        return booking.updateOne( {destinationId: destId},{$inc: {availability: -bookObj.noOfPersons}} )
        .then( ( data )=>{
            // usersDB.availabilitycheckdestination(destId)
            // console.log(data)
            // console.log(data);
            if( data.nModified>0 ){
                return connection.getBookingCollection().then( ( book )=>{
                    return usersDB.generateBid().then( ( bId )=>{
                        bookObj.bookingId=bId;
                        bookObj.userId=userId;
                        bookObj.destId=destId;
                        bookObj.timeStamp=new Date().getTime().toString();
                        // console.log(bookObj.bookingId)
                        return book.insertMany( bookObj ).then( ( obj )=>{
                            // console.log(obj)
                            // console.log("packmodel")
                            if( obj.length>0 ) {
                                return obj;
                            }
                            else{
                                // let err=new Error("Insertion unsuccessfull");
                                // err.status=406;
                                // throw err;
                                return null;
                            }
                        } )
                    } )
                } )
            }
            else{
                let err=new Error( "updation unsuccessfull" );
                err.status=406;
                throw err;
            }
        } )
    } )
}




usersDB.hotdealsbook=( userId,destId,bookObj )=>{
    return connection.getHotdealsCollection().then( ( booking )=>{
        return booking.updateOne( {destinationId: destId},{$inc: {availability: -bookObj.noOfPersons}} )
        .then( ( data )=>{
            // usersDB.availabilitycheckhot(destId)
            // console.log(data);
            // console.log("1")
            if( data.nModified>0 ){
                return connection.getBookingCollection().then( ( book )=>{
                   return usersDB.generateBid().then( ( bId )=>{
                        bookObj.bookingId=bId;
                        bookObj.userId=userId;
                        bookObj.destId=destId;
                        bookObj.timeStamp=new Date().getTime().toString();
                        // console.log(bookObj.bookingId)
                        return book.insertMany( bookObj ).then( ( obj )=>{
                            // console.log(obj)
                            // console.log("dealsmodel")
                            if( obj ) {
                                return obj}
                            else{
                                // let err=new Error("Insertion unsuccessfull");
                                // err.status=406;
                                // throw err;
                                return null;
                            }
                        } )
                    } )
                } )
            }
            else{
                let err=new Error( "updation unsuccessfull" );
                err.status=406;
                throw err;
            }
        } )
    } )
}


//checkbook for to check checkin and checkout date

usersDB.checkbook = ( userid )=>{
    return connection.getBookingCollection().then( ( model )=>{
        return model.find( {userId: userid},{checkOutDate: 1,_id: 0} ).then( ( data )=>{
            // console.log(data[data.length-1])
            // console.log(data)
            if( data.length>0 ){
                // console.log("if")
                return data[data.length-1];
            }
            else{
                // console.log("else")
                return null;
                
            }
        } )
    } )
}

// usersDB.checkbook("U1001")














// usersDB.book("D1001",obj);


//view bookings
usersDB.getBookingById=( userId )=>{
    return connection.getBookingCollection().then( ( data )=>{
        return data.find( {userId: userId},{_id: 0} )
        .then( ( bObj )=>{
            // console.log(bObj);
            // console.log("model")
            if( bObj ){
                return bObj;
            }
            else{
                return null;
            }
        } )
    } )
}


//no need---------------

usersDB.getdestination=( destId )=>{
    if( destId.length==6 ){
    return connection.getHotdealsCollection().then( ( data )=>{
        return data.findOne( {destinationId: destId},{_id: 0} )
        .then( ( dObj )=>{
            // console.log(dObj);
            // console.log("3")
            if( dObj ){
                return dObj;
            }
            else{
                return null;
            }} )
    } )}
    else{
        return connection.getDestinationCollection().then( ( data )=>{
            return data.findOne( {destinationId: destId},{_id: 0} )
            .then( ( dObj )=>{
                // console.log(dObj);
                // console.log("4")
                if( dObj ){
                    return dObj;
                }
                else{
                    return null;
                }} )
        } )
    }
}

// usersDB.getdestination("D1001")


// usersDB.get=()=>{
//     return connection.getBookingCollection().then((data)=>{
//         data.find({},{_id:0,bookingId:1}).then((temp)=>{
//             console.log(temp)
//         })
//     })
// }
// usersDB.get();

//no need --------------
usersDB.availabilitycheckhot= ( dest )=>{
    return connection.getHotdealsCollection().then( ( model )=>{
        return model.findOne( {destinationId: dest} ).then( ( data )=>{
            if( data ){
                // console.log(data.availability)
            }
        } )
    } )
}


// no need -----------

usersDB.availabilitycheckdestination= ( dest )=>{
    return connection.getDestinationCollection().then( ( model )=>{
        return model.findOne( {destinationId: dest} ).then( ( data )=>{
            if( data ){
                // console.log(data.availability)
            }
        } )
    } )
}




// update availability in hotdeals


usersDB.availabilitycheckhotdeals=( bookingId )=>{
    return connection.getBookingCollection().then( ( bookingData )=>{
        return bookingData.findOne( {bookingId: bookingId} ).then( ( data )=>{
            // console.log(data)
                // usersDB.availabilitycheckhotdeals(data.destId)
                return connection.getHotdealsCollection().then( ( userData )=>{
                    return userData.updateOne( {destinationId: data.destId},{$inc: {availability: data.noOfPersons}} ).then( ( update )=>{
                        // console.log(update)
                        // usersDB.availabilitycheckhot(data.destId)
                        if( update ){
                            return update;
                        }
                        else{
                            return null;
                        }
                    } )
                } )
        } )
    } )
}


//update availability in destination

usersDB.availabilitycheckdest=( bookingId )=>{
    return connection.getBookingCollection().then( ( bookingData )=>{
        return bookingData.findOne( {bookingId: bookingId} ).then( ( data )=>{
            // console.log(data)
                usersDB.availabilitycheckdestination( data.destId )
                return connection.getDestinationCollection().then( ( userData )=>{
                    return userData.updateOne( {destinationId: data.destId},{$inc: {availability: data.noOfPersons}} ).then( ( update )=>{
                        // console.log(update)
                        usersDB.availabilitycheckdestination( data.destId )
                        if( update ){
                            return update;
                        }
                        else{
                            return null;
                        }
                    } )
                } )
        } )
    } )
}








// cancle booking


usersDB.deleteBooking=( bookingId )=>{
    // console.log(bookingId)
    return connection.getBookingCollection().then( ( data )=>{
        return data.deleteOne( {bookingId: bookingId} )
        .then( ( obj )=>{
            // console.log(obj);
            if( obj ){
                return obj;
            }
            else{
                return null;
            }} )
    } )
        
}
// usersDB.deleteBooking("B1004");
// usersDB.deleteBooking("B1006");
// usersDB.destination("Paris")

// usersDB.hotdeals();
// usersDB.getBookingById("U1003");

module.exports = usersDB;

