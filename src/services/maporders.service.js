const generateApiToken = require("../middlewares/tokenGenerate");

class MapOrdersService {
    sendAssignOrderEmail = async (email, order_number, name) => {
        const msNotificationURL = process.env.GATEWAY_URL + "/api/notification/email/OrderAssigned";
        const token = generateApiToken();
        const data = {
            email: email,
            order_number: order_number,
            name: name
        };
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        };
        const response = await fetch(msNotificationURL, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        });
        console.log("Email sent", response.status);
    }

}


module.exports = {
    MapOrdersService: new MapOrdersService(),
};