const React = require("react");
const { createRoot } = require("react-dom/client");

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <h1>SETUP</h1>;
  }
}
if (typeof document !== "undefined") {
  const root = createRoot(document.getElementById("root"));
  root.render(<App />);
}
export default App;
