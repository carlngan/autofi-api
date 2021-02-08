const express = require("express")
const uuidv4 = require("uuid/v4")

const router = express.Router()
const { celebrate, Joi, errors } = require("celebrate")

const { VehicleCtrl } = require("../controllers/VehicleCtrl")
const { FileHelper } = require("../helpers/FileHelper")

/**
 * GET - /vehicles
 * Gets the mc accounts for this account -- for now there's only 1
 */
router.get("/vehicles", async (req, res) => {
  try {
    const vehicles = await VehicleCtrl.getAll()

    return res.status(200).send(vehicles)
  } catch (err) {
    console.log("Error: ", err)
    return res.status(400).send(err)
  }
})

/**
 * POST - /vehicles
 * Adds or updates vehicles
 */
router.post(
  "/vehicles",
  FileHelper.upload("vehicles"),
  // validations
  celebrate(
    {
      body: {
        providerName: Joi.string().required()
      }
    },
    {
      allowUnknown: true
    }
  ),
  async (req, res) => {
    try {
      const { providerName } = req.body
      const { vehicles } = req.files

      if (vehicles && vehicles[0]) {
        const vehiclesPath = vehicles[0].path

        // process file
        VehicleCtrl.processCsv(vehiclesPath, providerName)
      } else {
        return res.status(400).send({ msg: "Unable to process file" })
      }

      return res.status(200).send({ msg: "success" })
    } catch (err) {
      console.log("Error: ", err)
      return res.status(400).send(err)
    }
  }
)

router.use(errors())

module.exports = router
