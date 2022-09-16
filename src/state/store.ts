import { createStore, applyMiddleware } from 'redux';
import { composeWithDevToolsDevelopmentOnly } from '@redux-devtools/extension';
import thunk from 'redux-thunk';
import reducers from './reducers';
import { ActionType } from './action-types';

export const store = createStore(
    reducers,
    {},
    composeWithDevToolsDevelopmentOnly(
        applyMiddleware(thunk)
    ),
);

store.dispatch({
    type: ActionType.INSERT_CELL_AFTER,
    payload: {
        id: null,
        type: 'code',
    },
});

store.dispatch({
    type: ActionType.INSERT_CELL_AFTER,
    payload: {
        id: null,
        type: 'text',
    },
});

store.dispatch({
    type: ActionType.INSERT_CELL_AFTER,
    payload: {
        id: null,
        type: 'code',
    },
});

store.dispatch({
    type: ActionType.INSERT_CELL_AFTER,
    payload: {
        id: null,
        type: 'text',
    },
});


//! manually test redux reducers and actions
// store.dispatch({
//     type: ActionType.INSERT_CELL_BEFORE,
//     payload: {
//         id: null,
//         type: 'code'
//     }
// })

// store.dispatch({
//     type: ActionType.INSERT_CELL_BEFORE,
//     payload: {
//         id: null,
//         type: 'text'
//     }
// })

// console.log(store.getState())