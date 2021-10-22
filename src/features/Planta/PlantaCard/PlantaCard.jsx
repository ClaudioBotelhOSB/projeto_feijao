import React from "react"
import { Card, ListGroupItem, ListGroup } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import hipoeste from '../../../assets/images/hipoeste.jpg'
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

const mqtt = require('mqtt')
const host = 'broker.emqx.io'
const port = '8083'
const clientId = `5C-CD-5B-80-3C-66`
const connectUrl = `ws://${host}:${port}/mqtt`
const topic = 'projfeij_ESP32_recinfo'
const msg = 'ativar'
var status = "Não conectada"

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: false,
  resubscribe: true,
  receiveMaximum: 1,
  maximumPacketSize: 1
})

client.subscribe('projfeij_ESP32_pubinfo_l')
client.subscribe('projfeij_ESP32_pubinfo_t')
client.subscribe('projfeij_ESP32_pubinfo_u')
client.subscribe('projfeij_ESP32_recinfo')

export default function PlantaCard(props) {

  const [luminosidade, setLuminosidade] = React.useState([]);
  const [temperatura, setTemperatura] = React.useState([]);
  const [umidade, setUmidade] = React.useState([]);
  
  function Conectar (){
    client.on('error', (err) => {
      console.log('Connection error: ', err)
    })
  }

  client.on('connect', (err) => {
    status='Conectado';
  })

  function Regar(){
    client.publish(topic, msg, { qos: 0, retain: true }, (error) => {
      console.log("Regando planta");
      if (error) {
        console.error(error)
      }
    })
  }
    
  client.on('message', (topic, payload, packet) => {
    switch (topic) {
      case 'projfeij_ESP32_pubinfo_l':
        setLuminosidade(payload.toString());
        console.log("luminosidade:" + luminosidade);
        break;
      case 'projfeij_ESP32_pubinfo_t':
        setTemperatura(payload.toString());
        console.log("temperatura:" + temperatura);
        break;
      case 'projfeij_ESP32_pubinfo_u':
        setUmidade(payload.toString());
        console.log("umidade:" + umidade);
        break;
      default:
    }
  });
  
  return (
  <Card style={{ width: '18rem' }}>
    <div className="card-Planta">
      <Card.Img variant="top" src={hipoeste} />
      <Card.Body>
        <Card.Title className="text-center">Hipoeste</Card.Title>
        <Card.Subtitle className="mb-2 text-center">Quintal</Card.Subtitle> 
        <Card.Header className="text-center">Informações da planta</Card.Header>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroupItem>
          <div className="luminosidade-Planta">
            {'Luminosidade: ' + luminosidade + '%'}
          </div>
        </ListGroupItem>
        <ListGroupItem>
          <div className="umidade-Planta">
            {'Umidade: ' + umidade+ '%'}
          </div>
        </ListGroupItem>
        <ListGroupItem >
          <div className="temperatura-Planta">
            {'Temperatura: ' + temperatura + '°C'}
          </div>
        </ListGroupItem>
      </ListGroup>
      <Card.Text className="my-2 mx-2 text-center">
        <ButtonGroup disableElevation variant="contained">
          <Button onClick={Conectar}>Conectar</Button>
          <Button onClick={Regar}>Regar</Button>
        </ButtonGroup>
      </Card.Text>
      <Card.Footer className="text-center">Status: {status}</Card.Footer>
    </div>
  </Card>
  );
}