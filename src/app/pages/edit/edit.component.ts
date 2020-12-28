import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import { finalize, switchMap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { BookService } from '../../shared/services/book.service';
import { Book } from '../../shared/interfaces';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  form: FormGroup;
  book: Book;
  imageURL: string;
  imagePreview: string;
  reader: FileReader;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private fb: FormBuilder,
    private storage: AngularFireStorage,
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap((params: Params) => {
        return this.bookService.getBookById(params['id']);
      })
    ).subscribe(book => {
      console.log(book);
      this.book = book;
      this.imageURL = book.img;

      this.form = this.fb.group({
        genre: new FormControl(book.genre, Validators.required),
        title: new FormControl(book.title, Validators.required),
        author: new FormControl(book.author, Validators.required),
        translator: new FormControl(book.translator || null),
        editorialOffice: new FormControl(book.editorialOffice || null),
        publishingHouse: new FormControl(book.publishingHouse || null),
        yearPublish: new FormControl(book.yearPublish, Validators.required),
        series: new FormControl(book.series || null),
        price: new FormControl(book.price.toString(), Validators.required),
        annotate: new FormControl(book.annotation, Validators.required),
        discountIsActive: new FormControl(book.discountIsActive, Validators.required),
        discount: new FormControl(book.discount || 0, Validators.required),
        isBestseller: new FormControl(book.isBestseller, Validators.required),
      });
    });
  }

  onSelectFile(event): void {
    const file = event.target.files[0];
    const filePath = uuidv4();
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

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

    this.bookService.editBook(book, this.book.id).subscribe(() => {
      this.router.navigateByUrl('/');
    });
  }
}
