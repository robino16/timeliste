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

  useEffect(() => {
    if (props.min) {
      const minConverted = props.min.hour + props.min.minute / 60;
      const thisConverted = hour + minute / 60;
      if (minConverted > thisConverted) {
        setHour(props.min.hour);
        setMinute(props.min.minute);
      }
    }
  }, [props.min]);

  useEffect(() => {
    if (props.max) {
      const maxConverted = props.max.hour + props.max.minute / 60;
      const thisConverted = hour + minute / 60;
      if (maxConverted < thisConverted) {
        setHour(props.max.hour);
        setMinute(props.max.minute);
      }
    }
  }, [props.max]);

  return (
    <div style={{ display: "flex", marginBottom: "1rem" }}>
      <Input
        type="number"
        value={hour}
        max={23}
        min={0}
        style={{ maxWidth: "5rem" }}
        onChange={(_, data) => {
          setHour(+(data.value ?? "0"));
        }}
      ></Input>
      <Input
        type="number"
        value={minute}
        max={60}
        min={0}
        style={{ maxWidth: "5rem" }}
        onChange={(_, data) => {
          setMinute(+(data.value ?? "0"));
        }}
      ></Input>
    </div>
  );
};

export default TimePicker;
