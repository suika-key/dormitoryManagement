const util = require('util');

module.exports = () => {
  return (err, req, res, next) => {
    console.log(err);
    res.status(500).json({
      err_code: 500,
      message: err.message
    })
  }
}