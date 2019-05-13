import React from 'react';
import styles from '../styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { View, Text, TextInput, FlatList, KeyboardAvoidingView } from 'react-native';
import { addMessage } from '../actions';

class Chat extends React.Component {
  state = {
    message: '',
  }
  
  componentDidMount = () => {
  }

  sendMessage = () => {
    const { params } = this.props.navigation.state
    this.props.addMessage(params, this.state.message)
    this.setState({message: ''})
  }

  render() {
    return (
      <KeyboardAvoidingView enabled behavior='padding' style={styles.container}>
        <TextInput
          style={styles.input}
          onChangeText={(message) => this.setState({message})}
          value={this.state.message}
          returnKeyType='send'
          placeholder='Send Message'
          onSubmitEditing={this.sendMessage}/>
      </KeyboardAvoidingView>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ addMessage }, dispatch)
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat)