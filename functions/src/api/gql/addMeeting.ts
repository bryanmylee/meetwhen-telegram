import type { Interval, IntervalDTO, Meeting } from '../types';
import { IntervalSerializer } from '../types';
import { query } from '.';

const ADD_MEETING = `
mutation ($name: String!, $emoji: String, $color: String, $intervals: [IntervalInput!]!) {
	addMeeting(data: {name: $name, emoji: $emoji, color: $color, intervals: $intervals}) {
		id
		slug
		emoji
		owner {
			id
			name
		}
		total
	}
}`;

export interface AddMeetingVars {
  name: string;
  emoji?: string;
  color?: string;
  intervals: Interval[];
}

interface AddMeetingResolved {
  addMeeting: {
    id: string;
    slug: string;
    emoji: string;
    owner: null | {
      id: string;
      name: string;
    };
    total: IntervalDTO;
  };
}

export const addMeeting = async ({
  name,
  emoji,
  color,
  intervals,
}: AddMeetingVars): Promise<Meeting> => {
  const variables = {
    name,
    emoji,
    color,
    intervals: intervals.map(IntervalSerializer.serialize),
  };
  const { addMeeting } = (await query({ query: ADD_MEETING, variables })) as AddMeetingResolved;
  return {
    ...addMeeting,
    name,
    color,
    intervals,
    schedules: [],
    total: IntervalSerializer.deserialize(addMeeting.total),
  } as Meeting;
};
