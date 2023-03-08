import React, { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import db from "./db/db.json";
import { KnowTheCity } from "./views/KnowTheCity";

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={reactLogo} className="App-logo" alt="logo" />
        <h1>Türkiye İl Bulma Oyunu</h1>
      </header>
      <div className="container">
        <div>
          <KnowTheCity db={db} />
        </div>
      </div>
    </div>
  );
};

export default App;
