import React from 'react';
import firebase from 'firebase';
import { Text, View, Image, TouchableOpacity, FlatList} from 'react-native';
import { connect } from 'react-redux'
import styles from '../styles'

class Profile extends React.Component {
  render() {
    let user = {}
    const { state, navigate } = this.props.navigation
    if(state.routeName === 'Profile'){
      user = this.props.profile
    } else {
      user = this.props.user
    }
    return (
      <View style={styles.container}>
        <Image style={styles.roundImage} source={{uri: user.photo}}/>
        <Text>{user.email}</Text>
        <Text>{user.username}</Text>
        <Text>{user.bio}</Text>
        {
          state.routeName === 'MyProfile' ?
          <View>
            <TouchableOpacity style={styles.buttonSmall} onPress={() => this.props.navigation.navigate('Edit')}>
              <Text style={styles.bold}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSmall} onPress={() => firebase.auth().signOut()}>
              <Text style={styles.bold}>Logout</Text>
            </TouchableOpacity>
          </View> : 
          <TouchableOpacity style={styles.buttonSmall} onPress={() => this.props.navigation.navigate('Chat', user.uid)}>
            <Text style={styles.bold}>Message</Text>
          </TouchableOpacity>
        }
        <FlatList
          horizontal={false}
          numColumns={3}
          data={user.posts}
          keyExtractor={(item) => JSON.stringify(item.date)}
          renderItem={({ item }) => <Image style={styles.squareLarge} source={{uri: item.postPhoto}}/> }/>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    profile: state.profile
  }
}

export default connect(mapStateToProps)(Profile)