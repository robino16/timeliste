import { useEffect, useState } from "react";
import { Input } from "semantic-ui-react";

interface TimePickerProps {
  value?: Time;
  onChange: (time: Time) => void;
}

export interface Time {
  hour: number;
  minute: number;
}

const TimePicker = (props: TimePickerProps) => {
  const [hour, setHour] = useState<number>(props.value?.hour ?? 0);
  const [minute, setMinute] = useState<number>(props.value?.minute ?? 0);

  useEffect(() => {
    props.onChange({ hour, minute });
  }, [hour, minute]);

  return (
    <div style={{ display: "flex" }}>
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
      :
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
