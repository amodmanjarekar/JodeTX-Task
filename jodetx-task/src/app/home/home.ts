import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  EmailValidator,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { csv2json, json2csv } from 'json-2-csv';

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private http = inject(HttpClient);

  employees: any[] = [];
  private getEmployees() {
    this.http.get(`${environment.SERVER_URL}/employees`).subscribe((data) => {
      this.employees = Object.values(data);
    });
  }

  ngOnInit(): void {
    this.getEmployees();
  }

  employeeForm = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl(''),
    email: new FormControl('', Validators.required),
    salary: new FormControl(''),
    team: new FormControl('', Validators.required),
  });

  onEmployeeSubmit() {
    this.http
      .post(`${environment.SERVER_URL}/employees/new`, {
        firstname: this.employeeForm.get('firstname')?.value,
        lastname: this.employeeForm.get('lastname')?.value,
        email: this.employeeForm.get('email')?.value,
        salary: this.employeeForm.get('salary')?.value,
        team: this.employeeForm.get('team')?.value,
      })
      .subscribe({
        next: (data) => {
          this.getEmployees();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  downloadEmployees() {
    const csv = json2csv(this.employees, {
      excludeKeys: ['_id', '__v'],
    });

    console.log(csv);
    const csvBlob = new Blob([csv], { type: 'text/plain' });

    let link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    link.href = URL.createObjectURL(csvBlob);
    link.download = 'employees.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  newEmployees: object[] = [];

  async onUploadFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      if (input.files[0].type === 'text/csv') {
        const csv = await input.files[0].text();
        this.newEmployees = csv2json(csv, { trimHeaderFields: true, trimFieldValues: true });
      } else {
        // invalid file
        console.log('invalid file');
      }
    } else {
      // no file
      console.log('no file');
    }
  }

  uploadEmployees() {
    if (this.newEmployees.length > 0) {
      this.http.post(`${environment.SERVER_URL}/employees/bulk`, this.newEmployees).subscribe({
        next: () => {
          this.getEmployees();
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
}
