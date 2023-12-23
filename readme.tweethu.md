Express

Express is a package for creating web servers - [Express on npm](https://www.npmjs.com/package/express).

A web server is a part of the backend that receives HTTP requests and sends responses.

To create a web server, install the package using `npm i express`; then, import Express into the `app.js` file.
To create a web server, call Express as a function - `app` will be our web server.
Next, it needs to be launched - call its `listen` method and pass the port number (like 3000) as the first argument.
If you are developing both backend and frontend simultaneously, ensure the ports are different.
To confirm it's running, as a second argument to `listen`, pass a callback function that will execute if the server successfully starts, and you'll see a "Server is running" message.

To define a route, write the server name - `app`, call the required method - `get`, write the route's name (like "/" for the homepage) as the first argument, and a callback function as the second. This function will execute when the route is found.
Express passes two arguments to this callback function:

1. A request object containing all information about the incoming request.
2. A response object that allows you to set up and send the response.
   Send the response in JSON format using `res.json()`.

To check routes, use Postman - [Postman website](https://www.postman.com/) (it's better to download and install it).

Middleware

For each request, there are specific actions to perform, usually implemented through middleware. Middleware acts as a connective tissue between applications, data, and users.

To add middleware in Express, use the `use` method in the web server `app`.
You can pass a route or a function as the first argument, which will execute for any request on any route.
Once Express finds a suitable function, it executes it and stops looking further.
Middleware is an intermediate stage, a function that does something and then continues to look for the right route. Therefore, pass the `next()` function as the third argument in the `use` method, and if called, Express will continue searching.

To write data to a file, use the `fs` package with promises, allowing all handler functions to be asynchronous.
The challenge with asynchronous functions is that they return promises, and `res.json()` isn't a return statement but a way to send responses to the frontend; promises won't be sent there.

How does Express work? A request comes in, and Express iterates through all addresses from top to bottom. If a request comes to an address that isn't listed, Express will reach `app.use(req, res) =>` and send `res.status(404).json({ message: "Not found" })`. This is also middleware - handling requests for non-existent addresses.

The address of our server (or website) is `http://localhost:3000`. All servers are configured to accept requests from the address they're running on. If a request comes from a different address, the server will automatically reject it. Running frontend and backend simultaneously means the addresses will be different (e.g., 3000 and 3001).
A CORS (Cross-Origin Request) is a request from one domain (server) to another with different addresses. You need to allow cross-domain requests, at least during development.
This can be resolved by installing the `cors` package, which provides the necessary middleware - `npm i cors`.
In `app.js`, import `cors` (`const cors = require("cors");`), call the `cors` function to get the middleware.
Using `app.use(cors());`, any request will go through this middleware, and if it comes from a different domain, this middleware will allow it, making Express accept it.

Routes are moved to a separate file - create `routes/api/tweets.js`, import Express into it. Instead of calling Express as a function (since the server is already created in `app.js`), call its `Router` method and write all routes related to tweets. Export it using `module.exports = router;`.
So, you've created not a web server, but a part of it.

Import this part into `app.js` (`const tweetsRouter = require("./routes/api/tweets");`).
Now tell our web server where to find all routes starting with "/api/tweets" - `app.use("/api/tweets", tweetsRouter);`.

In `package.json`, it's specified that we run not `app.js`, but `server.js` - `"start": "cross-env NODE_ENV=production node ./server.js"`.
In `server.js`, import `app` (server) (`const app = require("./app");`) and launch `app` (`app.listen(PORT);`).

In `app.js`, `const logger = require("morgan");` is middleware that logs request information to the console, sometimes necessary for debugging.

Adding an Avatar

1. `npm install --save multer`

   - Install multer. Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.

2. `npm run start:dev`

   - Launch the project.

3. In `app.js`, write `app.use(express.static("public"));` - If a request for a static file is made, it should be searched for in the `public` folder.

4. First, create the necessary folders where multer will temporarily store files: `temp` (it will be empty, but empty folders are not pushed to Git), so create an empty file `.gitkeep` in it.

5. Create `public/avatars`. The files that we will serve to the frontend will be saved in the `public/avatars` folder - where we will store user avatars. Create an empty file `.gitkeep` in it too.

6. Create a new file `multer-config.js` in the `middlewares` folder. Import multer and create a multerConfig settings object, then use it to create the middleware - `upload`, which will upload files.

7. In `multer-config.js` - Create a settings object - `multerConfig`, call the `diskStorage` method and pass it an object describing the settings - only one mandatory setting is needed - `destination` (path to the temporary folder), specify the request address using `path`, so import `path`.

8. Create a path to the temporary folder - `tempDir` (all files will initially be saved here).

9. The second setting is `filename` - where we pass a function that can save the file under a different name than the one it came with, which is sometimes necessary.

10. Create middleware (`upload`) - call multer as a function, pass the settings object - in the `storage` property specify `multerConfig` - multer settings. The middleware is ready, it will save files in `tempDir` under their original name (`originalname`).

In the `user` schema, add:

avatarURL: {
type: String,
required: true,
},

11. To create an avatar upon registration, install the package `gravatar` - `npm i gravatar`.

12. Import `gravatar` in `controllers/auth.js`.
    To generate a link to a temporary avatar, call the `url` method of the `gravatar` object and pass `email`, then save it in the database. Now, when a person registers, they will be given a temporary avatar.

13. In `routes/api/auth.js`, append the PATCH route so that a logged-in user can change their avatar.

14. After registration or login, you can take the token and use it in a PATCH request to change the avatar.

15. In `routes/api/auth.js`, add to the PATCH request on avatars, `authenticate` and where one field `avatars` with a file will be passed.

16. Then write the `updateAvatars` controller in `controllers/auth.js`.
    Save the path to the avatars folder - `avatarsDir`, import `path`.
    Import the path `tempUpload` and `originalname`.
    Create the path where the file should be saved - `resultUpload`.
    Using `fs.rename`, move the file from the temporary location - the `temp` folder to the permanent one - `public/avatars`.
    Now write the file to the database - create `avatarURL`. Thanks to the `authenticate` middleware, the user's `id` who makes the request is stored in `req.user`.
    Knowing this `id`, we can overwrite `avatarURL`.
    We need to make the file name unique - we take `originalname` and add the user's `id` to it.

17. Process the avatar with the `npm i jimp` package.

18. In Postman, select the POST method, form-data, key-avatar, instead of Text select File, and attach the avatar.

Checking application in Postman

1. Register
   ![Alt text](image.png)

   Error 400
   ![Alt text](image-1.png)
   ![Alt text](image-2.png)

   Error 409
   ![Alt text](image-3.png)

2. Login
   ![Alt text](image-4.png)

   Error 400
   ![Alt text](image-5.png)
   ![Alt text](image-6.png)

   Error 401
   ![Alt text](image-7.png)

3. Get current user
   ![Alt text](image-8.png)
   ![Alt text](image-9.png)

   Error 401
   ![Alt text](image-10.png)

4. Logout
   ![Alt text](image-11.png)

   Error 401
   ![Alt text](image-12.png)

5. Update avatar
   ![Alt text](image-13.png)

   Error 400
   ![Alt text](image-14.png)

   Error 401
   ![Alt text](image-15.png)

6. Posting a tweet
   ![Alt text](image-16.png)

   Error 400
   ![Alt text](image-17.png)
   ![Alt text](image-18.png)

7. Update tweet
   ![Alt text](image-19.png)

   Error 400
   ![Alt text](image-22.png)

   Error 404
   ![Alt text](image-21.png)

8. Get all tweets
   ![Alt text](image-23.png)

   Error 401
   ![Alt text](image-24.png)

9. Get tweet by id
   ![Alt text](image-25.png)

   Error 404
   ![Alt text](image-26.png)
