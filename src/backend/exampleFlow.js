const axios = require('axios');
// URL base da API
const API_URL = 'http://localhost:3000/api';

// Exemplo de como seria o fluxo completo
async function demonstrateFullFlow() {
  try {
    console.log('1. Gerando contrato Lightning Network...');
    const contractData = {
      buyerPublicKey: "03a23d6b59ab80f6a2cd6a00af02a6772e37b0d450f64ebe31ec1126f3f9ec7709",
      buyerNodeId: "02eadbd9e7557375161df8b646776a547c5097614f97cae435257dc8b63f0a0f82",
      sellerPublicKey: "02e5be89fa161bf6b0bc64ec9ec7fe27311fbb0949a06bfcafdbb48a1e715a53c1",
      sellerNodeId: "03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f",
      amount: 500000 
    };
    
    const generateResponse = await axios.post(`${API_URL}/generate-lightning-contract`, contractData);
    const contract = generateResponse.data.contract;
    
    console.log('Contrato gerado com sucesso:');
    console.log(`ID: ${contract.id}`);
    console.log(`Valor: ${contract.transaction.amountInBTC} BTC (${contract.transaction.amount} sats)`);
    console.log('---------------------------------------');
    
    // Passo 2: Fazer deploy do contrato
    console.log('2. Fazendo deploy do contrato na Lightning Network...');
    const deployResponse = await axios.post(`${API_URL}/deploy-contract`, { contract });
    const deployResult = deployResponse.data;
    
    console.log('Contrato deployado com sucesso:');
    console.log(`Status: ${deployResult.deployStatus}`);
    console.log(`Invoice: ${deployResult.paymentRequest}`);
    console.log(`Expira em: ${deployResult.expiresAt}`);
    console.log('---------------------------------------');
    
    // Passo 3: Simular o pagamento (em uma aplicação real, o usuário pagaria o invoice)
    console.log('3. Esperando o pagamento...');
    console.log('(Em um app real, o comprador pagaria o invoice usando uma carteira Lightning)');
    
    // Aguardar um pouco antes de verificar o status
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Passo 4: Verificar o status do pagamento
    console.log('4. Verificando status do pagamento...');
    const statusResponse = await axios.get(`${API_URL}/contract-status/${contract.id}`);
    const paymentStatus = statusResponse.data;
    
    console.log(`Status atual: ${paymentStatus.status}`);
    if (paymentStatus.paidAt) {
      console.log(`Pago em: ${paymentStatus.paidAt}`);
    }
    if (paymentStatus.settledAt) {
      console.log(`Liquidado para o vendedor em: ${paymentStatus.settledAt}`);
    }
    console.log('---------------------------------------');
    

    if (paymentStatus.status !== 'settled') {
      console.log('5. Aguardando a liquidação do pagamento...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const finalStatusResponse = await axios.get(`${API_URL}/contract-status/${contract.id}`);
      const finalStatus = finalStatusResponse.data;
      
      console.log(`Status final: ${finalStatus.status}`);
      if (finalStatus.paidAt) {
        console.log(`Pago em: ${finalStatus.paidAt}`);
      }
      if (finalStatus.settledAt) {
        console.log(`Liquidado para o vendedor em: ${finalStatus.settledAt}`);
      }
    }
    
    console.log('---------------------------------------');
    console.log('Fluxo completo demonstrado com sucesso!');
    
  } catch (error) {
    console.error('Erro durante o fluxo:', error.response ? error.response.data : error.message);
  }
}

demonstrateFullFlow();