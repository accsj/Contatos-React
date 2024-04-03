import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/styles/home.css';

export default function HomePage() {
    const [contato, setContato] = useState({ nome: '', telefone: '', email: '' });
    const [contatosList, setContatosList] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editedName, setEditedName] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setContato({ ...contato, [name]: value });
    };
    const handleChangeEditedName = (e) => {
        setEditedName(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const csrfToken = getCookie('csrftoken');
            const config = {
                headers: {
                    'X-CSRFToken': csrfToken
                }
            };
            await axios.post('http://localhost:8000/cadastrar/', contato, config);
            alert('Contato cadastrado com sucesso!')
            setContato({ nome: '', telefone: '', email: '' });
            fetchContatos();
        } catch (error) {
            console.error('Erro ao cadastrar contato:', error);
        }
    };

    const fetchContatos = async () => {
        try {
            const response = await axios.get('http://localhost:8000/listar/');
            setContatosList(response.data);
        } catch (error) {
            console.error('Erro ao obter a lista de contatos:', error);
        }
    };
    useEffect(() => {
        fetchContatos();
    }, []);


    const handleDelete = async (id) => {
        try {
            const csrfToken = getCookie('csrftoken');
            const config = {
                headers: {
                    'X-CSRFToken': csrfToken
                }
            };
            await axios.delete(`http://localhost:8000/deletar/${id}`, config);
            alert('Contato excluído com sucesso!');
            fetchContatos();
        } catch (error) {
            console.error('Erro ao excluir contato:', error);
        }
    };

    const handleEditClick = (id) => {
        setEditingId(id === editingId ? null : id);
    };

    const handleSaveNameChange = async (id) => {
        try {
            const csrfToken = getCookie('csrftoken');
            const config = {
                headers: {
                    'X-CSRFToken': csrfToken
                }
            };
            await axios.put(`http://localhost:8000/alterar/${id}`, { nome: editedName }, config);
            alert('Nome do contato alterado com sucesso!');
            setEditingId(null);
            fetchContatos();
        } catch (error) {
            console.error('Erro ao alterar nome do contato:', error);
        }
    };


    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    return (
        <div>
            <header className="header">
                <h1>Contatos</h1>
            </header>

            <main className="content_container">
                <section className="contact_form">
                    <div className="title_form">
                        <h2>Cadastre seu contato</h2>
                    </div>
                    <form className='form' onSubmit={handleSubmit} method='post'>
                        <div className="input_box">
                            <label>Nome: <input type="text" name='nome' placeholder='Nome' required value={contato.nome} onChange={handleChange} /></label>
                        </div>
                        <div className="input_box">
                            <label>Telefone: <input type="text" name='telefone' placeholder='Telefone' required value={contato.telefone} onChange={handleChange} /></label>
                        </div>
                        <div className="input_box">
                            <label>E-mail: <input type="text" name='email' placeholder='E-mail' required value={contato.email} onChange={handleChange} /></label>
                        </div>
                        <button className="btn_submit" type='submit'>
                            <p>Cadastrar contato</p>
                        </button>
                    </form>
                </section>

                <aside className="contact_list">
                    <h2>Lista de Contatos</h2>
                    <div className='contact_container'>
                        {contatosList.map((contato, index) => (
                            <div className='contact' key={index}>
                                {editingId === contato.id ? (
                                    <div className='input_contact'>
                                        <input
                                            type='text'
                                            value={editedName}
                                            onChange={handleChangeEditedName}
                                            placeholder='Novo nome'
                                        />
                                        <button className='btn_change' onClick={() => handleSaveNameChange(contato.id)}>Salvar</button>
                                    </div>
                                ) : (
                                    <div>
                                        <p>{contato.nome}</p>
                                    </div>
                                )}
                                <div className="icon_container">
                                    <i id='alter' className='bx bx-edit-alt' onClick={() => handleEditClick(contato.id)}></i>
                                </div>
                                <div className='icon_container'>
                                    <i id='delete' className='bx bx-x' onClick={() => handleDelete(contato.id)}></i>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
            </main>

            <footer className="footer">
                <div className="disclaimer">
                    <p>Copyright © 2024 Antonio Carlos | Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    )
}
