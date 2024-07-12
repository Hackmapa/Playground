import "./App.css";
import { RouterContainer } from "./Components/RouterContainer";
import { Provider } from "react-redux";
import { store } from "./Redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./Redux/store";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RouterContainer />
        </PersistGate>
      </Provider>
    </div>
  );
}

export default App;
