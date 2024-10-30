export class DashboardModel {
    qtdPedidos?: number;
    qtdProdutos?: number;
    qtdClientes?: number;

    constructor(qtdPedidos: number, qtdProdutos: number, qtdClientes: number) {
        this.qtdPedidos = qtdPedidos;
        this.qtdProdutos = qtdProdutos;
        this.qtdClientes = qtdClientes;
    }
}