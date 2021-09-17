/**
 * Config file with enviroment keys
 */

require('dotenv').config();

module.exports = {
	test: process.env.TEST,
};
