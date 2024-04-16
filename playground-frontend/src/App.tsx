import "./App.css";
import { RouterContainer } from "./Components/RouterContainer";
import { Provider } from "react-redux";
import store from "./Redux/store";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <RouterContainer />
      </Provider>
    </div>
  );
}

export default App;
