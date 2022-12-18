import React, { useState } from "react";
import {
  Button,
  Container,
  Dropdown,
  Header,
  Input,
  Segment,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "./App.css";
import Day from "./components/Day";

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
  const [year, setYear] = useState<number>(2022);
  const [month, setMonth] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [days, setDays] = useState<Array<Date>>([]);
  const [value, onChange] = useState("10:00");

  const renderFirstPage = () => {
    return (
      <>
        <Header as="h5">År</Header>
        <Input
          type="number"
          value={year}
          onChange={(_, data) => {
            setYear(+(data.value ?? "2023"));
          }}
        ></Input>

        <Header as="h5">Måned</Header>
        <Dropdown
          value={month}
          options={options}
          onChange={(_, data) => {
            setMonth(+(data.value ?? "1"));
          }}
        />

        <br />
        <br />

        <Button
          primary
          onClick={() => {
            setDays(getDaysInMonth(month - 1, year));
            setPage(2);
          }}
        >
          OK, fortsett
        </Button>
      </>
    );
  };

  const renderSecondPage = () => {
    return (
      <>
        <Header as="h5">År</Header>
        <p>{year}</p>
        <Header as="h5">Måned</Header>
        <p>{options.find((d) => d.key === month)?.text}</p>
        <Header as="h4">Dager</Header>
        {days.map((x) => (
          <div key={x.getTime()} style={{ margin: "1rem" }}>
            <Day date={x} />
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
      <Container style={{ marginTop: "4rem" }}>
        <Header as="h1">Timeliste</Header>
        {renderPage()}
      </Container>
    </div>
  );
}

export default App;
