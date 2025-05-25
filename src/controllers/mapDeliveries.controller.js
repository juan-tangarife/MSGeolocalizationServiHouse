const { PrismaClient } = require('@prisma/client'); //Importamos el cliente de prisma
const prisma = new PrismaClient(); //Creamos una instancia del cliente de prisma
require("dotenv").config(); //Nos permite leer las variables de entorno
const express = require('express'); //Importamos express
const { getDistance } = require('geolib');
const { MapOrdersService } = require("../services/maporders.service.js");
const { getAddressFromLatLon } = require("../middlewares/nominatin.js");

const getDeliveryLocation = async (req, res) => {
    if (!req.params || !req.params.id) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Delivery ID is required"
        });
    }
    const { id } = req.params;
    try {
        const delivery = await prisma.delivery.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                location: true
            }
        });

        if (!delivery) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "Delivery not found"
            });
        }

        return res.status(200).json({
            success: true,
            status: 200,
            message: "Delivery location retrieved successfully",
            location: delivery.location
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            status: 500,
            message: "Internal server error " + error.message
        });
    }
}

const updateDeliveryLocation = async (req, res) => {
    if (!req.params || !req.params.id || !req.body || !req.body.location) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Delivery ID and location are required"
        });
    }
    const { id } = req.params;
    const { location } = req.body;

    try {
        let { direccion, ciudad, departamento } = await getAddressFromLatLon(location.latitude, location.altitude);
        const delivery = await prisma.delivery.findUnique({
            where: {
                id: parseInt(id)
            },
        });
        const locationExists = await prisma.location.findUnique({
            where: {
                id: delivery.location_id
            }
        });
        if (!locationExists) {
            const locationStatic = await prisma.location.create({
                data: {
                    latitude: location.latitude,
                    altitude: location.altitude,
                    static: true,
                    address: direccion,
                    city: ciudad,
                    department: departamento
                }
            });
            await prisma.delivery.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    locationId: locationStatic.id
                }
            });
        }
        else {
            await prisma.location.update({
                where: {
                    id: delivery.location_id
                },
                data: {
                    latitude: location.latitude,
                    altitude: location.altitude,
                    static: true,
                    address: direccion,
                    city: ciudad,
                    department: departamento

                }
            });
        }
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Delivery location updated successfully",
            delivery: await prisma.delivery.findUnique({
                where: {
                    id: parseInt(id)
                },
                include: {
                    location: true
                }
            })
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            status: 500,
            message: "Internal server error " + error.message
        });
    }
}

module.exports = {
    getDeliveryLocation,
    updateDeliveryLocation
}
