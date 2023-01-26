import React, { useEffect, useState } from "react";
import "./Home.css";
import PDF from "./PDF";
import { useAuth } from "../contexts/Auth";
import { db, storage } from "../firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { getDoc, doc, Firestore, updateDoc } from "firebase/firestore";
import { exportPDF } from "./PDF";
import Button from "./button/Button";
import { Link } from "react-router-dom";
import { FormControlLabel, Checkbox, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Stack } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function Home() {
  const { logout, currentUser } = useAuth();
  // const userInfoDB = collection(db, "users-data");
  // const filterByUserQuery = query(
  //   userInfoDB,
  //   where("userID", "==", currentUser.uid)
  // );
  const docRef = doc(db, "users-data", currentUser.uid);
  const [userName, setUserName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [editableStartDate, setEditableStartDate] = useState("");
  const [firstSignature, setFirstSignature] = useState();
  const [secondSignature, setSecondSignature] = useState();
  const [thirdSignature, setThirdSignature] = useState();
  const imageRef = ref(storage, `${currentUser.uid}/`);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isMoreHours, setIsMoreHours] = useState(false);
  const [hours, setHours] = useState(168);
  const [editName, setEditName] = useState(false);
  const [editLastName, setEditLastName] = useState(false);
  const [editStartDate, setEditStartDate] = useState(false);

  function padTo2Digits(num) {
    return num.toString().padStart(2, "0");
  }

  function formatDate(date) {
    return [
      padTo2Digits(date.getDate()),
      padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join("/");
  }

  const pencilSX = {
    width: 14,
    marginBottom: "-5px",
    marginLeft: "5px",
    color: "#586b84",
    "&:hover": {
      color: "#267cf7",
      cursor: "pointer",
    },
  };

  useEffect(() => {
    const getUserData = async () => {
      //getting user data
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserName(docSnap.data().name);
          setUserLastName(docSnap.data().lastname);
          setStartDate(
            formatDate(new Date(docSnap.data().startDate.seconds * 1000))
          );
          setEditableStartDate(
            new Date(docSnap.data().startDate.seconds * 1000)
          );
          setFirstSignature(docSnap.data().firstSignature);
          setSecondSignature(docSnap.data().secondSignature);
          setThirdSignature(docSnap.data().thirdSignature);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getUserData();
  }, []);

  const downloadPDF = (e) => {
    e.preventDefault();
    setIsDownloading(true);
    exportPDF(
      userName,
      userLastName,
      startDate,
      firstSignature,
      secondSignature,
      thirdSignature,
      setIsDownloading,
      hours
    );
  };

  const moreHours = () => {
    if (isMoreHours === true) setHours(168);
    setIsMoreHours(!isMoreHours);
  };

  const updateName = async () => {
    const updatedName = { name: userName };
    await updateDoc(docRef, updatedName);
    setEditName(false);
  };

  const updateLastName = async () => {
    const updatedLastName = { lastname: userLastName };
    await updateDoc(docRef, updatedLastName);
    setEditLastName(false);
  };

  const updateStartDate = async (newValue) => {
    setEditableStartDate(new Date(newValue));
    const updatedStartDate = { startDate: new Date(newValue) };
    await updateDoc(docRef, updatedStartDate);
    setStartDate(formatDate(new Date(newValue)));
  };

  return (
    <div className="home-overlay">
      <div className="home-container">
        <div className="auth-container">
          <div className="auth-content">
            <form className="auth-form">
              <section className="auth-form-control">
                <div className="user-data mb45">
                  <h1>Twoje dane</h1>
                  <div>
                    <span className="light-color">Imię: </span>
                    {editName ? (
                      <input
                        autoFocus
                        type="text"
                        value={userName}
                        onChange={(e) => {
                          setUserName(e.target.value);
                        }}
                        onBlur={updateName}
                      />
                    ) : (
                      <>
                        {userName}
                        <EditIcon
                          sx={pencilSX}
                          onClick={() => {
                            setEditName(true);
                          }}
                        />
                      </>
                    )}
                  </div>
                  <div>
                    <span className="light-color">Nazwisko: </span>
                    {editLastName ? (
                      <input
                        autoFocus
                        type="text"
                        value={userLastName}
                        onChange={(e) => {
                          setUserLastName(e.target.value);
                        }}
                        onBlur={updateLastName}
                      />
                    ) : (
                      <>
                        {userLastName}
                        <EditIcon
                          sx={pencilSX}
                          onClick={() => {
                            setEditLastName(true);
                          }}
                        />
                      </>
                    )}
                  </div>
                  <div className="date-container">
                    <span className="light-color">
                      Data podpisania umowy: &nbsp;
                    </span>
                    <div className="date-items">
                      <p>{startDate}</p>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          open={editStartDate}
                          onClose={() => {
                            setEditStartDate(false);
                          }}
                          value={editableStartDate}
                          onChange={(newValue) => {
                            updateStartDate(newValue);
                          }}
                          renderInput={({
                            ref,
                            inputProps,
                            disabled,
                            onChange,
                            value,
                            ...other
                          }) => (
                            <div ref={ref} {...other}>
                              <input
                                style={{ display: "none" }}
                                value={value}
                                onChange={(e) => {
                                  setEditableStartDate(e.target.value);
                                }}
                                disabled={disabled}
                                {...inputProps}
                              />
                              <EditIcon
                                sx={pencilSX}
                                onClick={() => {
                                  setEditStartDate(true);
                                }}
                              />
                            </div>
                          )}
                        />
                      </LocalizationProvider>
                    </div>
                  </div>
                  <div>
                    <span className="light-color">Podpisy:</span>
                  </div>
                  <div className="signatures-container mb45">
                    <img src={firstSignature} />
                    <img src={secondSignature} />
                    <img src={thirdSignature} />
                  </div>
                  <div>
                    <span className="light-color">Nadgodziny?</span>
                    <Checkbox onChange={moreHours} />
                    {isMoreHours && (
                      <div>
                        <TextField
                          variant="outlined"
                          type="number"
                          value={hours}
                          onChange={(e) => {
                            setHours(e.target.value);
                          }}
                          sx={{ width: "125px" }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  title={isDownloading ? "Pobieram..." : "Generuj ewidencję"}
                  onClick={downloadPDF}
                  style="solid"
                  disabled={isDownloading ? true : false}
                />
              </section>
            </form>
            <div className="bottom-controls">
              <span className="bottom-controls-link link" onClick={logout}>
                Wyloguj się
              </span>
            </div>
          </div>
        </div>
      </div>
      <PDF />
    </div>
  );
}
