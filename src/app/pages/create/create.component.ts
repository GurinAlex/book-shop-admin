import { Component, OnInit } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Book } from '../../shared/interfaces';
import { BookService } from '../../shared/services/book.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  imageURL: string;
  imagePreview: string;
  uploadPercent: Observable<number>;
  reader: FileReader;

  form = this.fb.group({
    genre: new FormControl('Проза', Validators.required),
    title: new FormControl(null, Validators.required),
    author: new FormControl(null, Validators.required),
    translator: new FormControl(null),
    editorialOffice: new FormControl(null),
    publishingHouse: new FormControl(null),
    yearPublish: new FormControl(0, Validators.required),
    series: new FormControl(null),
    price: new FormControl(0, Validators.required),
    annotate: new FormControl(null, Validators.required),
    discountIsActive: new FormControl(false, Validators.required),
    discount: new FormControl(0, Validators.required),
    isBestseller: new FormControl(false, Validators.required),
  });

  constructor(
    private storage: AngularFireStorage,
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  onSelectFile(event): void {
    const file = event.target.files[0];
    const filePath = uuidv4();
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    this.uploadPercent = task.percentageChanges();
    task.snapshotChanges().pipe(
      finalize(() => fileRef.getDownloadURL().subscribe(res => {
        this.imageURL = res;
      }))).subscribe();

    this.reader = new FileReader();
    this.reader.onload = (loadEvent: any) => {
      this.imagePreview = loadEvent.target.result;
    };
    this.reader.readAsDataURL(file);
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    const book: Book = {
      genre: this.form.value.genre,
      title: this.form.value.title,
      author: this.form.value.author,
      yearPublish: this.form.value.yearPublish,
      price: +this.form.value.price,
      img: this.imageURL,
      annotation: this.form.value.annotate,
      discountIsActive: this.form.value.discountIsActive,
      isBestseller: this.form.value.isBestseller
    };

    if (!!this.form.value.translator) {
      book.translator = this.form.value.translator;
    }
    if (!!this.form.value.editorialOffice) {
      book.editorialOffice = this.form.value.editorialOffice;
    }
    if (!!this.form.value.publishingHouse) {
      book.publishingHouse = this.form.value.publishingHouse;
    }
    if (!!this.form.value.series) {
      book.series = this.form.value.series;
    }

    if (!!this.form.value.discountIsActive) {
      book.discount = +this.form.value.discount;
    }

    this.bookService.addNewBook(book).subscribe(() => {
      this.form.reset();
      this.imagePreview = null;
      this.imageURL = null;
      this.router.navigateByUrl('/');
    });
  }
}
