import React, { useEffect, useState } from "react";
import "./Home.css";
import PDF from "./PDF";
import { useAuth } from "../contexts/Auth";
import { db, storage } from "../firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { getDoc, doc } from "firebase/firestore";
import { exportPDF } from "./PDF";
import Button from "./button/Button";
import { Link } from "react-router-dom";

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
  const [firstSignature, setFirstSignature] = useState();
  const [secondSignature, setSecondSignature] = useState();
  const [thirdSignature, setThirdSignature] = useState();
  const imageRef = ref(storage, `${currentUser.uid}/`);
  const [isDownloading, setIsDownloading] = useState(false);

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
          setFirstSignature(docSnap.data().firstSignature);
          setSecondSignature(docSnap.data().secondSignature);
          setThirdSignature(docSnap.data().thirdSignature);
        }
      } catch (error) {
        console.log(error);
      }
    };
    //getting signature img
    // listAll(imageRef).then((response) => {
    //   response.items.forEach((item) => {
    //     getDownloadURL(item).then((url) => {
    //       setUserSignature((prev) => [...prev, url]);
    //     });
    //   });
    // });

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
      setIsDownloading
    );
  };

  return (
    <>
      <div className="home-container">
        <div className="auth-container">
          <div className="auth-content">
            <div className="title-container">
              <p className="h1 mb30">Witaj {userName}</p>
            </div>
            <form className="auth-form">
              <section className="auth-form-control">
                <div className="user-data mb100">
                  <h1>Twoje dane</h1>
                  <p>
                    <span className="light-color">Imię: </span>
                    {userName}
                  </p>
                  <p>
                    <span className="light-color">Nazwisko: </span>
                    {userLastName}
                  </p>
                  <p>
                    <span className="light-color">Data podpisania umowy: </span>
                    {startDate}
                  </p>
                  <p>
                    <span className="light-color">Podpisy:</span>
                  </p>
                  <div className="signatures-container">
                    <img src={firstSignature} />
                    <img src={secondSignature} />
                    <img src={thirdSignature} />
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
    </>
  );
}
