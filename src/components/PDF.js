import React from "react";
import "./PDF.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

let today = new Date();
let month = today.getMonth();
let year = today.getFullYear() - 2000;
let months = [
  "styczeń",
  "luty",
  "marzec",
  "kwiecień",
  "maj",
  "czerwiec",
  "lipiec",
  "sierpień",
  "wrzesień",
  "październik",
  "listopad",
  "grudzień",
];

function getMonthNum() {
  let month = new Date().getMonth();
  if (month < 10) return "0" + (Number(month) + 1);
  else return month + 1;
}

let myDate = new Date();
myDate.setFullYear(year);
myDate.setMonth(month);
let daysNumber = new Date(year, month + 1, 0).getDate();
let weekends = 0;

//COUNT BUSINESS DAYS
for (let i = 1; i <= daysNumber; i++) {
  myDate.setDate(i);
  if (myDate.getDay() == 6 || myDate.getDay() == 0) weekends++;
}

let businessDays = daysNumber - weekends;

//GENERATING HOURS ARRAY OF HOURS HERE
function generateHours(hsum) {
  let hours = Array(businessDays).fill(0);

  while (hsum > 0) {
    for (let i = 0; i < businessDays; i++) {
      if (hsum > 0) {
        let con = Math.round(Math.random());
        if (con != 0) {
          if (hours[i] < 12) {
            hours[i] += 1;
            hsum -= 1;
          }
        }
      }
    }
  }

  return hours;
}

//END OF GENERATING HOURS

export function createTable(
  userName,
  userLastName,
  userStartDate,
  firstSignature,
  secondSignature,
  thirdSignature,
  totalHours
) {
  let table = document.getElementById("table");
  table.innerHTML = "";
  let startDate = userStartDate;
  let name = userLastName + " " + userName;
  let it = 0;
  let hoursCount = generateHours(totalHours);

  document.getElementById("insertStartDate").innerHTML = startDate;
  document.getElementById("insertMonth").innerHTML = months[month];
  document.getElementById("insertYear").innerHTML = year;
  document.getElementById("insertName").innerHTML = name;

  for (let i = 1; i <= 32; i++) {
    let tr = document.createElement("tr");
    for (let j = 0; j < 5; j++) {
      let td = document.createElement("td");
      if (i == 32 && j == 0)
        td.innerHTML = "Liczba godzin wykonywania umowy zlecenie ogółem:";
      else if (i == 32 && j == 1) td.innerHTML = totalHours;
      else if (j == 0) td.innerHTML = i;
      else if (j == 2) {
        if (
          (myDate.getDay() == 6 || myDate.getDay() == 0 || i > daysNumber) &&
          i != 32
        ) {
          td.innerHTML = "\u2013";
          td.classList.add("bold");
        } else {
          let img = document.createElement("img");
          let randSignature = Math.floor(Math.random() * 3) + 1;
          if (randSignature === 1) img.src = firstSignature;
          else if (randSignature === 2) img.src = secondSignature;
          else img.src = thirdSignature;
          if (i === 32) img.style.height = "45px";
          else img.style.height = "30px";
          img.style.width =
            Math.floor(Math.random() * (95 - 70 + 1)) + 70 + "%";
          img.style.marginLeft =
            Math.floor(Math.random() * (20 - 2 + 1)) + 2 + "px";
          td.appendChild(img);
        }
      } else if (j == 1 || j == 2) {
        myDate.setDate(i);
        if (
          (myDate.getDay() == 6 || myDate.getDay() == 0 || i > daysNumber) &&
          i != 32
        ) {
          td.innerHTML = "\u2013";
          td.classList.add("bold");
        } else if (j == 1) {
          //adding hours here
          td.innerHTML = hoursCount[it];
          it++;
        }
      }

      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
}

export const exportPDF = (
  userName,
  userLastName,
  startDate,
  firstSignature,
  secondSignature,
  thirdSignature,
  setIsDownloading,
  totalHours
) => {
  createTable(
    userName,
    userLastName,
    startDate,
    firstSignature,
    secondSignature,
    thirdSignature,
    totalHours
  );
  const input = document.getElementById("pdf");
  html2canvas(input, {
    logging: true,
    letterRendering: 2,
    useCORS: true,
  }).then((canvas) => {
    const imgWidth = 170;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const imgData = canvas.toDataURL("img/png");
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 20, 10, imgWidth, imgHeight);
    pdf.save(
      today.getFullYear() +
        "-" +
        getMonthNum() +
        "__" +
        userLastName.toUpperCase() +
        "_" +
        userName.toUpperCase()
    );
    setIsDownloading(false);
  });
};

export default function Content() {
  return (
    <>
      <div id="pdf">
        <div className="header">
          <p className="small-text mb100">Załącznik nr 1</p>
          <p className="big-text mb30">
            Ewidencja godzin wykonywania umowy zlecenia zawartej w dniu
          </p>
          <p className="big-text mb30">
            <span id="insertStartDate">20.08.2019</span> r.
          </p>
        </div>

        <p className="small-text mb45">
          Miesiąc: <span id="insertMonth"></span> 20
          <span id="insertYear"></span>
          r.
        </p>
        <p className="small-text mb45">
          Nazwisko i imię Zleceniobiorcy: <span id="insertName"></span>
        </p>

        <table>
          <thead>
            <tr>
              <th>
                Dzień <br></br>miesiąca
              </th>
              <th>
                Liczba godzin<br></br> wykonywania <br></br>umowy zlecenie
              </th>
              <th>
                Podpis <br></br>Zleceniobiorcy
              </th>
              <th>Uwagi</th>
              <th>Podpis Zleceniodawcy lub osoby przez niego upoważnionej</th>
            </tr>
          </thead>
          <tbody id="table"></tbody>
        </table>
      </div>
    </>
  );
}
