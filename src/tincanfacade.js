/**
 * Simple facade around the TinCan class to make sending statements easier
 *
 * Full doc https://github.com/adlnet/xAPI-Spec/blob/master/xAPI.md#result
 * TinCan Module docs http://rusticisoftware.github.io/TinCanJS/
 * Statements https://tincanapi.com/statements-101/
 * Statment generator https://tincanapi.com/statement-generator/
 */

const TinCan = require('tincanjs');
const _ = require('lodash');

const ADLActivity = {
    'assessment': {
        'id': 'http://adlnet.gov/expapi/activities/assessment',
        'display': {
            'en-US': 'assessment'
        }
    },
    'attempt': {
        'id': 'http://adlnet.gov/expapi/activities/attempt',
        'display': {
            'en-US': 'attempt'
        }
    },
    'course': {
        'id': 'http://adlnet.gov/expapi/activities/course',
        'display': {
            'en-US': 'course'
        }
    },
    'file': {
        'id': 'http://adlnet.gov/expapi/activities/file',
        'display': {
            'en-US': 'file'
        }
    },
    'interaction': {
        'id': 'http://adlnet.gov/expapi/activities/interaction',
        'display': {
            'en-US': 'interaction'
        }
    },
    'lesson': {
        'id': 'http://adlnet.gov/expapi/activities/lesson',
        'display': {
            'en-US': 'lesson'
        }
    },
    'link': {
        'id': 'http://adlnet.gov/expapi/activities/link',
        'display': {
            'en-US': 'link'
        }
    },
    'media': {
        'id': 'http://adlnet.gov/expapi/activities/media',
        'display': {
            'en-US': 'media'
        }
    },
    'meeting': {
        'id': 'http://adlnet.gov/expapi/activities/meeting',
        'display': {
            'en-US': 'meeting'
        }
    },
    'module': {
        'id': 'http://adlnet.gov/expapi/activities/module',
        'display': {
            'en-US': 'module'
        }
    },
    'objective': {
        'id': 'http://adlnet.gov/expapi/activities/objective',
        'display': {
            'en-US': 'objective'
        }
    },
    'performance': {
        'id': 'http://adlnet.gov/expapi/activities/performance',
        'display': {
            'en-US': 'performance'
        }
    },
    'profile': {
        'id': 'http://adlnet.gov/expapi/activities/profile',
        'display': {
            'en-US': 'profile'
        }
    },
    'question': {
        'id': 'http://adlnet.gov/expapi/activities/question',
        'display': {
            'en-US': 'question'
        }
    },
    'simulation': {
        'id': 'http://adlnet.gov/expapi/activities/simulation',
        'display': {
            'en-US': 'simulation'
        }
    }
};

const ADLVerb = {
    "abandoned": {
        "id": "https://w3id.org/xapi/adl/verbs/abandoned",
        "display": {
            "en-US": "abandoned"
        }
    },
    "answered": {
        "id": "http://adlnet.gov/expapi/verbs/answered",
        "display": {
            "de-DE": "beantwortete",
            "en-US": "answered",
            "fr-FR": "a répondu",
            "es-ES": "contestó"
        }
    },
    "asked": {
        "id": "http://adlnet.gov/expapi/verbs/asked",
        "display": {
            "de-DE": "fragte",
            "en-US": "asked",
            "fr-FR": "a demandé",
            "es-ES": "preguntó"
        }
    },
    "attempted": {
        "id": "http://adlnet.gov/expapi/verbs/attempted",
        "display": {
            "de-DE": "versuchte",
            "en-US": "attempted",
            "fr-FR": "a essayé",
            "es-ES": "intentó"
        }
    },
    "attended": {
        "id": "http://adlnet.gov/expapi/verbs/attended",
        "display": {
            "de-DE": "nahm teil an",
            "en-US": "attended",
            "fr-FR": "a suivi",
            "es-ES": "asistió"
        }
    },
    "commented": {
        "id": "http://adlnet.gov/expapi/verbs/commented",
        "display": {
            "de-DE": "kommentierte",
            "en-US": "commented",
            "fr-FR": "a commenté",
            "es-ES": "comentó"
        }
    },
    "completed": {
        "id": "http://adlnet.gov/expapi/verbs/completed",
        "display": {
            "de-DE": "beendete",
            "en-US": "completed",
            "fr-FR": "a terminé",
            "es-ES": "completó"
        }
    },
    "exited": {
        "id": "http://adlnet.gov/expapi/verbs/exited",
        "display": {
            "de-DE": "verließ",
            "en-US": "exited",
            "fr-FR": "a quitté",
            "es-ES": "salió"
        }
    },
    "experienced": {
        "id": "http://adlnet.gov/expapi/verbs/experienced",
        "display": {
            "de-DE": "erlebte",
            "en-US": "experienced",
            "fr-FR": "a éprouvé",
            "es-ES": "experimentó"
        }
    },
    "failed": {
        "id": "http://adlnet.gov/expapi/verbs/failed",
        "display": {
            "de-DE": "verfehlte",
            "en-US": "failed",
            "fr-FR": "a échoué",
            "es-ES": "fracasó"
        }
    },
    "imported": {
        "id": "http://adlnet.gov/expapi/verbs/imported",
        "display": {
            "de-DE": "importierte",
            "en-US": "imported",
            "fr-FR": "a importé",
            "es-ES": "importó"
        }
    },
    "initialized": {
        "id": "http://adlnet.gov/expapi/verbs/initialized",
        "display": {
            "de-DE": "initialisierte",
            "en-US": "initialized",
            "fr-FR": "a initialisé",
            "es-ES": "inicializó"
        }
    },
    "interacted": {
        "id": "http://adlnet.gov/expapi/verbs/interacted",
        "display": {
            "de-DE": "interagierte",
            "en-US": "interacted",
            "fr-FR": "a interagi",
            "es-ES": "interactuó"
        }
    },
    "launched": {
        "id": "http://adlnet.gov/expapi/verbs/launched",
        "display": {
            "de-DE": "startete",
            "en-US": "launched",
            "fr-FR": "a lancé",
            "es-ES": "lanzó"
        }
    },
    "mastered": {
        "id": "http://adlnet.gov/expapi/verbs/mastered",
        "display": {
            "de-DE": "meisterte",
            "en-US": "mastered",
            "fr-FR": "a maîtrisé",
            "es-ES": "dominó"
        }
    },
    "passed": {
        "id": "http://adlnet.gov/expapi/verbs/passed",
        "display": {
            "de-DE": "bestand",
            "en-US": "passed",
            "fr-FR": "a réussi",
            "es-ES": "aprobó"
        }
    },
    "preferred": {
        "id": "http://adlnet.gov/expapi/verbs/preferred",
        "display": {
            "de-DE": "bevorzugte",
            "en-US": "preferred",
            "fr-FR": "a préféré",
            "es-ES": "prefirió"
        }
    },
    "progressed": {
        "id": "http://adlnet.gov/expapi/verbs/progressed",
        "display": {
            "de-DE": "machte Fortschritt mit",
            "en-US": "progressed",
            "fr-FR": "a progressé",
            "es-ES": "progresó"
        }
    },
    "registered": {
        "id": "http://adlnet.gov/expapi/verbs/registered",
        "display": {
            "de-DE": "registrierte",
            "en-US": "registered",
            "fr-FR": "a enregistré",
            "es-ES": "registró"
        }
    },
    "responded": {
        "id": "http://adlnet.gov/expapi/verbs/responded",
        "display": {
            "de-DE": "reagierte",
            "en-US": "responded",
            "fr-FR": "a répondu",
            "es-ES": "respondió"
        }
    },
    "resumed": {
        "id": "http://adlnet.gov/expapi/verbs/resumed",
        "display": {
            "de-DE": "setzte fort",
            "en-US": "resumed",
            "fr-FR": "a repris",
            "es-ES": "continuó"
        }
    },
    "satisfied": {
        "id": "https://w3id.org/xapi/adl/verbs/satisfied",
        "display": {
            "en-US": "satisfied"
        }
    },
    "scored": {
        "id": "http://adlnet.gov/expapi/verbs/scored",
        "display": {
            "de-DE": "erreichte",
            "en-US": "scored",
            "fr-FR": "a marqué",
            "es-ES": "anotó"
        }
    },
    "shared": {
        "id": "http://adlnet.gov/expapi/verbs/shared",
        "display": {
            "de-DE": "teilte",
            "en-US": "shared",
            "fr-FR": "a partagé",
            "es-ES": "compartió"
        }
    },
    "suspended": {
        "id": "http://adlnet.gov/expapi/verbs/suspended",
        "display": {
            "de-DE": "pausierte",
            "en-US": "suspended",
            "fr-FR": "a suspendu",
            "es-ES": "aplazó"
        }
    },
    "terminated": {
        "id": "http://adlnet.gov/expapi/verbs/terminated",
        "display": {
            "de-DE": "beendete",
            "en-US": "terminated",
            "fr-FR": "a terminé",
            "es-ES": "terminó"
        }
    },
    "voided": {
        "id": "http://adlnet.gov/expapi/verbs/voided",
        "display": {
            "de-DE": "entwertete",
            "en-US": "voided",
            "fr-FR": "a annulé",
            "es-ES": "anuló"
        }
    },
    "waived": {
        "id": "https://w3id.org/xapi/adl/verbs/waived",
        "display": {
            "en-US": "waived"
        }
    }
};

let LRS,
    defaultProps = {},
    verbURLPrefix = 'http://adlnet.gov/expapi/verbs/',
    activityURLPrefix = 'http://adlnet.gov/expapi/activities/',
    defaultLanguage = 'en-US';

module.exports = {

    // Connect to the LRS
    connect(initObject) {
        let {
            end, user, pass
        } = initObject;
        return new Promise(function(resolve, reject) {
            try {
                LRS = new TinCan.LRS({
                    endpoint: end,
                    username: user,
                    password: pass,
                    allowFail: false
                });
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    },

    // Set defaults to be applied to each statement such as actor or authority
    default (defaultObj) {
        defaultProps = _.assign({}, defaultObj);
    },

    // Returns array of verbs from the ADL list
    getVerbsList() {
        // return Object.keys(VerbDictionary).map((key) => VerbDictionary[key].display[defaultLanguage]);
        return this.getDictionaryWordsList(ADLVerb);
    },

    // True if the verb is on the ADL list
    validateVerb(verb) {
        return this.getVerbsList().indexOf(verb.toLowerCase()) >= 0;
    },

    // Returns array of activity from the ADL list
    getActivitiesList() {
        return this.getDictionaryWordsList(ADLActivity);
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
        let statement, {
            subjectName, subjectID, verbDisplay, objectID, objectType, objectName
        } = statementData;

        if (!this.validateVerb(verbDisplay)) {
            console.warn('LRS verb is not in the dictionary', verbDisplay);
        }

        statement = _.defaults({
            actor: {
                name: subjectName,
                mbox: 'mailto:' + subjectID
            },
            verb: {
                id: verbURLPrefix + verbDisplay.toLowerCase(),
                display: {
                    'en-US': verbDisplay.toLowerCase()
                }
            },
            object: {
                id: objectID,
                definition: {
                    type: objectType ? activityURLPrefix + objectType : null,
                    name: {
                        'en-US': objectName
                    }
                }
            }
        }, defaultProps);
        return new TinCan.Statement(statement);
    },

    // Create and send an xAPI statement
    send(statementData) {
        let statement = this.createStatement(statementData);
        console.log(statement);

        return new Promise(function(resolve, reject) {

            if (!LRS) {
                reject({
                    message: 'LRS not connected! Cannot send statement: ' + statement
                });
                return;
            }

            LRS.saveStatement(statement, {
                callback: (err, xhr) => {
                    if (err !== null) {
                        if (xhr !== null) {
                            reject({
                                status: xhr.status,
                                message: xhr.responseText
                            });
                            return;
                        }
                        reject({
                            message: err
                        });
                        return;
                    }
                    resolve();
                }
            });
        });
    }

};