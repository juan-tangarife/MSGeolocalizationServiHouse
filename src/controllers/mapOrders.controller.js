const { PrismaClient } = require('@prisma/client'); //Importamos el cliente de prisma
const prisma = new PrismaClient(); //Creamos una instancia del cliente de prisma
require("dotenv").config(); //Nos permite leer las variables de entorno
const express = require('express'); //Importamos express
const { getDistance } = require('geolib');
const { MapOrdersService } = require("../services/maporders.service.js");

const asignOrderToDelivery = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Request body is required"
        });
    }   

    if (!req.body.latitude || !req.body.altitude || !req.body.order_number) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Latitude and altitude are required"
        });
    }
    const { latitude, altitude, order_number } = req.body;
    try {
        const deliveries = await prisma.delivery.findMany({
            include: {
                location: true,
            }
        });

        
        if (!deliveries || deliveries.length === 0) {
            return res.status(404).json(
                {
                    success: false,
                    status: 404,
                    message: "No deliveries available"
                }
            );
        }
        const moreOrders = Math.max(...deliveries.map(delivery => delivery.pending_orders));
        const moreDistance = Math.max(...deliveries.map(delivery => getDistance(
            { latitude: delivery.location.latitude, longitude: delivery.location.altitude },
            { latitude, longitude: altitude }
        )));

        const candidateDeliveries = deliveries.map(delivery => {
            const distance = getDistance(
                { latitude: delivery.location.latitude, longitude: delivery.location.altitude },
                { latitude, longitude: altitude }
            )

            const normalizedDistance = distance / moreDistance;
            const normalizedOrders = moreOrders === 0 ? 0 : delivery.pending_orders / moreOrders;
            const score = (normalizedDistance * 0.7) + (normalizedOrders * 0.3);
            return {
                ...delivery,
                score
            };
        })

        candidateDeliveries.sort((a, b) => a.score - b.score);

        const delivery = candidateDeliveries[0];
        const updateDelivery = await prisma.delivery.update({
            where: {
                id: delivery.id
            },
            data: {
                pending_orders: delivery.pending_orders + 1
            }
        });
        MapOrdersService.sendAssignOrderEmail(
            delivery.email,
            order_number,
            delivery.full_name
        );
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Delivery assigned successfully",
            delivery: {
                id: delivery.id,
                name: delivery.full_name,
                email: delivery.email,
                location: delivery.location
            }
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
    asignOrderToDelivery
}
