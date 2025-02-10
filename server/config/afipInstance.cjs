const Afip = require('@afipsdk/afip.js');
const fs = require('fs');

const afipInstance = new Afip({
    CUIT: '20439890518',
    cert: fs.readFileSync('./config/afip/certificado.crt', { encoding: 'utf8' }),
    key: fs.readFileSync('./config/afip/key.key', { encoding: 'utf8' })
})

module.exports = afipInstance;