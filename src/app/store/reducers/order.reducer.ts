import { createReducer, on } from '@ngrx/store';
import { addOrder, resetOrder } from '../actions/order.actions';
import { Order } from '../../models/order.model';

export interface OrderState {
  order: Order | null;
}

const initialState: OrderState = {
  order: null,
};

export const orderReducer = createReducer(
  initialState,
  on(addOrder, (state, { order }) => ({ ...state, order })),
  on(resetOrder, () => ({ ...initialState }))
);
