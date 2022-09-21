import React from 'react'
import { View, 
         Text, 
         StyleSheet, 
         TouchableWithoutFeedback, 
         TouchableOpacity
} from 'react-native'

import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";

import Icon from 'react-native-vector-icons/FontAwesome'

import moment from 'moment'
import 'moment/locale/pt-br'

export default props => {

    const doneOrNotStyle = props.done_at != null ?{ textDecorationLine: 'line-through'} :{}

    const date = props.done_at ? props.done_at : props.estimate_at
    
    const formattedDate = moment(date).locale('pt-br').format('ddd, D [de] MMMM')
    
    const getRightContent = () => {
        return (
            <TouchableOpacity 
                style={styles.right}
                onPress={() => props.onDelete && props.onDelete(props.id)}>
                <Icon name='trash' size={30} color='#FFF' />
            </TouchableOpacity>
        )
    }
    const getLeftContent = () => {
        return (
            <View style={styles.left}>
                <Icon name='trash' size={20} color='#FFF' style={styles.excludeIcon} />
                <Text style={styles.excludeText}>Excluir</Text>
            </View>
        )
    }

    return (
        <GestureHandlerRootView>
        <Swipeable 
            renderRightActions={getRightContent} 
            renderLeftActions={getLeftContent}
            onSwipeableLeftOpen={() => props.onDelete && props.onDelete(props.id)}>    
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={() => props.onToggleTask(props.id)}>
                    <View style={styles.checkContainer}>
                        {getCheckView(props.done_at)}
                    </View>
                </TouchableWithoutFeedback>
                <View>
                    <Text style={[styles.desc, doneOrNotStyle]}>{props.desc}</Text>
                    <Text style={styles.date}>{formattedDate}</Text>
                </View>
            </View>
        </Swipeable>
        </GestureHandlerRootView>
    )
}

function getCheckView(doneAt) {
    if(doneAt != null) {
        return(
            <View style={styles.done}>
                <Icon name='check' size={20} color='#FFF' />
            </View>
        )
    } else {
        return(
            <View style={styles.pending} />
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', //definido que o main access é a linha
        borderBottomWidth: 1,
        borderColor: '#AAA',
        alignItems: 'center', //alinha o item com base no eixo do cross access que é o eixo da coluna
        paddingVertical: 20,
        backgroundColor: '#FFF'
    },
    checkContainer: {
        width: '20%',
        alignItems: 'center',
        justifyContent: 'center' //garante que vai estar centralizado o conteudo no main access
    },
    pending: {
        height: 25,
        width: 25,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: '#555'
    },
    done: {
        height: 25,
        width: 25,
        borderRadius: 13,
        backgroundColor: '#4D7031',
        alignItems: 'center',
        justifyContent: 'center'
    },
    desc: {
        color: '#000',
        fontSize: 17
    },
    date: {
        color: '#495057',
        fontSize: 15
    },
    right: {
        backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: 20
    },
    left: {
        flex: 1,
        backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center'
    },
    excludeText: {
        color: '#FFF',
        fontSize: 20,
        margin: 10
    },
    excludeIcon: {
        marginLeft: 10
    }
})