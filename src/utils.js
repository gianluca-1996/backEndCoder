const multer = require('multer');
const { faker } = require('@faker-js/faker');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, __dirname + '/public/img');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
})

const uploader = multer({storage});


const generateProducts = () => {
    return {
        code: "codigoTest123",
        title: faker.lorem.sentence({ min: 3, max: 5 }),
        price: faker.number.float({ multipleOf: 0.25, min: 1, max:100 }),
        thumbnail: faker.system.directoryPath() + "/" + faker.system.fileName(),
        stock: faker.number.int({max: 100}),
        category: faker.word.sample(),
        status: faker.datatype.boolean()
    }
}

module.exports = {uploader, generateProducts};