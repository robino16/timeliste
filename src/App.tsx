import { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Header,
  Input,
  Message,
  Segment,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "./App.css";
import Day from "./components/Day";
import { addDays, addMonths } from "date-fns";
import { DayValue } from "./definitions/definitions";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

function getDaysInRange(startDate: Date, endDate: Date): Date[] {
  const days = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return days;
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

function App() {
  var init = addMonths(new Date(), -1);
  const [days, setDays] = useState<Array<Date>>([]);
  const [values, setValues] = useState<Array<DayValue>>([]);
  const [startDate, setStartDate] = useState<Date>(init);
  const [endDate, setEndDate] = useState(new Date());
  const [eveningStarts, setEveningStarts] = useState<number>(17); // o'clock today
  const [eveningEnds, setEveningEnds] = useState<number>(6); // o'clock next morning

  const [totalHoursWorked, setTotalHoursWorked] = useState<number>(0.0);
  const [totalWeekendHours, setTotalWeekendHours] = useState<number>(0.0);
  const [totalEveningHours, setTotalEveningHours] = useState<number>(0.0);
  const [totalPublicHolidayHours, setTotalPublicHolidayHours] =
    useState<number>(0.0);

  useEffect(() => {
    setTotalHoursWorked(
      values.reduce((sum, current) => sum + current.totalHoursWorked, 0)
    );
    setTotalEveningHours(
      values.reduce((sum, current) => sum + current.eveningHours, 0)
    );
    setTotalWeekendHours(
      values.reduce((sum, current) => sum + current.weekendHours, 0)
    );
    setTotalPublicHolidayHours(
      values.reduce((sum, current) => sum + current.publicHolidayHours, 0)
    );
  }, [values]);

  const onChange = (value: DayValue) => {
    var newValues = values.filter(
      (x) => x.date.getDate() !== value.date.getDate() && value.workedThatDay
    );
    newValues.push(value);
    setValues(newValues);
  };

  useEffect(() => {
    const newDays = getDaysInRange(startDate, endDate);
    setDays(newDays);
    setValues(values.filter((x) => newDays.findIndex((y) => +x === +y) !== -1));
  }, [startDate, endDate]);

  const renderPage = () => {
    return (
      <>
        <Segment style={{ backgroundColor: "#fcd8ea" }}>
          <Header as="h3">Oppsummering</Header>
          <p>Denne informasjonen kan du sende til lederen din.</p>
          <Grid doubling columns={6}>
            <Grid.Column>
              <Header as="h4">Fra</Header>
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  if (date !== undefined && date !== null) {
                    setStartDate(date);
                  }
                }}
              />
            </Grid.Column>

            <Grid.Column>
              <Header as="h4">Til</Header>
              <DatePicker
                selected={endDate}
                onChange={(date) => {
                  if (date !== undefined && date !== null) {
                    setEndDate(date);
                  }
                }}
              />
            </Grid.Column>
          </Grid>

          {+endDate < +startDate && (
            <Message error>
              <Message.Header>Nå tuller du</Message.Header>
              'Fra'-datoen må jo være tidligere enn 'til'-datoen.
            </Message>
          )}
          <Grid doubling columns={5}>
            <Grid.Column>
              <Segment style={{ backgroundColor: "#ffe8f3" }}>
                <Header as="h4">Arbeidstimer</Header>
                <p style={{ fontSize: "1.5rem" }}>
                  {totalHoursWorked.toFixed(2)}
                </p>
              </Segment>
            </Grid.Column>

            <Grid.Column>
              <Segment style={{ backgroundColor: "#ffe8f3" }}>
                <Header as="h4">Timer med kveldstillegg</Header>
                <p style={{ fontSize: "1.5rem" }}>
                  {totalEveningHours.toFixed(2)}
                </p>
              </Segment>
            </Grid.Column>

            <Grid.Column>
              <Segment style={{ backgroundColor: "#ffe8f3" }}>
                <Header as="h4">Timer med helgetillegg</Header>
                <p style={{ fontSize: "1.5rem" }}>
                  {totalWeekendHours.toFixed(2)}
                </p>
              </Segment>
            </Grid.Column>

            <Grid.Column>
              <Segment style={{ backgroundColor: "#ffe8f3" }}>
                <Header as="h4">Timer med helligdagstillegg</Header>
                <p style={{ fontSize: "1.5rem" }}>
                  {totalPublicHolidayHours.toFixed(2)}
                </p>
              </Segment>
            </Grid.Column>
          </Grid>
        </Segment>

        <Header as="h2">Dager</Header>
        {days.map((x, i) => {
          const tomorrow = values.find((y) => isSameDay(y.date, addDays(x, 1)));
          const tomorrowIsPublicHoliday =
            (tomorrow && tomorrow.isPublicHoliday) ?? false;

          return (
            <div key={x.getTime()} style={{ marginTop: "2rem" }}>
              <Day
                date={x}
                onChange={onChange}
                eveningStarts={eveningStarts}
                eveningEnds={eveningEnds}
                tomorrowIsPublicHoliday={tomorrowIsPublicHoliday}
              />
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div className="App">
      <Container>
        <Segment style={{ backgroundColor: "#ff88c3" }}>
          <Header as="h1">Timelistekalkulator</Header>
          <Segment style={{ backgroundColor: "#fcd8ea" }}>
            <Header as="h4">Kveldstillegg</Header>
            <p>Her kan du endre hvordan kveldstillegg skal regnes ut.</p>
            <div style={{ display: "flex" }}>
              <p>Kveldstillegg begynner kl.</p>{" "}
              <Input
                type="number"
                value={eveningStarts}
                max={24}
                min={-1}
                style={{
                  maxWidth: "5rem",
                  marginLeft: "0.4rem",
                  marginRight: "0.4rem",
                }}
                onChange={(_, data) => {
                  var newVal = +(data.value ?? "0");
                  if (newVal > 23) {
                    newVal = 0;
                  } else if (newVal < 0) {
                    newVal = 23;
                  }
                  setEveningStarts(newVal);
                }}
              />
              <p>og slutter kl.</p>{" "}
              <Input
                type="number"
                value={eveningEnds}
                max={24}
                min={-1}
                style={{
                  maxWidth: "5rem",
                  marginLeft: "0.4rem",
                  marginRight: "0.4rem",
                }}
                onChange={(_, data) => {
                  var newVal = +(data.value ?? "0");
                  if (newVal > 23) {
                    newVal = 0;
                  } else if (newVal < 0) {
                    newVal = 23;
                  }
                  setEveningEnds(newVal);
                }}
              />
              <p>dagen etter.</p>
            </div>
            <p>
              Husk at denne appen ikke tar hensyn til endring mellom sommertid
              og vintertid.
            </p>
          </Segment>
          {renderPage()}
        </Segment>
      </Container>
    </div>
  );
}

export default App;
