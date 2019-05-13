import uuid from 'uuid';
import firebase from 'firebase'
import { ImageManipulator } from 'expo';
import db from '../config/firebase'

export const uploadPhoto = (image) => {
  return async (dispatch) => {
    try {
      const resize = await ImageManipulator.manipulateAsync(image.uri, [], { format: 'jpg', compress: 0.1 })
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onload = () => resolve(xhr.response)
        xhr.responseType = 'blob'
        xhr.open('GET', resize.uri, true)
        xhr.send(null)
      });
      const uploadTask = await firebase.storage().ref().child(uuid.v4()).put(blob)
      const downloadURL = await uploadTask.ref.getDownloadURL()
      return downloadURL
    } catch(e) {
      console.error(e)
    }
  }
}

export const addMessage = (id, text) => {
  return (dispatch, getState) => {
    const { uid, photo, username } = getState().user
    try {
      const message = {
        members: [id, uid].sort(),
        message: text,
        photo: photo,
        username: username,
        uid: uid,
        date: new Date().getTime(),
      }
      db.collection('messages').doc().set(message)
    } catch(e) {
      console.error(e)
    }
  }
}