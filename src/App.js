import "./App.css";
import React, { Component } from "react";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/logo/Logo";
import Rank from "./components/rank/Rank";
import ImageLinkForm from "./components/ImageLink/ImageLinkForm";
import Particles from "react-particles-js";
import Clarifai from "clarifai";
import FaceRecegnition from "./components/faceRecognition/FaceRecognition";
import SignIn from "./components/GetIn/SignIn";
import Register from './components/Register/Register';

const app = new Clarifai.App({ apiKey: "902e1ab97c634defb8001dc67eb9d5ba" });

const particlesOption = {
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        value_area: 500,
      },
    },
  },
};
class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      box: {},
      route: "SignIn",
      SignedIn:false,
    };
  }
  calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * image.width,
      topRow: clarifaiFace.top_row * image.height,
      rightCol: width - clarifaiFace.right_col * image.width,
      bottomRow: height - clarifaiFace.bottom_row * image.height,
    };
  };
  displayFaceBox = (box) => {
    console.log(box);
    this.setState({ box: box });
  };
  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };
  onRouteChange = (route) => {
    if(route ==="SignOut"){
      this.setState({SignedIn:false})
    }
    else if(route==="home"){
      this.setState({SignedIn:true})
    }
    {
      this.setState({route:route})
    }
  };
  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then((response) =>
        this.displayFaceBox(this.calculateFaceLocation(response))
      )
      .catch((err) => console.log(err));
  };
  render() {
    const {SignedIn,imageUrl,route,box}=this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particlesOption} />
        <Navigation SignedIn={SignedIn} onRouteChange={this.onRouteChange} />
        {route === "home" 
        ? 
          <div>
            <Logo />
            <Rank />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecegnition
              box={box}
              imageUrl={imageUrl}
            />
          </div>
          :(
            route==="SignIn"
            ?<SignIn onRouteChange={this.onRouteChange} />
            :<Register onRouteChange={this.onRouteChange}/>
        )}
      </div>
    );
  }
}
export default App;
