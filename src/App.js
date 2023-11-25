import { useEffect, useState } from "react";
import getMainUrl from "./api";
import { status } from "./helper";

import "./App.css";
import Table from "./components/Table/Table";

export default function App() {
  let [data, setData] = useState([]);
  const [coinName, setCoinName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = (crypto) => {
    const updatedCryptos = data?.filter((c) => c.name !== crypto);
    setData(updatedCryptos);
  };

  useEffect(() => {
    const fetchData = async () => {
      fetch(getMainUrl("Dogecoin"))
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          // console.log(`response`, response);
          return response.json();
        })
        .then((data) => {
          // console.log(`data`, data);
          let newData = {
            ...data,
            id: Date.now(),
            name: "Dogecoin",
            currency: "$",
            price: data.USD,
            status: "",
          };
          setData((prevData) => {
            return [newData];
          });
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    };
    fetchData();
  }, []);

  const fetchData = (coinNamesStr = `Dogecoin`) => {
    let url = "";
    if (coinNamesStr === "") {
      url = getMainUrl(`Dogecoin,BTC`, true);
    } else {
      url = getMainUrl(coinNamesStr, true);
    }
    // console.log(`coinNamesStr`, coinNamesStr);

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.Response === "Error") {
          console.error(data.Response);
        } else {
          let newCoinsArr = Object.entries(data).map((item) => {
            return {
              // ...item,
              id: Date.now(),
              name: item[0],
              currency: "$",
              price: item[1].USD,
              status: "",
            };
          });

          // console.log(`newCoinsArr`, newCoinsArr);

          // setData(newCoinsArr);
          setData((prevPrices) => {
            const updatedData = prevPrices.map((prevPrice, i) => {
              if (prevPrice.price < newCoinsArr[i].price) {
                return { ...prevPrice, status: "UP" };
              } else if (prevPrice.price > newCoinsArr[i].price) {
                return { ...prevPrice, status: "DOWN" };
              }

              return prevPrice;
            });

            return updatedData;
          });

          setLoading(false);
        }
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    const fetchDataAtInterval = () => {
      const coinNames = data.map((item) => item.name).join(",");
      fetchData(coinNames);
    };

    const intervalId = setInterval(fetchDataAtInterval, 5000);

    return () => clearInterval(intervalId);
  }, [data, fetchData]);

  function fetchOtherCoin() {
    fetch(getMainUrl(coinName))
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        let newData = {
          ...data,
          name: coinName,
          id: Date.now(),
          currency: "$",
          price: data.USD,
          status: "",
        };

        if (data.Response) {
          alert(data.Response);
        } else {
          setData((prev) => {
            return [...prev, newData];
          });
          setCoinName("");
        }
      });
  }

  return (
    <div className="App">
      <h1>crypto currency exchange</h1>
      <div className="seach_container">
        <input
          style={{ width: "100%" }}
          type="text"
          value={coinName}
          onChange={(e) => setCoinName(e.target.value)}
          placeholder="searching cryptocurrencies"
        />
        <button onClick={fetchOtherCoin}>Search</button>
      </div>
      <br />
      <br />
      <Table items={data} onDelete={handleDelete} />
    </div>
  );
}
