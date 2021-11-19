// import "./styles.css";
import React, { useEffect, useReducer } from "react";
import { Dialog, DialogOverlay, DialogContent } from "@reach/dialog";
import VisuallyHidden from "@reach/visually-hidden";
import "@reach/dialog/styles.css";

const apiUrl = "https://6157228e8f7ea600179850e4.mockapi.io/api/vehicles";

const initialState = {
  status: "idle",
  data: null,
  error: null,
};

// const reducer = (state, action) => {
//   switch(action.type) {

//   }
// }

const Cars = () => {
  const [{ status, data: carsData, error }, setState] = useReducer(
    (s, a) => ({ ...s, ...a }),
    initialState
  );
  const [showDialog, setShowDialog] = React.useState(false);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);
  const [selectedCar, setSelectedCar] = React.useState();
  const [priceFilterActive, setPriceFilterActive] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      console.log("hey");
      setState({ data: null, status: "pending", error: null });
      try {
        const response = await window.fetch(apiUrl);
        console.log(response);
        if (response.ok) {
          const carsData = await response.json();

          setState({ data: carsData, status: "resolved" });
        } else {
          setState({
            data: null,
            status: "rejected",
            error: "response not ok",
          });
        }
      } catch (error) {
        if (error instanceof Error) {
          setState({ data: null, status: "rejected", error: error.message });
        }
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (carsData) {
      console.log(priceFilterActive);

      const comparablePrice = (n) => parseInt(n.split(" ")[0], 10);

      carsData.map((n) => console.log(n.price));

      carsData.sort((a, b) => {
        return comparablePrice(a.price) - comparablePrice(b.price);
      });
      console.log("-----------------");
      carsData.map((n) => console.log(n.price));
    }
  }, [carsData, priceFilterActive]);

  if (status === "idle" || status === "pending") {
    return <div>loading...</div>;
  }

  if (status === "rejected") {
    return <div>{error}</div>;
  }

  const handleCarClick = (car) => {
    setSelectedCar(car);
    open();
  };

  const handleModalClose = () => {
    setSelectedCar();

    close();
  };

  const handlePriceCheckboxChange = () => {
    setPriceFilterActive((state) => !state);
  };

  if (status === "resolved") {
    return (
      <div>
        <Dialog
          aria-label="car additional details"
          isOpen={showDialog}
          onDismiss={handleModalClose}
        >
          <button className="close-button" onClick={handleModalClose}>
            <VisuallyHidden>Close</VisuallyHidden>
            <span aria-hidden>×</span>
          </button>
          <DialogContent>
            {selectedCar && (
              <article>
                <div>
                  {selectedCar.colors.map((n) => (
                    <div key={n}>{n}</div>
                  ))}
                </div>
                <div>{`${selectedCar.range.distance} ${selectedCar.range.unit}`}</div>
              </article>
            )}
          </DialogContent>
        </Dialog>

        <section>
          <div>
            <p>Sort by: </p>
            <input
              type="checkbox"
              id="price"
              onChange={handlePriceCheckboxChange}
            />
            <label htmlFor="price">price</label>
            <input type="checkbox" id="range" />
            <label htmlFor="range">range</label>
          </div>
        </section>

        <div>
          {carsData?.map((car) => {
            return (
              <article key={car.id} onClick={() => handleCarClick(car)}>
                <img src={car.photo} alt="car" />
                <div>{car.make}</div>
                <div>{car.model}</div>
                <div>{car.price}</div>
              </article>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};

export default Cars;
