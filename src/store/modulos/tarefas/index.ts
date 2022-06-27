import http from "@/http";
import ITarefa from "@/interfaces/ITarefa";
import { Estado } from "@/store";
import { OBTER_TAREFAS, CADASTRAR_TAREFAS, ALTERAR_TAREFAS } from "@/store/tipo-acoes";
import { DEFINIR_TAREFAS, ADICIONA_TAREFA, ALTERA_TAREFA } from "@/store/tipo-mutation";
import { Module } from "vuex";

export interface EstadoTarefa {
  tarefas: ITarefa[];
}

export const tarefa: Module<EstadoTarefa, Estado> = {
  state: {
    tarefas: [],
  },
  
  mutations: {
    [DEFINIR_TAREFAS](state, tarefas: ITarefa[]) {
      state.tarefas = tarefas;
    },
    [ADICIONA_TAREFA](state, tarefa: ITarefa) {
      state.tarefas.push(tarefa);
    },
    [ALTERA_TAREFA](state, tarefa: ITarefa) {
      const index = state.tarefas.findIndex((t) => t.id == tarefa.id);
      state.tarefas[index] = tarefa;
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
};
