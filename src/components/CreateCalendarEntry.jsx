import React from 'react';
import config from './../../.env';
import firebase from 'firebase/app';
import firebaseui from 'firebaseui';

class CreateCalendarEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      summary: '',
      location: '',
      description: '',
      year: '',
      month: '',
      day: ''
    };
    this.handleFormChange = this.handleFormChange.bind(this);
    this.submitNewEvent = this.submitNewEvent.bind(this);
  }

  componentDidUpdate() {
    console.log(this.props);
  }

  handleFormChange(attribute, e) {
    this.setState({
      [attribute]: e.target.value
    });
    console.log(this.state);
  }

  submitNewEvent() {
    console.log('Submitting new event.');
    // firebase.auth().currentUser.getIdToken()
    //   .then(() => {
    //     gapi.client.calendar
    //   });
  }

  // const startApp = (user) => {
  //   this.setState({
  //     currentUser: user
  //   });
  //   console.log(this.state.currentUser);
  //   firebase.auth().currentUser.getIdToken()
  //     .then(() => {
  //       return gapi.client.calendar.events.list({
  //         calendarId: 'primary',
  //         timeMin: new Date().toISOString(),
  //         showDeleted: false,
  //         singleEvents: true,
  //         maxResults: 40,
  //         orderBy: 'startTime'
  //       });
  //     })
  //     .then(response => {
  //       this.setState({
  //         calendarInfo: response.result.items
  //       });
  //     });
  // };

  render() {
    return (
      <div>
        <form>
          <label>Summary: </label><input type='text' label='summary' defaultValue={this.state.summary} onChange={e => {this.handleFormChange('summary', e)}} />
          <label>Location: </label><input type='text' label='location' defaultValue={this.state.location} onChange={e => {this.handleFormChange('location', e)}} />
          <label>Description: </label><input type='text' label='description' defaultValue={this.state.description} onChange={e => {this.handleFormChange('description', e)}} />
          <label>Day: </label><input type='text' label='day' defaultValue={this.state.day} onChange={e => {this.handleFormChange('day', e)}} />
          <label>Month (0-11): </label><input type='text' label='month' defaultValue={this.state.month} onChange={e => {this.handleFormChange('month', e)}} />
          <label>Year: </label><input type='text' label='year' defaultValue={this.state.year} onChange={e => {this.handleFormChange('year', e)}} />
          <button type="button" onClick={this.submitNewEvent}>Submit</button>
        </form>
      </div>
    );
  }
}

export default CreateCalendarEntry;
