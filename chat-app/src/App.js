import './App.css';
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import React, { useRef, useState,useEffect } from 'react'


firebase.initializeApp({
  apiKey: "AIzaSyD7uEn78O-mYPNeOM7cG3HBpQ1gSvAqNDI",
  authDomain: "chat-app-f3602.firebaseapp.com",
  projectId: "chat-app-f3602",
  storageBucket: "chat-app-f3602.appspot.com",
  messagingSenderId: "938316179443",
  appId: "1:938316179443:web:5161d41bd5d869d2989486"
})
const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className=" container">
      <header className='d-flex justify-content-around align-items-center'>
        {user && <h1 className='text' style={{ color: "white" }}> Welcome {auth.currentUser.displayName}</h1>}
        <SignOut />

      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <div className="container">
        <h1 style={{ color: "white" }} className="text-center my-4">Hi! Please sign in to continue.</h1>
      </div>
      <div className="text-center a11">
        <button className="sign-in btn btn-primary" onClick={signInWithGoogle}> <i className="bi bi-google my-1"> Sign in with Google</i> </button>
      </div>


    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out btn btn-primary my-2" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }
  let limitChar = (element) => {
    const maxChar = 20;

    let ele = document.getElementById(element.id);
    let charLen = ele.value.length;

    let p = document.getElementById('charCounter');
    p.innerHTML = maxChar - charLen + ' characters remaining';

    if (charLen > maxChar) {
      ele.value = ele.value.substring(0, maxChar);
      p.innerHTML = 0 + ' characters remaining';
    }
  }
  return (
    <div className='container'>
          <div>
            <main style={{ border: "2px solid white" }}>

            {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

            <span ref={dummy}></span>
          </main>
          </div>
          <div className="">
            <form onSubmit={sendMessage} style={{position:"relative"}}>
            {/* <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice"className='form-control' /> */}
            <div className="input-group mb-3">
              <input type="text" placeholder="say something nice.." aria-label="Username" aria-describedby="basic-addon1" id='bottom0'  value={formValue} onChange={(e) => setFormValue(e.target.value)} className='form-control' maxLength="25" />
              <button type="submit" className=' btn btn-primary mx-2' disabled={!formValue}> Send</button>
            </div>
          </form>
          </div>
    </div>
    )
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  </>)
}


export default App;
