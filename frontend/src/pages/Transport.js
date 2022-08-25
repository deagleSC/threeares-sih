import {
  AppBar,
  Checkbox,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Toolbar,
  Typography,
  Modal
} from "@mui/material";
import {
  TextField,
  Button,
  FormControlLabel,
  RadioGroup,
  FormLabel,
  FormControl,
  Radio,
  CssBaseline,
} from "@mui/material";
import { Box } from "@mui/material";
import MUIDataTable from "mui-datatables";
import './transport.css'
import axios from 'axios'
import PieChart from "../components/PieChart";
import LocModal from './LocModal'
import React, { useEffect, useState } from "react";
import { useTheme } from '@mui/material/styles';

import useMediaQuery from '@mui/material/useMediaQuery';
import "./Material.css";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import SplitSection from "../components/SplitSection";
import haversine from "haversine";
import materialDetails from "../data/material_estimator";

import MapPicker from 'react-google-map-picker';

const DefaultLocation = { lat: 22.7196, lng: 75.8577 };
const DefaultZoom = 10;

const Material = () => {
  const [origin, setOrigin] = useState('')
  const [dest, setDest] = useState('')
  const [mass, setMass] = useState('')
  const [value, setValue] = React.useState('ROAD');
  const [dist, setDist] = useState(0)
  const [data, setData] = useState([])
  const [O, setO] = useState({
    latitude: 0, longitude: 0
  })
  const [D, setD] = useState({
    latitude: 0, longitude: 0
  })
  const [st, setSt] = useState(null)
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  var emissions_rate = 0
  const columns = ["Origin", "Destination", "Mass", "Means", "Distance", "Emission"];
  const options = {
    selectableRows: false
  };


  const [defaultLocation, setDefaultLocation] = useState(DefaultLocation);
  const [location, setLocation] = useState({
    lat: '',
    lng: '',
  });
  const [zoom, setZoom] = useState(DefaultZoom);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    height: '400px',
    width: '500px',
    maxWidth: '80vw',
    bgcolor: 'background.paper',
    borderRadius: '20px',
    boxShadow: 24,
    p: 4,

  };


  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  const handleChange = (event) => {


    setValue(event.target.value);
  };
  const addNew = (d) => {
    // console.log(res)
    setData(previous => [
      ...previous, [
        origin,
        dest,
        mass,
        value,
        d,
        d * mass * emissions_rate,

      ]
    ])
  };

  const calculate = async () => {
    setDist(null)
    // const request = {
    //   method: "GET",

    //   headers: {
    //     'no-cors': true,
    //     'Access-Control-Allow-Origin': '*',
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    // };
    if (value === 'ROAD')
      emissions_rate = 1.65
    else if (value === 'RAIL')
      emissions_rate = .0157
    else if (value === 'AIR')
      emissions_rate = 1.404

    // await axios.get(`https://distanceto.herokuapp.com/distance?pin1=${origin}&pin2=${dest}`).then((response) => {
    //   // setDist(parseInt(response.data))
    //   // 
    //   // console.log('axios', response.data)
    //   // setRes((parseInt(response.data) * emissions_rate * mass))
    //   addNew((response.data))
    // })

    // console.log(O, D)
    addNew(haversine(O, D))
  }

  //  function handleChangeLocation (lat, lng, state){
  //   if (state === "origin")
  //   setOrigin({lat:lat, lng:lng})

  //   else
  //   setDest({lat:lat, lng:lng})
  // }

  // function handleChangeZoom (newZoom){
  //   setZoom(newZoom);
  // }

  function handleResetLocation() {
    setDefaultLocation({ ...DefaultLocation });
    setZoom(DefaultZoom);
  }

  return (
    <>
      <LocModal
        open={open}
        setOpen={setOpen}
        st={st}
        // lat={lat}
        // lng={lng}
        setO={setO}
        setD={setD}

      />
      <div className="appbar">
        <CssBaseline />
        <ResponsiveAppBar />
      </div>
      <div className="main-container">
        <SplitSection
          heading="Transportation GHG Estimator"
          description="The ThreeAres Material Estimator allows the user to generate emission reports that estimate the carbon dioxide emissions associated with materials used in highway constructions projects. Materials are classified according to MDOT's Standard Specifications for Construction's Division 9  material classifications. The tool estimates cradle to gate emissions and can be used to differentiate impacts of using composite materials that make up the roadway."
          image="https://cdni.iconscout.com/illustration/premium/thumb/calculating-5329901-4481228.png"
          routepath=""
          height="90vh"
          border="30px solid white"
        />
        <div className="main-content"
          style={{
            margin: "20px",
            border: "1px solid #008000"
          }}
        >
          <Paper elevation={0}
          >
            <Box
              display="flex"
              flexDirection={matches ? 'row' : 'column'}
              justifyContent="center"
              alignItems="center"
            // minHeight="100vh"
            >
              <Grid
                container
                className="form-grid"
                xs={12}
                lg={6}
                direction={"column"}
                spacing={5}
                justifyContent="center"
              >

                <Grid item xs={12}>
                  {/* <Button
                  id="calculate-btn"
                  style={{
                    fontFamily: "montserrat",
                    width: "250px",
                    marginLeft: "0px",
                    marginTop: "20px",
                    marginBottom: "20px",
                    background: "white",
                    color: "#008000",
                    boxShadow: "none",
                    border: "1px solid #008000",
                    borderRadius: "0px",
                    transition: "0.4s ease",
                  }}
                  onClick={handleOpen}>Choose Origin</Button> */}
                  <TextField
                    className="textfield"
                    style={{
                      width: "100%",
                      paddingBottom: '10px'
                    }}
                    size="normal"
                    required
                    id="outlined-basic"
                    // disabled={true}
                    label="Origin" variant="outlined" value={O.latitude + " " + O.longitude}
                    onClick={() => {
                      setSt('O')
                      handleOpen()
                    }}
                  // onChange={(e) => {
                  //   setOrigin(e.target.value)
                  // }}
                  />
                  <TextField
                    className="textfield"
                    style={{
                      width: "100%",
                      paddingBottom: '10px'
                    }}
                    size="normal"
                    required
                    id="outlined-basic"
                    label="Destination" variant="outlined" value={D.latitude + " " + D.longitude} onClick={() => {
                      setSt('D')
                      handleOpen()
                    }} />
                  <TextField
                    className="textfield"
                    style={{
                      width: "100%",
                      paddingBottom: '10px'
                    }}
                    size="normal"
                    required
                    id="outlined-basic"
                    label="Cargo Mass" variant="outlined" value={mass} onChange={(e) => {
                      setMass(e.target.value)
                    }}
                  />
                  <FormControl style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center"

                  }}>
                    <FormLabel id="demo-radio-buttons-group-label">Means &nbsp; &nbsp;</FormLabel>
                    <RadioGroup
                      style={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                      aria-labelledby="demo-radio-buttons-group-label"
                      // defaultValue="female"
                      value={value}
                      onChange={handleChange}
                      sx={{
                        maxWidth: "60vw",
                        overflow: "hidden"
                      }}
                    >
                      <FormControlLabel value="RAIL" control={<Radio />} label="Rail" />
                      <FormControlLabel value="ROAD" control={<Radio />} label="Road" />
                      <FormControlLabel value="AIR" control={<Radio />} label="Air" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  textAlign: "center",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  id="calculate-btn"
                  style={{
                    fontFamily: "montserrat",
                    width: "250px",
                    marginLeft: "0px",
                    marginTop: "20px",
                    marginBottom: "20px",
                    background: "white",
                    color: "#008000",
                    boxShadow: "none",
                    border: "1px solid #008000",
                    borderRadius: "0px",
                    transition: "0.4s ease",
                  }}
                  onClick={calculate}>ADD New Emission</Button>

                {/* <Button
                  id="calculate-btn"
                  style={{
                    fontFamily: "montserrat",
                    width: "250px",
                    marginLeft: "0px",
                    marginTop: "20px",
                    marginBottom: "20px",
                    background: "white",
                    color: "#008000",
                    boxShadow: "none",
                    border: "1px solid #008000",
                    borderRadius: "0px",
                    transition: "0.4s ease",
                  }}
                  onClick={calculate}
                >
                  Calculate
                </Button> */}
              </div>


              {/* test */}
              {/* <Grid
                container
                className="form-grid"
                xs={12}
                lg={6}
                direction={"column"}
                spacing={5}
                justifyContent="center"

              >
                <Grid item xs={12}

                >
                  <TextField
                    className="textfield"
                    style={{
                      margin: "20px",
                      width: "300px",
                    }}

                    id="outlined-basic"
                    label="Emissions"
                    variant="outlined"
                    value={emission}
                  />
                </Grid>
              </Grid> */}
            </Box>
          </Paper>

          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              background: "white",
            }}
          >

          </div>
        </div>
      </div>

      <div style={{
        margin: "20px"
      }}>
        <div style={{
          border: "1px solid #008000"
        }}>

          <MUIDataTable

            title={"Transport Emission List"}
            data={data}
            columns={columns}
            options={options}

            style={{
              fontFamily: "Montserrat !important",
              marginTop: "10px"
            }}
          />

        </div>
      </div>

      <div className="whitespace" style={{
        height: "20px"
      }}></div>

      {/* {chartDataEmission.length > 0 && (
        <>
          <div style={{
            margin: "20px",
          }}>
            <div style={{
              // background: "blue",
              padding: "10px",
              border: "1px solid #008000",
            }}>
              <PieChart
                data={chartDataEmission}
                label="Emission Rate PieChart"
              />
            </div>
          </div>

          <div className="whitespace" style={{
            height: "20px"
          }}></div>
        </>

      )} */}

      {/* <iframe src="https://maps.google.com/maps?&hl=en&q=dermatologist&t=&z=13&ie=UTF8"></iframe> */}

      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      {/* <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        
          
            <MapPicker id="modal-modal-description" defaultLocation={defaultLocation}
            zoom={zoom}
            mapTypeId="roadmap"
            style={style}
            onChangeLocation={() => {
              
              handleChangeLocation()
            }} 
            onChangeZoom={handleChangeZoom}
            apiKey=''/>

      </Modal> */}


      <div>
        {/* <button onClick={handleResetLocation}>Reset Location</button>
    <label>Latitute:</label><input type='text' value={location.lat} disabled/>
    <label>Longitute:</label><input type='text' value={location.lng} disabled/>
    <label>Zoom:</label><input type='text' value={zoom} disabled/> */}


      </div>
    </>
  );
};

export default Material;
