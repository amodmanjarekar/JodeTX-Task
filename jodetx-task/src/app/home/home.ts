import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  AbstractControl,
  EmailValidator,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { csv2json, json2csv } from 'json-2-csv';
import { Router } from '@angular/router';
import { Auth } from '../auth';

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private authService = inject(Auth);
  username = this.authService.username;

  private http = inject(HttpClient);

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  });

  employees: any[] = [];
  isFiltered = false;
  filtered: any[] = this.employees;

  private getEmployees() {
    this.http
      .get(`${environment.SERVER_URL}/employees`, {
        headers: this.headers,
      })
      .subscribe((data) => {
        let dataArray = data as Array<any>;
        let cleanDate = dataArray.map((item) => {
          item.joindate = new Date(item.joindate).toDateString();
          return item;
        });
        this.employees = Object.values(data);
        if (this.isFiltered) {
          this.filterEmployees();
        } else {
          this.filtered = this.employees;
        }
      });
  }

  // ON INIT
  ngOnInit(): void {
    this.getEmployees();
  }

  // MANUAL ADD
  employeeForm = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    salary: new FormControl(''),
    joindate: new FormControl(Date(), Validators.required),
    team: new FormControl('', Validators.required),
  });

  onEmployeeSubmit() {
    let employee = {
      firstname: this.employeeForm.get('firstname')?.value,
      lastname: this.employeeForm.get('lastname')?.value,
      email: this.employeeForm.get('email')?.value,
      salary: this.employeeForm.get('salary')?.value,
      joindate: this.employeeForm.get('joindate')?.value,
      team: this.employeeForm.get('team')?.value,
    };

    console.log(employee);

    this.http
      .post(`${environment.SERVER_URL}/employees/new`, employee, { headers: this.headers })
      .subscribe({
        next: (data) => {
          this.getEmployees();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  // DOWNLOAD
  downloadEmployees() {
    const csv = json2csv(this.filtered, {
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

  // BULK ADD
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
      this.http
        .post(`${environment.SERVER_URL}/employees/bulk`, this.newEmployees, {
          headers: this.headers,
        })
        .subscribe({
          next: () => {
            this.getEmployees();
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }

  // FILTER
  dateFilterValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const sdate = new Date(control.get('startdate')!.value);
    const edate = new Date(control.get('enddate')!.value);

    return sdate < edate ? null : { smallerStartDate: true };
  };

  filterForm = new FormGroup(
    {
      startdate: new FormControl(Date(), Validators.required),
      enddate: new FormControl(Date(), Validators.required),
    },
    { validators: this.dateFilterValidator }
  );

  onFilter() {
    this.isFiltered = true;
    this.getEmployees();
  }

  clearFilter() {
    this.isFiltered = false;
    this.getEmployees();
  }

  filterEmployees() {
    this.filtered = this.employees.filter((employee) => {
      var date = new Date(employee.joindate);
      var startdate = new Date(this.filterForm.get('startdate')!.value!);
      var enddate = new Date(this.filterForm.get('enddate')!.value!);
      console.log(date, startdate, enddate);
      return date >= startdate && date <= enddate;
    });
  }

  // DELETE
  onDelete(email: string) {
    if (confirm('Are you sure you want to delete?')) {
      this.http
        .delete(`${environment.SERVER_URL}/employees/delete/${email}`, { headers: this.headers })
        .subscribe({
          next: () => {
            alert('Deleted successfully.'), this.getEmployees();
          },
          error: (err) => {
            alert('Delete operation failed.');
            console.log(err);
          },
        });
    }
  }

  // LOGOUT
  router = inject(Router);

  onLogout() {
    localStorage.clear();
    this.router.navigate(['/auth']);
  }
}
