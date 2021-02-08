const { db } = require("../lib/db")

class VehicleSvc {
  /**
   * Adds a vehicle to the database
   * @param {Object} vehicle - the vehicle object to add
   * @param {String} vehicle.uuid - uuid of the vehicle
   * @param {String} vehicle.vin - vin of the vehicle
   * @param {String} vehicle.providerName - provider name of the vehicle
   * @param {String} vehicle.make - make of the vehicle
   * @param {String} vehicle.model - model of the vehicle
   * @param {Number} vehicle.mileage - mileage of the vehicle
   * @param {Number} vehicle.year - year of the vehicle
   * @param {Number} vehicle.price - price of the vehicle
   * @param {Number} vehicle.zipCode - zip code of the vehicle
   * @param {String} vehicle.createDate - create date of the vehicle
   * @param {String} vehicle.updateDate - update date of the vehicle
   * @returns {Boolean}
   */
  static async addVehicle(vehicle) {
    try {
      const stmt = await db.prepare(`
          INSERT INTO vehicles (uuid, vin, providerName, make, model, mileage, year, price, zipCode, createDate, updateDate) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      await stmt.run(
        vehicle.uuid,
        vehicle.vin,
        vehicle.providerName,
        vehicle.make,
        vehicle.model,
        vehicle.mileage,
        vehicle.year,
        vehicle.price,
        vehicle.zipCode,
        vehicle.createDate,
        vehicle.updateDate
      )
      await stmt.finalize()
    } catch (err) {
      console.error(`VehicleSvc.addVehicle`, err)
      return false
    }

    return true
  }

  /**
   * Checks to see if a vehicle already exists in the database
   * @param {String} uuid - uuid of the vehicle
   * @param {String} vin - vin of the vehicle
   * @returns {Boolean}
   */
  static async vehicleExists(uuid, vin) {
    try {
      const existingVehicle = await new Promise((res, rej) => {
        db.get(
          `SELECT * FROM vehicles WHERE uuid='${uuid}' OR vin='${vin}'`,
          (err, v) => {
            if (err) {
              return rej(err)
            } else {
              return res(v)
            }
          }
        )
      })

      if (existingVehicle && existingVehicle.uuid) {
        return true
      }

      return false
    } catch (err) {
      console.error(`VehicleSvc.vehicleExists`, err)
      throw new Error(err)
    }
  }

  /**
   * Gets all vehicles in the database
   * @returns {Array}
   */
  static async getAll() {
    try {
      const vehicles = await new Promise((res, rej) => {
        db.all(`SELECT * FROM vehicles;`, (err, v) => {
          if (err) {
            return rej(err)
          } else {
            return res(v)
          }
        })
      })

      return vehicles
    } catch (err) {
      console.error(`VehicleSvc.getAll`, err)
      throw new Error(err)
    }
  }
}

module.exports = { VehicleSvc }
