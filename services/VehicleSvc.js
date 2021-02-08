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
  static async addVehicle(vehicle = {}) {
    // return false if uuid or vin doesn't exist
    if (!vehicle.uuid || !vehicle.vin) {
      return false
    }
    try {
      await new Promise((res, rej) => {
        const stmt = db.prepare(`
          INSERT INTO vehicles (uuid, vin, providerName, make, model, mileage, year, price, zipCode, createDate, updateDate) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        stmt.run(
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
          vehicle.updateDate,
          e => {
            if (e) {
              rej(e)
            }
          }
        )
        stmt.finalize(e => {
          if (e) {
            rej(e)
          } else {
            res(true)
          }
        })
      })
    } catch (err) {
      console.error(`VehicleSvc.addVehicle`, err)
      return false
    }

    return true
  }

  /**
   * Updates a vehicle, uuid and vin must exist
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
  static async updateVehicle(vehicle = {}) {
    try {
      let query = `
        UPDATE vehicles
      `
      // update fields that exist
      const querySetArr = []
      if (vehicle.providerName) {
        querySetArr.push(`SET providerName = "${vehicle.providerName}"`)
      }
      if (vehicle.make) {
        querySetArr.push(`SET make = "${vehicle.make}"`)
      }
      if (vehicle.model) {
        querySetArr.push(`SET model = "${vehicle.model}"`)
      }
      if (vehicle.mileage) {
        querySetArr.push(`SET mileage = ${vehicle.mileage}`)
      }
      if (vehicle.year) {
        querySetArr.push(`SET year = ${vehicle.year}`)
      }
      if (vehicle.price) {
        querySetArr.push(`SET price = ${vehicle.price}`)
      }
      if (vehicle.zipCode) {
        querySetArr.push(`SET zipCode = ${vehicle.zipCode}`)
      }
      if (vehicle.createDate) {
        querySetArr.push(`SET createDate = "${vehicle.createDate}"`)
      }
      if (vehicle.updateDate) {
        querySetArr.push(`SET updateDate = "${vehicle.updateDate}"`)
      }

      query += querySetArr.join(", ")

      query += `WHERE uuid="${vehicle.uuid}" AND vin="${vehicle.vin}"`

      await db.run(query)
    } catch (err) {
      console.error(`VehicleSvc.updateVehicle`, err)
      return false
    }

    return true
  }

  /**
   * Gets a vehicle by uuid and vin
   * @param {String} uuid - uuid of the vehicle
   * @param {String} vin - vin of the vehicle
   * @returns {Object}
   */
  static async get(uuid, vin) {
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
      return existingVehicle
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
