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
