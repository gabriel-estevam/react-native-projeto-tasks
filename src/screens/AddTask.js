import React, { Component } from 'react'
import { Modal, 
         Platform, 
         StyleSheet, 
         Text, 
         TextInput, 
         TouchableOpacity, 
         TouchableWithoutFeedback, 
         View 
} from 'react-native'

import DateTimePicker from '@react-native-community/datetimepicker';

import commonStyles from '../commonStyles'

import moment from 'moment';

const initialState = { desc: '', date: new Date(), showDatePicker: false }

export default class AddTask extends Component {

    state = {
        ...initialState
    }
    
    save = () => {
        const newTask = {
            desc: this.state.desc,
            date: this.state.date
        }
        
        /*if(this.props.onSave) {
            this.props.onSave(newTask)        
        } a linha abaixo faz a mesma função que esse if
        */
        this.props.onSave && this.props.onSave(newTask)
        this.setState({ ...initialState })
    }

    getDatePicket = () => {
        let datePicket = <DateTimePicker 
                            value={this.state.date}
                            onChange= {
                                //Tratativa para fechar a tela modal do dataPicker do Android
                                (event, date) => event.type === 'dismissed' 
                                ? null 
                                : this.setState({ date: date, showDatePicker: false })
                            }
                            mode='date' 
                          />

        const dateString = moment(this.state.date).format('ddd, D [de] MMMM [de] YYYY')

        if(Platform.OS === 'android') {
            datePicket = (
                <View>
                    <TouchableOpacity onPress={() => this.setState({ showDatePicker: true })}>
                        <Text style={styles.date}>
                            {dateString}
                        </Text>
                    </TouchableOpacity>
                    {this.state.showDatePicker && datePicket}
                </View>
            )
        }
        return datePicket
    }

    render() {
        return (
            <Modal transparent={true} 
                visible={this.props.isVisible}
                onRequestClose={this.props.onCancel}
                animationType='slide'>
                <TouchableWithoutFeedback
                  onPress={this.props.onCancel}>
                    <View style={styles.background}></View>
                </TouchableWithoutFeedback>

                <View style={styles.container}>
                    <Text style={styles.header}>Nova Tarefa</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder='Informe a Descrição'
                      onChangeText={desc => this.setState({ desc })}
                      value={this.state.desc}
                    />
                    {this.getDatePicket()}
                    <View style={styles.buttons}>
                        <TouchableOpacity onPress={this.props.onCancel}>
                            <Text style={styles.button}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={this.save}>
                            <Text style={styles.button}>Salvar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                
                <TouchableWithoutFeedback
                  onPress={this.props.onCancel}>
                    <View style={styles.background}></View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
    container: {
        //flex: 1,
        backgroundColor: '#FFF'
    },
    header: {
        backgroundColor: commonStyles.colors.today,
        color: commonStyles.colors.secondary,
        textAlign: 'center',
        padding: 15,
        fontSize: 18
    },
    input: {
        width: '90%',
        height: 40,
        margin: 15,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E3E3E3',
        borderRadius: 6
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    button: {
        margin: 20,
        marginRight: 30,
        color: commonStyles.colors.today
    },
    date: {
        fontSize: 20,
        marginLeft: 15,
        color: '#495057'
    }
})