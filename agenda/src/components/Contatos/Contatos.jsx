import { Link } from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect, useRef } from 'react';
import Swal from "sweetalert2";

import editIcon from '../../assets/icone-editar.svg';
import saveIcon from '../../assets/icone-salvar.svg'
import cancelIcon from '../../assets/icone-cancelar.svg'
import deleteIcon from '../../assets/icone-deletar.svg'
import searchIcon from '../../assets/icone-pesquisar.svg'

import "./Contatos.css"

export function Contatos () {
    const [agenda, setAgenda] = useState([]); //lista de contatos
    const [editandoContato, setEditandoContato] = useState(null); //id do contato editado
    const [contatoEditado, setContatoEditado] = useState({ nome: '', telefone: '', endereco: '', email: '' }); //dados do contato sendo editado
    const [searchTerm, setSearchTerm] = useState(''); //termo de busca
    const contactRefs = useRef({}); //referências aos elementos dos contatos para destaque na busca
    const [searchTrigger, setSearchTrigger] = useState(false); //gatilho para iniciar a busca

    //busca a lsita de contatos na api, ordena, e armazena no estado da agenda
    useEffect(() => {
        axios.get("http://localhost:3001/agendas").then(response => {
            setAgenda(response.data.sort((a, b) => a.nome.localeCompare(b.nome)));
            console.log("Agenda acessada com sucesso");
        })
        .catch(error => {
            console.error("Erro ao buscar agenda", error);
        });
    }, []);

    //armazena os dados do contato nos estados de edição
    const handleEditClick = (contato) => {
        setEditandoContato(contato.id);
        setContatoEditado(contato);
        console.log("Editando contato");
    };

    //atualiza o estado de edição conforme o input muda
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setContatoEditado(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    //envia os dados atualizados do contato para a api
    const handleSaveClick = () => {
        axios.put(`http://localhost:3001/agendas/${editandoContato}`, contatoEditado)
            .then(response => {
                setAgenda(agenda.map(contato => contato.id === editandoContato ? response.data : contato));
                setEditandoContato(null);
                setContatoEditado({ nome: '', telefone: '', endereco: '', email: '' });
                console.log("Contato atualizado");
            })
            .catch(error => {
                console.error("Erro ao atualizar contato", error);
            });
    };

    //cancela a edição e retorna os estados de edição para o valor original
    const handleCancelClick = () => {
        setEditandoContato(null);
        setContatoEditado({ nome: '', telefone: '', endereco: '', email: '' });
        console.log("Atualização de contato cancelada");
    }

    //pede confirmação para deletar o contato selecionado, e, caso confirmado, envia o contato para a api com o comando de DELETE
    const handleDeleteClick = (contato) => {
        Swal.fire({
            title: "Você tem certeza?",
            text: "O contato será deletado, isso não pode ser desfeito.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Deletar",
            cancelButtonText: "Cancelar"
          }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:3001/agendas/${contato.id}`)
                .then(response => {
                    console.log("Contato deletado");
                    setAgenda(prevAgenda => prevAgenda.filter(a => a.id !== contato.id));
                    Swal.fire({
                        title: "Deletado!",
                        text: "O contato foi deletado",
                        icon: "success"
                    });
                }).catch (error => {
                    console.error("Erro ao deletar contato", error);
                    Swal.fire({
                        title: "Erro!",
                        text: "Ocorreu um erro ao deletar o contato.",
                        icon: "error"
                    });
                })
            }
          });
    }

    //salva o termo de busca no estado
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    }

    //dispara o mecanismo de busca
    const handleSearchClick = () => {
        setSearchTrigger(true);
    }

    //procura o termo de pesquisa em todos os valores do estado da agenda
    useEffect(() => {
        if (searchTrigger) {
            const contatoEncontrado = agenda.find(contato =>
                contato.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contato.telefone.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contato.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contato.email.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (contatoEncontrado) {
                const contatoId = contatoEncontrado.id;
                if (contactRefs.current[contatoId]) {
                    contactRefs.current[contatoId].scrollIntoView({ behavior: 'smooth', block: 'center' });
                    contactRefs.current[contatoId].style.transition = 'transform 0.3s';
                    contactRefs.current[contatoId].style.transform = 'scale(1.05)';
                    contactRefs.current[contatoId].classList.add('highlighted');

                    setTimeout(() => {
                        contactRefs.current[contatoId].style.transform = '';
                        contactRefs.current[contatoId].classList.remove('highlighted');
                    }, 1500);
                }
            } else {
                Swal.fire({
                    title: "Contato não encontrado",
                    text: "O contato digitado não pode ser encontrado",
                    icon: "error"
                });
            }
            setSearchTrigger(false);
        }
    }, [searchTrigger, agenda, searchTerm]);


    return (
        <div className="container">
            <div className="contatos">
                <header id="header">
                    <h1 id="titulo">Lista de contatos</h1>
                    <div className="interacoes">
                        <div id="searchForm">
                            <input type="text" name="pesquisar" id="pesquisar" placeholder="Pesquisar" value={searchTerm} onChange={handleSearchChange}/>
                            <button id="btn-pesquisar" onClick={handleSearchClick}><img src={searchIcon} alt="icone de pesquisar" className="search-icon"/></button>
                        </div>
                        <Link id="novo_contato" to="/addcontato">Novo contato</Link>
                    </div>
                </header>
                <ul id="lista_de_contatos">
                    {agenda.map(a => (
                        <div id="contato" key={a.id} ref={el => contactRefs.current[a.id] = el}>
                            {editandoContato === a.id ? (
                                <div id="edit_contato">
                                    <span className="descricao">Nome:</span>
                                    <input type="text" name="nome" value={contatoEditado.nome} onChange={handleInputChange}/>
                                    <span className="descricao">Telefone:</span>
                                    <input type="text" name="telefone" value={contatoEditado.telefone} onChange={handleInputChange}/>
                                    <span className="descricao">Endereço:</span>
                                    <input type="text" name="endereco" value={contatoEditado.endereco} onChange={handleInputChange}/>
                                    <span className="descricao">Email:</span>
                                    <input type="text" name="email" value={contatoEditado.email} onChange={handleInputChange}/>
                                    <div id="botoes">
                                        <button onClick={handleSaveClick} className="btn"><img src={saveIcon} alt="ícone de salvar" className="icon"/></button>
                                        <button onClick={handleCancelClick} className="btn"><img src={cancelIcon} alt="ícone de cancelar" className="icon"/></button>
                                    </div>
                                </div>
                            ) : (
                                <div id="vis_contato">
                                    <div id="info_contato">
                                        <li id="nome_contato">{a.nome}</li>
                                        <span className="divisor">|</span>
                                        <li id="telefone_contato">{a.telefone}</li>
                                        <span className="divisor">|</span>
                                        <li id="endereco_contato">{a.endereco}</li>
                                        <span className="divisor">|</span>
                                        <li id="email_contato">{a.email}</li>
                                    </div>
                                    <div id="botoes">
                                        <button onClick={() => handleEditClick(a)} className="btn"><img src={editIcon} alt="icone de editar" className="icon"/></button>
                                        <button onClick={() => handleDeleteClick(a)} className="btn"><img src={deleteIcon} alt="icone de deletar" className="icon"/></button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </ul>
            </div>
        </div>
    );
}
