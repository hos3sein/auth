const fetch = require("node-fetch");

exports.refresh = async (id, type) => {
  // console.log("id", id);
  // console.log("type", type);

  const url = `${process.env.SERVICE_REFRESH}/api/v1/refresh/callalone/${id}/${type}`;
  try {
    const rawResponse = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    });
    const response = await rawResponse.json();
    // console.log("response refresh accept", response);
  } catch (error) {
    console.log("error", error);
  }
};

// const fetch = require("node-fetch");

exports.refreshGT = async (id) => {
  const url = `${process.env.SERVICE_REFRESH}/api/v1/refresh/calltransport`;
  try {
    const rawResponse = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({ provider: id }),
    });
    const response = await rawResponse.json();
  } catch (error) {
    console.log("error", error);
  }
};

exports.SingleCommerceT = async (id) => {
  const url = `${process.env.SERVICE_REFRESH}/api/v1/refresh/single/singlecommercet/${id}`;
  try {
    const rawResponse = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({ provider: id }),
    });
    const response = await rawResponse.json();
  } catch (error) {
    console.log("error", error);
  }
};

// exports.refreshGC = async (create) => {
//   const url = `${process.env.SERVICE_REFRESH}/api/v1/refresh/callcommerce`;
//   try {
//     const rawResponse = await fetch(url, {
//       method: "POST",
//       headers: {
//         Accept: "*/*",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ 
//        create:create
//        }),
//     });
//     const response = await rawResponse.json();
//   } catch (error) {
//     console.log("error", error);
//   }
// };
exports.refreshGC = async () => {
  const url = `${process.env.SERVICE_REFRESH}/api/v1/refresh/callcommerce`;
  
  try {
    const rawResponse = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({ 
      //   all,
      //  }),
    });
    const response = await rawResponse.json();
  } catch (error) {
    console.log("error", error);
  }
};
exports.refreshBidCommerce = async () => {
  const url = `${process.env.SERVICE_REFRESH}/api/v1/refresh/callcommercebid`;
 
  try {
    const rawResponse = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({ 
      //   order ,
      //  }),
    });
    const response = await rawResponse.json();
  } catch (error) {
    console.log("error", error);
  }
};
exports.refresh = async (id, type) => {
  const url = `${process.env.SERVICE_REFRESH}/api/v1/refresh/callalone/${id}/${type}`;
  try {
    const rawResponse = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    });
    const response = await rawResponse.json();
    // console.log("response refresh accept", response);
  } catch (error) {
    console.log("error", error);
  }
};
exports.refreshOneOrder = async (order) => {
  const url = `${process.env.SERVICE_REFRESH}/api/v1/refresh/single/singleCommerce`;
   console.log(order);
  try {
    const rawResponse = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order
      }),
    });
    const response = await rawResponse.json();
    if (response.success) {
      return response;
    } else {
      return response;
    }
  } catch (err) {
    console.log("err", err);
  }
};
