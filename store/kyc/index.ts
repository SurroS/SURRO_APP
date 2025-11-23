import { create } from 'zustand';
import { createKYCSlice } from './actions';
import { KYCStore } from './types';

export const useKYCStore = create<KYCStore>()((...a) => ({
  ...createKYCSlice(...a),
}));

