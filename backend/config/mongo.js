const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');

async function connectMongo() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Подключение к MongoDB установлено');
    } catch (err) {
        console.error('❌ Ошибка подключения к MongoDB:', err.message);
        throw err;
    }
}

module.exports = connectMongo;