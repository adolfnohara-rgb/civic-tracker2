project Name: Civic Issue Reporting & Tracking System

problem statement: People in many areas face daily civic problems like damaged roads, garbage overflow, water leaks, and electricity issues. Reporting these problems is often difficult because there is no single, easy platform. Complaints are usually made verbally or through different channels, and there is no proper way to track their status.

The Civic Issue Reporting & Tracking System provides a simple web platform where citizens can report issues using photos and live
elocation. Authorities can manage and resolve complaints efficiently, while citizens can track their complaints in real time, ensuring transparency and faster action.



Goal:The primary goal of the Civic Issue Reporting & Tracking System is to create a transparent, reliable, and easy-to-use digital platform that enables citizens to report civic issues and track their resolution in real time, while allowing authorities to manage and resolve these issues efficiently.

Target users:

    1. Citizens:Citizens are the main users of the platform who report civic issues in their local areas.

    2.Admin / Authorities

platform: Web Application


Tech Stack: 
    frontend:HTML,CSS,JavaScript
    Backend:Node.js,Express.js
    Database:Mongodb
    Authentication & Security: JSW(JSON Web Tokens),bcrypt for password hash
    Media(Image):Multer,Cloudinary
    location Services:Geolocation API (we will use this for capture the live location of the reported civic issue.)

    Version Control: Git & GitHub

    Deployment & Hosting : we will discuss


Core Fetaures 

    1.Authnetication System
        Citizen signup
        Citizen login
        Admin login
        JWT- based authentication
        Paasword hashing using bcrypt
        Role-based authorization (Citien vs Admin)

    2.Civic Lessu Reporitng
        Reprt civic issues like:
            -road damage
            -Garbage overflow
            -Water leakage
            -Electricity issues
        -Upload issue image as proof
        -Auto-capture live location(latifude & -longitude)

    3. Issue Tracking System
        Issue status lifecycle:
            pending
            In Progress
            Resolved
        Citizens can track ther own reported issues
        public visibility of issue resolution progress
    
    4. Admin Management
        -View all reported issues
        -View all reported issues
            Category
            Status
        Update issue status








Data base schema Design(created by jaypal for stor data in database (MongoDB))

1. User Schema Design / user collection
    {
        _id: ObjectId,
        name: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["citizen", "admin"], required: true },
        profilePicture: String,
        emailVerified: { type: Boolean, default: false },
        createdAt: Date,
        updatedAt: Date
    }


2. Issues Collection

    {
        _id: ObjectId,
        title: { type: String, required: true },
        description: { type: String, required: true },
        category: {
        type: String,
        enum: ["Road", "Garbage", "Water", "Electricity"],
        required: true
        },
        imageUrl: { type: String, required: true },
        location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
        },
        status: {
        type: String,
        enum: ["Pending", "In Progress", "Resolved"],
        default: "Pending"
        },
        reportedBy: { type: ObjectId, ref: "Users", required: true },
        createdAt: Date,
        updatedAt: Date
    }



our Team Members

Aayush Sharma – Role
Adolf Nohara – (I will handle related backend and frontend like: MongoDB,Html,Css,Js,React.js and in Verson control : Github. firebase, kiro,chatgpt )
Hamsini Rapalli -Front end coding ( I handle the user experince in the website- HTML/CSS/JSS)
Haneesh - Role
Jaypal -UI/UX, backend develper (i will handel all thing related backend like : Node.js,Express.js,MongoDB,API etc....)
Pratik Munde - Role
