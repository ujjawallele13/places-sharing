import React, { useReducer, useEffect } from "react";
import { validate } from "../../util/validators";
import "./Input.css";

const InputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case "TOUCH":
      return {
        ...state,
        isTouched: true,
      };

    default:
      return state;
  }
};

const Input = (props) => {
  const [InputState, dispatcher] = useReducer(InputReducer, {
    value: props.initialValue || "",
    isValid: props.initialValid || false,
    isTouched: false,
  });
  const EnteredTextChangeHandler = (event) => {
    dispatcher({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
  };
  const TouchHandler = (event) => {
    dispatcher({ type: "TOUCH" });
  };
  
  const { InputChange, id } = props;
  const { value, isValid } = InputState;

  useEffect(() => {
    InputChange(id, value, isValid)
  }, [InputChange, id, value, isValid]);

  const element =
    props.element === "input" ? (
      <input
        type={props.type}
        id={props.id}
        placeholder={props.placeholder}
        value={InputState.value}
        onChange={EnteredTextChangeHandler}
        onBlur={TouchHandler}
      />
    ) : (
      <textarea
        rows={props.rows || 3}
        id={props.id}
        value={InputState.value}
        onChange={EnteredTextChangeHandler}
        onBlur={TouchHandler}
      />
    );

  return (
    <div
      className={`form-control ${
        !InputState.isValid && InputState.isTouched && "form-control--invalid"
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!InputState.isValid && InputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
