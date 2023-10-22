import { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Message,
  Segment,
} from "semantic-ui-react";
import { Days, DayValue, Months, Time } from "../definitions/definitions";
import TimePicker from "./TimePicker";

interface IDayProps {
  date: Date;
  onChange: (value: DayValue) => void;
  eveningStarts: number;
  eveningEnds: number;
  tomorrowIsPublicHoliday: boolean;
}

const Day = (props: IDayProps) => {
  const [hidden, setHidden] = useState<boolean>(false);
  const [workedThatDay, setWorkedThatDay] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Time>({ hour: 8, minute: 0 });
  const [endTime, setEndTime] = useState<Time>({ hour: 16, minute: 0 });
  const [lunchStartTime, setLunchTime] = useState<Time>({
    hour: 12,
    minute: 0,
  });
  const [hadLunch, setHadLunch] = useState<boolean>(true);
  const [isPublicHoliday, setIsPublicHoliday] = useState<boolean>(false);
  const [totalHoursWorked, setTotalHoursWorked] = useState<number>(0);
  const [eveningHours, setEveningHours] = useState<number>(0);
  const [weekendHours, setWeekendHours] = useState<number>(0);
  const [publicHolidayHours, setPublicHolidayHours] = useState<number>(0);
  const [workedTillNextDay, setWorkedTillNextDay] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  function convert(time: Time): number {
    return time.hour + time.minute / 60;
  }

  const calculateValues = () => {
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
        isPublicHoliday: isPublicHoliday,
        publicHolidayHours: 0.0,
      });

      return;
    }

    const startTimeConverted = convert(startTime);
    const endTimeConverted = convert(endTime);
    const lunchDuration = hadLunch ? 0.5 : 0.0; // hours
    const lunchStartTimeConverted = convert(lunchStartTime);
    var lunchEndTimeConverted = convert(lunchStartTime) + lunchDuration;
    if (lunchEndTimeConverted > 24) {
      lunchEndTimeConverted -= 24;
    }

    const lunchSplit = lunchEndTimeConverted < lunchStartTimeConverted;
    const hadLunchTodayOnly = lunchStartTimeConverted > startTimeConverted;
    const hadLunchNextDayOnly = lunchEndTimeConverted < startTimeConverted;
    const timeWhenEveningStarts = props.eveningStarts; // o'clock
    const timeWhenEveningEnds = props.eveningEnds; // o'clock (next day)
    // we simply assume you've worked to the next day if endTime < startTime
    // because who would ever work more than 24 hours?
    const newWorkedTillNextDay = endTimeConverted < startTimeConverted;
    const day = props.date.getDay();
    const startDayIsWeekend = day === 0 || day === 6; // 0 is sunday, 6 is saturday
    const endDayIsWeekend = day === 5 || day === 6; // 5 is friday, 6 is saturday

    var todaysLunchTime = 0.0;
    var nextDayLunchTime = 0.0;
    var lunchTimeInEvening = 0.0;
    if (hadLunch) {
      if (lunchSplit) {
        todaysLunchTime += 24 - lunchStartTimeConverted;
        nextDayLunchTime += lunchEndTimeConverted;
        lunchTimeInEvening += lunchDuration;
      } else if (hadLunchTodayOnly) {
        todaysLunchTime += lunchDuration;
        lunchTimeInEvening += Math.max(
          0,
          lunchEndTimeConverted -
            Math.max(timeWhenEveningStarts, lunchStartTimeConverted)
        );
      } else if (hadLunchNextDayOnly) {
        nextDayLunchTime += lunchDuration;
        lunchTimeInEvening += Math.max(
          0,
          lunchStartTimeConverted -
            Math.max(timeWhenEveningEnds, lunchEndTimeConverted)
        );
      }
    }

    var newTotalHoursWorked = 0.0;
    var newEveningHours = 0.0;
    var newWeekendHours = 0.0;
    var newPublicHolidayHours = 0.0;
    if (newWorkedTillNextDay) {
      const hoursWorkedToday = 24 - startTimeConverted - todaysLunchTime;
      const hoursWorkedNextDay = endTimeConverted - nextDayLunchTime;
      newTotalHoursWorked = hoursWorkedToday + hoursWorkedNextDay;
      // we add either public holiday hours or weekend hours, not both
      if (isPublicHoliday) {
        newPublicHolidayHours += hoursWorkedToday;
      } else if (startDayIsWeekend) {
        newWeekendHours += hoursWorkedToday;
      }

      if (props.tomorrowIsPublicHoliday) {
        newPublicHolidayHours += hoursWorkedNextDay;
      } else if (endDayIsWeekend) {
        newWeekendHours += hoursWorkedNextDay;
      }

      newEveningHours +=
        24 - Math.max(timeWhenEveningStarts, startTimeConverted);
      newEveningHours += Math.min(timeWhenEveningEnds, endTimeConverted);
      newEveningHours -= lunchTimeInEvening;
    } else {
      newTotalHoursWorked =
        endTimeConverted - startTimeConverted - lunchDuration;
      newEveningHours +=
        Math.max(
          0,
          endTimeConverted - Math.max(timeWhenEveningStarts, startTimeConverted)
        ) - lunchTimeInEvening;
      if (isPublicHoliday) {
        newPublicHolidayHours += newTotalHoursWorked;
      } else if (startDayIsWeekend) {
        newWeekendHours += newTotalHoursWorked;
      }
    }

    newTotalHoursWorked = Math.max(0, newTotalHoursWorked);
    newEveningHours = Math.max(0, newEveningHours);
    newWeekendHours = Math.max(0, newWeekendHours);
    newPublicHolidayHours = Math.max(0, newPublicHolidayHours);

    setTotalHoursWorked(newTotalHoursWorked);
    setEveningHours(newEveningHours);
    setWeekendHours(newWeekendHours);
    setWorkedTillNextDay(newWorkedTillNextDay);
    setPublicHolidayHours(newPublicHolidayHours);

    if (newTotalHoursWorked === 0) {
      setError("Du kan ikke ha jobbet i null timer.");
    } else if (hadLunch && newTotalHoursWorked < 5.5) {
      setError(
        "Obs: Du har ikke krav på lunsj om du jobbet mindre enn 5.5 timer."
      );
    } else if (!hadLunch && newTotalHoursWorked >= 5.5) {
      setError(
        "Obs: Du har krav på lunsj når du har jobbet mer enn 5.5 timer."
      );
    } else if (hadLunch && newTotalHoursWorked < lunchDuration) {
      setError(
        "Du har jobbet mindre enn 0.5 timer. Det er kortere enn lunsjen din."
      );
    } else if (lunchSplit && !workedTillNextDay) {
      setError("Du kan ikke ha lunsj utenom arbeidstid.");
    } else if (
      !workedTillNextDay &&
      hadLunchTodayOnly &&
      (lunchStartTimeConverted < startTimeConverted ||
        lunchEndTimeConverted > endTimeConverted)
    ) {
      setError("Du kan ikke ha lunsj utenom arbeidstid.");
    } else if (
      hadLunchNextDayOnly &&
      lunchEndTimeConverted > endTimeConverted
    ) {
      setError("Du kan ikke ha lunsj utenom arbeidstid.");
    } else {
      setError(undefined);
    }

    props.onChange({
      workedThatDay: true,
      totalHoursWorked: newTotalHoursWorked,
      eveningHours: newEveningHours,
      weekendHours: newWeekendHours,
      date: props.date,
      error: error !== undefined,
      isPublicHoliday: isPublicHoliday,
      publicHolidayHours: newPublicHolidayHours,
    });
  };

  useEffect(() => {
    calculateValues();
  }, [
    startTime,
    endTime,
    hadLunch,
    lunchStartTime,
    workedThatDay,
    props.eveningStarts,
    props.eveningEnds,
    isPublicHoliday,
    props.tomorrowIsPublicHoliday,
  ]);

  const renderTitle = () => {
    const day = Days.find((x) => x.key === props.date.getDay());
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Header
          as="h3"
          style={{
            opacity: workedThatDay ? "1.0" : "0.4",
            color: isPublicHoliday ? "red" : "black",
          }}
        >
          {day?.text} {props.date.getDate()}.{" "}
          {Months.find((x) => x.value - 1 === props.date.getMonth())?.text}{" "}
          {props.date.getFullYear()}
        </Header>

        <div style={{ display: "flex" }}>
          <Checkbox
            style={{ marginRight: "2rem" }}
            label="Dette er en helligdag"
            checked={isPublicHoliday}
            onChange={(e, data) => setIsPublicHoliday(!isPublicHoliday)}
          />

          {!workedThatDay && (
            <Button
              color="pink"
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
                color="pink"
                style={{ marginBottom: "1rem" }}
              >
                <Icon name={hidden ? `angle down` : `angle up`} />
                {hidden ? "Vis" : "Skjul"}
              </Button>

              <Button
                color="black"
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
                value={lunchStartTime}
                onChange={(time: Time): void => {
                  setLunchTime(time);
                }}
              />
            </Grid.Column>
          )}
        </Grid>
        {error && (
          <Message icon negative>
            <Icon name="exclamation triangle" />
            <Message.Content>
              <Message.Header>Noe er feil</Message.Header>
              {error}
            </Message.Content>
          </Message>
        )}
        <p>
          Du jobbet fra {String(startTime.hour).padStart(2, "0")}:
          {String(startTime.minute).padStart(2, "0")} til{" "}
          {String(endTime.hour).padStart(2, "0")}:
          {String(endTime.minute).padStart(2, "0")}
          {workedTillNextDay && " dagen etter"}.{" "}
        </p>

        <Divider />
        <Grid doubling columns={5}>
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

          <Grid.Column>
            <Header as="h5">Helligdagstillegg</Header>
            <p>{publicHolidayHours.toFixed(2)} timer.</p>
          </Grid.Column>
        </Grid>
      </>
    );
  };

  return (
    <Segment key={props.date.getTime()} style={{ backgroundColor: "#fcd8ea" }}>
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
