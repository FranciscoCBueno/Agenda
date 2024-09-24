import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import axios from "axios";
import Swal from "sweetalert2";

import "./AddContato.css"

export function AddContato () {
    const [novoContato, setNovoContato] = useState({ nome: '', telefone: '', endereco: '', email: '' }); //dados do novo contato
    const [emailInvalido, setEmailInvalido] = useState(false); //email é válido

    const navigate = useNavigate();

    //atualiza o estado do novo contato conforme o input muda
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNovoContato(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    //checa se o email é válido e envia as alterações para a api registrar o novo contato no banco de dados
    const handleSaveClick = (e) => {
        e.preventDefault();
        if (novoContato.email.includes("@")) {
            setEmailInvalido(false);
            axios.post("http://localhost:3001/agendas", novoContato)
            .then(response => {
                console.log("Contato criado")
                Swal.fire({
                    title: "Sucesso!",
                    text: "Contato criado com sucesso",
                    icon: "success",
                    didClose: navigate("/contatos")
                });
            }).catch(error => {
                console.error("Erro ao criar contato", error);
                Swal.fire({
                    title: "Erro!",
                    text: "Ocorreu um erro ao criar o contato.",
                    icon: "error"
                });
            });
        } else {
            console.error("Email inválido");
            setEmailInvalido(true);
        }
    };

    //botão de cancelar retorna para a página incial
    const handleCancelClick = () => {
        navigate("/contatos");
    }

    return (
        <div className="add_contato">
            <form action="submit" className="novo_contato">
                <h1>Registrar novo contato</h1>
                <input type="text" name="nome" id="Nome" placeholder="Nome" value={novoContato.nome} onChange={handleInputChange}/>
                <input type="text" name="telefone" id="telefone" placeholder="Telefone" value={novoContato.telefone} onChange={handleInputChange}/>
                <input type="text" name="endereco" id="Endereco" placeholder="Endereço" value={novoContato.endereco} onChange={handleInputChange}/>
                <input type="text" name="email" id="E-mail" 
                    placeholder={emailInvalido ? "E-mail inválido" : "E-Mail"} className={emailInvalido ? "email_invalido" : ""}
                    value={novoContato.email} onChange={handleInputChange} />
                <div className="botoes">
                    <button id="botao_salvar" onClick={handleSaveClick}>Salvar</button>
                    <button onClick={handleCancelClick}>Cancelar</button>
                </div>
            </form>
        </div>
    );
}
