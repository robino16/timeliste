export interface Time {
  hour: number;
  minute: number;
}

export interface DayValue {
  workedThatDay: boolean;
  date: Date;
  totalHoursWorked: number;
  eveningHours: number;
  weekendHours: number;
  error: boolean;
}

export const Months = [
  {
    key: 1,
    text: "Januar",
    value: 1,
    content: "Januar",
  },
  {
    key: 2,
    text: "Feburar",
    value: 2,
    content: "Feburar",
  },
  {
    key: 3,
    text: "Mars",
    value: 3,
    content: "Mars",
  },
  {
    key: 4,
    text: "April",
    value: 4,
    content: "April",
  },
  {
    key: 5,
    text: "Mai",
    value: 5,
    content: "Mai",
  },
  {
    key: 6,
    text: "Juni",
    value: 6,
    content: "Juni",
  },
  {
    key: 7,
    text: "Juli",
    value: 7,
    content: "Juli",
  },
  {
    key: 8,
    text: "August",
    value: 8,
    content: "August",
  },
  {
    key: 9,
    text: "September",
    value: 9,
    content: "September",
  },
  {
    key: 10,
    text: "Oktober",
    value: 10,
    content: "Oktober",
  },
  {
    key: 11,
    text: "November",
    value: 11,
    content: "November",
  },
  {
    key: 12,
    text: "Desember",
    value: 12,
    content: "Desember",
  },
];

export const Days = [
  {
    key: 0,
    text: "Søndag",
    value: 0,
    content: "Søndag",
  },
  {
    key: 1,
    text: "Mandag",
    value: 1,
    content: "Mandag",
  },
  {
    key: 2,
    text: "Tirsdag",
    value: 2,
    content: "Tirsdag",
  },
  {
    key: 3,
    text: "Onsdag",
    value: 3,
    content: "Onsdag",
  },
  {
    key: 4,
    text: "Torsdag",
    value: 4,
    content: "Torsdag",
  },
  {
    key: 5,
    text: "Fredag",
    value: 5,
    content: "Fredag",
  },
  {
    key: 6,
    text: "Lørdag",
    value: 6,
    content: "Lørdag",
  },
];
