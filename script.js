let registros = JSON.parse(localStorage.getItem('registros')) || [];

function registrarAgendamento() {
    const dataAgendada = document.getElementById('dateInput').value;
    const valorVenda = parseFloat(document.getElementById('vendaInput').value) || 0.00;

    if (!dataAgendada) {
        showErrorCard("Insira uma data");
        return;
    }
    if (valorVenda === 0) {
        showErrorCard("Insira o valor da venda");
        return;
    }
    saveAndShowFloatingCard(dataAgendada, valorVenda);
}

function showErrorCard(message) {
    document.getElementById('errorCard').innerText = message;
    document.getElementById('errorCard').style.display = 'block';
    setTimeout(() => {
        document.getElementById('errorCard').style.display = 'none';
    }, 3000);
}

function saveAndShowFloatingCard(dataAgendada, valorVenda) {
    document.getElementById('errorCard').style.display = 'none';
    document.getElementById('floatingCardSuccess').style.display = 'block';
    setTimeout(() => {
        document.getElementById('floatingCardSuccess').style.display = 'none';
    }, 3000);

    const dataRegistro = new Date().toLocaleDateString();
    registros.push({ dataAgendada, valorVenda, dataRegistro });
    localStorage.setItem('registros', JSON.stringify(registros));
    atualizarSaldoDiario();
    atualizarContador();
}

function atualizarSaldoDiario() {
    const hoje = new Date().toLocaleDateString();
    const saldoDia = registros
        .filter(registro => registro.dataRegistro === hoje)
        .reduce((total, registro) => total + registro.valorVenda, 0);

    document.getElementById('totalAgendamentos').innerText = formatarReal(saldoDia);
    document.getElementById('totalContagem').innerText = 'Vendas do Dia:';
}

function filtrarRegistros() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const saldoPeriodo = registros
            .filter(registro => {
                const dataRegistro = new Date(registro.dataAgendada);
                return dataRegistro >= start && dataRegistro <= end;
            })
            .reduce((total, registro) => total + registro.valorVenda, 0);

        document.getElementById('totalAgendamentos').innerText = formatarReal(saldoPeriodo);
        document.getElementById('totalContagem').innerText = 'Total de Vendas no Período:';
    } else {
        atualizarSaldoDiario();
    }
}

function formatarReal(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function limparFiltro() {
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    filtrarRegistros();
}

document.getElementById('limparFiltro').addEventListener('click', limparFiltro);

window.onload = function() {
    atualizarSaldoDiario();
    atualizarContador();
};

localStorage.setItem('dataAtual', new Date().getTime());

function atualizarContador() {
    const totalVendas = registros.reduce((total, registro) => total + registro.valorVenda, 0);
    document.getElementById('totalContagem').innerText = `Total de Vendas: ${formatarReal(totalVendas)}`;
}
