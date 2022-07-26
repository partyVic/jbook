import produce from 'immer';
import { ActionType } from '../action-types';
import { Action } from '../actions';
import { Cell } from '../cell';

interface CellsState {
    loading: boolean;
    error: string | null;
    order: string[];
    data: {
        [key: string]: Cell;
    };
}

const initialState: CellsState = {
    loading: false,
    error: null,
    order: [],
    data: {},
};

// use produce function from immer to wrap the reducer
const reducer = produce((state: CellsState = initialState, action: Action) => {
    switch (action.type) {
        case ActionType.UPDATE_CELL:
            const { id, content } = action.payload;

            //! use immer can directly update data
            state.data[id].content = content;
            return;

        case ActionType.DELETE_CELL:
            //! immer can remove a property without mutating the object
            delete state.data[action.payload];
            state.order = state.order.filter((id) => id !== action.payload);
            return;

        case ActionType.MOVE_CELL:
            const { direction } = action.payload;
            const index = state.order.findIndex((id) => id === action.payload.id);
            const targetIndex = direction === 'up' ? index - 1 : index + 1;

            if (targetIndex < 0 || targetIndex > state.order.length - 1) {
                return;
            }

            state.order[index] = state.order[targetIndex];
            state.order[targetIndex] = action.payload.id;

            return;

        // case ActionType.INSERT_CELL_BEFORE:
        //     const cell: Cell = {
        //         content: '',
        //         type: action.payload.type,
        //         id: randomId(),
        //     };

        //     state.data[cell.id] = cell;

        //     const foundIndex = state.order.findIndex(
        //         (id) => id === action.payload.id
        //     );

        //     if (foundIndex < 0) {
        //         state.order.push(cell.id);
        //     } else {
        //         state.order.splice(foundIndex, 0, cell.id);
        //     }

        //     return state;
        case ActionType.INSERT_CELL_AFTER:
            const cell: Cell = {
                content: '',
                type: action.payload.type,
                id: randomId(),
            };

            state.data[cell.id] = cell;

            const foundIndex = state.order.findIndex(
                (id) => id === action.payload.id
            );

            if (foundIndex < 0) {
                state.order.unshift(cell.id);
            } else {
                state.order.splice(foundIndex + 1, 0, cell.id);
            }

            return;
        default:
            return state;
    }
}, initialState);

const randomId = () => {
    return Math.random().toString(36).substring(2, 5);
};

export default reducer;