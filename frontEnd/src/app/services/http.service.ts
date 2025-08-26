import {throwError as observableThrowError, Subscription, Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Injectable, OnDestroy} from '@angular/core';
import {TokenService} from '../auth/token.service';
// import {Utils} from '../utils/utils';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
// import {ErroModel} from '../../entities/erro';
// import {FilterOption} from '../../core/entities/filter-option';
// import {Column} from '../../core/entities/table.types';
import {Router} from '@angular/router';
import * as moment from 'moment';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService implements OnDestroy {
  private token = '';
  // private subscription: Subscription;

  constructor(private http: HttpClient,
              private router: Router,
              private tokenService: TokenService) {

    this.token = this.tokenService.getToken();
    //this.subscription = this.tokenService.tokenChanged.subscribe((tokenRetornado: string) => {
    //   this.token = 'bearer ' + tokenRetornado;
    // });
  }

  // get<T>(endPoint: string, params: any ) {
  //   return this.http.get(environment.pathAPI + endPoint, {headers: this.getHeaders(true), params: this.parseParams(params), responseType: 'blob', observe: 'response'});
  // }

  // onGet<T>(endPoint: string, autorizacao: boolean = true): Observable<T> {
  //   return new Observable<T>(obs => {

  //     this.http.get<T>(environment.pathAPI + endPoint, {headers: this.getHeaders(autorizacao)})
  //       .pipe(catchError(this.handleError.bind(this).bind(this))).subscribe(xs => {
  //       obs.next(xs);
  //     }, error1 => {
  //       obs.error(error1);
  //     },
  //       () => {
  //         obs.complete();
  //       });

  //   });
  // }

  // onGetParam<T>(endPoint: string, params?: any, responseType?: string) {
  //   return new Observable<T>(obs => {

  //     this.http.get<T>(environment.pathAPI + endPoint, {
  //       headers: this.getHeaders(true),
  //       params: this.parseParams(params),
  //       responseType: responseType ? responseType as 'json' : undefined
  //     })
  //       .pipe(catchError(this.handleError.bind(this).bind(this))).subscribe(xs => {
  //       obs.next(xs);
  //     }, error1 => {
  //       obs.error(error1);
  //     },
  //       () => {
  //         obs.complete();
  //       });

  //   });
  // }

  // onGetText<T>(endPoint: string, autorizacao: boolean = true): Observable<T> {
  //   return this.http.get<T>(environment.pathAPI + endPoint, {headers: this.getHeaders(autorizacao)})
  //     .pipe(catchError(this.handleError.bind(this)));
  // }

  // onPost<T>(endPoint: string, data: any, autorizacao: boolean = true, asJson = true): Observable<T> {
  //   return this.http.post<T>(environment.pathAPI + endPoint, data, {headers: this.getHeaders(autorizacao, asJson)}).pipe(
  //     catchError(this.handleError.bind(this)));
  // }

  // onPatch<T>(endPoint: string, data: any, autorizacao: boolean = true, asJson = true): Observable<T> {
  //   return this.http.patch<T>(environment.pathAPI + endPoint, data, {headers: this.getHeaders(autorizacao, asJson)}).pipe(
  //     catchError(this.handleError.bind(this)));
  // }

  // onPostType(endPoint: string, data: any, contentType: string): Observable<Object> {

  //   const headers = new HttpHeaders();
  //   headers.append('Content-Type', contentType);
  //   return this.http.post(environment.pathAPI + endPoint, data, {headers: headers}).pipe(
  //     catchError(this.handleError.bind(this)));
  // }

  // onPostResponseType(endPoint: string, data: any, responseType: string) {
  //   return this.http.post<any>(environment.pathAPI + endPoint, data, {
  //     headers: this.getHeaders(true),
  //     responseType: responseType ? responseType as 'json' : undefined
  //   });
  // }

  // onPut<T>(endPoint: string, data: any, autorizacao: boolean = true): Observable<T> {

  //   return this.http.put<T>(environment.pathAPI + endPoint, data, {headers: this.getHeaders(autorizacao)}).pipe(
  //     catchError(this.handleError.bind(this)));
  // }

  // onPutFormEnconded(endPoint: string, body: HttpParams, autorizacao: boolean = true): Observable<Object> {

  //   let headers = this.getHeaders(autorizacao);
  //   headers = headers.delete('Content-type');
  //   headers = headers.append('Content-type', 'application/x-www-form-urlencoded');
  //   return this.http.put(environment.pathAPI + endPoint, body.toString(), {headers: headers}).pipe(
  //     catchError(this.handleError.bind(this)));
  // }

  // onDelete<T>(endPoint: string, autorizacao: boolean = true): Observable<T> {
  //   return this.http.delete<T>(environment.pathAPI + endPoint, {headers: this.getHeaders(autorizacao)}).pipe(
  //     catchError(this.handleError.bind(this)));
  // }

  // onGravar(endPoint: string, data: any, Sucesso?: () => void, Erro?: (Erro) => void, autorizacao: boolean = true): Subscription {
  //   return this.onPost(endPoint, data, autorizacao).subscribe(
  //     (usuario: any) => {
  //       if (Sucesso) {
  //         Sucesso();
  //       }
  //     },
  //     (erro: ErroModel) => {
  //       if (Erro) {
  //         Erro(erro);
  //       }
  //     }
  //   );
  // }

  // resolveFilter(page: number, coluna?: string, ordem?: boolean, columns?: Column[]): FilterOption {

  //   const filter = {} as FilterOption;

  //   if (columns) {
  //     filter.filtros = [];
  //     columns.forEach(c => {
  //       filter.filtros.push({key: c.fieldName, value: (c.filterValue === undefined) ? null : c.filterValue});
  //     });

  //   }

  //   filter.pagina = page;
  //   filter.coluna = coluna;
  //   filter.crescente = ordem;

  //   return filter;

  // }

  // private getHeaders(autorizacao: boolean = true, asJson: boolean = true): HttpHeaders {
  //   let headers = new HttpHeaders();
  //   if (asJson) {
  //     headers = headers.append('Content-Type', 'application/json');
  //   } else {
  //     headers = headers.append('Content-Type', 'text/plain');
  //   }

  //   if (autorizacao) {
  //     headers = headers.append('Authorization', this.token);
  //   }

  //   if (localStorage.getItem('EMPRESA')) {
  //     headers = headers.append('EMPRESA', atob(localStorage.getItem('EMPRESA')));
  //   }
  //   return headers;
  // }

  // private handleError(error: any): Observable<never> {
  //   if (error.status === 400 &&
  //     (error.error === 'pexp' || error.error.toString().startsWith('invalid_sub_'))
  //     && this.router.url !== 'app/config/plano/expirou') {
  //     this.router.navigate(['/app/config/plano/expirou'], {queryParams: {'motive': error.error}});
  //   }

  //   if (error.status === 401) {
  //     error.error = {mensagem: 'Não possui autorização', status: 401};
  //   }
  //   return observableThrowError(error.error ? error.error : error);

  // }

   ngOnDestroy(): void {
  //   if (this.subscription) {
  //     this.subscription.unsubscribe();
  //   }
   }

  // parseParams(params: any): any {
  //   let httpParams = new HttpParams();
  //   Object.keys(params)
  //     .filter(key => {
  //       const dataParam = params[key];
  //       return (Array.isArray(dataParam) || typeof dataParam === 'string') ?
  //         (dataParam.length > 0) :
  //         (dataParam !== null && dataParam !== undefined);
  //     })
  //     .forEach(key => {
  //       if (params[key] instanceof Date) {
  //         httpParams = httpParams.set(key, moment(params[key]).format('MM/DD/YYYY'));
  //       } else {
  //         httpParams = httpParams.set(key, params[key]);
  //       }
  //     });
  //   return httpParams;
  // }
}
