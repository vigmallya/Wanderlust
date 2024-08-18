request = require( 'request' );
const hotdeals_url = `http://localhost:4000/user/hotDeals`; 
const view_bookings_url = `http://localhost:4000/package`;
const delete_url = `http://localhost:4000/book`;
const usersDB = require( '../model/userslogin' );
const userService = require( '../service/userslogin' )

//hotdeals
describe( "hot deals",function (){
    describe( "GET /",function (){
        it( "Test case 1: Check for Status code",function ( done ){ //status code
            request.get( 'http://localhost:4000/user/hotDeals',function ( error,response,body ){
                expect( response.statusCode ).toBe( 200 );
                done();
                console.log( "Print response code 200 for hotdeal route path " )
            } );
        } );
        it( "Test case 2: Check for data",function ( done ){
            request.get( 'http://localhost:4000/user/hotDeals',function ( error,response,body ){
                expect( body ).toBeTruthy();
                done();
                console.log( 'Returns hotdeals package' );                
        } );
    } );
} );
} );

//login
describe( "login",function (){
    describe( "post /",function (){
        it( "Testcase 3.1: Check for login",function ( done ){  //login success 
            request.post( 'http://localhost:4000/user/login',function ( error,response,body ){
                userService.login( 9098765432,'Abc@1234' ).then( ( data )=>{
                    expect( data ).toBeDefined();
                    done();  
                    console.log( "Login successfull" );                                      
                } ).catch( error=>{
                    expect( error ).toBeDefined();
                    done();
                    console.log( "Login failed" );
                } )
            } )
        } )
        it( "Testcase 3.2: Check for login",function ( done ){  //login fail
            request.post( 'http://localhost:4000/user/login',function ( error,response,body ){
                userService.login( 9098765432,'Abc1234' ).then( ( data )=>{
                    expect( data ).toBeDefined();
                    done();  
                    console.log( "Login successfull" );                                      
                } ).catch( error=>{
                    expect( error ).toBeDefined();
                    done();
                    console.log( "Login failed" );
                } )
            } )
        } )
        
    } )
} );

//register

describe( 'register',function (){
    describe( 'post /',function (){
        it( "Testcase 4.1: Check for register",function ( done ){
            request.post( 'http://localhost:4000/user/register',function ( error,response,body ){
                const details=[{ name: "def", emailId: "def@gmail.com", contactNo: 6234567892, password: "Def@1234" }]
                userService.register( details ).then( ( data )=>{
                    expect( data ).toBeDefined();
                    done();
                    console.log( "Register successfull" );                    
                } ).catch( error=>{
                    expect( error ).toBeDefined();
                    done();
                    console.log( "Register failed" );
                } )
            } )
        } )
        it( "Testcase 4.2: Check for register",function ( done ){
            request.post( 'http://localhost:4000/user/register',function ( error,response,body ){
                const details=[{ name: "def", emailId: "def@gmail.com", contactNo: 6234567890, password: "Def@1234" }]
                userService.register( details ).then( ( data )=>{
                    expect( data ).toBeDefined();
                    done();
                    console.log( "Register successfull" );                    
                } ).catch( error=>{
                    expect( error ).toBeDefined();
                    done();
                    console.log( "Register failed" );
                } )
            } )
        } )
    } )
} )

//packages

describe( "packages",function (){ 
    describe( "GET /",function (){
        it( "Testcase 5: Check for package display",function ( done ){    //package success
            request.get( 'http://localhost:4000/user/packages/Australia',function ( error,response,body ){
                userService.destination( "Australia" ).then( ( data )=>{
                    expect( data ).toBeTruthy();
                    done();
                    console.log( "Searched result successful" );                    
                } ).catch( error=>{
                    expect( error ).toBeTruthy();
                    done();
                    console.log( "Searched result failed dut to incorrect destination" );
                } )
            } )
        } )
    } )
} )


//view booking

describe( "booking",function (){
    describe( "GET /",function (){
        it( 'Testcase 6: Check for booking a package',function ( done ){
            request.get( 'http://localhost:4000/book/U1004',function ( error,response,body ){
                userService.GetBookingbyuserId( 'U1004' ).then( ( data )=>{
                    expect( data ).toBeTruthy();
                    done();
                    console.log( "Viewed booked package successfully" ); 
                } ).catch( error=>{
                    expect( error ).toBeTruthy();
                    done();
                    console.log( "Viewing booked package failed " ); 
                } )
            } )
        } )
    } )
} )

//booking
describe( "booking",function (){ 
    describe( "POST /",function (){
        it( 'Testcase 7: Check for booking a package',function ( done ){      //booking failed
            details={userId: "U1001",destId: "D1001",destinationName: "A Week in Greece: Athens, Mykonos & Santorini",checkInDate: "2018-12-09"
            ,checkOutDate: "2018-12-16",noOfPersons: 2 ,totalCharges: 5998,timeStamp: new Date().getTime().toString()}
            request.post( 'http://localhost:4000/book/U1001/D1001/',function ( error,response,body ){
                userService.book( 'U1001','D1002',details ).then( ( data )=>{
                    expect( data ).toBeTruthy();
                    done();
                    console.log( "Booked successful" ); 
                } ).catch( error=>{
                    expect( error ).toBeTruthy();
                    done();
                    console.log( "Booking failed" ); 
                } )
            } )
        } )
    } )
} )

//cancel booking

describe( 'cancel booking',function (){
    describe( 'Delelte /',function (){
        it( 'Testcase 8: Check for cancel booking',function ( done ){
            request.delete( 'http://localhost:4000/cancelBooking/U1001/B1002',function ( error,response,body ){
                userService.deleteBooking( 'B1002','U1001' ).then( ( data )=>{
                    expect( data ).toBeTruthy();
                    done();
                    console.log( "successfully deleted" );
                } ).catch( error=>{
                    expect( error ).toBeTruthy();
                    done();
                    console.log( "Deleting data failed" )
                } )
            } )
        } )
    } )
} )

