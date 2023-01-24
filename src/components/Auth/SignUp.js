import React, { useState, useRef } from "react";
import { TextField } from "@mui/material";
import "./Auth.css";
import Button from "../button/Button";
import { useForm } from "react-hook-form";
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
import InputAdornment from "@mui/material/InputAdornment";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import BadgeIcon from "@mui/icons-material/Badge";

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
  const [selectedDate, setSelectedDate] = useState(null);
  const canvas = useRef(null);
  const [title, setTitle] = useState("stwórz konto");
  const [subtitle, setSubtitle] = useState(
    "A następnie podaj nam kilka szczegółów"
  );

  async function createAccount(e) {
    e.preventDefault();

    try {
      if (watch().password !== watch().confirmpassword) {
        setPasswordError("Hasła nie są takie same");

        return;
      }
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
    setTitle("KONTO ZOSTAŁO STWORZONE");
    setSubtitle("Zostało jeszcze kilka szczegółów");
  }

  const updateUserInfo = async (e) => {
    e.preventDefault();

    try {
      await setDoc(doc(db, "users-data", currentUser.uid), {
        name: watch().name,
        lastname: watch().lastname,
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
    setTitle(`ŚWIETNIE ${watch().name}!`);
    setSubtitle("Teraz poprosimy o autograf (1/3)");
  };

  const clearCanvas = () => {
    canvas.current.clear();
  };

  const updateSignature = async (e) => {
    e.preventDefault();
    if (formStep === 2) {
      await updateDoc(doc(db, "users-data", currentUser.uid), {
        firstSignature: canvas.current.getDataURL(),
      });
      setTitle("Jeszcze raz");
      setSubtitle("Teraz poprosimy o autograf (2/3)");
    } else if (formStep === 3) {
      await updateDoc(doc(db, "users-data", currentUser.uid), {
        secondSignature: canvas.current.getDataURL(),
      });
      setTitle("To już ostatni");
      setSubtitle("Teraz poprosimy o autograf (3/3)");
    } else {
      await updateDoc(doc(db, "users-data", currentUser.uid), {
        thirdSignature: canvas.current.getDataURL(),
      });
      navigate("/");
    }

    canvas.current.clear();
    setFormStep((cur) => cur + 1);
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="title-container">
          <p className="h1 mb30">{title}</p>
          <p className="h3 text-light">{subtitle}</p>
        </div>
        <form className="auth-form">
          <section className="auth-form-control">
            {formStep === 0 && (
              <>
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

                <div className="input-container">
                  <TextField
                    id="outlined-basic"
                    label="Powtórz hasło"
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
                    {...register("confirmpassword")}
                    className="box-input"
                  />
                </div>
                <Button
                  onClick={createAccount}
                  type="submit"
                  title="Dalej"
                  style="solid"
                  disabled={
                    !watch().email ||
                    !watch().password ||
                    !watch().confirmpassword
                  }
                />
              </>
            )}
            {formStep === 1 && (
              <>
                <div className="double-input-row">
                  <div className="input-container">
                    <TextField
                      id="outlined-basic"
                      label="Imię"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BadgeIcon
                              sx={{ color: iconsColor, mr: 1, my: 0.5 }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                      helperText={emailError}
                      error={emailError && true}
                      {...register("name")}
                      className="box-input"
                    />
                  </div>
                  <div className="input-container">
                    <TextField
                      id="outlined-basic"
                      label="Nazwisko"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BadgeIcon
                              sx={{ color: iconsColor, mr: 1, my: 0.5 }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                      helperText={emailError}
                      error={emailError && true}
                      {...register("lastname")}
                      className="box-input"
                    />
                  </div>
                </div>
                <div className="input-container">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack spacing={4} sx={{ width: "100%" }}>
                      <DatePicker
                        label="Data podpisania umowy"
                        inputFormat="DD/MM/YYYY"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
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
                </div>

                <Button
                  type="submit"
                  title="Dalej"
                  onClick={updateUserInfo}
                  style="solid"
                  disabled={!watch().name || !watch().lastname || !selectedDate}
                />
              </>
            )}
            {formStep >= 2 && (
              <>
                <CanvasDraw
                  className="auth-form-signature"
                  lazyRadius={1}
                  brushRadius={3}
                  brushColor="#000"
                  canvasHeight={100}
                  canvasWidth={400}
                  ref={canvas}
                  hideGrid
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
                    title={formStep === 4 ? "Stwórz konto" : "Dalej"}
                    onClick={updateSignature}
                    style="solid"
                  />
                </div>
              </>
            )}
          </section>
        </form>
        {formStep === 0 && (
          <div className="bottom-controls">
            <span className="text-light">Masz już konto?&nbsp;</span>
            <Link to="/login" className="bottom-controls-link">
              Zaloguj się
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
