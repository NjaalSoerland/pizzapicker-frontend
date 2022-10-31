import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const apiURL = "https://pizzapicker-api.vercel.app/";

  interface pizzaInterface {
    name: string;
    description: string;
    extra: string;
  }

  const [pizzas, setPizzas] = useState<{
    dessert: pizzaInterface[];
    original: pizzaInterface[];
    tynn: pizzaInterface[];
    vegansk: pizzaInterface[];
  }>({ dessert: [], original: [], tynn: [], vegansk: [] });

  const [activeCatergories, setActiveCatergories] = useState([
    "original",
    "tynn",
    "vegansk",
    "dessert",
  ]);

  const [pizzaOptions, setPizzaOptions] = useState<pizzaInterface[]>([]);

  const [selectedPizza, setSelectedPizza] = useState<pizzaInterface | null>();

  const handleChange = (type: string) => {
    if (activeCatergories.includes(type)) {
      setActiveCatergories(activeCatergories.filter((item) => item !== type));
    } else {
      setActiveCatergories([...activeCatergories, type]);
    }
  };

  const getRandomPizza = () => {
    const randomPizza = Math.floor(Math.random() * pizzaOptions.length);
    setSelectedPizza(pizzaOptions[randomPizza]);
  };

  useEffect(() => {
    axios
      .get(apiURL)
      .then((response) => {
        setPizzas(response.data);
        setActiveCatergories(Object.keys(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    let pizzaList: pizzaInterface[] = [];
    activeCatergories.forEach((category) => {
      pizzaList = [...pizzaList, ...pizzas[category as keyof typeof pizzas]];
    });
    setPizzaOptions(pizzaList);
  }, [activeCatergories, pizzas]);

  useEffect(() => {
    console.log(pizzaOptions);
  }, [pizzaOptions]);

  return (
    <div className="App">
      <header>
        <img src={require("./logo.png")} alt={"dumb logo"}></img>
      </header>
      <div id={"options"}>
        {Object.keys(pizzas).map((type) => {
          return (
            <div key={type}>
              <input
                type="checkbox"
                onChange={() => handleChange(type)}
                id={type}
                defaultChecked
              />
              <label htmlFor={type}>{type}</label>
            </div>
          );
        })}
      </div>

      <div id={"possiblePizzas"}>
        <h1 id={"possiblePizzasTitle"}>Possible options:</h1>
        {pizzaOptions.map((pizza) => {
          return <p key={pizza.name}>{pizza.name}</p>;
        })}
      </div>
      <div id={"selectedPizza"}>
        <button onClick={() => console.log(getRandomPizza())}>Get pizza</button>
        {selectedPizza ? (
          <div>
            <h3>Congratulations! You got {selectedPizza.name}!</h3>
            <h3>Description:</h3>
            <div>{selectedPizza.description}</div>
            <h3>Extra:</h3>
            <div>{selectedPizza.extra}</div>
          </div>
        ) : (
          <h3>
            You haven't gotten a pizza yet, click the button above to see what
            you get!
          </h3>
        )}
      </div>
    </div>
  );
}

export default App;
