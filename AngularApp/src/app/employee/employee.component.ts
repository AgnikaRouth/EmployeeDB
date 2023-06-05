import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../shared/employee.service';
import { NgForm } from '@angular/forms';
import { Employee } from '../shared/employee.model';
import { FormGroup, FormControl } from '@angular/forms';
declare var M: any;

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
  providers: [EmployeeService],
})
export class EmployeeComponent implements OnInit {
  constructor(public employeeService: EmployeeService) {}

  form: FormGroup;

  ngOnInit(): void {
    this.resetForm();
    this.refreshEmployeeList();

    this.form = new FormGroup({
      _id: new FormControl(null),
      name: new FormControl(''),
      position: new FormControl(''),
      office: new FormControl(''),
      salary: new FormControl(null),
    });
  }

  onSubmit() {
    console.log('Form value:', this.form.value);

    if (!this.form.value._id || this.form.value._id === '') {
      console.log('Hello Post');
      this.employeeService.postEmployee(this.form.value).subscribe((res) => {
        this.resetForm(this.form.value);
        this.refreshEmployeeList();
        M.toast({ html: 'Saved successfully', classes: 'rounded' });
      });
    } else {
      this.employeeService.putEmployee(this.form.value).subscribe((res) => {
        this.resetForm(this.form.value);
        this.refreshEmployeeList();
        M.toast({ html: 'Updated successfully', classes: 'rounded' });
      });
    }
  }

  resetForm(form?: FormGroup) {
    if (form) {
      this.form.reset();
      console.log('Reset successful');
    }

    this.employeeService.selectedEmployee = {
      _id: '',
      name: '',
      position: '',
      office: '',
      salary: null,
    };
  }
  refreshEmployeeList() {
    this.employeeService.getEmployeeList().subscribe((res) => {
      this.employeeService.employees = res as Employee[];
      console.log('Refreshed List');
    });
  }

  onEdit(emp: Employee) {
    console.log('Edit:', emp);
    this.employeeService.selectedEmployee = emp;
    this.form.patchValue(emp);
    // this.employeeService.putEmployee(emp).subscribe((res) => {
    //   this.resetForm(this.form.value);
    //   this.refreshEmployeeList();
    //   M.toast({ html: 'Updated successfully', classes: 'rounded' });
    // });
  }

  onDelete(_id: string) {
    if (confirm('Are you sure to delete this record ?') == true) {
      this.employeeService?.deleteEmployee(_id).subscribe((res) => {
        this.refreshEmployeeList();
        this.resetForm(this.form.value);
        M.toast({ html: 'Deleted successfully', classes: 'rounded' });
      });
    }
  }
}
