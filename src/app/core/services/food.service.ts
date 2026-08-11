import { Injectable, Injector, inject, runInInjectionContext } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, updateDoc, writeBatch } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Food } from '../models';

const FIRESTORE_BATCH_LIMIT = 500;

@Injectable({ providedIn: 'root' })
export class FoodService {
  private readonly firestore = inject(Firestore);
  private readonly injector = inject(Injector);
  private readonly foodsCollection = collection(this.firestore, 'foods');

  getFoods(): Observable<Food[]> {
    return runInInjectionContext(this.injector, () => collectionData(this.foodsCollection, { idField: 'id' })) as Observable<Food[]>;
  }

  searchFoods(term: string): Observable<Food[]> {
    const normalized = term.trim().toLowerCase();
    return this.getFoods().pipe(map((foods) => (normalized ? foods.filter((food) => food.name.toLowerCase().includes(normalized)) : foods)));
  }

  addFood(food: Food): Promise<void> {
    return addDoc(this.foodsCollection, food).then(() => undefined);
  }

  updateFood(id: string, changes: Partial<Food>): Promise<void> {
    return updateDoc(doc(this.firestore, 'foods', id), changes);
  }

  deleteFood(id: string): Promise<void> {
    return deleteDoc(doc(this.firestore, 'foods', id));
  }

  async bulkAddFoods(foods: Food[]): Promise<number> {
    for (let i = 0; i < foods.length; i += FIRESTORE_BATCH_LIMIT) {
      const batch = writeBatch(this.firestore);
      for (const food of foods.slice(i, i + FIRESTORE_BATCH_LIMIT)) {
        batch.set(doc(this.foodsCollection), food);
      }
      await batch.commit();
    }
    return foods.length;
  }
}
