import React, { useEffect, useState } from "react";
import "./Home.css";
import PDF from "./PDF";
import { useAuth } from "../contexts/Auth";
import { db, storage } from "../firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { getDoc, doc } from "firebase/firestore";
import { exportPDF } from "./PDF";
import Button from "./button/Button";

export default function Home() {
  const { logout, currentUser } = useAuth();
  // const userInfoDB = collection(db, "users-data");
  // const filterByUserQuery = query(
  //   userInfoDB,
  //   where("userID", "==", currentUser.uid)
  // );
  const docRef = doc(db, "users-data", currentUser.uid);
  const [userName, setUserName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [userSignature, setUserSignature] = useState([]);
  const imageRef = ref(storage, `${currentUser.uid}/`);

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
          setStartDate(
            formatDate(new Date(docSnap.data().startDate.seconds * 1000))
          );
          setUserSignature(docSnap.data().signature);
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

  const downloadPDF = () => {
    exportPDF(userName, startDate, userSignature);
  };

  return (
    <>
      <div className="home-container">
        <div className="home-content">
          <div className="user-data">
            <p>Imię i Nazwisko: {userName} </p>
            <p>Data podpisania umowy: {startDate}</p>
            <p>Podpis URL: </p>
            <img src={userSignature} />
          </div>
          <div className="btns-container">
            <div className="btn-container">
              <Button
                title="Pobierz ewidencję"
                onClick={downloadPDF}
                style="solid"
              />
            </div>
            <div className="btn-container">
              <Button title="Wyloguj się" onClick={logout} style="outlined" />
            </div>
          </div>
        </div>
      </div>
      <PDF />
    </>
  );
}
