#! /usr/bin/env node

const importLocal = require("import-local")

if (importLocal(__filename)) {
  console.log("124")
} else {
  require("../lib")(process.argv.splice(2))
}