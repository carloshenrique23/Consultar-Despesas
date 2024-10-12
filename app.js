class Despesa {
	constructor(ano, mes, dia, tipo, descricao, valor) {
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}

	validarDados() {
		for(let i in this) {
			if(this[i] == undefined || this[i] == '' || this[i] == null) {
				return false
			}
		}
		return true
	}
}

class Bd {

	constructor() {
		let id = localStorage.getItem('id')

		if(id === null) {
			localStorage.setItem('id', 0)
		}
	}

	getProximoId() {
		let proximoId = localStorage.getItem('id')
		return parseInt(proximoId) + 1
	}

	gravar(d) {
		let id = this.getProximoId()

		localStorage.setItem(id, JSON.stringify(d))

		localStorage.setItem('id', id)
	}

	recuperarTodosRegistros() {

		//array de despesas
		let despesas = Array()

		let id = localStorage.getItem('id')

		//recuperar todas as despesas cadastradas em localStorage
		for(let i = 1; i <= id; i++) {

			//recuperar a despesa
			let despesa = JSON.parse(localStorage.getItem(i))

			//existe a possibilidade de haver índices que foram pulados/removidos
			//nestes casos nós vamos pular esses índices
			if(despesa === null) {
				continue
			}
			despesa.id = i
			despesas.push(despesa)
		}

		return despesas
	}

	pesquisar(despesa){

		let despesasFiltradas = Array()
		despesasFiltradas = this.recuperarTodosRegistros()
		console.log(despesasFiltradas);
		console.log(despesa)

		//ano
		if(despesa.ano != ''){
			console.log("filtro de ano");
			despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
		}
			
		//mes
		if(despesa.mes != ''){
			console.log("filtro de mes");
			despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
		}

		//dia
		if(despesa.dia != ''){
			console.log("filtro de dia");
			despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
		}

		//tipo
		if(despesa.tipo != ''){
			console.log("filtro de tipo");
			despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
		}

		//descricao
		if(despesa.descricao != ''){
			console.log("filtro de descricao");
			despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
		}

		//valor
		if(despesa.valor != ''){
			console.log("filtro de valor");
			despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
		}

		
		return despesasFiltradas

	}

	remover(id){
		localStorage.removeItem(id)
	}
}

let bd = new Bd()


function cadastrarDespesa() {

	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	let despesa = new Despesa(
		ano.value, 
		mes.value, 
		dia.value, 
		tipo.value, 
		descricao.value,
		valor.value
	)


	if(despesa.validarDados()) {
		bd.gravar(despesa)

		document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
		document.getElementById('modal_titulo_div').className = 'modal-header text-success'
		document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!'
		document.getElementById('modal_btn').innerHTML = 'Voltar'
		document.getElementById('modal_btn').className = 'btn btn-success'

		//dialog de sucesso
		$('#modalRegistraDespesa').modal('show') 

		ano.value = '' 
		mes.value = ''
		dia.value = ''
		tipo.value = ''
		descricao.value = ''
		valor.value = ''
		
	} else {
		
		document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro'
		document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
		document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente!'
		document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
		document.getElementById('modal_btn').className = 'btn btn-danger'

		//dialog de erro
		$('#modalRegistraDespesa').modal('show') 
	}
}

function carregaListaDespesas(despesas = Array(), filtro = false) {
    if (despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarTodosRegistros();
    }

    // Ordenar despesas em ordem crescente
	despesas.sort((a, b) => {
		let dataA = new Date(a.ano, a.mes - 1, a.dia);
		let dataB = new Date(b.ano, b.mes - 1, b.dia);
		return dataA - dataB; // Para ordem crescente
	}); // Altere para b.id - a.id para ordem decrescente

    let listaDespesas = document.getElementById("listaDespesas");
    listaDespesas.innerHTML = '';

    despesas.forEach(function(d) {
        // Criando a linha (tr)
        var linha = listaDespesas.insertRow();

        // Criando as colunas (td)
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`; 

        // Ajustar o tipo
        switch (d.tipo) {
            case '1': d.tipo = 'Alimentação'; break;
            case '2': d.tipo = 'Educação'; break;
            case '3': d.tipo = 'Lazer'; break;
            case '4': d.tipo = 'Saúde'; break;
            case '5': d.tipo = 'Transporte'; break;
            case '6': d.tipo = ''; break;	
        }
        linha.insertCell(1).innerHTML = d.tipo;
        linha.insertCell(2).innerHTML = d.descricao;
        linha.insertCell(3).innerHTML = d.valor;

        // Criar o botão de exclusão
        let btn = document.createElement('button');
        btn.className = 'btn btn-danger';
        btn.innerHTML = '<i class="fa fa-times"></i>';
        btn.id = `id_despesa_${d.id}`;
        btn.onclick = function() {
            let id = this.id.replace('id_despesa_', '');
            bd.remover(id);
            window.location.reload();
        };
        linha.insertCell(4).append(btn);
    });
}
 function pesquisarDespesa(){
	 
	let ano  = document.getElementById("ano").value
	let mes = document.getElementById("mes").value
	let dia = document.getElementById("dia").value
	let tipo = document.getElementById("tipo").value
	let descricao = document.getElementById("descricao").value
	let valor = document.getElementById("valor").value

	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

	let despesas = bd.pesquisar(despesa)
	 
	this.carregaListaDespesas(despesas, true)

 }

// Função para adicionar novo tipo de despesa
function adicionarTipo() {
   const novoTipo = document.getElementById('novo_tipo').value;
   if (novoTipo.trim() !== "") {
	 const selectTipo = document.getElementById('tipo');
	 const option = document.createElement('option');
	 option.value = novoTipo;
	 option.text = novoTipo;
	 selectTipo.add(option);
	 document.getElementById('novo_tipo').value = ''; // Limpa o campo após adicionar
   }
 }
  // Ajusta os dias de acordo com o mês selecionado
  function ajustarDias() {
	const mes = document.getElementById('mes').value;
	const diaSelect = document.getElementById('dia');
	diaSelect.innerHTML = '';

	if (mes) {
		const diasNoMes = new Date(2024, mes, 0).getDate();
		for (let i = 1; i <= diasNoMes; i++) {
			const option = document.createElement('option');
			option.value = i;
			option.text = i;
			diaSelect.appendChild(option);
		}

		// Adiciona a opção para o dia atual
		const optionAtual = document.createElement('option');
		optionAtual.value = 'atual';
		optionAtual.text = 'Dia atual';
		diaSelect.appendChild(optionAtual);
	}
}

// Adiciona novo tipo de despesa
function adicionarTipo() {
	const novoTipo = document.getElementById('novo_tipo').value;
	const tipoSelect = document.getElementById('tipo');

	if (novoTipo) {
		const option = document.createElement('option');
		option.value = novoTipo.toLowerCase();
		option.text = novoTipo;
		tipoSelect.appendChild(option);

		document.getElementById('novo_tipo').value = ''; // Limpa o campo
	}
}

// Define o dia para o dia atual, se a opção 'Dia atual' for selecionada
function verificarDiaAtual() {
	const diaSelect = document.getElementById('dia').value;
	if (diaSelect === 'atual') {
		const hoje = new Date();
		document.getElementById('dia').value = hoje.getDate();
	}
}

function gerarRelatorio() {
    const tipoFiltro = document.getElementById('filtroTipo').value;
    const mes = document.getElementById('mes').value;
    const ano = document.getElementById('ano').value;
    
    let despesasFiltradas;

    if (tipoFiltro === 'mes' && mes) {
        despesasFiltradas = bd.recuperarTodosRegistros().filter(d => d.mes == mes);
    } else if (tipoFiltro === 'ano' && ano) {
        despesasFiltradas = bd.recuperarTodosRegistros().filter(d => d.ano == ano);
    } else {
        alert('Por favor, selecione um filtro válido.');
        return;
    }

    exibirRelatorio(despesasFiltradas);
}

function exibirRelatorio(despesas) {
    const listaDespesasRelatorio = document.getElementById('listaDespesasRelatorio');
    listaDespesasRelatorio.innerHTML = '';

    if (despesas.length === 0) {
        const linha = listaDespesasRelatorio.insertRow();
        linha.insertCell(0).innerHTML = 'Nenhuma despesa encontrada.';
        return;
    }

    despesas.forEach(d => {
        const linha = listaDespesasRelatorio.insertRow();
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;
        
        switch(d.tipo) {
            case '1': d.tipo = 'Alimentação'; break;
            case '2': d.tipo = 'Educação'; break;
            case '3': d.tipo = 'Lazer'; break;
            case '4': d.tipo = 'Saúde'; break;
            case '5': d.tipo = 'Transporte'; break;
            case '6': d.tipo = ''; break;
        }
        linha.insertCell(1).innerHTML = d.tipo;
        linha.insertCell(2).innerHTML = d.descricao;
        linha.insertCell(3).innerHTML = d.valor;
    });
}

document.getElementById('filtroTipo').addEventListener('change', function() {
	const filtroMesContainer = document.getElementById('filtroMesContainer');
	const filtroAnoContainer = document.getElementById('filtroAnoContainer');
	if (this.value === 'mes') {
		filtroMesContainer.style.display = 'block';
		filtroAnoContainer.style.display = 'none';
	} else {
		filtroMesContainer.style.display = 'none';
		filtroAnoContainer.style.display = 'block';
	}
});
