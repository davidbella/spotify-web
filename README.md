#### About
A simple web application to search the Spotify web service.

##### Install
To keep things simple while I am learning how to share projects, I have packaged up all the node_modules used here in the repository.

This will require Node to be installed and also MongoDB running locally on port 27017

create a .config file in the base directory with two lines:

username
password

You have to be a paying Spotify member to access their API - sorry.

##### Run It!
> node server.js

Browse to localhost:5002
Search Spotify for some tunes
Suggest! them to track them in MongoDB and Backbone them into the page
Play will begin playing the song _in the console_ (it doesn't yet pipe data back up to the browser)

##### Issues
Lots of them.

* Doesn't block when starting the server and logging in to Spotify, causing errors if you search too soon.
* It's super ugly
* It plays in the back end, and doesn't stop when you choose to play another song
* Many things are messy due to async and not waiting for things to happy
* The backbone code is surely a mess