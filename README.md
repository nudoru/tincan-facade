# TinCanJS Facade

Just a simple wrapper and a few convenience functions for Rustici’s TinCanJS https://github.com/RusticiSoftware/TinCanJS

*Note* This module utilizes ES6 - use with Node 6+ or in the browser with Babel.

## Usage

```
const LRS = require('./src/tincanfacade.js');

function connect() {
    LRS.connect({
        end: 'https://lrs.adlnet.gov/xapi/',
        user: ‘userName’,
        pass: ‘password’
    }).then(() => console.log('Connected to the LRS'))
        .catch((err) => console.warn('Failed to connect to LRS', err));
}

function send(statement) {
    LRS.send(statement).then(() => console.log('Statement sent'))
        .catch((err) => console.warn('Failed to send', err));
}
```

## Functions

`connect(options)` Connect to an LRS. Returns a promise.

`send(statmentObj)` Send the statement to the connected LRS. Returns a promise.

`default(obj)` Default props to send with every statement. Examples include: context, instructor, actor, etc.

`getVerbsList()` Returns internal list of verbs from ADL.

`validateVerb(verb)` Returns true if the verb is in the list.

`getActivitiesList()` Returns internal list of activities from ADL.

`validateActivity(activity)` Returns true if the activity is in the list.

`createStatement(statementObj)` Creates a statement object from the passed statement object and any default values.