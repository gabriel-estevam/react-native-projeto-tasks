import React, { Component } from 'react'
import { View, 
         Text, 
         ImageBackground, 
         StyleSheet, 
         FlatList, 
         TouchableOpacity, 
         Alert, 
         Platform
} from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from 'moment'
import Icon from 'react-native-vector-icons/FontAwesome'

import todayImage from '../../assets/imgs/today.jpg'
import 'moment/locale/pt-br'
import Task from '../components/Task'
import AddTask from './AddTask'

import commonStyles from '../commonStyles'

const initialState = { 
    showDoneTasks: true,
    showAddTask: false,
    visibleTasks: [],
    tasks: []
}

export default class TaskList extends Component {
    state = {
        ...initialState
    }

    componentDidMount = async () => {
    //filtra assim que o componente foi renderizado
      //  this.filterTasks()
      const stateString =  await AsyncStorage.getItem('tasksState')
      const state =  JSON.parse(stateString) || initialState
      this.setState(state)
    }

    toggleFilter = () => {
        this.setState({ showDoneTasks: !this.state.showDoneTasks }, this.filterTasks)
    }
    
    filterTasks = () => {
        let visibleTasks = null
        
        if (this.state.showDoneTasks) {
            visibleTasks = [...this.state.tasks]
        } else {
            const pending = task => task.done_at === null
            visibleTasks = this.state.tasks.filter(pending)
        }

        this.setState({ visibleTasks })
        AsyncStorage.setItem('tasksState', JSON.stringify(this.state))
    }

    toggleTask = taskId => {
        const tasks = [...this.state.tasks]
        tasks.forEach(task => {
            if(task.id === taskId) {
                task.done_at = task.done_at ? null : new Date()
            }
        })

        this.setState({ tasks }, this.filterTasks)
    }
    addTask = newTask => {
        if(!newTask.desc || !newTask.desc.trim()) {
            Alert.alert('Dados Inválidos', 'Descrição não informada!')
            return 
        }

        const tasks = [...this.state.tasks]
        tasks.push({
            id: Math.random(),
            desc: newTask.desc,
            estimate_at: newTask.date,
            done_at: null
        })
        
        this.setState({ tasks, showAddTask: false }, this.filterTasks)
    }

    deleteTask = id => {
        const tasks = this.state.tasks.filter(task => task.id !== id)
        this.setState({ tasks }, this.filterTasks)
    }

    render() {
        const today = moment().locale('pt-br').format('ddd, D, [de] MMMM')
        return (
            <View style={styles.container}>
                <AddTask 
                  isVisible={this.state.showAddTask}
                  onCancel={() => this.setState({ showAddTask: false })}
                  onSave={this.addTask}
                />
               
               <ImageBackground 
                   source={todayImage} 
                   style={styles.background}>
                    <View style={styles.iconBar}>
                        <TouchableOpacity onPress={this.toggleFilter}>
                            <Icon name={this.state.showDoneTasks ? 'eye' : 'eye-slash'} 
                                  size={25}
                                  color='#FFF'
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.titleBar}>
                        <Text style={styles.title}>Hoje</Text>
                        <Text style={styles.subtitle}>{today}</Text>
                    </View>
                </ImageBackground>
                <View style={styles.taskListContainer}>
                    <FlatList 
                        data={this.state.visibleTasks}
                        keyExtractor={item => `${item.id}`}
                        renderItem={({item}) => <Task {...item} onToggleTask={this.toggleTask} onDelete={this.deleteTask} />}
                    />
                </View>
                <TouchableOpacity 
                    style={styles.addButton}
                    activeOpacity={0.7}
                    onPress={() => this.setState({ showAddTask: true })}>
                    <Icon name='plus' size={20} color='#FFF'/>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1 //esse container vai ocupar a tela inteira
    },
    background: {
        flexGrow: 3 //ocupa 30% da tela ou do componente pai
    },
    taskListContainer: {
        flexGrow: 7 //ocupa 70% da tela ou do componente pai
    },
    titleBar: {
        flexGrow: 1,
        justifyContent: 'flex-end' //posiciona no final do eixo principal, que no caso do celular é o eixo da coluna
    },
    title: {
      //  fontFamily: commonStyles.fontFamily,
        fontSize: 50,
        color: '#FFF',
        marginLeft: 20,
        marginBottom: 20
    },
    subtitle: {
        //fontFamily: commonStyles.fontFamily,
        fontSize: 20,
        color: '#FFF',
        marginLeft: 20,
        marginBottom: 20
    },
    iconBar: {
        flexDirection: 'row',
        marginHorizontal: 20,
        justifyContent: 'flex-end',
        marginTop: Platform.OS === 'ios' ? 40 : 10
    },
    addButton: {
        position: 'absolute',
        right: 30,
        bottom: 30,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: commonStyles.colors.today,
        justifyContent: 'center',
        alignItems: 'center'
    }
})