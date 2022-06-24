<template>
  <section >
    <form @submit.prevent="salvar">
      <div class="field">
        <label for="nomeDoProjeto" class="label"> Nome do Projeto </label>
        <input
          type="text"
          class="input"
          v-model="nomeDoProjeto"
          id="nomeDoProjeto"
        />
      </div>
      <div class="field">
        <button class="button" type="submit">Salvar</button>
      </div>
    </form>
  </section>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { defineComponent } from "vue";
import { TipoNotificacao } from '@/interfaces/INotificacao'
import { ALTERAR_PROJETOS, CADASTRAR_PROJETOS } from "@/store/tipo-acoes";
import useNotificador from '@/hooks/notificador'

export default defineComponent({
  name: "Formulario",
  props:{
       id: {
        type:String
       }
  },
  mounted(){
      if(this.id) {
        const projeto = this.store.state.projetos.find(proj => proj.id == this.id)
        this.nomeDoProjeto = projeto?.nome || ''
      }
    },
  data() {
    return {
      nomeDoProjeto: ""
    };
  },
  methods: {
    salvar(){
      if(this.id){
        this.store.dispatch(ALTERAR_PROJETOS,{
          id:this.id,
          nome:this.nomeDoProjeto
        }).then(()=> this.lidarComSucesso())
      }else{
            this.store.dispatch(CADASTRAR_PROJETOS, this.nomeDoProjeto)
            .then(()=>{ this.lidarComSucesso })
            .catch(()=>{ this.notificar(TipoNotificacao.FALHA, 'ERRO!','ERRO ao criar projeto')})
      }  
    },
    lidarComSucesso(){
      this.nomeDoProjeto ="";
      this.notificar(TipoNotificacao.SUCESSO,'Pronto!', 'Projeto criado com sucesso')
      this.$router.push('/projetos')
    }
  },
  setup(){
    const store = useStore()
    const { notificar } = useNotificador()
    return{
      store,
      notificar
    }
  }
})


</script>

