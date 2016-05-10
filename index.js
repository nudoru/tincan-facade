const LRS = require('./src/tincanfacade.js');

// Set initial statement data
let testStatement = {
        subjectName: 'Blue Berry',
        subjectID: 'blueberry@pietown.com',
        verbDisplay: 'completed',
        objectName: 'Filling the pies',
        objectType: 'course',
        objectID: 'http://pietown.com/Apple_Pie_Filling_101',
        statement: 'Click Submit to create a statement',
        isError: false
    },
    defaults = {
        result: {
            completion: true,
            success: true,
            score: {
                scaled: 1
            }
        },
        authority: {
            name: 'Irene Instructor',
            mbox: 'mailto:irene@example.com'
        },
        context: {
            instructor: {
                name: 'Irene Instructor',
                mbox: 'mailto:irene@example.com'
            },
            contextActivities: {
                parent: {
                    id: 'http://example.com/activities/pie-filling-101'
                },
                grouping: {
                    id: 'http://example.com/activities/pie-town-school'
                }
            }
        }
    };



// Connect to the LRS
LRS.connect({
    end: 'https://lrs.adlnet.gov/xapi/',
    user: '',
    pass: ''
}).then(() => {
    console.log('Connected to the LRS');
    // Set defaults for every statement
    LRS.default(defaults);
    // Send test statement
    LRS.send(testStatement).then(() => console.log('Statement sent'))
        .catch((err) => console.warn('Failed to send', err));
}).catch((err) => console.warn('Failed to connect to LRS', err));