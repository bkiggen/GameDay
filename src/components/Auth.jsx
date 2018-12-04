import React from 'react';
import config from './../../.env';
import firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';

class Auth extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      calendarInfo: null
    }
  }

  componentDidMount() {
    const uiConfig = {
      signInSuccessUrl: '/',
      signInOptions: [
        {
          provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          scopes: config.scopes
        }
      ],
      tosUrl: 'https://www.google.com'
    };

    firebase.initializeApp(config);

    const ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', uiConfig);

    firebase.auth().onAuthStateChanged(user => {
      console.log("onAuthStateChanged fired. user:", user);
      if (user) {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://apis.google.com/js/api.js";
        console.log("gapi.client: ", script.src);
        script.onload = function(e) {
          gapi.load('client', {
            callback: function() {
              gapi.client.init({
                apiKey: config.apiKey,
                clientId: config.clientId,
                discoveryDocs: config.discoveryDocs,
                scope: config.scopes.join(" ")
              })
              .then(() => {
                if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
                  startApp(user);
                } else {
                  firebase.auth().signOut();
                }
              });
            }
          })
        };
        document.getElementsByTagName("head")[0].appendChild(script);
      }
    });

    const startApp = (user) => {
      console.log("startApp fired");
      console.log(firebase.auth().currentUser);
      firebase.auth().currentUser.getIdToken()
      .then(() => {
        return gapi.client.calendar.events.list({
          calendarId: "primary",
          timeMin: new Date().toISOString(),
          showDeleted: false,
          singleEvents: true,
          maxResults: 40,
          orderBy: "startTime"
        })
      })
      .then(response => {
        console.log("firebase.auth().currentUser.getToken promise fulfilled. response: ", response);
        this.setState({
          calendarInfo: response.result.items
        });
      });
    }

  }

  render() {
    console.log(this.state.calendarInfo);
    let firstCalendarEntry;
    if (!this.state.calendarInfo) {
      console.log('if...');
      firstCalendarEntry = "Getting Calendar Info...";
    } else {
      console.log('else...');
      firstCalendarEntry = this.state.calendarInfo[0].summary;
    }
    return (
      <div key={this.state.calendarInfo}>
        <h1>Firebase Auth Quickstart</h1>
        <div id="firebaseui-auth-container"></div>
        <div id="calendar-info">
          <ul>
            <li>{firstCalendarEntry}</li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Auth;
