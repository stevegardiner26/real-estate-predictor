# Real Estate Predictor (Machine Learning)

A nodejs/mysql application that uses a dataset of currently for sale houses in NJ that can be fetched from Zillow
using the script in this repo. It then calculates the price based on certain parameters provided
by the user such as how many bedrooms and bathrooms there are or the square footage of the house.

Node JS version: `15`
MySQL Version: `5.7`

## Local Installation

    $ git clone git@github.com:stevegardiner26/real-estate-predictor.git
    $ cd real-estate-predictor
    $ npm install

## Setting Up Mysql DB
    
Have mysql setup locally on your machine.

    $ CREATE DATABASE real_estate_data;
    $ CREATE TABLE house_data (price INTEGER,
        beds INTEGER,
        baths INTEGER,
        sqft INTEGER,
        zip VARCHAR(255)
      );

## Running the Web Scraper to get House Data
    
WARNING!!: Make sure that you set up your mysql database before executing this
WARNING!!: This wasn't optimized very much. So the computations might crash your computer.

    $ node fetch_house_data.js

#### Scraping a Different State/Location

If you plan on scraping a new state you will only be able to get 500 entries
per search, so it is a good idea to get a list of cities/municipalities in the
state because then you can get 500 entries per city/municipality, resulting in
a bunch more data.

Get a list of municipalities that you want to use, replace
the cities array with your data in `fetch_house_data.js`.

Change `nj` in the link in `fetch_house_data.js [Line: 566]` to your state or location.
(This might take some tinkering. The best way to find what you need is to go to 
https://zillow.com/ and just try finding what is consistent in the url.)

## Running the Web Server/Predictor

    $ node server.js
    Visit http://localhost:5500/ 
