import { Outlet } from "react-router-dom";
import "./css/custom.css";
import "leaflet/dist/leaflet.css";

function App() {
  return (
    <>
      <Outlet />
    </>
  );
}

export default App;
