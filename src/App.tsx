import { useEffect, useState } from "react";
import {
  Button,
  Container,
  Dropdown,
  Grid,
  Header,
  Input,
  Segment,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "./App.css";
import Day from "./components/Day";
import { addMonths } from "date-fns";
import { DayValue, Months } from "./definitions/definitions";

function getDaysInMonth(month: number, year: number): Array<Date> {
  var date = new Date(year, month, 1);
  var days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return days;
}

function App() {
  var init = addMonths(new Date(), -1);
  const [year, setYear] = useState<number>(init.getFullYear());
  const [month, setMonth] = useState<number>(init.getMonth() + 1);
  const [page, setPage] = useState<number>(1);
  const [days, setDays] = useState<Array<Date>>([]);
  const [values, setValues] = useState<Array<DayValue>>([]);
  const [error, setError] = useState<boolean>(false);

  const [totalHoursWorked, setTotalHoursWorked] = useState<number>(0.0);
  const [totalWeekendHours, setTotalWeekendHours] = useState<number>(0.0);
  const [totalEveningHours, setTotalEveningHours] = useState<number>(0.0);

  const renderFirstPage = () => {
    return (
      <Grid doubling columns={5} style={{ marginTop: "1rem" }}>
        <Grid.Column width={2}>
          <Header as="h5">Måned</Header>
          <Dropdown
            value={month}
            options={Months}
            onChange={(_, data) => {
              setMonth(+(data.value ?? "1"));
            }}
          />
        </Grid.Column>

        <Grid.Column widh={2}>
          <Header as="h5">År</Header>
          <Input
            type="number"
            value={year}
            onChange={(_, data) => {
              setYear(+(data.value ?? "2023"));
            }}
          ></Input>
        </Grid.Column>

        <Grid.Column></Grid.Column>

        <Grid.Row style={{ marginLeft: "1rem", paddin: "0" }}>
          <Button
            primary
            onClick={() => {
              setDays(getDaysInMonth(month - 1, year));
              setValues(
                getDaysInMonth(month - 1, year).map(
                  (date) =>
                    ({
                      date: date,
                      workedThatDay: false,
                      totalHoursWorked: 0.0,
                      eveningHours: 0.0,
                      weekendHours: 0.0,
                    } as DayValue)
                )
              );
              setPage(2);
            }}
          >
            OK, fortsett
          </Button>
        </Grid.Row>
      </Grid>
    );
  };

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
  }, [values]);

  const onChange = (value: DayValue) => {
    var newValues = values.filter(
      (x) => x.date.getDate() !== value.date.getDate()
    );
    newValues.push(value);
    setValues(newValues);
  };

  const renderSecondPage = () => {
    return (
      <>
        <Grid doubling>
          <Grid.Column>
            <p style={{ fontSize: "1.5rem" }}>
              {Months.find((d) => d.key === month)?.text} {year}
            </p>
          </Grid.Column>
        </Grid>

        <Grid doubling columns={5}>
          <Grid.Column>
            <Segment style={{ backgroundColor: "#eee" }}>
              <Header as="h4">Arbeidstimer</Header>
              <p style={{ fontSize: "1.5rem" }}>
                {totalHoursWorked.toFixed(2)}
              </p>
            </Segment>
          </Grid.Column>

          <Grid.Column>
            <Segment style={{ backgroundColor: "#eee" }}>
              <Header as="h4">Timer med kveldstillegg</Header>
              <p style={{ fontSize: "1.5rem" }}>
                {totalEveningHours.toFixed(2)}
              </p>
            </Segment>
          </Grid.Column>

          <Grid.Column>
            <Segment style={{ backgroundColor: "#eee" }}>
              <Header as="h4">Timer med helgetillegg</Header>
              <p style={{ fontSize: "1.5rem" }}>
                {totalWeekendHours.toFixed(2)}
              </p>
            </Segment>
          </Grid.Column>
        </Grid>

        <Header as="h2">Dager</Header>
        {days.map((x) => (
          <div key={x.getTime()} style={{ marginTop: "2rem" }}>
            <Day date={x} onChange={onChange} />
          </div>
        ))}
      </>
    );
  };

  const renderPage = () => {
    if (page == 1) {
      return renderFirstPage();
    } else if (page == 2) {
      return renderSecondPage();
    } else {
      return <>Invalid page number</>;
    }
  };

  return (
    <div className="App">
      <Container>
        <Segment style={{ backgroundColor: "#ccc" }}>
          {page === 2 && (
            <Button
              onClick={() => {
                setValues([]);
                setDays([]);
                setPage(1);
              }}
            >
              Gå tilbake
            </Button>
          )}
          <Header as="h1">Timeliste</Header>
          {renderPage()}
        </Segment>
      </Container>
    </div>
  );
}

export default App;
