import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Text, View, Button, Image, FlatList, TouchableOpacity } from 'react-native';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getPosts, likePost, unlikePost } from '../actions/post'
import moment from 'moment'

import styles from '../styles'

class Home extends React.Component {

  componentDidMount() {
    this.props.getPosts()
  }

  likePost = (post) => {
    const { uid } = this.props.user
    if(post.likes.includes(uid)){
      this.props.unlikePost(post)
    } else {
      this.props.likePost(post)
    }
  }

  navigateMap = (item) => {
    this.props.navigation.navigate('Map', 
      { location: item.postLocation }
    )
  }

  render() {
    if(this.props.post === null) return null
    return (
      <View style={styles.container}>
        <FlatList
          onRefresh={() => this.props.getPosts()}
          refreshing={false}
          data={this.props.post.feed}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => {
            const liked = item.likes.includes(this.props.user.uid)
            return (
              <View>
                <View style={[styles.headerRow, styles.space]}>
                  <View style={[styles.headerRow, styles.center]}>
                    <Image style={styles.roundImage} source={{uri: item.photo}}/>
                    <View>
                      <Text style={styles.bold}>{item.username}</Text>
                      <Text style={[styles.gray, styles.small]}>{moment(item.date).format('ll')}</Text>
                      <TouchableOpacity onPress={() => this.navigateMap(item)} >
                        <Text style={[styles.bold, styles.red]}>{item.postLocation ? item.postLocation.name : null}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Ionicons style={{margin: 5}} name='ios-flag' size={25} />
                </View>
                <TouchableOpacity onPress={() => this.likePost(item)} >
                  <Image style={[styles.postPhoto, styles.footerRow]} source={{uri: item.postPhoto}}/>
                </TouchableOpacity>
                <View style={styles.footerRow}>
                  <Ionicons style={{margin: 5}} color={liked ? '#db565b' : '#000'} name={ liked ? 'ios-heart' : 'ios-heart-empty'} size={25} />
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('Comment', item)} >
                    <Ionicons style={{margin: 5}} name='ios-chatbubbles' size={25} />
                  </TouchableOpacity>
                  <Ionicons style={{margin: 5}} name='ios-send' size={25} />
                  <Text style={{margin: 10}}>{item.postDescription}</Text>
                </View>
              </View>
            )
          }}
        />
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ getPosts, likePost, unlikePost }, dispatch)
}

const mapStateToProps = (state) => {
  return {
    post: state.post, 
    user: state.user
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)