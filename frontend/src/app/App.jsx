import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import Routers from "../routes/Routers";
import { store } from "./store";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routers />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
