require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = require("../schemas/userModel");
const docSchema = require("../schemas/docModel");
const appointmentSchema = require("../schemas/appointmentModel");

// ------------------- REGISTER CONTROLLER -------------------
const registerController = async (req, res) => {
  try {
    const existsUser = await userSchema.findOne({ email: req.body.email });
    if (existsUser) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new userSchema({ ...req.body, password: hashedPassword });
    await newUser.save();

    return res
      .status(201)
      .json({ message: "Register success", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

// ------------------- LOGIN CONTROLLER -------------------
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userSchema.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid email or password", success: false });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET, // Make sure this exists in your .env
      { expiresIn: "1d" }
    );

    const userData = { ...user._doc };
    delete userData.password;

    return res.status(200).json({
      message: "Login successful",
      success: true,
      token,
      userData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

// ------------------- AUTH CONTROLLER -------------------
const authController = async (req, res) => {
  try {
    const user = await userSchema.findById(req.body.userId);
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }

    const userData = { ...user._doc };
    delete userData.password;

    return res.status(200).json({ success: true, data: userData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

// ------------------- DOCTOR REGISTRATION CONTROLLER -------------------
const docController = async (req, res) => {
  try {
    const { doctor, userId } = req.body;

    const newDoctor = new docSchema({
      ...doctor,
      userId: userId.toString(),
      status: "pending",
    });
    await newDoctor.save();

    const adminUser = await userSchema.findOne({ type: "admin" });

    if (!adminUser) {
      return res
        .status(404)
        .json({ success: false, message: "Admin user not found" });
    }

    const notification = adminUser.notification || [];
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.fullName} has applied for doctor registration`,
      data: {
        userId: newDoctor._id,
        fullName: newDoctor.fullName,
        onClickPath: "/admin/doctors",
      },
    });

    await userSchema.findByIdAndUpdate(adminUser._id, { notification });

    return res.status(201).json({
      success: true,
      message: "Doctor Registration request sent successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while applying",
      error: error.message,
    });
  }
};

// ------------------- NOTIFICATION CONTROLLERS -------------------
const getallnotificationController = async (req, res) => {
  try {
    const user = await userSchema.findById(req.body.userId);
    const seennotification = user.seennotification || [];
    const notification = user.notification || [];

    seennotification.push(...notification);
    user.notification = [];
    user.seennotification = seennotification;

    const updatedUser = await user.save();
    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Unable to fetch", success: false, error });
  }
};

const deleteallnotificationController = async (req, res) => {
  try {
    const user = await userSchema.findById(req.body.userId);
    user.notification = [];
    user.seennotification = [];

    const updatedUser = await user.save();
    delete updatedUser.password;

    return res.status(200).json({
      success: true,
      message: "Notifications deleted",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Unable to delete", success: false, error });
  }
};

// ------------------- GET ALL DOCTORS CONTROLLER -------------------
const getAllDoctorsControllers = async (req, res) => {
  try {
    const docUsers = await docSchema.find({ status: "approved" });
    return res.status(200).json({
      message: "Doctor Users data list",
      success: true,
      data: docUsers,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false, error });
  }
};

// ------------------- APPOINTMENT CONTROLLERS -------------------
const appointmentController = async (req, res) => {
  try {
    let { userInfo, doctorInfo } = req.body;
    userInfo = JSON.parse(userInfo);
    doctorInfo = JSON.parse(doctorInfo);

    let documentData = null;
    if (req.file) {
      documentData = {
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
      };
    }

    const newAppointment = new appointmentSchema({
      userId: req.body.userId,
      doctorId: req.body.doctorId,
      userInfo,
      doctorInfo,
      date: req.body.date,
      document: documentData,
      status: "pending",
    });

    await newAppointment.save();

    const user = await userSchema.findById(doctorInfo.userId);
    if (user) {
      user.notification.push({
        type: "New Appointment",
        message: `New Appointment request from ${userInfo.fullName}`,
      });
      await user.save();
    }

    return res.status(200).json({
      message: "Appointment booked successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false, error });
  }
};

const getAllUserAppointments = async (req, res) => {
  try {
    const allAppointments = await appointmentSchema.find({
      userId: req.body.userId,
    });

    const doctorIds = allAppointments.map((a) => a.doctorId);
    const doctors = await docSchema.find({ _id: { $in: doctorIds } });

    const appointmentsWithDoctor = allAppointments.map((appointment) => {
      const doctor = doctors.find(
        (doc) => doc._id.toString() === appointment.doctorId.toString()
      );
      return {
        ...appointment.toObject(),
        docName: doctor ? doctor.fullName : "",
      };
    });

    return res.status(200).json({
      message: "All appointments listed",
      success: true,
      data: appointmentsWithDoctor,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false, error });
  }
};

const getDocsController = async (req, res) => {
  try {
    const user = await userSchema.findById(req.body.userId);
    const allDocs = user.documents || [];

    if (!allDocs.length) {
      return res.status(200).json({
        message: "No documents",
        success: true,
        data: [],
      });
    }

    return res.status(200).json({
      message: "All documents listed",
      success: true,
      data: allDocs,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false, error });
  }
};

// ------------------- EXPORT ALL CONTROLLERS -------------------
module.exports = {
  registerController,
  loginController,
  authController,
  docController,
  getallnotificationController,
  deleteallnotificationController,
  getAllDoctorsControllers,
  appointmentController,
  getAllUserAppointments,
  getDocsController,
};
