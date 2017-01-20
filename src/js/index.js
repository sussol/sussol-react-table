import React from 'react';
import { render } from 'react-dom';
import { App } from './App.jsx'
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap, won't be required once official React version released.
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

render(<App />, document.getElementById('root'));
