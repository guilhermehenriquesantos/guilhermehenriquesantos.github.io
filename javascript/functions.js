function typeWriter(elemento) {
    // O split faz com que eu separe uma string em substrings, de acordo com o caractere ou a string que eu especificar para ele, como eu não especifiquei nada, ele pega cada letra e coloca em uma "substring"
    const textoArray = elemento.innerHTML.split('');

    // Aqui, ele pega o meu elemento HTML que já estava preenchido e coloca ele como vazio, para que cada letra separada no meu "textoArray" possa ser colocada uma de cada vez
    elemento.innerHTML = '';

    // Irá percorrer o meu array textoArray, o primeiro valor que eu passo no foreach é o que representará cada elemento do meu array, é nele que estarão meus splits (cada uma das letras) e também passo um index, que é a posição que o foreach estará no meu array.
    textoArray.forEach((letra, i) => {
        // Adicione cada letra em um intervalor de 100ms * o seu index, por exemplo, adicione a primeira letra com 0ms, a segunda com 100 ms, a terceira com 200ms. Então ele vai adicionando cada letra que eu quero com um intervalo de 100ms
        setTimeout(() => {
            elemento.innerHTML += letra;
         }, 100 * i);
    });
}

const specialty = document.querySelector('#specialty');
typeWriter(specialty);