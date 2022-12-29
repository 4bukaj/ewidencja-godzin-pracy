import React, { useState } from "react";
import Button from "../button/Button";
import "./Auth.css";
import HttpsIcon from "@mui/icons-material/Https";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import Box from "@mui/material/Box";
import { TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/Auth";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { watch, register } = useForm();
  const iconsColor = "#267cf7";
  const [emailError, setEmailError] = useState();
  const [passwordError, setPasswordError] = useState();
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setEmailError("");
      setPasswordError("");
      await login(watch().email, watch().password);
      navigate("/");
    } catch (error) {
      console.log(error.code);
      switch (error.code) {
        case "auth/invalid-email":
          setEmailError("Wrong email format");
          break;
        case "auth/user-not-found":
          setEmailError("User not found");
          break;
        case "auth/wrong-password":
          setPasswordError("Wrong password");
          break;
        default:
          setEmailError(error.message);
          break;
      }
    }
  }
  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="title-container">
          <p className="h1">WYPEŁNIJ SE EWIDENCJE</p>
          <p className="h3 text-light">
            Zaloguj się i wygeneruj ewidencje na ten miesiąc
          </p>
        </div>
        <form className="auth-form">
          <section className="auth-form-control">
            <Box
              className="auth-form-box"
              sx={{ display: "flex", alignItems: "flex-end" }}
            >
              <AlternateEmailIcon sx={{ color: iconsColor, mr: 1, my: 0.5 }} />
              <TextField
                label="Email"
                variant="standard"
                helperText={emailError}
                error={emailError && true}
                {...register("email")}
                className="box-input"
              />
            </Box>
            <Box
              className="auth-form-box"
              sx={{ display: "flex", alignItems: "flex-end" }}
            >
              <HttpsIcon sx={{ color: iconsColor, mr: 1, my: 0.5 }} />
              <TextField
                label="Hasło"
                variant="standard"
                type="password"
                helperText={passwordError}
                error={passwordError && true}
                {...register("password")}
                className="box-input"
              />
            </Box>
            <Button
              onClick={handleSubmit}
              type="submit"
              title="Zaloguj"
              style="solid"
            />
          </section>
        </form>
        <div className="bottom-controls">
          <span className="text-light">Potrzebujesz konta?&nbsp;</span>
          <Link to="/signup" className="bottom-controls-link">
            Zarejestruj się
          </Link>
        </div>
      </div>
    </div>
  );
}
