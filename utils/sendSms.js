  const accountSid = 'AC44d884b4bc1dc051e7e6af0625174160' 
//   const authToken = '1254f6ceb148d038fe8dd06d5c304ec2';
  const authToken = 'd3085041a1e5a9a0af67685f611c5101';
  const client = require('twilio')(accountSid, authToken); 

const sendSms = async (phone,code) => {
 console.log("rrestrrrsrsr");
 console.log("rrestrrrsrsr>>>>>>" , phone , code);
 try{
     const resault = await client.messages.create({ body:code , messagingServiceSid : 'MG4180185e3892397701d7de635039f782' , to : phone })
      console.log("SMS Sent with Resault>>>>>>>>>>>>" , resault);
      return resault
 }catch(error){
     console.log('errore in proccess',error)
 }
 
}
 
// OR00b50d7a24b7ccbb0b2852b100fc0712


// d3085041a1e5a9a0af67685f611c5101

module.exports = sendSms;
