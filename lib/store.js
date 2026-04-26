// Simple state management for Compliance AI
export const INITIAL_STATE = {
  cases: [],
  currentCase: null,
  loading: false,
  error: null,
};

export function caseReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_CASE':
      return { ...state, cases: [...state.cases, action.payload] };
    case 'SET_CURRENT_CASE':
      return { ...state, currentCase: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}
