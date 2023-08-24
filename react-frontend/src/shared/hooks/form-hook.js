import { useReducer, useCallback } from "react";

const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE": {
      let FormIsValid = true;
      for (const inputId in state.inputs) {
        if(!state.inputs[inputId]){
          continue;
        }
        if (action.inputId === inputId) {
          FormIsValid = FormIsValid && action.isValid;
        } else {
          FormIsValid = FormIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: {
            value: action.value,
            isValid: action.isValid,
          },
        },
        isValid: FormIsValid,
      };
    }
    case "SET_FORM":
      return {
        inputs: action.inputs,
        isValid: action.FormisValid,
      };
    default:
      return state;
  }
};

export const useForm = (initialState, initialFormValidity) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialState,
    isValid: initialFormValidity,
  });

  const InputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: "INPUT_CHANGE",
      inputId: id,
      isValid: isValid,
      value: value,
    });
  }, []);

  const setForm = useCallback((inputData, FormValidity) => {
    dispatch({
      type: "SET_FORM",
      inputs: inputData,
      FormisValid: FormValidity,
    });
  }, []);

  return [formState, InputHandler, setForm];
};
