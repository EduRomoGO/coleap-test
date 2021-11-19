// import "./styles.css";
import React, { useReducer } from "react";
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

  // const [showDialog, setShowDialog] = React.useState(false);
  // const open = () => setShowDialog(true);
  // const close = () => setShowDialog(false);

  // return (
  //   <div>
  //     <button onClick={open}>Open Dialog</button>

  //   </div>
  // );

  if (status === "idle" || status === "pending") {
    return <div>loading...</div>;
  }

  if (status === "rejected") {
    return <div>{error}</div>;
  }

  if (status === "resolved") {
    return (
      <div>
        <Dialog isOpen={showDialog} onDismiss={close}>
          <button className="close-button" onClick={close}>
            <VisuallyHidden>Close</VisuallyHidden>
            <span aria-hidden>×</span>
          </button>
          <p>Hello there. I am a dialog</p>
        </Dialog>

        <div>
          {carsData?.map((car) => {
            return (
              <article key={car.id} onClick={open}>
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
