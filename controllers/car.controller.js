const mongoose = require('mongoose');
const Car = require('../models/Car');
const { AppError, sendResponse } = require('../helpers/utils');
const { createCarSchema, editCarSchema } = require('./validation');

const carController = {};

carController.createCar = async (req, res, next) => {
	try {
		const info = req.body;

		// if (!info) {
		// 	throw new AppError(400, "Bad Request", "Create Car Error");
		// } 

		const validationResult = createCarSchema.validate(info);
        if (validationResult.error) {
            throw new AppError(400, "Bad Request", validationResult.error.message);
        }

		const created= await Car.create(info);
		sendResponse(res,200,true,{Car:created},null,"Create Car Success");


	} catch (err) {
		next(err);
	}
};

carController.getCars = async (req, res, next) => {
	const page = parseInt(req.query.page) || 1; 
	const perPage = 10;
  
	try {
	  // Mongoose query with pagination
	  const listOfFound = await Car.find().skip((page - 1) * perPage).limit(perPage);
  
	  // Log the result for debugging
	  console.log("Car:", listOfFound);
  
	  // Query total count for pagination information
	  const totalCarsCount = await Car.countDocuments();
	  const totalPages = Math.ceil(totalCarsCount / perPage);
  
	  sendResponse(res, 200, true, { cars: listOfFound, page, total:  totalPages }, null, "Found list of cars success");
	} catch (err) {
	  next(err);
	}
  };


carController.editCar = async (req, res, next) => {
	const targetId = req.params.id;
    const updateInfo = req.body;

    try {
		if (!targetId) {
            throw new AppError(400, "Bad Request", "Edit Car Error - Missing targetId");
        }

        if (!updateInfo) {
            throw new AppError(400, "Bad Request", "Edit Car Error - Missing updateInfo in the request body");
        }

		const validationResult = editCarSchema.validate(updateInfo);
        if (validationResult.error) {
            throw new AppError(400, "Bad Request", validationResult.error.message);
        }

        const car = await Car.findById(targetId);

        if (!car) {
            throw new AppError(404, "Not Found", "Car not found");
        }

        const updatedCar = { ...car._doc, ...updateInfo };

        if (!Object.keys(updatedCar).some((key) => updatedCar[key] !== car[key])) {
            throw new AppError(400, "Bad Request", "Nothing has been updated");
        }

        const updated = await Car.findByIdAndUpdate(targetId, updatedCar, { new: true });

        sendResponse(res, 200, true, { car: updated }, null, "Update Car Successfully!");

    } catch (err) {
        next(err);
    }
  };
	   

carController.deleteCar = async (req, res, next) => {
    const targetId = req.params.id;
    const options = {new:true};
	try {
        if (!targetId) {
            throw new AppError(400, "Bad Request", "Delete Car Error - Missing targetId");
        }

        const car = await Car.findById(targetId);

        if (!car) {
            throw new AppError(404, "Not Found", "Car not found");
        }

        // Mongoose query to delete the car and return the deleted document
        const deletedCar = await Car.findByIdAndDelete(targetId, options);

        if (!deletedCar) {
            throw new AppError(500, "Internal Server Error", "Error deleting car");
        }

        sendResponse(res, 200, true, { Car: deletedCar }, null, "Delete car success");
    }catch(err){
        next(err)
    }
};

module.exports = carController;


