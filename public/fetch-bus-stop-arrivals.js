const axios = require("axios");

const BSA = (busStopCode) => {
  let busStopEndpoint = `http://datamall2.mytransport.sg/ltaodataservice/BusStops`;
  let arrivalEndpoint = `http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=${busStopCode}`;

  return Promise.all([
    BSI()(),
    axios.get(arrivalEndpoint, {
      headers: {
        AccountKey: "jFy/9f6DTo6LHhmHX282YA==",
        accept: "application/json",
      },
    }),
  ]);
};

const BSI = () => {
  var _BSICacheDate = 0;
  var _BSICache = [];

  return () => {
    return new Promise((resolve, reject) => {
      if (
        new Date() - _BSICacheDate < 24 * 30 * 60 * 1000 &&
        _BSICache.length > 0
      ) {
        /* 24h, 60mins, 60s, 1000ms */
        resolve(_BSICache);
        return;
      }

      let promiseChain = (n, accum) => {
        n = n || 0;
        accum = accum || [];

        let busStopEndpoint = `http://datamall2.mytransport.sg/ltaodataservice/BusStops?$skip=${
          n * 500
        }`;

        axios
          .get(busStopEndpoint, {
            headers: {
              AccountKey: process.env.DATAMALLKEY,
              accept: "application/json",
            },
          })
          .then((response) => {
            if (response.data.value.length > 0) {
              promiseChain(n + 1, accum.concat(response.data.value));
            } else {
              _BSICache = accum;
              _BSICacheDate = new Date();
              resolve(_BSICache);
            }
          })
          .catch((err) => {
            reject(err);
          });
      };

      promiseChain();
    });
  };
};

module.exports = { BSA, BSI: BSI() };
