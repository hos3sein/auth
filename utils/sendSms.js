  const accountSid = 'AC44d884b4bc1dc051e7e6af0625174160' 
  const authToken = '1254f6ceb148d038fe8dd06d5c304ec2';
  const client = require('twilio')(accountSid, authToken); 

const sendSms = async (phone,code) => {
 console.log("rrestrrrsrsr");
 console.log("rrestrrrsrsr>>>>>>" , phone , code);
 try{
     const resault = await client.messages.create({ body:code , messagingServiceSid : 'MG4180185e3892397701d7de635039f782', to : phone})
      console.log("SMS Sent with Resault>>>>>>>>>>>>",result);
      return result
 }catch(error){
     console.log(error)
 }
 
}
 

module.exports = sendSms;
