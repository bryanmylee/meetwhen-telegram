import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import type { Time } from '../../utils/Time';

export interface Interval {
  beg: Dayjs;
  end: Dayjs;
}

export interface LocalTimeInterval {
  beg: Time;
  end: Time;
}

export interface IntervalDTO {
  beg: number;
  end: number;
}

export class IntervalSerializer {
  static serialize(interval: Interval): IntervalDTO {
    if (interval == null) {
      throw new Error('Failed to serialize interval');
    }
    const { beg, end } = interval;
    return {
      beg: beg.unix(),
      end: end.unix(),
    };
  }

  static deserialize(interval: IntervalDTO): Interval {
    if (interval == null) {
      throw new Error('Failed to deserialize interval');
    }
    const { beg, end } = interval;
    return {
      beg: dayjs.unix(beg),
      end: dayjs.unix(end),
    };
  }
}
