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
	const page = parseInt(req.query.page) || 1; // Get the page number from query parameters
	const perPage = 10; // Number of items per page

  
	try {
	  // Mongoose query with pagination
	  const listOfFound = await Car.find().skip((page - 1) * perPage).limit(perPage);
  
	  // Log the result for debugging
	  console.log("Car:", listOfFound);
  
	  // Query total count for pagination information
	  const totalCarsCount = await Car.countDocuments();
  
	  sendResponse(res, 200, true, { cars: listOfFound, page, total:  Math.ceil(totalCarsCount / perPage) }, null, "Found list of cars success");
	} catch (err) {
	  next(err);
	}
  };

carController.editCar = async (req, res, next) => {
	const targetId = null;
	const updateInfo = "";
  
	//options allow you to modify query. e.g new true return lastest update of data
	const options = { new: true };
	try {
	  //mongoose query
	  const updated = await car.findByIdAndUpdate(targetId, updateInfo, options);
  
	  sendResponse(
		res,
		200,
		true,
		{ car: updated },
		null,
		"Update Car Successfully!"
	  );
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
