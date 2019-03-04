import moment from 'moment-timezone';

export const buildUTCString = (tz, date, time) => {
  let timeStr = time;
  if (!timeStr) {
    timeStr = '00:00'
  }
  const tzDateTime = moment.tz(`${date} ${timeStr}`, tz);
  return tzDateTime.clone().utc().format();
};

export const buildDateAndTime = (tz, dateTimeStr) => {
  const localizedDateTimeStr = moment.tz(dateTimeStr, tz);
  const splitDTString = localizedDateTimeStr.format().split('T');
  const date = splitDTString[0];
  const splitTime = splitDTString[1].split(':');
  const time = [splitTime[0], splitTime[1], '00'].join(':');
  return { date, time }
};

export const makeElObj = (data) => {
  const {
    start, end, mandatePeriodStart, mandatePeriodEnd
  } = data;
  let startDateAndTime = { date: null, time: null };
  if (start) {
    startDateAndTime = buildDateAndTime(data.tz, start);
  }
  let endDateAndTime = { date: null, time: null };
  if (end) {
    endDateAndTime = buildDateAndTime(data.tz, end);
  }
  let mandateStartDateAndTime = { date: null, time: null };
  if (mandatePeriodStart) {
    mandateStartDateAndTime = buildDateAndTime(data.tz, mandatePeriodStart);
  }
  let mandateEndDateAndTime = { date: null, time: null };
  if (mandatePeriodEnd) {
    mandateEndDateAndTime = buildDateAndTime(data.tz, mandatePeriodEnd);
  }
  return Object.assign({}, data, {
    startDate: startDateAndTime.date,
    startTime: startDateAndTime.time,
    endDate: endDateAndTime.date,
    endTime: endDateAndTime.time,
    mandateStartDate: mandateStartDateAndTime.date,
    mandateEndDate: mandateEndDateAndTime.date,
  });
};

export const makeElObjData = (elGrp) => {
  const {
    startDate, startTime, endDate, endTime,
    mandateStartDate, mandateEndDate,
    ...restProps
  } = elGrp;
  let start = null;
  if (startDate && startTime) {
    start = buildUTCString(elGrp.tz, startDate, startTime)
  }
  let end = null;
  if (endDate && endTime) {
    end = buildUTCString(elGrp.tz, endDate, endTime)
  }
  let mandatePeriodStart = null;
  if (mandateStartDate) {
    mandatePeriodStart = buildUTCString(elGrp.tz, mandateStartDate, '00:00:00')
  }
  let mandatePeriodEnd = null;
  if (mandateEndDate) {
    mandatePeriodEnd = buildUTCString(elGrp.tz, mandateEndDate, '00:00:00')
  }
  return Object.assign({}, restProps, {
    start, end, mandatePeriodStart, mandatePeriodEnd
  })
};