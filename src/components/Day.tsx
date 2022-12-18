import { endianness } from "os";
import React, { useEffect, useState } from "react";
import { Checkbox, Header, Input, Segment } from "semantic-ui-react";
import TimePicker from "./TimePicker";

interface IDayProps {
  date: Date;
}

interface Time {
  hour: number;
  minute: number;
}

interface DayValue {
  start: Time;
  end: Time;
  lunch: boolean;
}

const options = [
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

const Day = (props: IDayProps) => {
  const [start, setStart] = useState<Time>({ hour: 0, minute: 0 });
  const [end, setEnd] = useState<Time>({ hour: 0, minute: 0 });
  const [lunchTime, setLunchTime] = useState<Time>({ hour: 12, minute: 0 });
  const [lunch, setLunch] = useState<boolean>(true);
  const [hoursWorked, setHoursWorked] = useState<number>(0);
  const [kveldstillegg, setKveldstillegg] = useState<number>(0);
  const [helgeTillegg, setHelgetillegg] = useState<number>(0);

  const calcHours = (): number => {
    const a = start.hour + start.minute / 60;
    const b = end.hour + end.minute / 60;
    if (b < a) {
      // worked till next day ?
      const c = 24 - a;
      const res = c + b;
      return lunch ? res - 0.5 : res;
    } else {
      const res = b - a;
      return lunch ? res - 0.5 : res;
    }
  };

  const nextDay = (): boolean => {
    const a = start.hour + start.minute / 60;
    const b = end.hour + end.minute / 60;
    return b < a;
  };

  const calcHelgetillegg = (): number => {
    const a = start.hour + start.minute / 60;
    const b = end.hour + end.minute / 60;

    if (b < a) {
      const startDayIsWeekend =
        props.date.getDay() === 6 || props.date.getDay() == 0;
      const endDayIsWeekend =
        props.date.getDay() === 6 || props.date.getDay() === 5;
      var res = 0.0;
      if (startDayIsWeekend) {
        res += 24 - a;
      }
      if (endDayIsWeekend) {
        res += b;
      }
      return res;
    } else {
      const isWeekend = props.date.getDay() === 6 || props.date.getDay() == 0;
      if (isWeekend) {
        return b - a;
      }
    }

    return 0;
  };

  const calcKveldstillegg = (): number => {
    const a = start.hour + start.minute / 60;
    const b = end.hour + end.minute / 60;
    const threshold = 17;
    if (b < a) {
      // worked till next day ?
      const startDayIsWeekend =
        props.date.getDay() === 6 || props.date.getDay() == 0;
      const endDayIsWeekend =
        props.date.getDay() === 6 || props.date.getDay() === 5;

      var firstDayKveldstillegg = 0.0;
      if (!startDayIsWeekend) {
        if (a < threshold) {
          firstDayKveldstillegg += 24 - threshold;
        } else {
          firstDayKveldstillegg += 24 - a;
        }
      }

      var secondDayKveldstillegg = 0.0;
      if (!endDayIsWeekend) {
        secondDayKveldstillegg += b;
      }

      return firstDayKveldstillegg + secondDayKveldstillegg;
    }

    const isWeekend = props.date.getDay() === 6 || props.date.getDay() == 0;
    if (isWeekend) {
      return 0;
    }

    if (b < threshold) {
      return 0;
    }

    if (a < threshold) {
      return b - threshold;
    }

    if (a >= threshold) {
      return b - a;
    }

    return 0;
  };

  useEffect(() => {
    setHoursWorked(calcHours());
    setKveldstillegg(calcKveldstillegg());
    setHelgetillegg(calcHelgetillegg());
  }, [start, end, lunch]);

  const renderTitle = () => {
    switch (props.date.getDay()) {
      case 0:
        return (
          <Header as="h4" color="red">
            Søndag {props.date.getDate()}.{" "}
            {options.find((x) => x.value - 1 === props.date.getMonth())?.text}{" "}
            {props.date.getFullYear()}
          </Header>
        );
      case 1:
        return (
          <Header as="h4">
            Mandag {props.date.getDate()}.{" "}
            {options.find((x) => x.value - 1 === props.date.getMonth())?.text}{" "}
            {props.date.getFullYear()}
          </Header>
        );
      case 2:
        return (
          <Header as="h4">
            Tirsdag {props.date.getDate()}.{" "}
            {options.find((x) => x.value - 1 === props.date.getMonth())?.text}{" "}
            {props.date.getFullYear()}
          </Header>
        );
      case 3:
        return (
          <Header as="h4">
            Onsdag {props.date.getDate()}.{" "}
            {options.find((x) => x.value - 1 === props.date.getMonth())?.text}{" "}
            {props.date.getFullYear()}
          </Header>
        );
      case 4:
        return (
          <Header as="h4">
            Torsdag {props.date.getDate()}.{" "}
            {options.find((x) => x.value - 1 === props.date.getMonth())?.text}{" "}
            {props.date.getFullYear()}
          </Header>
        );
      case 5:
        return (
          <Header as="h4">
            Fredag {props.date.getDate()}.{" "}
            {options.find((x) => x.value - 1 === props.date.getMonth())?.text}{" "}
            {props.date.getFullYear()}
          </Header>
        );
      case 6:
        return (
          <Header as="h4" color="red">
            Lørdag {props.date.getDate()}.{" "}
            {options.find((x) => x.value - 1 === props.date.getMonth())?.text}{" "}
            {props.date.getFullYear()}
          </Header>
        );
      default:
        return "Invalid";
    }
  };

  return (
    <Segment key={props.date.getTime()}>
      {renderTitle()}
      <Header as="h5">Start</Header>
      <TimePicker
        onChange={(time: Time): void => {
          setStart(time);
        }}
      />
      <Header as="h5">Slutt</Header>
      <TimePicker
        onChange={(time: Time): void => {
          setEnd(time);
        }}
      />
      {nextDay() && <p>Dagen etter</p>}
      <Header as="h5">Lunsj</Header>
      <Checkbox
        label="0.5 timer lunsj"
        checked={lunch}
        onChange={(e, data) => setLunch(!lunch)}
      />
      <br />
      {lunch && (
        <>
          <p>Lunsj startet:</p>
          <TimePicker
            value={lunchTime}
            onChange={(time: Time): void => {
              setLunchTime(time);
            }}
          />
        </>
      )}
      <Header as="h5">Oppsummert</Header>
      <p>
        Du jobbet fra {String(start.hour).padStart(2, "0")}:
        {String(start.minute).padStart(2, "0")} til{" "}
        {String(end.hour).padStart(2, "0")}:
        {String(end.minute).padStart(2, "0")}
        {nextDay() && " dagen etter"}.{" "}
        <p>
          {`Dette blir ca. ${hoursWorked.toFixed(2)} timer.`}{" "}
          {lunch ? "Og 0.5 timer lunsj." : "Uten lunsj."}
        </p>
        <p>Kveldstillegg: {kveldstillegg.toFixed(2)} timer.</p>
        <p>Helgetillegg: {helgeTillegg.toFixed(2)} timer.</p>
      </p>
    </Segment>
  );
};

export default Day;
