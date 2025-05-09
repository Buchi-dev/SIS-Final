const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');

// Student CRUD operations
router.get('/', studentController.getAllStudents);
router.post('/profile', studentController.createStudentProfile);
router.get('/profile/:studentId', studentController.getStudentProfile);
router.get('/id/:id', studentController.getStudentById);
router.put('/profile/:studentId', studentController.updateStudentProfile);
router.delete('/profile/:studentId', studentController.deleteStudentProfile);

// Test endpoint for validation before creating student
router.post('/test-create', studentController.testCreateStudent);

module.exports = router;
