const functions = require('firebase-functions');
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

exports.countExpenses = functions.database.ref('/users/{userId}/expenses/{expenseID}')
    .onWrite((change) => {
        const collectionRef = change.after.ref.parent;
        const countRef = collectionRef.parent.child('expensesCount');

        let increment;
        if (change.after.exists() && !change.before.exists()) {
            increment = 1;
        } else if (!change.after.exists() && change.before.exists()) {
            increment = -1;
        } else {
            return null;
        }

        return countRef.transaction( current => {
            return (current || 0) + increment;
        }).then( () => {
            return console.log('counter updated');
        });
    });

