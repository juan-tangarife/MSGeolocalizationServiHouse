const axios = require('axios');

async function getAddressFromLatLon(latitude, longitude) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
    console.log("Fetching address from Nominatim API:", url);
    const response = await axios.get(url, {
        headers: { 'User-Agent': 'ServiHouseApp/1.0' }
    });    const data = response.data;
    console.log("Response from Nominatim API:", data);
    return {
        direccion: `${data.address.road} ${data.address.suburb ? ', ' + data.address.suburb : ''}`,
        ciudad: data.address.county,
        departamento: data.address.state
    };
}

module.exports = {
    getAddressFromLatLon
};