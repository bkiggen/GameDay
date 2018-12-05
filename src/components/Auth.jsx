import React from 'react';
import config from './../../.env';
import firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
// import * as gapi from './../../api';
import CreateCalendarEntry from './CreateCalendarEntry';

class Auth extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      calendarInfo: null,
      loggedIn: false,
      currentUser: null
    };
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
      console.log('onAuthStateChanged method fired.');
      console.log(user);
      if (user) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = e => {
          gapi.load('client', {
            callback: () => {
              gapi.client.init({
                apiKey: config.apiKey,
                clientId: config.clientId,
                discoveryDocs: config.discoveryDocs,
                scope: config.scopes.join(' ')
              })
                .then(() => {
                  if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
                    startApp(user);
                    this.setState({
                      loggedIn: true
                    });
                  } else {
                    firebase.auth().signOut();
                  }
                });
            }
          });
        };
        document.getElementsByTagName('head')[0].appendChild(script);
      }
    });

    const startApp = (user) => {
      this.setState({
        currentUser: user
      });
      console.log(this.state.currentUser);
      firebase.auth().currentUser.getIdToken()
        .then(() => {
          return gapi.client.calendar.events.list({
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            showDeleted: false,
            singleEvents: true,
            maxResults: 40,
            orderBy: 'startTime'
          });
        })
        .then(response => {
          this.setState({
            calendarInfo: response.result.items
          });
        });
    };

  }

  render() {
    let firstCalendarEntry;
    let renderNewCalendarEntryComponent;
    if (!this.state.calendarInfo) {
      firstCalendarEntry = [{
        summary: 'Getting calendar info...',
        id: 0
      }];
    } else {
      firstCalendarEntry = this.state.calendarInfo;
    }
    if (this.state.loggedIn) {
      // renderNewCalendarEntryComponent = <CreateCalendarEntry
      //   user={this.state.currentUser} />;
    } else {
      renderNewCalendarEntryComponent = 'Log in to create a new calendar entry';
    }

    return (
      <div>
        <h1>Firebase Auth Quickstart</h1>
        <div id="firebaseui-auth-container"></div>
        <div id="calendar-info">
          <ul>
            {firstCalendarEntry.map((key) => {
              return <li key={key.id}>{key.summary}</li>;
            })}
          </ul>
        </div>
        <div>{renderNewCalendarEntryComponent}</div>
      </div>
    );
  }
}

export default Auth;
