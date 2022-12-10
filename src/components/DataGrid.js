import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import APIService from '../services/service';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';

export const DataGrid = () => {
    const tropaModel = {
        tipo: '',
        quantidade: null,
        nome: ''
    }
    const toast = useRef(null);

    const showToast = (severityValue, summaryValue, detailValue) => {
        toast.current.show({ severity: severityValue, summary: summaryValue, detail: detailValue, life: 3000 });
    }

    const service = new APIService()
    const [linhas, setLinhas] = useState([])
    const [tropa, setTropa] = useState(tropaModel)
    const [editDialog, setEditDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false)
    const [addDialog, setAddDialog] = useState(false);
    const filters = {
        'tipo': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'nome': { value: null, matchMode: FilterMatchMode.CONTAINS }
    }
    const openEditDialog = (e, rowData) => {
        setTropa(rowData)
        setEditDialog(true)
    }
    const hideEditDialog = () => {
        setEditDialog(false)
    }
    const openAddDialog = (e) => {
        setTropa(tropaModel)
        setAddDialog(true)
    }
    const hideAddDialog = () => {
        setAddDialog(false)
    }
    const header = (
        <div style={{
            'display': 'flex',
            'alignItems': 'center',
            'justifyContent': 'space-between'
        }}>
            Manejo do Arsenal
            <Button label="Adicionar" icon="pi pi-plus" className="p-button-success mr-2" onClick={(e) => openAddDialog(e)} />
        </div>
    );

    const acoesTemplate = (rowData) => {
        return <div>
            <Button label="Editar" style={{ 'backgroundColor': 'white', 'color': 'blue', 'marginRight': 5 }} onClick={(e) => openEditDialog(e, rowData)} />
            <Button label="Excluir" style={{ 'backgroundColor': 'white', 'color': 'red', 'marginLeft': 5 }} onClick={(e) => onDelete(e, rowData)} />
        </div>
    }

    useEffect(() => {
        service.obterLista(
            (success) => {
                setLinhas(success.arsenal)
            },
            (error) => {
                console.log(error)
            }
        )
    });

    const onDelete = (e, rowData) => {
        e.stopPropagation()
        service.removerLista(rowData.nome,
            (success) => {
                debugger
                showToast('success', 'Successo', success.mensagem)
            },
            (error) => {
                showToast('error', 'Erro', error.mensagem)
            }
        )
    }

    const editTropa = () => {
        service.atualizarTropa(tropa.nome, tropa.quantidade,
            (success) => {
                setTropa(tropaModel)
                hideEditDialog()
                showToast('success', 'Successo', success.mensagem)
            },
            (error) => {
                showToast('error', 'Erro', error.mensagem)
            }
        )
    }
    
    const addTropa = () => {
        setSubmitted(true)
        service.adicionarTropa(tropa,
            (success) => {
                setTropa(tropaModel)
                hideAddDialog()
                showToast('success', 'Successo', success.mensagem)
            },
            (error) => {
                showToast('error', 'Erro', error.mensagem)
            }
        )
    }

    const footerEdit = (
        <div>
            <Button label="Editar" onClick={editTropa} />
            <Button label="Cancelar" onClick={hideEditDialog} />
        </div>
    );

    const footerAdd = (
        <div>
            <Button label="Adicionar" onClick={addTropa} />
            <Button label="Cancelar" onClick={hideAddDialog} />
        </div>
    );

    return (
        <div>
            <div className="card">
                <Toast ref={toast} />
                <DataTable header={header} showGridlines value={linhas} resizableColumns columnResizeMode="expand" responsiveLayout="scroll" paginator rows={10} filters={filters} filterDisplay="row">
                    <Column field="tipo" header="Tipo" sortable filter></Column>
                    <Column field="nome" header="Nome" sortable filter></Column>
                    <Column field="quantidade" header="Quantidade" sortable></Column>
                    <Column header="Ações" body={acoesTemplate}></Column>
                </DataTable>
                <Dialog visible={editDialog} style={{ width: '450px' }} header="Editar Item" modal className="p-fluid" onHide={hideEditDialog} footer={footerEdit}>
                    <h3>Tipo:</h3>
                    <InputText value={tropa.tipo} disabled={true} />
                    <h3>Nome:</h3>
                    <InputText value={tropa.nome} disabled={true} />
                    <h3>Quantidade:</h3>
                    <InputNumber integer={true} value={tropa.quantidade} onValueChange={(e) => setTropa({
                        tipo: tropa.tipo,
                        quantidade: e.value,
                        nome: tropa.nome
                    })} />
                </Dialog>
                <Dialog visible={addDialog} style={{ width: '450px' }} header="Adicionar Item" modal className="p-fluid" onHide={hideAddDialog} footer={footerAdd}>
                    <h3>Tipo:</h3>
                    <InputText value={tropa.tipo} required onChange={(e) => setTropa({
                        tipo: e.target.value,
                        quantidade: tropa.quantidade,
                        nome: tropa.nome
                    })} />
                    {submitted && !tropa.tipo && <small className="p-error">Tipo é obrigatório.</small>}
                    <h3>Nome:</h3>
                    <InputText value={tropa.nome} required onChange={(e) => setTropa({
                        tipo: tropa.tipo,
                        quantidade: tropa.quantidade,
                        nome: e.target.value
                    })} />
                    <h3>Quantidade:</h3>
                    <InputNumber integer={true} required onValueChange={(e) => setTropa({
                        tipo: tropa.tipo,
                        quantidade: e.value,
                        nome: tropa.nome
                    })} />
                </Dialog>
            </div>
        </div>
    );

}