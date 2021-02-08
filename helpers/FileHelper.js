const multer = require("multer")
const uuidv4 = require("uuid/v4")
const path = require("path")
const fs = require("fs")

class FileHelper {
  static upload(name) {
    const uploadFunc = multer({
      storage: multer.diskStorage({
        destination: function(req, file, cb) {
          cb(null, path.join(__dirname, "../uploads"))
        },
        filename: function(req, file, cb) {
          // generate a random uuid for filename
          const fileName = `${uuidv4()}${path.extname(file.originalname)}`
          cb(null, fileName)
        }
      }),
      fileFilter: (req, file, cb) => {
        // validate that this is really a csv file
        if (
          file.mimetype === "text/csv" ||
          file.mimetype === "application/octet-stream"
        ) {
          return cb(null, true)
        }
        cb(null, false)
      }
    })

    return uploadFunc.fields([{ name, maxCount: 1 }])
  }

  /**
   * Removes a file from the uploads folder
   * Returns true for success, and false on error
   * @param {String} filePath - file name of the file to be removed (i.e. xxx-xx-xxx.csv)
   * @returns {Boolean}
   */
  static async remove(filePath) {
    // const filePath = path.join(__dirname, `../uploads/${fileName}`)
    try {
      fs.unlinkSync(filePath)
      return true
    } catch (err) {
      console.error(`FileHelper.remove`, err)
      return false
    }
  }
}

module.exports = { FileHelper }
