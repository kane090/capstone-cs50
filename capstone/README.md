# README

## Terminology

**PB:** Personal Best

**ao5:** Average of your last 5 solves *(exclusive of your fastest and slowest solves from the 5)*

**ao12:** Average of your last 12 solves *(exclusive of your fastest and slowest solves from the 12)*

## Basic Description

This web application is a Rubik's Cube speedsolving timer. With a start and stop from the spacebar (or manually adding the time), this application tracks your time spent solving, saves it into a database (along with the scramble) and uses that information to calculate your current ao5 and ao12. Furthermore, on this application you can check and **update** your PBs (unlike in some other timers) so that you are appropriately notified if you do get a new PB.

## Distinctiveness and Complexity

This project is sufficiently distinct from the other projects in this course.

It is not similar to a front-end search, an online encyclopedia, an e-commerce auction site, a front-end email client nor a social network.

The complexity of this project arises from the heavy front-end JavaScript usage, more specifically the usage of the `setInterval` and `clearInterval` functions that ran the timer itself. In addition, this project expanded the use of self-made JavaScript API calls that were introduced in the front-end email client project.

## Contents of each file created

### Files created

* [urls.py](timer/urls.py) - in the timer application

This file contains the routes (including API routes) that are used in this web application. This file was created in order to better segregate the routes in this Django project, should it be extended further.

* [index.html](timer/templates/timer/index.html)

This is the HTML file that is rendered when visiting the 'index' route (ie. 127.0.0.1:8000/). It is the main page that contains the timer and is used to interact with the web application.

* [pbs.html](timer/templates/timer/pbs.html)

This HTML file is rendered when visiting the 'pbs' route (ie. 127.0.0.1:8000/pbs). This page allows you to interact with (ie. update) the database that stores your personal bests and enables the notifications of getting a new PB.

* [index.css](timer/static/timer/index.css)

This CSS file adjusts the font sizes and weights of the elements on the [index.html](timer/templates/timer/index.html) page.

* [index.js](timer/static/timer/index.js)

This is the main file that handles all of the interactivity of this web application. It controls the timer, generates the scramble, alerts you when you get a new PB, updates your ao5 and ao12 on each solve (whether timed or added seperately) and allows you to view information about any previous solves.

* [pbs.css](timer/static/timer/pbs.css)

This CSS file adjusts the font size and location of the hyperlink that routes you back to the main timer application.

* [pbs.js](timer/static/timer/pbs.js)

This JS file handles the updating of your PBs as mentioned in the basic description and allows for this feature to be present in the web application.

## How to run this application

To run this application, you just need to start the server by running `python manage.py runserver` in your terminal.

## Additional information

When initially running the application, 12 solves need to be completed in order to fully initialize the PB database and properly make use of updating your PBs as mentioned in the basic description.
