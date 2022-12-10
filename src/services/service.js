import axios from 'axios'

export default class APIService {

    obterLista = (success, error) => {
        return axios.get('http://localhost:3000/api/arsenal').then((response) => success(response.data)).catch((e) => error(e))
    }

    removerLista = (nome, success, error) => {
        return axios.delete(`http://localhost:3000/api/arsenal/${nome}`).then((response) => success(response.data)).catch((e) => error(e))
    }

    atualizarTropa = (nome, quantidade, success, error) => {
        return axios.put(`http://localhost:3000/api/arsenal/${nome}`, {quantidade}).then((response) => success(response.data)).catch((e) => error(e))
    }

    adicionarTropa = (tropa, success, error) => {
        return axios.post(`http://localhost:3000/api/arsenal`, {tropa}).then((response) => success(response.data)).catch((e) => error(e))
    }
}