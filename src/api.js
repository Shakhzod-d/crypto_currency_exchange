const API_KEY = `9ff3021f1ccfac65d8513085f0a8610934a16abb96942fe3f1cb8b9cc3a99926`;

export default function getMainUrl(COIN_NAME = "Dogecoin", isMulti = false) {
  const mainurl = `https://min-api.cryptocompare.com/data/${
    isMulti ? "pricemulti" : "price"
  }?${isMulti ? "fsyms" : "fsym"}=${COIN_NAME}&tsyms=USD&api_key=${API_KEY}`;

  return mainurl;
}
