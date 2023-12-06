import { CommonState } from './common.states';

const initialState: CommonState = {
  isViewSchedule: false,
  practiceScheduleId: null
};

export function commonReducer(state = initialState, action: any) {
  switch (action.type) {
    case 'SET_IS_VIEW_SCHEDULE': {
      return {
        ...state,
        isViewSchedule: action.isViewSchedule,
        practiceScheduleId: action.id,
      };
    }
    default: {
      return state;
    }
  }
}
