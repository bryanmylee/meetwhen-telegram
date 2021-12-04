import type { Identifiable } from './Identifiable';
import type { Meeting, MeetingDTO, Schedule, ScheduleDTO } from '.';

export interface ShallowUser extends Identifiable {
  name: string;
  email: string;
  guestOf: string | null;
}

export interface User extends ShallowUser {
  meetings: Partial<Meeting>[];
  schedules: Partial<Schedule>[];
}

export interface UserDTO extends ShallowUser {
  meetings: Partial<MeetingDTO>[];
  schedules: Partial<ScheduleDTO>[];
}
