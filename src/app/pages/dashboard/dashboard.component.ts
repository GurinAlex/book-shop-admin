import { Component, OnInit } from '@angular/core';
import {BookService} from '../../shared/services/book.service';
import {Book} from '../../shared/interfaces';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  books: Book[];

  constructor(
    private bookService: BookService,
  ) { }

  ngOnInit(): void {
    this.bookService.getAll().subscribe(books => {
      this.books = books;
    });
  }

  deleteBook(bookId: string): void {
    this.bookService.deleteBook(bookId).subscribe(() => {
      this.books = this.books.filter(_ => _.id !== bookId);
    });
  }

}
