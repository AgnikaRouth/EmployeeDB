const express = require('express');
var router = express.Router();
var { Employee } = require('../models/employee');
var ObjectId = require('mongoose').Types.ObjectId;

// -> localhost:3000/employees

router.get('/', async (req, res) => {
	try {
		const docs = await Employee.find().exec(); //exec() ->convert the query object into a promise,
		res.send(docs);
	} catch (err) {
		console.log('Error in retrieving Employees: ' + err);
	}
});

router.get('/:id', async (req, res) => {
	try {
		const id = req.params.id;
		const employee = await Employee.findById(id).exec();

		if (employee) {
			res.send(employee);
		} else {
			res.status(404).send('Employee not found');
		}
	} catch (err) {
		console.log('Error in retrieving Employee: ' + err);
		res.status(500).send('Internal server error');
	}
});

router.post('/', async (req, res) => {
	try {
		// emp is Employee Model Class
		//by default there will be _id key too
		var emp = new Employee({
			name: req.body.name,
			position: req.body.position,
			office: req.body.office,
			salary: req.body.salary,
		});
		const doc = await emp.save();
		res.send(doc);
	} catch (err) {
		console.log('Error in Employee Save :' + err);
	}
});

router.put('/:id', async (req, res) => {
	try {
		if (!ObjectId.isValid(req.params.id))
			return res.status(400).send(`No record with given id: ${req.params.id}`);

		const emp = {
			name: req.body.name,
			position: req.body.position,
			office: req.body.office,
			salary: req.body.salary,
		};

		const updatedEmployee = await Employee.findByIdAndUpdate(
			req.params.id,
			{ $set: emp },
			{ new: true }
		).exec();

		if (updatedEmployee) {
			res.send(updatedEmployee);
		} else {
			res.status(404).send(`Employee not found with id: ${req.params.id}`);
		}
	} catch (err) {
		console.log('Error in Employee Update: ' + err);
		res.status(500).send('Internal server error');
	}
});

router.delete('/:id', async (req, res) => {
	try {
		const id = req.params.id;
		if (!ObjectId.isValid(id)) {
			return res.status(400).send(`No record with given id: ${id}`);
		} else {
			const employeeToDelete = await Employee.findByIdAndRemove(id).exec();
			if (employeeToDelete) {
				res.send(employeeToDelete);
			} else {
				res.status(404).send(`Employee not found with id: ${id}`);
			}
		}
	} catch (err) {
		console.log('Error in Employee Delete: ' + err);
		res.status(500).send('Internal server error');
	}
});
module.exports = router;
