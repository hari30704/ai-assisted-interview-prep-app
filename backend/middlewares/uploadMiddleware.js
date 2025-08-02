const multer = require("multer");  

//configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // specify the destination folder
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // create a unique filename
    },
});

// file filter to allow only images
const fileFilter = (req, file, cb) => {
   const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
   if (allowedTypes.includes(file.mimetype)) {
       cb(null, true); // accept the file
   } else {
       cb(new Error('Only images are allowed'), false); // reject the file
   }    
};

const upload = multer({ storage, fileFilter });

module.exports = upload;