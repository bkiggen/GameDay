import React from 'react';
import ReactDOM from 'react-dom';
import { GoogleLogin } from 'react-google-login';
import Header from './Header';

const responseGoogle = (response) => {
  console.log(response);
}

function App(){
  return (
    <div>
      <Header />
      <GoogleLogin
        clientId='597257145003-60l0ccbjfklfh733beauplt9lblduv99.apps.googleusercontent.com'
        buttonText="Log In"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
      />
    </div>
  );
}

export default App;
