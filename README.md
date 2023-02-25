# Server-to-QR

This is a Node.js application that provides an API for generating and managing QR codes. It uses the Express framework and the fs module to read and write data to a json file. The application has two sets of routes for ready-made QR codes and temporary QR codes.

This application requires the following dependencies:
* Express (^4.18.2)
* Express Fileupload (^1.4.0)
* QRCode (^1.5.1)
* UUID (^9.0.0) 
* Nodemon (^2.0.20) 

To start the application, run `node index.js` or `nodemon index.js` for development purposes in your terminal window from the project directory.

## Usage

 The application provides two sets of routes for ready-made and temporary QR codes. For ready-made codes, use the following routes:  

 - `POST /api/qr/ready/:id` - creates a new ready-made code with the specified id  

 - `GET /api/qr/ready/:id` - returns a ready-made code with the specified id  

 - `GET /api/qr/ready/` - returns all ready-made codes in an array  

 - `DELETE /api/qr/ready/:id` - deletes a ready-made code with the specified id  

 - `DELETE /api/qr/ready/` - deletes all ready-made codes in an array   

 For temporary codes, use the following routes:   

 - `POST /api/qr/:id` - creates a new temporary code with the specified id   

 - `GET /api/qr//:id` - returns a temporary code with the specified id   

 - `GET /api//qr//` - returns all temporary codes in an array   

 - `DELETE //api//qr//:id` - deletes a temporary code with the specified id   

 - `DELETE //api//qr//` – deletes all temporary codes in an array
