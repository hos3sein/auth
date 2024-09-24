const { getdata, setdata } = require("./cache");
const User = require("./models/User");
const lastUsers = require("./models/lastUsers")


exports.setingData=async()=>{
    const users = await lastUsers.find()
    if(users.length == 0){
        const allUser = await User.find();
        let Truck = 0;
        let transport = 0;
        let commerce = 0;
        let linemaker = 0;
        let USER = 0;
        allUser.forEach(elem=>{
          if (elem.isActive == true){
              USER+=1
              if (elem.group.includes("truck")){
                  Truck+=1
              }
              if(elem.group.includes("commerce")){
                  commerce += 1
              }
              if(elem.group.includes("transport")){
                  transport += 1;
              }
              if(elem.group.includes("lineMaker")){
                  linemaker += 1;
              }
          }
        })
        await lastUsers.create({name : 'userCounter',
            Truck : Truck , 
            transport :transport,
            commerce : commerce,
            linemaker : linemaker,
            USER : USER
        })
        // setdata('lastData' , {Truck : Truck , transport : transport , commerce : commerce , linemaker : linemaker , USER : USER})
    }
}





  