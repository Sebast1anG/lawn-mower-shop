import { createSelector, createFeatureSelector } from '@ngrx/store';
import { OrderState } from '../reducers/order.reducer';

export const selectOrderState = createFeatureSelector<OrderState>('order');

export const selectCurrentOrder = createSelector(
  selectOrderState,
  (state: OrderState) => state.order
);
