import React, { useState, useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import { useForm } from "../../shared/hooks/form-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import Button from "../../shared/components/FormElements/Button";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./Auth.css";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setForm] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (isLoginMode) {
      setForm(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    } else {
      setForm(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (isLoginMode) {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.login(responseData.userId, responseData.token);
      } else {
        const formData = new FormData();
        formData.append("email", formState.inputs.email.value);
        formData.append("name", formState.inputs.name.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);

        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/signup",
          "POST",
          formData
        );
        auth.login(responseData.userId, responseData.token);
      }
    } catch (err) {}
  };

  return (
    <React.Fragment>
      {error && <ErrorModal error={error} onClear={clearError} />}
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <form onSubmit={onSubmitHandler}>
          <h2>Login Required</h2>
          <hr />
          {!isLoginMode && (
            <Input
              id="name"
              element="input"
              type="text"
              label="Your name"
              validators={[VALIDATOR_REQUIRE()]}
              InputChange={inputHandler}
              errorText="Please enter the correct name"
            />
          )}
          {!isLoginMode && (
            <ImageUpload
              center
              id="image"
              InputChange={inputHandler}
              errorText="Please provide an image"
            />
          )}
          <Input
            id="email"
            element="input"
            type="text"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            InputChange={inputHandler}
            errorText="Please enter the correct email"
          />
          <Input
            id="password"
            element="input"
            type="password"
            label="Password"
            InputChange={inputHandler}
            validators={[VALIDATOR_MINLENGTH(3)]}
            errorText="Please enter the correct password(min 3 length)."
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "LOGIN" : "SIGNUP"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
