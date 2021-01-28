import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PatternValidator } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit {
  title = 'wrldbnkapp';

  tableData: any[] = [];
  page: number = 1;
  year: string;
  totalPages: number = 30;
  pageMin: boolean = true;
  pageMax: boolean = false;

  regex = /^\d+$/;



  constructor(
    private http: HttpClient
  ) {

  }

  ngOnInit() {

  }

  searchYearDetails() {
    let d = new Date();
    let oldYear = this.year;

    if (this.regex.test(this.year) && parseInt(this.year) < d.getFullYear()) {
      this.tableData = [];
      this.http.get(`http://api.worldbank.org/v2/country?format=json&page=${this.page}&per_page=10`).subscribe((countryRes) => {
        let countries = countryRes[1];
        console.log(this.totalPages);

        for (let country of countries) {
          let tableRow = new TableRow();
          tableRow.id = country.id;
          tableRow.name = country.name;

          this.http.get(`http://api.worldbank.org/v2/country/${country.id}/indicator/SP.POP.TOTL/?format=json&date=${this.year}`).subscribe((countryPop) => {

            if (countryPop[1]) {
              tableRow.population = countryPop[1][0].value;

              this.http.get(`http://api.worldbank.org/v2/country/${country.id}/indicator/NY.GDP.MKTP.CD/?format=json&date=${this.year}`).subscribe((countryGDP) => {
                tableRow.gdp = countryGDP[1][0].value;
                this.tableData.push(tableRow);

              })
            } else {
              this.tableData.push(tableRow);
            }
          });
        }
      })
    } else {
      alert("Not Acceptabel year input");
      this.year = oldYear;
    }



  }

  previous() {

    if (this.page > 1) {

      this.page--;
      this.searchYearDetails();
      this.pageMin = false;
    } else {
      alert("Page limit Reached");
    }

  }


  next() {
    alert("hi")
    console.log(this.page);
    console.log(this.totalPages);

    if (this.page < this.totalPages) {

      this.page++;
      this.searchYearDetails();
      this.pageMax = false;
    } else {
      alert("Page limit Reached");
    }

  }



}

class TableRow {
  id: string;
  name: string;
  population: number;
  gdp: number;
}
