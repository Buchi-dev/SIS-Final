const Student = require('../model/student_model');

// Helper functions for common operations
const handleServerError = (res, error, message = 'Server error') => {
  console.error(`Error: ${message}:`, error);
  res.status(500).json({ 
    message,
    error: error.message,
    stack: undefined
  });
};

// Validate required student fields based on our schema
const validateRequiredFields = (req) => {
  const { idNumber, firstName, lastName, course, year } = req.body;
  const missing = !idNumber || !firstName || !lastName || !course || !year;
  
  return {
    isValid: !missing,
    requiredFields: {
      idNumber: !!idNumber,
      firstName: !!firstName,
      lastName: !!lastName,
      course: !!course,
      year: !!year
    }
  };
};

// Create a new student profile
exports.createStudentProfile = async (req, res) => {
  try {
    const { 
      idNumber,
      firstName,
      middleName,
      lastName, 
      course, 
      year
    } = req.body;
    
    // Validate required fields
    const validation = validateRequiredFields(req);
    if (!validation.isValid) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        requiredFields: validation.requiredFields
      });
    }
    
    // Check if student already exists
    const existingStudent = await Student.findOne({ idNumber });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student profile already exists' });
    }
    
    // Create new student profile
    const student = new Student({
      idNumber,
      firstName,
      middleName: middleName || '',
      lastName,
      course,
      year
    });
    
    await student.save();
    
    res.status(201).json({ 
      message: 'Student profile created successfully',
      student
    });
  } catch (error) {
    handleServerError(res, error, 'Error creating student profile');
  }
};

// Get student profile
exports.getStudentProfile = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const student = await Student.findOne({ idNumber: studentId });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }
    
    res.status(200).json(student);
  } catch (error) {
    handleServerError(res, error, 'Error fetching student profile');
  }
};

// Update student profile
exports.updateStudentProfile = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { firstName, middleName, lastName, course, year } = req.body;
    const updateData = { firstName, middleName, lastName, course, year };
    
    // Filter out undefined values
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );
    
    const student = await Student.findOneAndUpdate(
      { idNumber: studentId },
      { $set: updateData },
      { new: true }
    );
    
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }
    
    res.status(200).json({ 
      message: 'Student profile updated successfully',
      student
    });
  } catch (error) {
    handleServerError(res, error, 'Error updating student profile');
  }
};

// Delete student profile
exports.deleteStudentProfile = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const result = await Student.findOneAndDelete({ idNumber: studentId });
    
    if (!result) {
      return res.status(404).json({ message: 'Student profile not found' });
    }
    
    res.status(200).json({ 
      message: 'Student profile deleted successfully'
    });
  } catch (error) {
    handleServerError(res, error, 'Error deleting student profile');
  }
};

// Get all student profiles
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    handleServerError(res, error, 'Error fetching student profiles');
  }
};

// Test creating a student profile - validates data without saving to DB
exports.testCreateStudent = async (req, res) => {
  try {
    const { 
      idNumber,
      firstName,
      middleName,
      lastName, 
      course, 
      year
    } = req.body;
    
    // Validate required fields
    const validation = validateRequiredFields(req);
    if (!validation.isValid) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        requiredFields: validation.requiredFields,
        valid: false
      });
    }
    
    // Check if student already exists
    const existingStudent = await Student.findOne({ idNumber });
    if (existingStudent) {
      return res.status(400).json({ 
        message: 'Student profile already exists',
        valid: false 
      });
    }
    
    // Validation passed
    res.status(200).json({ 
      message: 'Student data is valid',
      valid: true
    });
  } catch (error) {
    handleServerError(res, error, 'Error testing student profile creation');
  }
};
