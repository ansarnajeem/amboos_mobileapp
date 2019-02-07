import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { KeyboardAvoidingView, LayoutAnimation, Platform, StyleSheet, UIManager, StatusBar } from 'react-native'
import { Image, View } from 'react-native-animatable'
import imgLogo from '../../images/logo.png'
import metrics from '../../config/metrics'
import Opening from './Opening'
import SignupForm from './SignupForm'
import LoginForm from './LoginForm'
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux'
import thunk from 'redux-thunk';
import { cartItems,itemsFetchData,saveUserAccess} from '../../action';
import store from '../../store'
const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.6
if (Platform.OS === 'android') UIManager.setLayoutAnimationEnabledExperimental(true)

/**
 * The authentication screen.
 * It shows three different sub-screens:
 * - The opening screen, with the two buttons that redirect to the login/signup forms (if this.state.visibleForm === null)
 * - The signup form (if this.state.visibleForm === 'SIGNUP')
 * - The login form (if this.state.visibleForm === 'LOGIN')
 *
 * The app state (isLoggedIn, isLoading) and the login/signup functions are received as props from src.app.js
 *
 * The animations are delegated to:
 * - react-native-animatable: for the simpler animations of the components (in e.g. bounceIn animation of the logo)
 * - react-native's LayoutAnimation: for the form show/hide animation
 * - react-native's KeyboardAvoidingView: for applying a bottom padding when a keyboard show-up is detected
 *
 * An example of this screen animation flow is the following:
 * - The user opens the app.
 * - The logo shows up using the bounceIn animation of react-native-animatable, while the "Opening" subscreen animates the button
 *   using the fadeIn animation of react-native-animatable.
 * - The user taps on the "Create account" button.
 * - _setVisibleForm gets called with the 'SIGNUP' parameter. It configures the next animation and sets this.state.visibleForm to 'SIGNUP'.
 *   The state change triggers a render and the change of formStyle gets animated (thanks to the animation configuration previously
 *   applied by _setVisibleForm).
 * - Just after the signup form has become visible it animates the form button using the bounceIn animation of react-native-animatable.
 * - The user fills up its info and signup succesfully.
 * - componentWillUpdate checks the isLoggedIn props and after realizing that the user has just authenticated it calls _hideAuthScreen.
 *   _hideAuthScreen then 1. calls the SignupForm.hideForm(), that hides the form buttons (zoomOut) and the form itself (fadeOut),
 *   2. fadeOut the logo, 3. tells the container that the login animation has completed and that the app is ready to show the next screen (HomeScreen).
 */
 class AuthScreen extends Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    signup: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    onLoginAnimationCompleted: PropTypes.func.isRequired // Called at the end of a succesfull login/signup animation
  }

  state = {
    visibleForm: null // Can be: null | SIGNUP | LOGIN
  }

   componentDidMount() {
        this.props.fetchData();
        this.props.saveUserToken();
    }
  componentWillUpdate (nextProps) {
    // If the user has logged/signed up succesfully start the hide animation
    if (!this.props.isLoggedIn && nextProps.isLoggedIn) {
      this._hideAuthScreen()
    }
  }

  _hideAuthScreen = async () => {
    // 1. Slide out the form container
    await this._setVisibleForm(null)
    // 2. Fade out the logo
    await this.logoImgRef.fadeOut(800)
    // 3. Tell the container (app.js) that the animation has completed
    this.props.onLoginAnimationCompleted()
  }

  _setVisibleForm = async (visibleForm) => {
    // 1. Hide the current form (if any)
    if (this.state.visibleForm && this.formRef && this.formRef.hideForm) {
      await this.formRef.hideForm()
    }
    // 2. Configure a spring animation for the next step
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
    // 3. Set the new visible form
    // if(this.props.token && this.props.token.api_token){
      this.setState({ visibleForm })
    // }
   
  }
 

  render () {
    // alert(JSON.stringify(this.props.token.api_token));
     //console.log(this.props.token);
    const { isLoggedIn, isLoading, signup, login} = this.props
    const { visibleForm } = this.state
    // The following style is responsible of the "bounce-up from bottom" animation of the form
    const formStyle = (!visibleForm) ? { height: 0 } : { marginTop: 40 }
    return (
 <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} locations={[.1,0.50,1]} colors={['#275CAA', '#4677C4', '#275CAA']} style={styles.linearGradient}>
 <StatusBar
     backgroundColor="#1D4B98"
     barStyle="light-content"
  
   />
      <View style={styles.container}>
        <Image
          animation={'bounceIn'}
          duration={1200}
          delay={200}
          ref={(ref) => this.logoImgRef = ref}
          style={styles.logoImg}
          source={imgLogo}
        />
       
        {(!visibleForm && !isLoggedIn) && (
          <Opening
            onCreateAccountPress={() => this._setVisibleForm('SIGNUP')}
            onSignInPress={() => (this.props.token.api_token?this._setVisibleForm('LOGIN'):'')}
          />
        )}
        <KeyboardAvoidingView
          keyboardVerticalOffset={-100}
          behavior={'padding'}
          style={[formStyle, styles.bottom]}
        >
     
          {(visibleForm === 'SIGNUP') && (
            <SignupForm
              ref={(ref) => this.formRef = ref}
              onLoginLinkPress={() => this._setVisibleForm('LOGIN')}
              onSignupPress={signup}
              isLoading={isLoading}
            />
          )}
          {(visibleForm === 'LOGIN') && (
            <LoginForm
              ref={(ref) => this.formRef = ref}
              onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
              onLoginPress={login}
              isLoading={isLoading}
            />
          )}
        </KeyboardAvoidingView>


      </View>
       </LinearGradient>
    )
  }
}
const mapStateToProps = (state) => {
    return {
         token: state.items,
         hasError: state.itemsHaveError,
         isLoading: state.itemsAreLoading,
         device_token:state.authUser
    };
};

const mapDispatchToProps = (dispatch) => {
  return {
  
      fetchData: () => dispatch(itemsFetchData()),
    saveUserToken: () => dispatch(saveUserAccess())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen);



const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    width: metrics.DEVICE_WIDTH,
    height: metrics.DEVICE_HEIGHT,
    paddingTop: 24,
    
  },
   linearGradient: {
    flex: 1,
    
  },
  logoImg: {
    flex: 1,
    height: null,
    width: IMAGE_WIDTH,
    alignSelf: 'center',
    resizeMode: 'contain',
    marginVertical: 30,
    
  },
  bottom: {
    
  }
})
