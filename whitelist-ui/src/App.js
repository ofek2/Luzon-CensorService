import React from 'react';
import './App.css';
import Header from './components/header/Header';
import IndexPage from './pages/indexPage/IndexPage';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import FilterWordsPage from './pages/filterWordsPage/FilterWordsPage';
import AddWordsPage from './pages/addWordsPage/AddWordsPage';

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Switch>
          <Route exact path="/">
            <IndexPage/>
          </Route>
          <Route path="/words">
            <FilterWordsPage/>
          </Route>
          <Route path="/words-inputes">
            <AddWordsPage/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
