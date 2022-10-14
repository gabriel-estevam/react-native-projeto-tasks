import React, { Component } from 'react'
import { 
    ImageBackground, 
    Text, 
    StyleSheet, 
    View,
    TouchableOpacity
} from 'react-native'

import AuthInput from '../components/AuthInput'
import backgroundImage from '../../assets/imgs/login.jpg'
import commonStyles from '../commonStyles'

import { server, showError, showSucces } from '../common'

import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CommonActions } from '@react-navigation/native'

const initialState = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    stageNew: false
}

export default class Auth extends Component {

    state = {
        ...initialState
    }

    signInOrSignUp = () => {
        if(this.state.stageNew) {
            this.signup()
        }
        else {
            this.signin()
        }
    }

    signup = async () => {
        try{
            await axios.post(`${server}/signup`, {
                name: this.state.name,
                email: this.state.email.toLowerCase(),
                password: this.state.password,
                confirmPassword: this.state.confirmPassword,
            })
            showSucces('Usuário cadastrado!')
            this.setState({ ...initialState }) //restaura para o estado inicial da tela (campos limpos)

        } catch (e) {
            showError(e)
        }
    }

    signin = async () => {
        try {
            const res = await axios.post(`${server}/signin`, {
                email: this.state.email,
                password: this.state.password
            })

            AsyncStorage.setItem('userData', JSON.stringify(res.data))
            axios.defaults.headers.common['Authorization'] = `bearer ${res.data.token}`
            // this.props.navigation.navigate('Home', res.data)
            this.props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'Home',
                            params: res.data,
                        },
                    ],
                })
            )
        } catch (e) {
            showError(e)
        }
    }

    render() {
        const validations = []
        validations.push(this.state.email && this.state.email.includes('@'))
        validations.push(this.state.password && this.state.password.length >=3)
        
        if(this.state.stageNew) {
            validations.push(this.state.name && this.state.name.trim().length >= 3)
            validations.push(this.state.password === this.state.confirmPassword)
        }

        const validForm = validations.reduce((t, a) => t && a) //valida se cada item do array é true

        return (
            <ImageBackground source={backgroundImage} style={styles.background}>
                <Text style={styles.title}>Tasks</Text>
                <View style={styles.formContainer}>
                    <Text style={styles.subTitle}>
                        {this.state.stageNew ? 'Crie sua Conta' : 'Informe seus dados'}
                    </Text>
                    {this.state.stageNew &&
                        <AuthInput
                            icon= 'user' 
                            placeholder='Nome' 
                            value={this.state.name}
                            style={styles.input} 
                            onChangeText={name => this.setState( { name })} 
                        />
                    }
                    <AuthInput 
                        icon='envelope'
                        placeholder='E-mail' 
                        value={this.state.email}
                        style={styles.input} 
                        onChangeText={email => this.setState( { email })} 
                        autoCapitalize='none'
                    />
                    <AuthInput 
                        icon='lock'
                        placeholder='Senha' 
                        value={this.state.password}
                        style={styles.input} 
                        onChangeText={password => this.setState( { password })}
                        secureTextEntry={true} 
                    />
                     {this.state.stageNew &&
                        <AuthInput 
                            icon='lock'
                            placeholder='Confirmar Senha' 
                            value={this.state.confirmPassword}
                            style={styles.input} 
                            onChangeText={confirmPassword => this.setState( { confirmPassword })} 
                            secureTextEntry={true}
                        />
                    }
                    <TouchableOpacity onPress={this.signInOrSignUp} disabled={!validForm}>
                        <View style={[styles.button, validForm ? {} : { backgroundColor: '#AAA' }]}>
                            <Text style={styles.buttonText}>
                                {this.state.stageNew ? 'Registrar' : 'Entrar'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{ padding: 10}}
                    onPress={() => this.setState({ stageNew: !this.state.stageNew })}>
                    <Text style={styles.buttonText}>
                        {this.state.stageNew ? 'Já possui conta?' : 'Ainda não possui conta?'}
                    </Text>
                </TouchableOpacity>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        //fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 70,
        marginBottom: 10
    },
    subTitle: {
        //fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 10
    },
    formContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 20,
        width: '90%',
        borderRadius: 10
    },
    input: {
        marginTop: 10,
        backgroundColor: '#FFF'
    },
    button: {
        backgroundColor: '#080',
        marginTop: 10,
        padding: 10,
        alignItems: 'center',
        borderRadius: 7
    },
    buttonText: {
        //fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20
    }
})