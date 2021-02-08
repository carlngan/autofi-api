const csv = require("csv-parser")
const moment = require("moment")
const fs = require("fs")

const { FileHelper } = require("../helpers/FileHelper")
const { VehicleSvc } = require("../services/VehicleSvc")

const { config } = require("../config")

class VehicleCtrl {
  /**
   * Given a path to a csv, attempt to process the vehicles in the csv
   * Returns true if operation is successful, returns false otherwise
   * @param {String} csvPath - absolute path to where the csv is located
   * @param {String} providerName - name of the provider -- where this csv is coming from
   * @returns {Boolean}
   */
  static async processCsv(csvPath, providerName) {
    try {
      await fs
        .createReadStream(csvPath)
        .pipe(csv())
        .on("data", async rawVehicle => {
          // add providerName to vehicle
          rawVehicle.providerName = providerName
          // clean up the raw vehicle data
          await VehicleCtrl.processVehicle(rawVehicle)
        })
        .on("end", () => {
          FileHelper.remove(csvPath)
        })

      return true
    } catch (err) {
      console.error(`VehicleCtrl.processVehicles`, err)
      return false
    }
  }

  /**
   * Given a path to a csv, attempt to process the vehicles in the csv
   * Returns true regardless
   * @param {Object} rawVehicle - object of a vehicle with columns we may not care about
   * @returns {Boolean}
   */
  static async processVehicle(rawVehicle) {
    try {
      const cleanVehicle = await VehicleCtrl.cleanData(rawVehicle)
      // check if vehicle already exists
      const existingVehicle = await VehicleSvc.vehicleExists(
        cleanVehicle.uuid,
        cleanVehicle.vin
      )
      // add to db if unique
      if (!existingVehicle || !existingVehicle.uuid) {
        await VehicleSvc.addVehicle(cleanVehicle)
      } else if (
        moment(existingVehicle.updateDate).isBefore(
          moment(cleanVehicle.updateDate)
        )
      ) {
        // if update date is newer, then perform an update instead
        await VehicleSvc.updateVehicle(cleanVehicle)
      }
    } catch (err) {
      // if it errors, for example on vin and uuid -- continue
      console.log(`VehicleCtrl.processVehicle`, err, ` Continuing...`)
    }
    return true
  }

  /**
   * Cleans up a vehicle object into only columns that we care about
   * UUID and VIN (can be lowercase) must exist in the object
   * @param {Object} rawVehicle - object of a vehicle with columns we may not care about
   * @returns {Object}
   */
  static async cleanData(rawVehicle) {
    // get keys
    const rawVehicleKeys = Object.keys(rawVehicle)
    const lowerCaseKeys = rawVehicleKeys.map(k => {
      return k.toLowerCase()
    })

    // if uuid or vin doesn't exist, return
    if (lowerCaseKeys.indexOf("uuid") < 0 || lowerCaseKeys.indexOf("vin") < 0) {
      console.log("UUID and VIN must exist.")
    }

    // get columns arr
    const columnsArr = config.columns.split(",")

    const cleanVehicle = {}

    for (const rawKey of rawVehicleKeys) {
      // convert key to lowercase and remove spaces
      const lowerCaseKey = rawKey.replace(/ /g, "").toLowerCase()

      // if this is a column we care about, then add it to the clean object
      const columnPos = columnsArr
        .map(c => {
          return c.toLowerCase()
        })
        .indexOf(lowerCaseKey)
      if (columnPos > -1) {
        cleanVehicle[columnsArr[columnPos]] = rawVehicle[rawKey]
      }
    }

    return cleanVehicle
  }

  /**
   * Gets all vehicles from the database
   * @returns {Array}
   */
  static async getAll() {
    return await VehicleSvc.getAll()
  }
}

module.exports = { VehicleCtrl }
