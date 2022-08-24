import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
function handleCredentialResponse(response: any) {
  console.log("Encoded JWT ID token: " + response.credential);
}
function App() {
  useEffect(() => {
    google.accounts.id.initialize({
      client_id:
        "688749290501-dnfnff0toq3e5o9d26pcbt6jbth9r7mn.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", size: "large" } // customization attributes
    );
  }, []);
  return (
    <div className="">
      <div id="buttonDiv"></div>
    </div>
  );
}

export default App;
