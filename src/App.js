import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import SDLNavbar from "./Components/Navbar";
import DataTable from "./Components/DataTable";
import Body from "./Components/Body";


function App() {
  return (
      <div className="App">
        <SDLNavbar />
        <Body />
      </div>
  );
}

export default App;
