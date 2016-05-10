/**
 * Simple facade around the TinCan class to make sending statements easier
 *
 * Full doc https://github.com/adlnet/xAPI-Spec/blob/master/xAPI.md#result
 * TinCan Module docs http://rusticisoftware.github.io/TinCanJS/
 * Statements https://tincanapi.com/statements-101/
 * Statment generator https://tincanapi.com/statement-generator/
 */

import TinCan from 'tincanjs';
import VerbDictionary from './ADL-Verbs';
import ActivityDictionary from './ADL-Activity';
import {defaults, assign} from 'lodash';

let LRS,
    defaultProps    = {},
    verbURLPrefix   = 'http://adlnet.gov/expapi/verbs/',
    activityURLPrefix = 'http://adlnet.gov/expapi/activities/',
    defaultLanguage = 'en-US';

export default {

  // Connect to the LRS
  connect(initObject) {
    let {end, user, pass} = initObject;
    return new Promise(function (resolve, reject) {
      try {
        LRS = new TinCan.LRS({
          endpoint : end,
          username : user,
          password : pass,
          allowFail: false
        });
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  },

  // Set defaults to be applied to each statement such as actor or authority
  default(defaultObj) {
    defaultProps = assign({}, defaultObj);
  },

  // Returns array of verbs from the ADL list
  getVerbsList() {
    // return Object.keys(VerbDictionary).map((key) => VerbDictionary[key].display[defaultLanguage]);
    return this.getDictionaryWordsList(VerbDictionary);
  },

  // True if the verb is on the ADL list
  validateVerb(verb) {
    return this.getVerbsList().indexOf(verb.toLowerCase()) >= 0;
  },

  // Returns array of activity from the ADL list
  getActivitiesList() {
    return this.getDictionaryWordsList(ActivityDictionary);
  },

  // True if the activity is on the ADL list
  validateActivity(activity) {
    return this.getActivitiesList().indexOf(activity.toLowerCase()) >= 0;
  },

  getDictionaryWordsList(dictionary) {
    return Object.keys(dictionary).map((key) => dictionary[key].display[defaultLanguage]);
  },

  // Create an xAPI statement object
  createStatement(statementData) {
    let statement,
        {subjectName, subjectID, verbDisplay, objectID, objectType, objectName} = statementData;

    if (!this.validateVerb(verbDisplay)) {
      console.warn('LRS verb is not in the dictionary', verbDisplay);
    }

    statement = defaults({
      actor : {
        name: subjectName,
        mbox: 'mailto:' + subjectID
      },
      verb  : {
        id     : verbURLPrefix + verbDisplay.toLowerCase(),
        display: {'en-US': verbDisplay.toLowerCase()}
      },
      object: {
        id        : objectID,
        definition: {
          type      : objectType ? activityURLPrefix + objectType : null,
          name: {'en-US': objectName}
        }
      }
    }, defaultProps);
    return new TinCan.Statement(statement);
  },

  // Create and send an xAPI statement
  send(statementData) {
    let statement = this.createStatement(statementData);
    console.log(statement);

    return new Promise(function (resolve, reject) {

      if (!LRS) {
        reject({message: 'LRS not connected! Cannot send statement: ' + statement});
        return;
      }

      LRS.saveStatement(statement, {
        callback: (err, xhr) => {
          if (err !== null) {
            if (xhr !== null) {
              reject({status: xhr.status, message: xhr.responseText});
              return;
            }
            reject({message: err});
            return;
          }
          resolve();
        }
      });
    });
  }

}