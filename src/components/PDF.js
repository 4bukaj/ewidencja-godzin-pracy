import React from "react";
import "./PDF.css";
import signature from "../img/podpis.png";
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
  if (month < 10) return "0" + month + 1;
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
let hsum = 168;
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

hours = hours.map(function (x) {
  return x;
});

//END OF GENERATING HOURS

export function createTable(userName, userStartDate, userSignature) {
  let table = document.getElementById("table");
  table.innerHTML = "";
  // let startDate = document.getElementById("startDate").value;
  let startDate = userStartDate;

  // let name =
  //   document.getElementById("lastname").value +
  //   " " +
  //   document.getElementById("firstname").value;
  let name = userName;
  let it = 0;

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
      else if (i == 32 && j == 1) td.innerHTML = "168";
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
          img.src = userSignature;
          img.style.width =
            Math.floor(Math.random() * (95 - 70 + 1)) + 70 + "%";
          // img.style.marginLeft =
          //   Math.floor(Math.random() * (20 - 2 + 1)) + 2 + "px";
          // img.style.marginBottom =
          //   Math.floor(Math.random() * (10 - 2 + 1)) + 2 + "px";
          let rnum = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
          console.log(rnum);
          if (rnum == 1) img.style.marginLeft = "20px";
          else if (rnum == 2) img.style.marginRight = "20px";
          else if (rnum == 3) img.style.marginTop = "20px";
          else img.style.marginBottom = "20px";
          td.appendChild(img);
        }
      } else if (j == 1 || j == 2) {
        myDate.setDate(i);
        //console.log(myDate);
        if (
          (myDate.getDay() == 6 || myDate.getDay() == 0 || i > daysNumber) &&
          i != 32
        ) {
          td.innerHTML = "\u2013";
          td.classList.add("bold");
        } else if (j == 1) {
          //adding hours here
          td.innerHTML = hours[it];
          it++;
        }
      }

      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
}

export const exportPDF = (userName, startDate, userSignature) => {
  createTable(userName, startDate, userSignature);
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
    pdf.save("testPDF.pdf");
  });
};

export default function Content() {
  return (
    <>
      <button onClick={exportPDF}>Download</button>
      <div id="pdf">
        <div className="header">
          <p className="small-text mb100">Załącznik nr 1</p>
          <p className="big-text mb30">
            Ewidencja godzin wykonywania umowy zlecenia zawartej w dniu
          </p>
          <p className="big-text">
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
          <tbody id="table"></tbody>
        </table>
      </div>
    </>
  );
}