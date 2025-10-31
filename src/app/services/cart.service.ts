import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Quadrinho } from '../models/quadrinho.model';

export interface CartItem {
  quadrinho: Quadrinho;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>([]);
  readonly items$ = this.itemsSubject.asObservable();

  addItem(quadrinho: Quadrinho): void {
    const items = [...this.itemsSubject.value];
    const existing = items.find(item => item.quadrinho.id === quadrinho.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({ quadrinho, quantity: 1 });
    }

    this.itemsSubject.next(items);
  }

  removeItem(quadrinhoId: number): void {
    const items = this.itemsSubject.value
      .map(item =>
        item.quadrinho.id === quadrinhoId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter(item => item.quantity > 0);

    this.itemsSubject.next(items);
  }

  deleteItem(quadrinhoId: number): void {
    const items = this.itemsSubject.value.filter(item => item.quadrinho.id !== quadrinhoId);
    this.itemsSubject.next(items);
  }

  clear(): void {
    this.itemsSubject.next([]);
  }

  getItemsSnapshot(): CartItem[] {
    return this.itemsSubject.value;
  }

  getTotalQuantity(): Observable<number> {
    return this.items$.pipe(
      map(items => items.reduce((total, item) => total + item.quantity, 0))
    );
  }

  calculateTotal(): number {
    return this.itemsSubject.value.reduce((total, item) => {
      return total + item.quadrinho.preco * item.quantity;
    }, 0);
  }
}
