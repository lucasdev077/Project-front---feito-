const modal = document.querySelector(".modal-container");
const tbody = document.querySelector("tbody");
const sModelo = document.querySelector("#m-modelo");
const sAno = document.querySelector("#m-ano");
const sPreco = document.querySelector("#m-preco");
const sCor = document.querySelector("#m-cor");
const sPlaca = document.querySelector("#m-placa");
const btnSalvar = document.querySelector("#btnSalvar");

let itens;
let modelo;

// Função para abrir o modal
function openModal(edit = false, index = 0) {
  modal.classList.add("active");

  modal.onclick = (e) => {
    if (e.target.className.indexOf("modal-container") !== -1) {
      modal.classList.remove("active");
    }
  };

  if (edit) {
    sModelo.value = itens[index].modelo;
    sAno.value = itens[index].ano;
    sPreco.value = itens[index].preco;
    sCor.value = itens[index].cor;
    sPlaca.value = itens[index].placa;
    modelo = index; // Atualizar o índice do item em edição
  } else {
    sModelo.value = "";
    sAno.value = "";
    sPreco.value = "";
    sCor.value = "";
    sPlaca.value = "";
    modelo = undefined;
  }
}

// Função para editar um item
function editItem(index) {
  openModal(true, index);
}

// Função para confirmação de exclusão
function confirmarExclusao(index) {
  var resposta = confirm("Você tem certeza que deseja excluir este item?");
  if (resposta == true) {
      deleteItem(index);
  } else {
      console.log("Exclusão cancelada.");
  }
}

// Função para excluir um item
function deleteItem(index) {
  itens.splice(index, 1);
  setItensBD();
  loadItens();
  console.log("Item excluído com sucesso!");
}

// Função para inserir um item na tabela
function insertItem(item, index) {
  let tr = document.createElement("tr");

  tr.innerHTML = `
    <td><img src="${item.imagem}" alt="Imagem do Carro" style="max-width: 100px; max-height: 100px;" /></td>
    <td>${item.modelo}</td>
    <td>${item.ano}</td>
    <td>${item.preco}</td>
    <td>${item.cor}</td>
    <td>${item.placa}</td>
    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit'></i></button>
    </td>
    <td class="acao">
      <button onclick="confirmarExclusao(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `;
  tbody.appendChild(tr);
}

// Função para salvar um item
btnSalvar.onclick = (e) => {
  if (sModelo.value == "" || sAno.value == "" || sPreco.value == "" || sCor.value == "" || sPlaca.value == "") {
    return;
  }

  e.preventDefault();

  const carImage = document.getElementById('m-img').files[0]; 

  if (!carImage) {
    alert("Por favor, carregue uma imagem.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const carImageData = e.target.result;
    
    if (modelo !== undefined) {
      // Editando um item existente
      itens[modelo].modelo = sModelo.value;
      itens[modelo].ano = sAno.value;
      itens[modelo].preco = sPreco.value;
      itens[modelo].cor = sCor.value;
      itens[modelo].placa = sPlaca.value;
      itens[modelo].imagem = carImageData;
    } else {
      // Adicionando um novo item
      itens.push({
        modelo: sModelo.value,
        ano: sAno.value,
        preco: sPreco.value,
        cor: sCor.value,
        placa: sPlaca.value,
        imagem: carImageData
      });
    }

    setItensBD();
    modal.classList.remove("active");
    loadItens();
  };

  reader.readAsDataURL(carImage);
};

// Carregar os itens armazenados no LocalStorage
function loadItens() {
  itens = getItensBD();
  tbody.innerHTML = ""; // Limpar a tabela
  itens.forEach((item, index) => {
    insertItem(item, index);
  });
}

const getItensBD = () => JSON.parse(localStorage.getItem("dbfunc")) ?? [];
const setItensBD = () => localStorage.setItem("dbfunc", JSON.stringify(itens));

loadItens();

// Função para formatar a placa (semelhante à da vida real)
function formatarPlaca(event) {
  const campo = event.target;
  let valor = campo.value.toUpperCase();

  valor = valor.replace(/[^A-Za-z0-9]/g, '');

  let parte1 = valor.slice(0, 3);
  let parte2 = valor.slice(3, 7);

  parte1 = parte1.replace(/[^A-Za-z]/g, '');
  parte2 = parte2.replace(/[^0-9]/g, '');

  if (parte2.length > 4) {
    parte2 = parte2.slice(0, 4);
  }

  valor = parte1 + (parte2 ? '-' + parte2 : '');

  campo.value = valor;
}

// Função para colocar a vírgula no preço
function virgula(event) {
  const campo = event.target;
  let valor = campo.value.replace(/\D/g, '');  

  if (valor.length > 9) {
    valor = valor.slice(0, 9);
  }

  if (valor.length > 7) {
    valor = valor.slice(0, 7) + ',' + valor.slice(7);
  }

  campo.value = valor;
}

// Função para visualizar a imagem antes de salvar
document.getElementById('m-img').addEventListener('change', function (event) {
  const file = event.target.files[0];
  const preview = document.querySelector('#carImagePreview');
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});
