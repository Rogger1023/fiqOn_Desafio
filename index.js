 //Desafio fiqOn de Consumo de API feito em Javascript 
// Arquivo foi verificado e testado usando Node.js


 //Primeira etapa - Requisição de token da API
 // -----------------------------------------------------------------
 async function etapaUm(){
    const urlStepOne = "https://instance.fique.online/webhook/merge/88d8701e-a1d6-4fee-b15b-53e90dc1d126/autenticacao/57441afd5a59ccd4c62816683fcc8d665c42bb7b12857fc64a6cace4ababdc67f78c70b044";

    const credentials = btoa("teste_fiqon" + ":" + "senha@115#"); 

    await fetch(urlStepOne,{
        method: 'POST',
        headers: {
             'Authorization': `Basic ${credentials}`
        },
        credentials: 'include'
    }).then((response )=>{
        if(!response.ok){
            throw new Error(`Erro na respose:${response}`)
        }
        return response.json();
    })
    .then((token)=>{
        console.log('========api_token========')
        console.log(token['api_token']);
        etapaDois(token['api_token']); //chamada da etapa 2 que esta logo abaixo
    })
    .catch((error)=>{
        console.error('Erro na requisição',error.mensage)
    })
    
}
 
//Segunda etapa - Utilizando o token, fazer a requisição dos 5 pilares da fiqOn
// -----------------------------------------------------------------

async function etapaDois(token){
    let pilares = []
   for (let i = 0; i< 5; i++){
    const urlStepTwo = `https://instance.fique.online/webhook/merge/88d8701e-a1d6-4fee-b15b-53e90dc1d126/listar_pilares/76b07f1dbf18eabde7b8e3611ab078daa0f34b094cc9856d20d6d0b15fb3b7a99f697e451d?page=${i}&api_token=${token}`

       await fetch(urlStepTwo,{
                method:'GET'
            })
            .then((response)=>{
                if (!response.ok){
                    throw new Error(`Erro na requisição: ${response.status}`)
                }
                return response.json();
            })
            .then((fiqonPilar)=>pilares.push(fiqonPilar['data']) )
            .catch((error)=>{
                console.error('Erro na requisição:', error.mensage)
            })
    };

    console.log('=========JSON DOS PILARES DA FIQON=======')
    console.log(pilares)

    //Verificação para ver se as promises foram resolvidas antes de prosseguir para a etapa tres
    if (pilares.length == 5){
        etapaTres(token,pilares)
    }return;
    
    
}

//Terceira etapa - decodificação dos 5 pilares da fiqOn e envio para API e obtendo a resposta de callback
// -----------------------------------------------------------------
async function etapaTres(token,pilares){
    const urlStepThree = `https://instance.fique.online/webhook/merge/88d8701e-a1d6-4fee-b15b-53e90dc1d126/envia_resposta/7b56940678e89802e02e1981a8657206d639f657d4c58efb8d8fb74814799d1c001ec121c6?api_token=${token}`
    stringPilares = pilares.join('');
    const pilarBase = btoa(encodeURIComponent(stringPilares).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1)));
    console.log('=======Conversão Para Base64 dos pilares======')
    console.log(pilarBase)
    const answer = {
        'answer': pilarBase
    }
    await fetch(urlStepThree,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(answer),

    }).then((response)=>{
        if(!response.ok){
            throw new Error(`Error: ${response.status}`)
        }
        return response.json();
    }).then((response)=>{
        console.log('=======Resposta da requisição de Etapa 03=======')
        console.log(response['message'])
    })
}
    etapaUm();