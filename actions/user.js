import firebase from 'firebase';
import db from '../config/firebase';
import orderBy from 'lodash/orderBy'

export const updateEmail = (email) => {
	return {type: 'UPDATE_EMAIL', payload: email}
}

export const updatePassword = (password) => {
	return {type: 'UPDATE_PASSWORD', payload: password}
}

export const updateUsername = (username) => {
	return {type: 'UPDATE_USERNAME', payload: username}
}

export const updateBio = (bio) => {
	return {type: 'UPDATE_BIO', payload: bio}
}

export const updatePhoto = (photo) => {
	return {type: 'UPDATE_PHOTO', payload: photo}
}

export const login = () => {
	return async (dispatch, getState) => {
		try {
			const { email, password } = getState().user
			const response = await firebase.auth().signInWithEmailAndPassword(email, password)
			dispatch(getUser(response.user.uid))
		} catch (e) {
			alert(e)
		}
	}
}

export const facebookLogin = () => {
	return async (dispatch) => {
		try {
			const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('136245687322203')
			if(type === 'success') {
				// Build Firebase credential with the Facebook access token.
				const credential = await firebase.auth.FacebookAuthProvider.credential(token);
				// Sign in with credential from the Facebook user.
				const response = await firebase.auth().signInWithCredential(credential)
				const user = await db.collection('users').doc(response.uid).get()
				if(!user.exists){
					const user = {
						uid: response.uid,
						email: response.email,
						username: response.displayName,
						bio: '',
						photo: response.photoURL,
						token: null,
					}
					db.collection('users').doc(response.uid).set(user)
					dispatch({type: 'LOGIN', payload: user})
				} else {
					dispatch(getUser(response.uid))
				}
			}
		} catch (e) {
			alert(e)
		}
	}
}

export const getUser = (uid, type) => {
	return async (dispatch, getState) => {
		try {
			const userQuery = await db.collection('users').doc(uid).get()
			let user = userQuery.data()

			let posts = []
			const postsQuery = await db.collection('posts').where('uid', '==', uid).get()
			postsQuery.forEach(function (response) {
				posts.push(response.data())
			})
			user.posts = orderBy(posts, 'date', 'desc')

			if (type === 'LOGIN') {
				dispatch({ type: 'LOGIN', payload: user })
			} else {
				dispatch({ type: 'GET_PROFILE', payload: user })
			}
		} catch (e) {
			alert(e)
		}
	}
}

export const updateUser = () => {
  return async ( dispatch, getState )  => {
    const { uid, username, bio, photo } = getState().user
    try {
      db.collection('users').doc(uid).update({
        username: username,
        bio: bio,
        photo: photo
      })
    } catch(e) {
      alert(e)
    }
  }
}

export const signup = () => {
	return async (dispatch, getState) => {
		try {
			const { email, password, username, bio } = getState().user
			const response = await firebase.auth().createUserWithEmailAndPassword(email, password)
			if(response.user.uid) {
				const user = {
					uid: response.user.uid,
					email: email,
					username: username,
					bio: bio,
					photo: '',
					token: null,
				}
				db.collection('users').doc(response.user.uid).set(user)
				dispatch({type: 'LOGIN', payload: user})
			}
		} catch (e) {
			alert(e)
		}
	}
}