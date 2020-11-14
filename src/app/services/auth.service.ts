import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import firebase from 'firebase/app';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user$: Observable<any>;
  private user: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    // Get the auth state, then fetch the Firestore user document or return null
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        // Logged in
        if (user) {
          this.afs.doc<any>(`users/${user.uid}`).valueChanges().subscribe(val => this.user.next(val))
          return this.afs.doc<any>(`users/${user.uid}`).valueChanges();
        } else {
          // Logged out
          this.user.next(null);
          return of(null);
        }
      })
    )
  }

  getUser(): BehaviorSubject<any> {
    return this.user;
  }

  initSubjects(): void {
    if(!this.user) this.user = new BehaviorSubject(null);
  }

  completeAllSubjects(): void {
    if(this.user) this.user.complete();
  }

  googleSignin(): void {
    const provider = new firebase.auth.GoogleAuthProvider();
    this.afAuth.signInWithPopup(provider)
      .then(credential => this.updateUserData(credential.user))
      .catch(err => console.error(err.message))
  }

  getIdToken(): Promise<any> {
    return firebase.auth().currentUser
      .getIdToken(true)
  }

  private updateUserData(user): Promise<any>  {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    }

    return userRef.set(data, { merge: true });
  }

  async signOut() {
    await this.afAuth.signOut();
    this.router.navigate(['/']);
  }
}
