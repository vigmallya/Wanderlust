const express = require( 'express' );
const router = express.Router();
const setupUser = require( "../model/setupUser" )
const userservice = require( '../service/userslogin' )
const userDetails = require( '../model/beanClasses/users' );
const bookdetails = require( '../model/beanClasses/bookobj' );

router.get( "/setup", ( req, res, next ) => {
    setupUser.userSetup().then( ( data ) => {
        res.send( data )
    } ).catch( err => next( err ) );
} )

//router to login
router.post( '/login', function ( req, res, next ) {
    let contactNo = req.body.contactNo;
    let password = req.body.password;
    userservice.login( parseInt( contactNo ), password ).then( function ( userDetails ) {
        res.json( userDetails );
    } ).catch( err => next( err ) );
} )

router.post( '/register',( req,res,next )=>{
    const setUpuser = new userDetails( req.body );
    userservice.register( setUpuser ).then( ( data )=>{
        res.json( {"message": "Successfully Registered!"} );
    } ).catch( ( err )=> next( err ) )
} )

router.get( '/hotDeals',( req,res,next )=>{
    userservice.hotdeals().then( ( data )=>{
        res.json( data )
    } ).catch( ( err )=>{next( err )} )
} )

router.get( '/packages/:continent',( req,res,next )=>{
    let destination = req.params.continent
    userservice.destination( destination ).then( ( data )=>{
        res.json( data )
    } ).catch( ( err )=>{next( err )} )
} )

router.get( '/book/:userId',( req,res,next )=>{
    let userId=req.params.userId;
    // console.log("1")
    userservice.GetBookingbyuserId( userId ).then( ( data )=>{
        // console.log("route")
        // console.log(data)
        res.json( data )
    } ).catch( ( err )=>{next( err )} )
} )

router.post( '/book/:userId/:destinationId',( req,res,next )=>{
    let userid=req.params.userId;
    let destinationId=req.params.destinationId;
    const setUpbook = new bookdetails( req.body );
    userservice.book( userid,destinationId,setUpbook ).then( ( data )=>{
        // console.log(data)
        res.json( data );
    } ).catch( ( err )=> next( err ) )
} )

router.delete( '/cancelBooking/:bookingId/:destid',( req,res,next )=>{
    let bookingId = req.params.bookingId;
    let destination=req.params.destid
    userservice.deleteBooking( bookingId,destination ).then( ( data )=>{
        // console.log(data)
        res.json( data )
    } ).catch( ( err )=> next( err ) )
} )

module.exports = router;

