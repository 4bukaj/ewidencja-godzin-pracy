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
import InputAdornment from "@mui/material/InputAdornment";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";

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
          setEmailError("Niepoprawny email");
          break;
        case "auth/user-not-found":
          setEmailError("Nie znaleziono użytkownika");
          break;
        case "auth/wrong-password":
          setPasswordError("Niepoprawne hasło");
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
          <p className="h1 mb30">WYPEŁNIJ SE EWIDENCJE</p>
          <p className="h3  text-light">Zaloguj się i zobacz jakie to proste</p>
        </div>
        <form className="auth-form">
          <section className="auth-form-control">
            <div className="input-container">
              <TextField
                id="outlined-basic"
                label="Email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlineIcon
                        sx={{ color: iconsColor, mr: 1, my: 0.5 }}
                      />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                helperText={emailError}
                error={emailError && true}
                {...register("email")}
                className="box-input"
              />
            </div>
            <div className="input-container">
              <TextField
                id="outlined-basic"
                label="Hasło"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOpenIcon
                        sx={{ color: iconsColor, mr: 1, my: 0.5 }}
                      />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                type="password"
                helperText={passwordError}
                error={passwordError && true}
                {...register("password")}
                className="box-input"
              />
            </div>
            <Button
              onClick={handleSubmit}
              type="submit"
              title="Zaloguj"
              style="solid"
              disabled={!watch().email || !watch().password}
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
