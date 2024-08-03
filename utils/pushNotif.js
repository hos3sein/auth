const fetch = require("node-fetch");
exports.pushNotificationStatic = async (userId,number) => {
    const url = `${process.env.SERVICE_NOTIFICATION}/api/v1/notification/static/push`;
    
// const url = `http://localhost:8006/api/v1/notification/static/push`;
  
    try {
      const rawResponse = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
         userId,   
         serviceName:"Auth",
         number
        }),
      });
      const response = await rawResponse.json();
  
      if (response.success) {
        // console.log("success");
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  exports.notification = async (
    notificationType,
    recipient,
    sender,
    relation,
    relationModel,
    title,
    message
  ) => {
    const url = `${process.env.SERVICE_NOTIFICATION}/api/v1/notification/create`;
    //  const url = `http://localhost:8006/api/v1/notification/create`;
  
  
    try {
      const rawResponse = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificationType,
          recipient,
          sender,
          relation,
          relationModel,
          title,
          message,
        }),
      });
      const response = await rawResponse.json();
  
      if (response.success) {
        // console.log("success");
      }
    } catch (error) {
      console.log("error", error);
    }
  };