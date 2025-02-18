const Afip = require('@afipsdk/afip.js');
const fs = require('fs');
const path = require('path');

const certPath = path.join(__dirname, 'afip/certificado.crt');
const keyPath = path.join(__dirname, 'afip/key.key');
const configPath = path.join(__dirname, 'afip/config.json');

let afipInstance = null;

const crearInstanciaAfip = (CUIT) => {
    if (fs.existsSync(certPath) && fs.existsSync(keyPath) && fs.existsSync(configPath)) {
        const { CUIT } = JSON.parse(fs.readFileSync(configPath, { encoding: 'utf8' }));
        afipInstance = new Afip({
            CUIT,
            cert: fs.readFileSync(certPath, { encoding: 'utf8' }),
            key: fs.readFileSync(keyPath, { encoding: 'utf8' }),
        });
        console.log('✅ Instancia de AFIP creada correctamente.');
    } else {
        console.warn('⚠️ No se encontraron certificados. La instancia de AFIP no se creó.');
    }
};

const generarCertificados = async (username, password, cuit) => {
    const afip = new Afip({ CUIT: username });

    try {
        const res = await afip.CreateCert(username, password, 'afipsdk');

        fs.writeFileSync(certPath, res.cert, { encoding: 'utf8' });
        fs.writeFileSync(keyPath, res.key, { encoding: 'utf8' });

        // Guardar el CUIT en config.json
        fs.writeFileSync(configPath, JSON.stringify({ CUIT: cuit }, null, 2));

        console.log('✅ Certificados generados y guardados correctamente.');

        // Crear la instancia automáticamente
        crearInstanciaAfip();

        return true;
    } catch (error) {
        console.error('❌ Error generando certificados:', error);
        return false;
    }
};

const getInstanciaAfip = () => {
    if (!afipInstance) {
        console.warn('⚠️ No hay instancia de AFIP configurada.');
    }
    return afipInstance;
};

const isAfipConfigured = () => {
    return fs.existsSync(certPath) && fs.existsSync(keyPath) && fs.existsSync(configPath);
};

// Crear instancia automáticamente al cargar el módulo si está todo listo
crearInstanciaAfip();

module.exports = {
    crearInstanciaAfip,
    generarCertificados,
    getInstanciaAfip,
    isAfipConfigured,
};