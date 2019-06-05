import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Image,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';
import styles from './styles';
import { colors } from '~/styles';
import api from '~/services/api';

export default class Welcome extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    username: '',
    loading: false,
    error: false,
  };

  checkUserExists = async (username) => {
    const user = await api.get(`/users/${username}`);
    return user;
  };

  saveUser = async (username) => {
    await AsyncStorage.setItem('@Githuber:username', username);
  };

  sigIn = async () => {
    const { username } = this.state;
    const { navigation } = this.props;
    this.setState({
      loading: true,
    });
    try {
      await this.checkUserExists(username);
      await this.saveUser(username);
      navigation.navigate('User');
    } catch (err) {
      setTimeout(() => {
        this.setState({
          loading: false,
          error: true,
        });
        console.log('usuário inexistente');
      }, 3000);
    }
  };

  render() {
    const { username, loading, error } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <View style={styles.containerLogo}>
          <Image
            style={styles.logo}
            source={{
              uri:
                'https://github.githubassets.com/images/modules/logos_page/Octocat.png',
            }}
          />
        </View>
        <Text style={styles.title}>Bem-vindo</Text>
        <Text style={styles.text}>
          Para continuar precisamos que você informe seu usuário no Github.
        </Text>
        {error && <Text style={styles.error}>Usuário não encontrado</Text>}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Digite seu usuário"
            underlineColorAndroid="transparent"
            value={username}
            onChangeText={text => this.setState({ username: text })}
          />

          <TouchableOpacity
            style={styles.button}
            disabled={loading}
            onPress={this.sigIn}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>Prosseguir</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
