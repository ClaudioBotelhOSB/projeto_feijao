import React from 'react';
import { Container} from 'react-bootstrap'
import { BrowserRouter as Router, Switch, Route, useHistory } from 'react-router-dom';
import PlantaCard from './features/Planta/PlantaCard/PlantaCard';
import './App.css';

function App() {
  const history = useHistory();

  return (
    <Container>
        <Router history={history}>
          <Switch>
            <Route path="/planta"></Route>
            <Route path="/edita_planta"></Route>
          </Switch>
        </Router>
          <PlantaCard />
    </Container>
  );
}

export default App;
