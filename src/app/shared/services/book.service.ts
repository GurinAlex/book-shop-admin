import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Book} from '../interfaces';
import {environment} from '../../../environments/environment';
import {tap} from 'rxjs/operators';

@Injectable()
export class BookService {

  constructor(private http: HttpClient) {}

  private books: BehaviorSubject<Book[]> = new BehaviorSubject<Book[]>([]);
  public books$ =  this.books.asObservable();

  addNewBook(book: Book): Observable<Book> {
    return this.http.post<Book>(`${environment.api_server}/admin/book`, book)
      .pipe(tap(() => this.saveBooks.bind(this)));
  }

  private saveBooks(book: Book): void {
   const books =  this.books.getValue();
   books.push(book);
   this.books.next(books);
  }

  getAll(): Observable<Book []> {
    return this.http.get<Book []>(`${environment.api_server}/admin/books`)
      .pipe(tap(books => this.books.next(books)));
  }

  editBook(book: Book, id: string): Observable<Book> {
    return this.http.put<Book>(`${environment.api_server}/admin/book/${id}`, book);
  }

  getBookById(id: string): Observable<Book> {
    return this.http.get<Book>(`${environment.api_server}/book/${id}`);
  }

  deleteBook(id: string): Observable<Book> {
    return this.http.delete<Book>(`${environment.api_server}/admin/book/${id}`);
  }
}
