import { OBTER_TAREFAS, CADASTRAR_TAREFAS, ALTERAR_TAREFAS } from './tipo-acoes';
import INotificacao from "@/interfaces/INotificacao";
import { InjectionKey } from 'vue';
import { createStore, Store, useStore as vuexUseStore } from "vuex";
import{ ADICIONA_TAREFA, ALTERA_TAREFA, DEFINIR_TAREFAS, NOTIFICAR} from './tipo-mutation'

import http from '@/http'
import ITarefa from '@/interfaces/ITarefa';
import { EstadoProjeto, projeto } from './modulos/projetos/index';


export interface Estado {
    notificacoes: INotificacao[]
    tarefas: ITarefa[]
    projeto: EstadoProjeto
}

export const key:InjectionKey<Store<Estado>> = Symbol()

export const store = createStore<Estado>({
    state: {
        notificacoes:[],
        tarefas:[],
        projeto: {
            projetos:[]
        }
    },
    mutations: {
        
        [NOTIFICAR](state, novaNotificacao:INotificacao){

            novaNotificacao.id = new Date().getTime()
            state.notificacoes.push(novaNotificacao)

            setTimeout(()=>{
                state.notificacoes= state.notificacoes.filter(notificacao => notificacao.id != novaNotificacao.id)
            }, 3000)
        },
        [DEFINIR_TAREFAS](state, tarefas: ITarefa[]){
            state.tarefas = tarefas
        },
        [ADICIONA_TAREFA](state, tarefa: ITarefa){
            state.tarefas.push(tarefa)
        },
        [ALTERA_TAREFA](state, tarefa: ITarefa){
            const index = state.tarefas.findIndex(t => t.id == tarefa.id)       
            state.tarefas[index] = tarefa
        },
    },
    actions: {
        
        [OBTER_TAREFAS]({commit}){
            http.get('tarefas')
            .then(resp => commit(DEFINIR_TAREFAS, resp.data))
        },
        [CADASTRAR_TAREFAS]({commit}, tarefa:ITarefa){
            return http.post('/tarefas', tarefa)
                   .then(resp => commit(ADICIONA_TAREFA, resp.data)) 
        },
        [ALTERAR_TAREFAS]({commit}, tarefa:ITarefa){
            return http.put(`/tarefas/${tarefa.id}`, tarefa)
                       .then(() => commit(ALTERA_TAREFA, tarefa))     
        },
    },
    modules: {
        projeto
    }
})

export function useStore(): Store<Estado> {
    return vuexUseStore(key)
}