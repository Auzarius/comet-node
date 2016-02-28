# comet ticket cms
This is a re-creation of the previous inshop ticket system that was using PHP and MYSQL.  This version will use Node.js, Express.js, AngularJS and the node-mysql tie in.  There will be some custom styling but I will primarily be using bootstrap (bootswatch paper) for the visual presentation.  Moment.js is also used to alter the time presentation.

I am open to feedback to help along the development.
This is just a small project I am working on in my spare time.
This will also server as my first node.js project and also my first real javascript project.

##Completed
- [X] API Routes and JSON responses
- [X] MySQL database interface
- [X] Front-end Angular Website
- [X] Angular functions for using the Node.js API including the login/logout functionality
- [X] User permissions
- [X] Feedback page & database
- [X] Website bug testing and some code cleanup
- [X] Database migration from the old system to this one

##Currently working on
- [X] Just launched the first full version with the completed database migration.  There could be more to come as bugs or other usages are requested.
  
##To-do
- [ ] Write the API Documentation
- [ ] Add the ability to disable a user account without deletion (this would be to maintain records)
- [ ] Rewrite node code-base for the project to clean it up.  Likely using a few of the new ES6 features like promises to remove the nested callbacks.

##Links
- The live version is almost always running at: http://inshop.auzarius.com/
- The development version is usually running at: http://dev.auzarius.com/
  - For the dev version you can login using admin for the username and password for the password.
