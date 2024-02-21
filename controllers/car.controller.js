const mongoose = require('mongoose');
const Car = require('../models/Car');
const { AppError, sendResponse } = require('../helpers/utils');
const carController = {};

carController.createCar = async (req, res, next) => {
	try {
		const info = req.body;

		if (!info) {
			throw new AppError(400, "Bad Request", "Create Car Error");
		} 

		const created= await Car.create(info);
		sendResponse(res,200,true,{Car:created},null,"Create Car Success");


	} catch (err) {
		next(err);
	}
};

carController.getCars = async (req, res, next) => {
	const filter = {};

	try{
		//mongoose query
		const listOfFound= await Car.find().limit(10).exec();
		//this to query data from the reference and append to found result.
		console.log("Car:",listOfFound)
		sendResponse(res,200,true,{Car:listOfFound},null,"Found list of cars success");
	
	}catch(err){
		next(err);
	}
};

carController.editCar = async (req, res, next) => {
	try {
		const { id } = req.params;
    	const updateInfo = req.body;

		// Validate input
		if (!updateInfo) {
			throw new AppError(400, 'Bad Request', 'Update car Error');
		  }
		// mongoose query to find the car by ID and update it
		const updatedCar = await Car.findByIdAndUpdate(id, updateInfo, {
			new: true, // Return the modified document
		});

		if (!updatedCar) {
			// If the car with the given ID is not found
			throw new AppError(404, 'Not Found', 'Car not found');
		}

		// Send the response with the updated car data
		sendResponse(res, 200, true, { Car: updatedCar }, null, 'Update Car Successfully');
	} catch (err) {
	next(err);
	}
};

carController.deleteCar = async (req, res, next) => {
	// empty target mean delete nothing
    const targetId = null;
    //options allow you to modify query. e.g new true return lastest update of data
    const options = {new:true};
    try{
        //mongoose query
        const updated= await Car.findByIdAndDelete(targetId,options)

        sendResponse(res,200,true,{Car:updated},null,"Delete foo success")
    }catch(err){
        next(err)
    }
};

module.exports = carController;
