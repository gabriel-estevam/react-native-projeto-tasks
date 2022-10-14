import { Alert, Platform } from 'react-native'

const server = Platform.OS === 'ios' ? 'http://localhost:3000' : 'http://192.168.15.15:3000'

function showError(error) {
    if(error.response && error.response.data) {
        Alert.alert('ops! Ocorreu um Problema!', `Mensagem: ${error.response.data}`)
    }
    else {
        Alert.alert('ops! Ocorreu um Problema!', `Mensagem: ${error}`)
    }
}

function showSucces(msg) {
    Alert.alert('Sucesso!', msg)
}

export { server, showError, showSucces }