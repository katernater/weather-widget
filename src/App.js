import React, { Component } from 'react';
import './App.css';

//I used React's own get started guide to set up the initial app, with the create-react-app method.
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      deg: "",
      wind: "",
      city: "",
      img:"",
      created: false
    };

  // I used a variety of stackoverflow answers to get a better understanding of how binding works in a React Framework.
    this.handleClick = this.handleClick.bind(this);
    this.showPosition = this.showPosition.bind(this);
  }


//returns title imput by user
  getTitle() {
    return document.getElementById("widget-title").value;
  }

//returns temperature based on which radio was selected by the user
  getDeg(temp){
    if (document.getElementById("cel").checked) {
      return Math.round(temp - 273.15);
    } else if (document.getElementById('fah').checked) {
      return Math.round((temp - 273.15) * (9 / 5) + 32);
    } else {
      return "Please Check Metric or Imperial";
    }
  }

//returns image based on data received from api.
  getImg(condition){
    if (condition === "Clear" || condition === "Rain" ||condition === "Clouds") {
      return "images/" + condition + ".png";
    } else {
      //only put three weather cases, but capture all other weather cases in here : ie Drizzle, Thunderstorm etc.
      return "images/over.png";
    }
  }

//gets wind + direction based on data received from API. Only includes if user selected 'ON' radio.
  getWind(wind, direction) {
      if (document.getElementById("windTrue").checked) {
        return "Wind " + direction + Math.round(wind) + "km/h";
      } else if (document.getElementById("windFalse").checked) {
        return "";
      } else {
        return "No Wind Choice Made";
      }
    }

//converts wind direction from degree to rough compass direction.
  getDir(dir) {
      if (dir >= 338 || dir < 23) {
        return "N";
      } else if (dir >= 23 || dir < 68) {
        return "NE";
      } else if (dir >= 68 || dir < 113) {
        return "E";
      } else if (dir >= 113 || dir < 158) {
        return "SE";
      } else if (dir >= 158 || dir < 203) {
        return "S";
      } else if (dir >= 203 || dir < 248) {
        return "SW";
      } else if (dir >= 248 || dir < 293) {
        return "W";
      } else if (dir >= 293 || dir < 338) {
        return "NW";
      }
    }

//accesses API and changes the app state based on user options and data received.
    showPosition(position){
        let latitude = position.coords.latitude.toFixed(2);
        const longitude = position.coords.longitude.toFixed(2);

        //to access the API, input your own API key. I accessed my API key using a dotenv file.
        const URL = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&appid=" + process.env.REACT_APP_WEATHER_API_KEY;
        
        //used https://www.robinwieruch.de/react-fetching-data as a resource to better understand how fetch works with changing states.
        fetch(URL)
          .then((resp) => resp.json())
          .then(data => this.setState({
            title: this.getTitle(),
            deg: this.getDeg(data.main.temp) + "°",
            wind: this.getWind(data.wind.speed*3.6, this.getDir(data.wind.deg)),
            city: data.name,
            img: this.getImg(data.weather[0].main),
            created: true
          })).catch(function(err) {
            console.log(err);
          })
      }

//I assumed that to activate/create a widget, the user would click a button once they had made their selections.
//The button click activates the click handler.
  handleClick() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition);
    } else {
      console.log("Geolocation is not supported");
    }
  }

  render() {
    return (
      //html in JSX format.
      <div>
        <div className="container">
          <div className="row">
            <div className="col-sm mx-5">
              <h4>Title</h4>
              <div className="form-group">
                <input type="text" className="form-control" name="widget-title" id="widget-title" placeholder="Title of widget"></input>
              </div>
              <h4>Temperature</h4>
                <div className="custom-control custom-radio custom-control-inline">
                  <input className="custom-control-input" type="radio" name="temperature" id="cel" value="celcius" />
                  <label className="custom-control-label" htmlFor="cel">°C</label>
                </div>
              <div className="custom-control custom-radio custom-control-inline">
                <input className="custom-control-input" type="radio" name="temperature" id="fah" value="fahrenheit" />
                <label className="custom-control-label" htmlFor="fah">°F</label>
              </div>

              <h4>Wind</h4>
              <div className="custom-control custom-radio custom-control-inline">
                <input className="custom-control-input" type="radio" name="wind" id="windTrue" value="true" />
                <label className="custom-control-label" htmlFor="windTrue">On</label>
              </div>
              <div className="custom-control custom-radio custom-control-inline">
                <input className="custom-control-input" type="radio" name="wind" id="windFalse" value="false" />
                <label className="custom-control-label" htmlFor="windFalse">Off</label>
              </div>

              <h5>Make Widget</h5>
              <button onClick={() => this.handleClick()}> Go! </button>
            </div>


            <div className="col-sm">
              <div id="widget" className = {this.state.created ? 'shadow p-3 mb-5 bg-white rounded' : null}>
              <h4 id="title"> {this.state.title} </h4>
              <div className = "image-block">
                <img id="image" src={this.state.img} />
                  <div className = "image-text">
                    <p id="city">{this.state.city}</p>
                    <h2 id="temperature"> {this.state.deg}</h2>
                    <p id="wind">{this.state.dir} {this.state.wind}  </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

    );
  }
}


export default App;
