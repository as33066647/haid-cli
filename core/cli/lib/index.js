'use strict';

const path = require("path")
const pkg = require("../package.json")
const log = require("@haid-cli/log")
const {
    getNpmSemverVersion
} = require("@haid-cli/get-npm-info")
const semver = require("semver")
const userHome = require('user-home');
const pathExist = require("path-exists").sync
const argv = require('minimist')(process.argv.slice(2));
const constant = require("./const")
const dotenv = require("dotenv");
const npmlog = require("@haid-cli/log");
const colors = require("colors")




function core() {
    try {
        checkArgv()
        checkVersion()
        checkNodeVersion()
        checkUserRoot()
        checkUserHome()
        checkEnv()
        checkNpmVersion()
    } catch (err) {
        log.error(err)
    }
}

function checkVersion() {
    log.verbose("test")
    log.info(`当前版本为${pkg.version}`)
}

function checkNodeVersion() {
    const minVersion = "8.0.0"
    if (semver.gt(minVersion, process.version)) {
        throw (`当前node版本过低,请升级node版本为大于${minVersion}`)
    }
}

function checkUserRoot() {
    const rootCheck = require("root-check")
    rootCheck()
}

function checkUserHome() {
    if (!pathExist(userHome)) {
        throw ("请检查用户主目录")
    }
}

function checkArgv() {
    if (argv.debug) {
        process.env.LOG_LEVEL = "verbose"
    } else {
        process.env.LOG_LEVEL = "info"
    }
    log.level = process.env.LOG_LEVEL
}

function checkEnv() {
    const defaultEnvPath = path.resolve(userHome, '.env')
    let config
    if (pathExist(defaultEnvPath)) {
        config = dotenv.config({
            path: defaultEnvPath
        })
    }
    createDefaultConfig()
}

function createDefaultConfig() {
    const cliConfig = {
        home: userHome
    }
    if (process.env.CLI_HOME) {
        cliConfig["cliHome"] = process.env.CLI_HOME
    } else {
        cliConfig["cliHome"] = constant.DEFAULT_CLI_HOME
    }
    process.env.CLI_HOME_PATH = cliConfig.cliHome
}

async function checkNpmVersion() {
    const npmName = pkg.name
    const lastVersion = await getNpmSemverVersion(pkg.version, npmName)

    if (lastVersion) {
        npmlog.info(colors.yellow(`请手动更新${npmName},当前版本为${pkg.version},最新版本为${lastVersion}
            更新命令为 npm install -g ${npmName}`))

    }
}

module.exports = core;