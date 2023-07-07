module.exports = {
    HOST: "192.168.1.15",
    USER: "mtgadmin",
    PASSWORD: "pinkfluffyunicorns",
    DB: "fddp-data",
    PORT: 5432,
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};