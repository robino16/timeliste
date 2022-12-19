import { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Segment,
} from "semantic-ui-react";
import { Days, DayValue, Months, Time } from "../definitions/definitions";
import TimePicker from "./TimePicker";

interface IDayProps {
  date: Date;
  onChange: (value: DayValue) => void;
}

const Day = (props: IDayProps) => {
  const [hidden, setHidden] = useState<boolean>(false);
  const [workedThatDay, setWorkedThatDay] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Time>({ hour: 8, minute: 0 });
  const [endTime, setEndTime] = useState<Time>({ hour: 16, minute: 0 });
  const [lunchTime, setLunchTime] = useState<Time>({ hour: 12, minute: 0 });
  const [hadLunch, setHadLunch] = useState<boolean>(true);
  const [totalHoursWorked, setTotalHoursWorked] = useState<number>(0);
  const [eveningHours, setEveningHours] = useState<number>(0);
  const [weekendHours, setWeekendHours] = useState<number>(0);
  const [workedTillNextDay, setWorkedTillNextDay] = useState<boolean>(false);
  const [lunchError, setLunchError] = useState<string | undefined>(undefined);

  const calc2 = () => {
    if (!workedThatDay) {
      setHadLunch(false);
      setTotalHoursWorked(0.0);
      setEveningHours(0.0);
      setWeekendHours(0.0);

      props.onChange({
        workedThatDay: true,
        totalHoursWorked: 0.0,
        eveningHours: 0.0,
        weekendHours: 0.0,
        date: props.date,
        error: false,
      });

      return;
    }

    const start = startTime.hour + startTime.minute / 60; // in hours
    const end = endTime.hour + endTime.minute / 60; // in hours
    const lunch = lunchTime.hour + lunchTime.minute / 60; // in hours
    const eveningThreshold = 17; // o'clock
    const newWorkedTillNextDay = end < start;
    const day = props.date.getDay();
    const startDayIsWeekend = day === 0 || day === 6; // 0 is sunday, 6 is saturday
    const lunchInEvening = Math.max(
      0,
      lunch + 0.5 - Math.max(eveningThreshold, lunch)
    );

    var newTotalHoursWorked = 0.0;
    var newEveningHours = 0.0;
    var newWeekendHours = 0.0;

    if (newWorkedTillNextDay) {
      const endDayIsWeekend = day === 5 || day === 6; // 5 is friday, 6 is saturday
      var hoursWorkedFirstDay = 24 - start;
      var hoursWorkedSecondDay = end;
      if (hadLunch) {
        hoursWorkedFirstDay -= 0.5;
      }

      hoursWorkedFirstDay = Math.max(0.0, hoursWorkedFirstDay);
      newTotalHoursWorked = hoursWorkedFirstDay + hoursWorkedSecondDay;
      if (startDayIsWeekend) {
        newWeekendHours += hoursWorkedFirstDay;
      } else {
        if (start >= eveningThreshold) {
          newEveningHours += hoursWorkedFirstDay;
        } else if (end > eveningThreshold) {
          newEveningHours += end - eveningThreshold;
          if (hadLunch) {
            newEveningHours -= lunchInEvening;
          }

          newEveningHours = Math.max(0, newEveningHours);
        }
      }

      if (endDayIsWeekend) {
        newWeekendHours += hoursWorkedSecondDay;
      } else {
        newEveningHours += hoursWorkedSecondDay;
      }
    } else {
      newTotalHoursWorked = end - start;
      if (hadLunch) {
        newTotalHoursWorked -= 0.5;
      }

      newTotalHoursWorked = Math.max(0.0, newTotalHoursWorked);
      if (startDayIsWeekend) {
        newWeekendHours = newTotalHoursWorked;
      } else {
        if (start >= eveningThreshold) {
          newEveningHours = newTotalHoursWorked;
        } else if (end > eveningThreshold) {
          newEveningHours = end - eveningThreshold;
          if (hadLunch) {
            newEveningHours -= lunchInEvening;
          }

          newEveningHours = Math.max(0, newEveningHours);
        }
      }
    }

    setTotalHoursWorked(newTotalHoursWorked);
    setEveningHours(newEveningHours);
    setWeekendHours(newWeekendHours);
    setWorkedTillNextDay(newWorkedTillNextDay);

    if (newTotalHoursWorked === 0) {
      setLunchError("Du kan ikke jobbe null timer.");
    } else if (lunch && newTotalHoursWorked < 5.5) {
      setLunchError(
        "Obs: Man har ikke krav på lunsj om man jobber mindre enn 5.5 timer."
      );
    } else if (newTotalHoursWorked < 0.5) {
      setLunchError("Du har jobbet mindre enn 0.5 timer.");
    } else if (start > 23.5) {
      setLunchError("Du kan jo ikke ha lunsj midt på svarte natta!");
    } else if (!workedTillNextDay && lunch > end - 0.5) {
      setLunchError("Du kan ikke ha lunsj etter du var ferdig på jobb 🤔");
    } else if (lunch < start) {
      setLunchError("Du kan ikke ha lunsj før du startet på jobb vel? 🤔");
    } else {
      setLunchError(undefined);
    }

    props.onChange({
      workedThatDay: true,
      totalHoursWorked: newTotalHoursWorked,
      eveningHours: newEveningHours,
      weekendHours: newWeekendHours,
      date: props.date,
      error: lunchError !== undefined,
    });
  };

  useEffect(() => {
    calc2();
  }, [startTime, endTime, hadLunch, lunchTime, workedThatDay]);

  const renderTitle = () => {
    const day = Days.find((x) => x.key === props.date.getDay());
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Header as="h3" style={{ opacity: workedThatDay ? "1.0" : "0.4" }}>
          {day?.text} {props.date.getDate()}.{" "}
          {Months.find((x) => x.value - 1 === props.date.getMonth())?.text}{" "}
          {props.date.getFullYear()}
        </Header>

        {!workedThatDay && (
          <Button
            primary
            onClick={() => {
              setHadLunch(true);
              setHidden(false);
              setWorkedThatDay(true);
            }}
          >
            <Icon name="plus" />
            Legg til
          </Button>
        )}

        {workedThatDay && (
          <div>
            <Button
              onClick={() => setHidden(!hidden)}
              style={{ marginBottom: "1rem" }}
            >
              <Icon name={hidden ? `angle down` : `angle up`} />
              {hidden ? "Vis" : "Skjul"}
            </Button>

            <Button
              onClick={() => {
                setWorkedThatDay(false);
                setHidden(false);
              }}
              style={{ marginBottom: "1rem" }}
            >
              <Icon name="times" />
              Fjern
            </Button>
          </div>
        )}
      </div>
    );
  };

  const render = () => {
    return (
      <>
        <Grid doubling columns={5}>
          <Grid.Column>
            <Header as="h4">Startet</Header>
            <TimePicker
              value={startTime}
              onChange={(time: Time): void => {
                setStartTime(time);
              }}
            />
          </Grid.Column>

          <Grid.Column>
            <Header as="h4">Sluttet</Header>
            <TimePicker
              value={endTime}
              onChange={(time: Time): void => {
                setEndTime(time);
              }}
            />
            {workedTillNextDay && (
              <p>
                <i>Dagen etter</i>
              </p>
            )}
          </Grid.Column>

          <Grid.Column>
            <Header as="h4">Lunsj</Header>
            <Checkbox
              label="0.5 timer lunsj"
              checked={hadLunch}
              onChange={(e, data) => setHadLunch(!hadLunch)}
            />
          </Grid.Column>

          {hadLunch && (
            <Grid.Column>
              <Header as="h4">Tidspunkt for lunsj</Header>
              <TimePicker
                value={lunchTime}
                min={{ hour: startTime.hour + 3, minute: startTime.minute }}
                max={workedTillNextDay ? { hour: 23, minute: 30 } : endTime}
                onChange={(time: Time): void => {
                  setLunchTime(time);
                }}
              />
              {lunchError && <p style={{ color: "red" }}>{lunchError}</p>}
            </Grid.Column>
          )}
        </Grid>
        <p>
          Du jobbet fra {String(startTime.hour).padStart(2, "0")}:
          {String(startTime.minute).padStart(2, "0")} til{" "}
          {String(endTime.hour).padStart(2, "0")}:
          {String(endTime.minute).padStart(2, "0")}
          {workedTillNextDay && " dagen etter"}.{" "}
        </p>
        <Divider />
        <Grid doubling columns={4}>
          <Grid.Column>
            <Header as="h5">Arbeid</Header>
            <p>{totalHoursWorked.toFixed(2)} timer.</p>
          </Grid.Column>

          <Grid.Column>
            <Header as="h5">Lunsj</Header>
            <p>{hadLunch ? "0.50" : "0.00"} timer.</p>
          </Grid.Column>

          <Grid.Column>
            <Header as="h5">Kveldstillegg</Header>
            <p>{eveningHours.toFixed(2)} timer.</p>
          </Grid.Column>

          <Grid.Column>
            <Header as="h5">Helgetillegg</Header>
            <p>{weekendHours.toFixed(2)} timer.</p>
          </Grid.Column>
        </Grid>
      </>
    );
  };

  return (
    <Segment key={props.date.getTime()} style={{ backgroundColor: "#eee" }}>
      {renderTitle()}
      {workedThatDay && !hidden && render()}
      {workedThatDay && hidden && (
        <>
          <p>
            {`${totalHoursWorked.toFixed(2)} timer arbeid `}{" "}
            {hadLunch ? "med 0.5 timer lunsj. " : "uten lunsj. "}
            Kveldstillegg: {eveningHours.toFixed(2)} timer. Helgetillegg:{" "}
            {weekendHours.toFixed(2)} timer.
          </p>
        </>
      )}
    </Segment>
  );
};

export default Day;
