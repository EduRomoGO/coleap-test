/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Card, CardBody } from "reactstrap";
import styled from "@emotion/styled";

import React, { useReducer } from "react";
import { Dialog, DialogContent } from "@reach/dialog";
import VisuallyHidden from "@reach/visually-hidden";
import "@reach/dialog/styles.css";

const apiUrl = "https://6157228e8f7ea600179850e4.mockapi.io/api/vehicles";

const initialState = {
  status: "idle",
  data: null,
  error: null,
};

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
  const [rangeFilterActive, setRangeFilterActive] = React.useState(false);

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

  const sortByPrice = (carsData) => {
    const comparablePrice = (n) => parseInt(n.split(" ")[0], 10);

    carsData.map((n) => console.log(n.price));

    let newCarsData = [...carsData];
    newCarsData.sort((a, b) => {
      return comparablePrice(a.price) - comparablePrice(b.price);
    });
    console.log("-----------------");
    carsData.map((n) => console.log(n.price));

    return newCarsData;
  };

  const sortByRange = (carsData) => {
    const comparablePrice = (n) => parseInt(n.split(" ")[0], 10);

    carsData.map((n) => console.log(n.price));

    let newCarsData = [...carsData];
    newCarsData.sort((a, b) => {
      return comparablePrice(a.price) - comparablePrice(b.price);
    });
    console.log("-----------------");
    carsData.map((n) => console.log(n.price));

    return newCarsData;
  };

  const getCarsData = () => {
    let sortedCars = [...carsData];

    if (priceFilterActive) {
      sortedCars = sortByPrice(sortedCars);
    }

    if (rangeFilterActive) {
      sortedCars = sortByRange(sortedCars);
    }

    return sortedCars;
  };

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
  const handleRangeCheckboxChange = () => {
    setRangeFilterActive((state) => !state);
  };

  const Value = styled.p`
    font-weight: bold;
    margin-left: 8px;
  `;

  if (status === "resolved") {
    return (
      <div
        css={css`
          padding: 20px;
        `}
      >
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

        <div>
          <h1
            css={css`
              text-align: center;
            `}
          >
            Awesome Cars
          </h1>
          <section>
            <div>
              <p>Sort by: </p>
              <input
                type="checkbox"
                id="price"
                onChange={handlePriceCheckboxChange}
              />
              <label htmlFor="price">price</label>
              <input
                type="checkbox"
                id="range"
                onChange={handleRangeCheckboxChange}
              />
              <label htmlFor="range">range</label>
            </div>
          </section>

          <section>
            {getCarsData()?.map((car) => {
              return (
                <div>
                  {" "}
                  <Card
                    css={css`
                      border: 1px solid hsl(0deg 4% 77%);
                      border-radius: 3px;
                      margin-bottom: 20px;
                    `}
                  >
                    <CardBody>
                      <article
                        css={css`
                          display: flex;
                          justify-content: space-around;
                        `}
                        key={car.id}
                        onClick={() => handleCarClick(car)}
                      >
                        <img
                          css={css`
                            width: 200px;
                            object-fit: contain;
                          `}
                          src={car.photo}
                          alt="car"
                        />
                        <div
                          css={css`
                            display: flex;
                            flex-direction: column;
                          `}
                        >
                          <div>
                            <p>Make</p>
                            <Value>{car.make}</Value>
                          </div>
                          <div>
                            <p>Model</p>
                            <Value>{car.model}</Value>
                          </div>
                          <div>
                            <p>Price</p>
                            <Value>{car.price}</Value>
                          </div>
                        </div>
                      </article>
                    </CardBody>
                  </Card>
                </div>
              );
            })}
          </section>
        </div>
      </div>
    );
  }

  return null;
};

export default Cars;
