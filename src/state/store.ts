import { createStore, applyMiddleware } from 'redux';
import { composeWithDevToolsDevelopmentOnly } from '@redux-devtools/extension';
import thunk from 'redux-thunk';
import reducers from './reducers';

export const store = createStore(
    reducers,
    {},
    composeWithDevToolsDevelopmentOnly(
        applyMiddleware(thunk)
    ),
);