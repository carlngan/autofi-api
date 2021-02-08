const assert = require("assert")
const chai = require("chai")
const expect = chai.expect
const { VehicleSvc } = require("../services/VehicleSvc")

describe("VehicleSvc", async () => {
  describe("#addVehicle()", async () => {
    it("should return true when uuid and vin are passed in", async () => {
      const success = await VehicleSvc.addVehicle({
        uuid: "1234",
        vin: "1234"
      })
      const vehicle = await VehicleSvc.get("1234", "1234")
      assert.equal(vehicle.uuid, "1234")
      assert.equal(success, true)
    })
    it("should return true all fields are passed in", async () => {
      const success = await VehicleSvc.addVehicle({
        uuid: "123456",
        vin: "123456",
        providerName: "Carl",
        make: "Carl",
        model: "Carl",
        mileage: 123,
        year: 123,
        price: 123,
        zipCode: 123,
        createDate: "2021-01-29T15:16:25Z",
        updateDate: "2021-01-29T15:16:25Z"
      })
      const vehicle = await VehicleSvc.get("123456", "123456")
      assert.equal(vehicle.uuid, "123456")
      assert.equal(vehicle.vin, "123456")
      assert.equal(vehicle.providerName, "Carl")
      assert.equal(vehicle.make, "Carl")
      assert.equal(vehicle.model, "Carl")
      assert.equal(vehicle.mileage, 123)
      assert.equal(vehicle.year, 123)
      assert.equal(vehicle.price, 123)
      assert.equal(vehicle.zipCode, 123)
      assert.equal(vehicle.createDate, "2021-01-29T15:16:25Z")
      assert.equal(vehicle.updateDate, "2021-01-29T15:16:25Z")
      assert.equal(success, true)
    })
    it("should return false when no fields are passed in", async () => {
      const success = await VehicleSvc.addVehicle({})
      assert.equal(success, false)
    })
    it("should return err when duplicate uuid and vin are passed in", async () => {
      try {
        await VehicleSvc.addVehicle({
          uuid: "1234",
          vin: "1234"
        })
      } catch (err) {
        err.should.be.Error()
        err.should.have.value("message", "Contrived Error")
      }
    })
  })

  describe("#updateVehicle()", async () => {
    it("should return true when uuid and vin exists", async () => {
      await VehicleSvc.addVehicle({
        uuid: "1234update",
        vin: "1234update"
      })
      const success = await VehicleSvc.updateVehicle({
        uuid: "1234update",
        vin: "1234update",
        make: "Carl"
      })
      const vehicle = await VehicleSvc.get("1234update", "1234update")
      assert.equal(vehicle.uuid, "1234update")
      assert.equal(vehicle.make, "Carl")
      assert.equal(success, true)
    })

    it("should return true when uuid and vin doesn't exists", async () => {
      const success = await VehicleSvc.updateVehicle({
        uuid: "1234updateNONEXIST",
        vin: "1234updateNONEXIST",
        make: "Carl"
      })
      const vehicle = await VehicleSvc.get(
        "1234updateNONEXIST",
        "1234updateNONEXIST"
      )
      expect(vehicle).to.equal(undefined)
      expect(success).to.equal(true)
    })
  })
})
