import { AsyncStorage } from 'react-native';

const deviceStorage = {

    async saveKey(key, value) {
        try {
          await AsyncStorage.setItem(key, value);
        } catch (error) {
          console.log('AsyncStorage Error: ' + error.message);
        }
    },
    async loadToken() {
        try {
          const value = await AsyncStorage.getItem('id_token');
          if (value !== null) {
            this.setState({
              id_token: value,
              isLoading: false
            });
          } else {
            this.setState({
                isLoading: false
            });
          }
        } catch (error) {
          console.log('AsyncStorage Error: ' + error.message);
        }
    },
    async deleteToken() {
        try{
          await AsyncStorage.removeItem('id_token')
          .then(
            () => {
              this.setState({
                id_token: ''
              })
            }
          );
        } catch (error) {
          console.log('AsyncStorage Error: ' + error.message);
        }
    },
    async loggedUser() {
      try {
        const value = await AsyncStorage.getItem('logged_user');
        if (value !== null) {
          this.setState({
            user_current:value
          })
        } else {
         return false;
        }
      } catch (error) {
        console.log('AsyncStorage Error: ' + error.message);
      }
  },

};

export default deviceStorage;