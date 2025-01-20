import React from "react";
import { observer } from "mobx-react-lite";
import { queryParamsStore } from "./Store";

const MyComponent: React.FC = observer(() => {
  return (
    <div>
      <Setter param="foo" />
      <Setter param="bar" />
      <Setter param="baz" />
      <Listener param="foo" />
      <Listener param="bar" />
      <Listener param="baz" />
      <ChangeMultiple />
      <Override />
    </div>
  );
});

const Setter = observer(({ param }: { param: string }) => {
  const value = queryParamsStore.getParam(param);

  return (
    <div>
      <input
        type="text"
        value={value || ""}
        onChange={(e) =>
          queryParamsStore.setParam(param, e.currentTarget.value)
        }
        placeholder={`Enter ${param}`}
      />
    </div>
  );
});

const Listener = observer(({ param }: { param: string }) => {
  const value = queryParamsStore.getParam(param);

  return (
    <div>
      Listener for {param} - {value}
    </div>
  );
});

const ChangeMultiple = observer(() => {
  return (
    <div>
      <button
        onClick={() =>
          queryParamsStore.mergeParams({ foo: "fooooo", bar: "baaaar" })
        }
      >
        Change Multiple
      </button>
    </div>
  );
});

const Override = observer(() => {
  return (
    <div>
      <button onClick={() => queryParamsStore.setParams({ foo: "fooooo" })}>
        Override
      </button>
    </div>
  );
});

export default MyComponent;
