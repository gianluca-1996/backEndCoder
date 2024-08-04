const {Command} = require('commander');

const program = new Command();

//La opcion para el logger (dev, prod)
program.parse();

module.exports = program;