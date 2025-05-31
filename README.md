### Setup Instructions
***Prerequiste***
- Install Mongodb or use cloud service (ie atlas)
- Install Redis or use cloud service
  
*Install all dependencies*
```bash
npm install
```
*run the server*
```bash
npm run dev
```
*Export the csv data to mongodb database*
```bash
npx ts-node utils/importCSV.ts
```
Now Test all the api keys against the requirement of the project
```bash
Method	Endpoint	              Description
POST	  /api/auth/register	    Register a new user
POST	  /api/auth/login	        Login and get JWT
POST	  /api/properties	        Create property (auth required)
GET	    /api/properties	        Get all properties (with filters)
GET	    /api/properties/:id	    Get single property
PUT	    /api/properties/:id	    Update property (creator only)
DELETE	/api/properties/:id	    Delete property (creator only)
POST	  /api/favorites/:id	    Add to favorites
DELETE	/api/favorites/:id	    Remove from favorites
GET	    /api/favorites	        List all favorites
POST	  /api/recommendations	  Recommend property to user (by email)
GET	    /api/recommendations	  Get properties recommended to you
```

