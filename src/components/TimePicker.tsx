import { useEffect, useState } from "react";
import { Input } from "semantic-ui-react";
import { Time } from "../definitions/definitions";

interface TimePickerProps {
  min?: Time;
  max?: Time;
  value?: Time;
  onChange: (time: Time) => void;
}

const TimePicker = (props: TimePickerProps) => {
  const [hour, setHour] = useState<number>(props.value?.hour ?? 0);
  const [minute, setMinute] = useState<number>(props.value?.minute ?? 0);

  useEffect(() => {
    props.onChange({ hour, minute });
  }, [hour, minute]);

  useEffect(() => {}, [props.value]);

  // useEffect(() => {
  //   if (props.min) {
  //     const minConverted = props.min.hour + props.min.minute / 60;
  //     const thisConverted = hour + minute / 60;
  //     if (minConverted > thisConverted) {
  //       setHour(props.min.hour);
  //       setMinute(props.min.minute);
  //     }
  //   }
  // }, [props.min]);

  // useEffect(() => {
  //   if (props.max) {
  //     const maxConverted = props.max.hour + props.max.minute / 60;
  //     const thisConverted = hour + minute / 60;
  //     if (maxConverted < thisConverted) {
  //       setHour(props.max.hour);
  //       setMinute(props.max.minute);
  //     }
  //   }
  // }, [props.max]);

  return (
    <div style={{ display: "flex", marginBottom: "1rem" }}>
      <Input
        type="number"
        value={hour}
        max={24}
        min={-1}
        style={{ maxWidth: "5rem" }}
        onChange={(_, data) => {
          var newVal = +(data.value ?? "0");
          if (newVal > 23) {
            newVal = 0;
          } else if (newVal < 0) {
            newVal = 23;
          }
          setHour(newVal);
        }}
      ></Input>
      <Input
        type="number"
        value={minute}
        max={60}
        min={-1}
        style={{ maxWidth: "5rem" }}
        onChange={(_, data) => {
          var newVal = +(data.value ?? "0");
          if (newVal > 59) {
            newVal = 0;
          } else if (newVal < 0) {
            newVal = 59;
          }
          setMinute(newVal);
        }}
      ></Input>
    </div>
  );
};

export default TimePicker;
