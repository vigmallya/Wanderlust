const usersDB = require( '../model/userslogin' );
const userService = require( '../service/userslogin' )
request = require( 'request' );

//US01

describe( 'Check contact number: ',function (){
    it( 'Testcase 1.1',async function (){
        const data= await usersDB.checkUser( 9098765432 );
        const obj={ userId: "U1001", name: "abc", emailId: "abc@gmail.com", 
        contactNo: 9098765432, password: "Abc@1234", bookings: ["B1001", "B1002"] };
        expect( data ).toEqual( jasmine.objectContaining( obj ) );
        console.log( "Returns Object for registered contact number and password" )
    } )
} )

describe( "Checking user password: ",function (){
    it( 'Testcase 1.2',async function (){
        const data=await usersDB.getPassword( 9098765432 );
        expect( data ).toEqual( "Abc@1234" );
        console.log( "Check for correct user password" )
    } )
} )

describe( 'Checking user login failure: ',function (){
    it( 'Testcase 1.3',async function (){
        try{ await userService.login( 9097765432, "Abc@1234" );}
        catch( error ){errorMessage=error.message}
        expect( errorMessage ).toEqual( "Enter registered contact number! If not registered, please register" )
        console.log( "Enter registered contact number! If not registered, please register" )
    } )
} )

describe( 'Checking user password failure: ',function (){
    it( 'Testcase 1.4',async function (){
        try{await userService.login( 9098765432, "Abc@123" );}
        catch( error ){errorMessage=error.message}
        expect( errorMessage ).toEqual( "Incorrect password" );
        console.log( "Incorrect password" );        
    } )
} )


//US02

describe( 'Checking Register',function (){
    it( 'Testcase 2.1',async function (){
        const details=[{ name: "def", emailId: "def@gmail.com", contactNo: 6234567891, password: "Def@1234" }]
        const data=await userService.register( details );
        expect( data ).toBeTruthy();
        console.log( 'Registered Successfull' );
    } )
} )


//US03

describe( 'Checking HotDeals Service',function (){
    it( 'Testcase 3.1',async function (){
        const data=await userService.hotdeals();
        expect( data ).toBeTruthy();
        console.log( 'Returns hotdeals package' );  
    } )
} )

describe( 'Check for searching destination',function (){
    it( 'Testcase 3.2',async function (){
        const data=await userService.destination( "Australia" );
        expect( data ).toBeTruthy();
        console.log( 'Returns corresponding package' );  
    } )
} )

describe( 'Check for searching failure destination',function (){
    it( 'Testcase 3.3',async function (){
        const data=await userService.destination( "russia" );
        expect( data ).toEqual( [] );
        console.log( 'Fail to returns corresponding package - due to wrong destination place' );  
    } )
} )


//US05

describe( 'Check for booking desire package--packages',function (){
    it( 'Testcase 5.1',async function (){
        let obj={userId: "U1001",destId: "D1001",destinationName: "A Week in Greece: Athens, Mykonos & Santorini",checkInDate: "2018-12-09"
        ,checkOutDate: "2018-12-16",noOfPersons: 2 ,totalCharges: 5998,timeStamp: new Date().getTime().toString()}
        let data=await usersDB.packagebook( "U1001","D1001",obj );
        expect( data ).toBeTruthy();
        console.log( 'Successfully booked corresponding package' );  
    } )
} )

describe( 'Check for booking desire package--hotdeals',function (){
    it( 'Testcase 5.2',async function (){
        let obj={userId: "U1001",destId: "HD1001",destinationName: "A Week in Greece: Athens, Mykonos & Santorini",checkInDate: "2018-12-09"
        ,checkOutDate: "2018-12-16",noOfPersons: 11.0 ,totalCharges: 5998,timeStamp: new Date().getTime().toString(),"availability": 15.0}
        let data=await usersDB.hotdealsbook( "U1001","HD1001",obj );
        expect( data ).toBeTruthy();
        console.log( 'Successfully booked corresponding hotdeal package' );  
    } )
} )

describe( 'Check for booking desire package--failure',function (){
    it( 'Testcase 5.3',async function (){
        let obj={userId: "U1001",destId: "D1001",destinationName: "A Week in Greece: Athens, Mykonos & Santorini",checkInDate: "2018-12-09"
        ,checkOutDate: "2018-12-16",noOfPersons: 11.0 ,totalCharges: 5998,timeStamp: new Date().getTime().toString(),"availability": 15.0}
        try{await userService.book( "U1001","HD1001",obj )}
        catch( error ){errorMessage=error.message}
        expect( errorMessage ).toEqual( "A user can only book one package in a particular duration" );
        console.log( "Failed to book due to package booking by user at a particular time." )
    } )
} )


//US06

describe( 'Check for Planned trip--success Testcase',function (){
    it( 'Testcase 6.1',async function (){
        let data=await userService.GetBookingbyuserId( "U1001" );
        expect( data ).toBeTruthy();
        console.log( 'Succesfully returns planned trips' );        
    } )
} )

describe( 'Check for Planned trip--failure testcase',function (){
    it( 'Testcase 6.2',async function (){
        let data=await userService.GetBookingbyuserId( "U1003" );
        expect( data ).toBeTruthy();
        console.log( 'No planned trips available' );        
    } );
} )


//US07

describe( 'Check for delete booking--Destination package',function (){
    it( 'Testcase 7.1',async function (){
        let data=await userService.deleteBooking( "B1005","D1001" );
        expect( data ).toBeTruthy();
        console.log( "Deleted successful--destination package" )
    } )
} )

describe( 'Check for delete booking--Hotdeal package',function (){
    it( 'Testcase 7.2',async function (){
        let data=await userService.deleteBooking( "B1006","HD1001" );
        expect( data ).toBeTruthy();
        console.log( "Deleted successful--hotdeals package" )
    } )
} )

//routing

// describe('Checking register failure: ',function(){
//     it('Testcase 2.2',async function(){
//         const detail=[
//             { name: "def", emailId: "def@gmail.com", contactNo: 6234567890, password: "Def@1234" }
//             ]
//         try{await userService.register(detail);}
//         catch(error){errorMessage=error.message}
//         expect(errorMessage).toEqual("This contact number is already registered.Use another contact number")
//     })
// })