const path = require("path");

console.log(path.resolve(process.argv[2] || '.'), __dirname);