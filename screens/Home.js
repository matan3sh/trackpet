import React from 'react';
import styles from '../styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons
} from '@expo/vector-icons';
import {
  Text,
  View,
  Button,
  Image,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { getPosts, likePost, unlikePost } from '../actions/post';
import moment from 'moment';

class Home extends React.Component {
  componentDidMount() {
    this.props.getPosts();
  }

  likePost = post => {
    const { uid } = this.props.user;
    if (post.likes.includes(uid)) {
      this.props.unlikePost(post);
    } else {
      this.props.likePost(post);
    }
  };

  navigateMap = item => {
    this.props.navigation.navigate('Map', {
      location: item.postLocation
    });
  };

  render() {
    if (this.props.post === null) return null;
    return (
      <View style={styles.container}>
        <FlatList
          onRefresh={() => this.props.getPosts()}
          refreshing={false}
          data={this.props.post.feed}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            const liked = item.likes.includes(this.props.user.uid);
            return (
              <View>
                <View style={[styles.row, styles.space]}>
                  <View style={[styles.row, styles.center]}>
                    <Image
                      style={styles.roundImage}
                      source={{ uri: item.photo }}
                    />
                    <View>
                      <Text style={styles.bold}>{item.username}</Text>
                      <Text style={[styles.gray, styles.small]}>
                        {moment(item.date).format('ll')}
                      </Text>
                      <TouchableOpacity onPress={() => this.navigateMap(item)}>
                        <Text>
                          {item.postLocation ? item.postLocation.name : null}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text
                    style={{
                      marginLeft: 100,
                      fontWeight: 'bold',
                      alignItems: 'center'
                    }}
                  >
                    {item.postPet} {item.postPetRace}
                  </Text>

                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('Comment', item)
                    }
                  >
                    <FontAwesome
                      style={{ margin: 5 }}
                      name='commenting'
                      size={35}
                    />
                  </TouchableOpacity>

                  {/* <Ionicons style={{ margin: 5 }} name='ios-flag' size={25} /> */}
                </View>
                <TouchableOpacity onPress={() => this.likePost(item)}>
                  <Image
                    style={styles.postPhoto}
                    source={{ uri: item.postPhoto }}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                >
                  <MaterialCommunityIcons
                    onPress={() => this.likePost(item)}
                    style={{ margin: 5 }}
                    color={liked ? '#E98F00' : '#000'}
                    name={liked ? 'human-handsup' : 'human-handsdown'}
                    size={25}
                  />
                  <Text>
                    {item.likes.length} {'People are Interested'}
                  </Text>

                  {/* <Ionicons style={{ margin: 5 }} name='ios-send' size={25} /> */}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end'
                  }}
                >
                  <View
                    style={{
                      justifyContent: 'flex-start',
                      flexDirection: 'row',
                      alignContent: 'center',
                      borderColor: '#d3d3d3',
                      borderWidth: 1,
                      borderRadius: 50,
                      width: 410
                    }}
                  >
                    <View style={{ flexDirection: 'column' }}>
                      <Text>
                        {' '}
                        <Text style={{ color: '#882525', fontWeight: 'bold' }}>
                          {'Description: '}
                        </Text>
                        {item.postDescription}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ getPosts, likePost, unlikePost }, dispatch);
};

const mapStateToProps = state => {
  return {
    post: state.post,
    user: state.user
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
