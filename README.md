# Testing (from the end user's perspective)

Go to https://autofi.podsoft.io/test

1. Fill in the provider name
2. Upload a CSV file (which could include some of the fields above, all of them, or even additional fields that are not relevant -- however at a minimum it should include `UUID` and `VIN`). If you want to use the examples provided, feel free to download them from the "Example Files" section.
3. Click on Submit.

The CSV will then be uploaded onto the server and processed to be stored in the database.

Give it a few seconds, and click on the "Refresh" button in the "Current Vehicles" section and should see a list of vehicles that are currently in the database.

# Purpose

This tool is an API that allows people (or machines) to upload a CSV of vehicles along with a provider name. Our system will then match the columns in the CSV to the ones below, and store them in our database.

The UUID and VIN should be unique as duplicates will be ignored.

## Fields

- UUID
- VIN (alphanumerical vehicle id)
- Make
- Model
- Mileage
- Year
- Price
- Zip Code
- Create Date
- Update Date

# API Usage

POST - /vehicles

Body:

- vehicles - a csv file of vehicles
- providerName - name of the provider uploading this csv

GET - /vehicles -- gets a list of all vehicles currently in the database

# Running the code

`yarn install`

`yarn start dev` to auto restart server when there's code change

`yarn start` to run

# Running on Windows

It may be tricky to run on windows because of sqlite3. It tries to fetch binaries in the current version that may have been removed from s3, so it'll make attemps to build from source.

With that said, you should have python on your machine for this to work.

If you run into errors, the follow commands may help:

`npm install --global --production windows-build-tools` on a bash or command prompt with administrator access (run as administrator)

Set VCTargetsPath environment variable to C:\Program Files (x86)\MSBuild\Microsoft.Cpp\v4.0\V140 of whatever your path to MS CPP is.

# Potential

If we want to take this to the moon, we could add features such as:

- logs to keep track of uploads that providers are performing
- a queue to process files for scale
- another table / management system to keep track of vehicles that are skipped (duplicates, updates, etc)
