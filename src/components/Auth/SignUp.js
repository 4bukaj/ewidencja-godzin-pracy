import React, { useState, useRef } from "react";
import { TextField } from "@mui/material";
import "./Auth.css";
import Button from "../button/Button";
import Box from "@mui/material/Box";
import { useForm } from "react-hook-form";
import HttpsIcon from "@mui/icons-material/Https";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { useAuth, currentUser } from "../../contexts/Auth";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../../firebase";
import { collection, addDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { storage } from "../../firebase";
import { ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { Stack } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CanvasDraw from "react-canvas-draw";

export default function SignUp() {
  const [formStep, setFormStep] = useState(0);
  const { watch, register } = useForm();
  const { signup } = useAuth();
  const iconsColor = "#267cf7";
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState();
  const [passwordError, setPasswordError] = useState();
  const { currentUser } = useAuth();
  const userInfoDB = collection(db, "users-data");
  const [imageUpload, setImageUpload] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const canvas = useRef(null);
  const [firstSignature, setFirstSignature] = useState();
  const [secondSignature, setSecondSignature] = useState();
  const [thirdSignature, setThirdSignature] = useState();

  async function createAccount(e) {
    e.preventDefault();

    try {
      setEmailError("");
      setPasswordError("");
      await signup(watch().email, watch().password);
      setFormStep((cur) => cur + 1);
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          setEmailError("Niepoprawny format adresu email");
          break;
        case "auth/email-already-in-use":
          setEmailError("Podany adres email jest już w użyciu");
          break;
        case "auth/weak-password":
          setPasswordError("Hasło musi składac się z conajmiej 6 znaków");
          break;
        default:
          setEmailError(error.message);
          break;
      }
    }
  }

  const updateUserInfo = async (e) => {
    e.preventDefault();

    try {
      await setDoc(doc(db, "users-data", currentUser.uid), {
        name: watch().name,
        startDate: selectedDate,
      });
      // if (imageUpload == null) return;
      // const imageRef = ref(
      //   storage,
      //   `${currentUser.uid}/${imageUpload.name + v4()}`
      // );
      // uploadBytes(imageRef, imageUpload);
      // navigate("/");
    } catch (error) {
      console.log(error);
    }

    setFormStep((cur) => cur + 1);
  };

  const clearCanvas = () => {
    canvas.current.clear();
  };

  const updateSignature = async (e) => {
    e.preventDefault();
    setFirstSignature(canvas.current.getDataURL());
    await updateDoc(doc(db, "users-data", currentUser.uid), {
      signature: canvas.current.getDataURL(),
    });
    navigate("/");
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="title-container">
          <p className="h1">STWÓRZ KONTO</p>
          <p className="h3 text-light">i sprawdź jakie to proste</p>
        </div>
        <form className="auth-form">
          {formStep === 0 && (
            <section className="auth-form-control">
              <Box
                className="auth-form-box"
                sx={{ display: "flex", alignItems: "flex-end" }}
              >
                <AlternateEmailIcon
                  sx={{ color: iconsColor, mr: 1, my: 0.5 }}
                />
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
              <Box
                className="auth-form-box"
                sx={{ display: "flex", alignItems: "flex-end" }}
              >
                <HttpsIcon sx={{ color: iconsColor, mr: 1, my: 0.5 }} />
                <TextField
                  label="Powtórz hasło"
                  variant="standard"
                  type="password"
                  helperText={passwordError}
                  error={passwordError && true}
                  {...register("confirmpassword")}
                  className="box-input"
                />
              </Box>
              <Button
                onClick={createAccount}
                type="button"
                title="Dalej"
                style="solid"
              />
            </section>
          )}
          {formStep === 1 && (
            <section className="auth-form-control">
              <Box
                className="auth-form-box"
                sx={{ display: "flex", alignItems: "flex-end" }}
              >
                <AccountBoxIcon sx={{ color: iconsColor, mr: 1, my: 0.5 }} />
                <TextField
                  label="Imię i Nazwisko"
                  variant="standard"
                  {...register("name")}
                  className="box-input"
                />
              </Box>
              <Box
                className="auth-form-box"
                sx={{ display: "flex", alignItems: "flex-end" }}
              >
                <AccountBoxIcon sx={{ color: iconsColor, mr: 1, my: 0.5 }} />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Stack spacing={4} sx={{ width: "250px" }}>
                    <DatePicker
                      label="Data podpisania umowy"
                      inputFormat="DD/MM/YYYY"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="standard"
                          {...register("date")}
                        />
                      )}
                      value={selectedDate}
                      onChange={(newValue) => {
                        setSelectedDate(new Date(newValue));
                      }}
                    />
                  </Stack>
                </LocalizationProvider>
              </Box>

              <Button
                type="button"
                title="Stwórz konto"
                onClick={updateUserInfo}
                style="solid"
              />
            </section>
          )}
          {formStep === 2 && (
            <section className="auth-form-control">
              <CanvasDraw
                className="auth-form-signature"
                lazyRadius={1}
                brushRadius={3}
                brushColor="#000"
                canvasWidth={400}
                canvasHeight={100}
                ref={canvas}
              />
              <div className="double-button">
                <Button
                  type="button"
                  title="Reset"
                  onClick={clearCanvas}
                  style="outlined"
                />
                <Button
                  type="submit"
                  title="Stwórz konto"
                  onClick={updateSignature}
                  style="solid"
                />
              </div>
            </section>
          )}
        </form>
        <div className="bottom-controls">
          <span className="text-light">Masz już konto?&nbsp;</span>
          <Link to="/login" className="bottom-controls-link">
            Zaloguj się
          </Link>
        </div>
      </div>
    </div>
  );
}
