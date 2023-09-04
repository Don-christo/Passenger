const { getTrips, getDriver, getVehicle } = require('api');

/**
 * This function should return the trip data analysis
 *
 * Question 3
 * @returns {any} Trip data analysis
 */
async function analysis() {
  // Your code goes here
  let tripsData = await getTrips();
  //console.log(tripsData);
  let result = {};
  let noOfCashTrips = 0;
  let noOfNonCashTrips = 0;
  let billedTotal = 0;
  let cashBilledTotal = 0;
  let nonCashBilledTotal = 0;
  let driverId = [];
  let driverTrips = {};
  let driverEarnings = {};
  let mostTripsByDriver = {};
  let noOfDriversWithMoreThanVehicle = {};
  let highestEarningDriver = {};

  for(let i = 0; i < tripsData.length; i++){
      let items = tripsData[i]
      driverId.push(items.driverID)
      items.billedAmount = Number(items.billedAmount.toString().replace(/,/g, ""))
     if(items.isCash){
      noOfCashTrips = noOfCashTrips + 1;
      cashBilledTotal = cashBilledTotal  + items.billedAmount
      
     }
     
     else if(!items.isCash){
       noOfNonCashTrips = noOfNonCashTrips + 1
       nonCashBilledTotal = nonCashBilledTotal + items.billedAmount

     }
     billedTotal = (cashBilledTotal + nonCashBilledTotal).toFixed(2)

     if(!driverTrips.hasOwnProperty(items.driverID)){
        driverTrips[items.driverID] = 1
     }
     driverTrips[items.driverID]++
     

     if(!driverEarnings.hasOwnProperty(items.driverID)){
      driverEarnings[items.driverID] = items.billedAmount
    }
    driverEarnings[items.driverID] += items.billedAmount
   
  }
 
 

  driverId = [...new Set(driverId)]
  let keys = Object.values(driverTrips) 
  let highestTrip = Math.max(...keys)

    let mostTripId= "";
    for(let k in driverTrips){

      if(driverTrips[k] === highestTrip){
        mostTripId += k
        break;
      }

    }

    let driverWithMostTrips = await getDriver(mostTripId)
    mostTripsByDriver["name"] = driverWithMostTrips.name
    mostTripsByDriver["email"] = driverWithMostTrips.email
    mostTripsByDriver["phone"] = driverWithMostTrips.phone
    mostTripsByDriver["noOfTrips"] = highestTrip
    mostTripsByDriver["totalAmountEarned"] = driverEarnings[mostTripId]

    let drv = [];
    for(let i = 0; i < driverId.length; i++){
      drv.push(getDriver(driverId[i]))
    }

    drv = await Promise.allSettled(drv)

    let drivers = [];

    drv.map((a) =>{
      if(a.status === "fulfilled"){
        drivers.push(a.value)
      }
    })

    let vehicles = []
    for( let j = 0; j<drivers.length; j++){
      vehicles.push(getVehicle(drivers[j].vehicleID))
    }

    vehicles = await Promise.allSettled(vehicles)
     let vehi = [];
       vehicles.map((a) => {
     if(a.status === "fulfilled"){
        vehi.push(a.value)

       }
     })

     let vehiArray = []
     for( let i = 0; i<drivers.length; i++ ){
        let element = drivers[i]
      
       let noOfVehicleID = element["vehicleID"].length;
       
      
       vehiArray.push(noOfVehicleID);

        }
        
        let maxNum = Math.max(...vehiArray)
       
        let count = 0;
        for (let value of vehiArray) {
          if (value === maxNum) {
            count++;
          }
        }
        
      let parts = Object.values(driverEarnings);
      let highestEarned = Math.max(...parts);
     


      let highestPaidId = "";
    for(let k in driverEarnings){

      if(driverEarnings[k] === highestEarned){
        highestPaidId += k
        break;
      }

    }
        
      
      let driverWithHighestPay = await getDriver(highestPaidId);
      highestEarningDriver["name"] = driverWithHighestPay.name
      highestEarningDriver["email"] = driverWithHighestPay.email
      highestEarningDriver["phone"] = driverWithHighestPay.phone
      highestEarningDriver["noOfTrips"] = driverTrips[highestPaidId];
      highestEarningDriver["totalAmountEarned"] = driverEarnings[highestPaidId]

    


     result["noOfCashTrip"] = noOfCashTrips;
     result["noOfNonCashTrips"] = noOfNonCashTrips;
     result["billedTotal"] = Number(billedTotal);
     result["cashBilledTotal"] = cashBilledTotal;
     result["noOfDriversWithMoreThanVehicle"] = count;
     result["mostTripsByDriver"] = mostTripsByDriver;
     result["highestEarningDriver"] = highestEarningDriver;
  

  console.log(result);
 
}

analysis()
module.exports = analysis;