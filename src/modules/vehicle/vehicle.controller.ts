import { Request, Response } from "express";
import { createVehicleService, getAllVehiclesService, getVehicleByIdService } from "./vehicle.service";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    } = req.body;

    
    if (
      !vehicle_name ||
      !type ||
      !registration_number ||
      !daily_rent_price ||
      !availability_status
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const vehicle = await createVehicleService({
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    });

    return res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: vehicle,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await getAllVehiclesService();

    if (vehicles.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No vehicles found",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: vehicles,
    });
  } catch (error) {
    console.error("Error fetching vehicles:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while retrieving vehicles",
    });
  }
};

const getVehicleById = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;

    // Validate vehicleId is a number
    const id = Number(vehicleId);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Vehicle ID must be a valid number",
      });
    }

    const vehicle = await getVehicleByIdService(id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: vehicle,
    });

  } catch (error) {
    console.error("Error fetching vehicle by ID:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while retrieving vehicle",
    });
  }
};

export { createVehicle, getAllVehicles, getVehicleById };