const mongoose = require("mongoose");

//prorority ai 
const calculatePriority = require("../utils/priorityAI");


const issueSchema = new mongoose.Schema(
  {
    title: {
       type: String, 
       required: true 
      },
    description: {
       type: String, 
       required: true
       },
    category: {
      type: String,
      enum: ["Road", "Garbage", "Water", "Electricity"],
      required: true,
    },
    imageUrl: { type: String },

    //ai priroty sorting of issues   alos donnt forget to import priority ai at top of Issue controller   const calculatePriority = require("../utils/priorityAI"); then inside craete issue use it in IssueConolller only 
    priorityScore: { type: Number, default: 0 },


    location: {
      latitude: Number,
      longitude: Number,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved" , , "Escalated"],
      default: "Pending",
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);
