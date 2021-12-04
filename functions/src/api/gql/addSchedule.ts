import type { Interval, IntervalDTO } from '../types';
import { IntervalSerializer } from '../types';
import { query } from '.';

const ADD_SCHEDULE = `
mutation ($meetingId: ID!, $intervals: [IntervalInput!]!) {
	addSchedule(data: {
		meetingId: $meetingId,
		intervals: $intervals
	}) {
		user {
			id
			name
			guestOf
			hasPassword
		}
		intervals {
			beg
			end
		}
	}
}`;

export interface AddScheduleVars {
  intervals: Interval[];
  meetingId: string;
}

interface AddScheduleResolved {
  addSchedule: {
    user: {
      id: string;
      name: string;
      guestOf: string | null;
      hasPassword: boolean;
    };
    intervals: IntervalDTO[];
  };
}

interface AddScheduleReturned {
  user: {
    id: string;
    name: string;
    guestOf: string | null;
    hasPassword: boolean;
  };
  intervals: Interval[];
}

export const addSchedule = async ({
  meetingId,
  intervals,
}: AddScheduleVars): Promise<AddScheduleReturned> => {
  const variables = {
    intervals: intervals.map(IntervalSerializer.serialize),
    meetingId,
  };
  const { addSchedule } = (await query({
    query: ADD_SCHEDULE,
    variables,
  })) as AddScheduleResolved;
  return {
    user: addSchedule.user,
    intervals: addSchedule.intervals.map(IntervalSerializer.deserialize),
  };
};
