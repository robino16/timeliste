import { useEffect, useState } from "react";
import { Input } from "semantic-ui-react";
import { Time } from "../definitions/definitions";

interface TimePickerProps {
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
            var newHour = hour + 1;
            if (newHour > 23) {
              newHour = 0;
            }
            setHour(newHour);
          } else if (newVal < 0) {
            newVal = 59;
            var newHour = hour - 1;
            if (newHour < 0) {
              newHour = 23;
            }
            setHour(newHour);
          }
          setMinute(newVal);
        }}
      ></Input>
    </div>
  );
};

export default TimePicker;
